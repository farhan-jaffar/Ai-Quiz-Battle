<?php
/**
 * AI Quiz Battle — PHP Backend API
 * 
 * Endpoints:
 *   POST /api/generate-batch  — Generate 9 quiz questions via Gemini AI
 *   POST /api/submit-score    — Save a score and return the leaderboard
 *   GET  /api/leaderboard     — Get top 50 scores
 */

require_once __DIR__ . '/database.php';

// ─── CORS Headers ────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─── Simple Router ───────────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove trailing slash for consistency
$uri = rtrim($uri, '/');

// Route matching
if ($method === 'POST' && $uri === '/api/generate-batch') {
    handleGenerateBatch();
} elseif ($method === 'POST' && $uri === '/api/submit-score') {
    handleSubmitScore();
} elseif ($method === 'GET' && $uri === '/api/leaderboard') {
    handleLeaderboard();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found', 'available_routes' => [
        'POST /api/generate-batch',
        'POST /api/submit-score',
        'GET /api/leaderboard'
    ]]);
}

// ─── Route Handlers ──────────────────────────────────────────────

/**
 * POST /api/generate-batch
 * Calls Google Gemini API to generate 9 quiz questions (3 Easy, 3 Medium, 3 Hard)
 */
function handleGenerateBatch() {
    $input = json_decode(file_get_contents('php://input'), true);
    $topic = $input['topic'] ?? null;

    if (!$topic) {
        http_response_code(400);
        echo json_encode(['error' => 'Topic is required']);
        return;
    }

    $apiKey = getenv('GEMINI_API_KEY');
    if (!$apiKey) {
        http_response_code(500);
        echo json_encode(['error' => 'GEMINI_API_KEY not configured in .env']);
        return;
    }

    $prompt = <<<PROMPT
You are an expert quiz master creating an adaptive test. 
Topics/Domain: "$topic".

You must generate EXACTLY 9 highly engaging, unique multiple-choice questions matching this domain.
The difficulty must be stratified exactly like this:
- 3 questions where "difficulty": "Easy"
- 3 questions where "difficulty": "Medium"
- 3 questions where "difficulty": "Hard"

Ensure they are diverse and do not repeat identical concepts.

You MUST respond with a valid JSON array only. No markdown formatting, no code blocks, no text before or after the JSON.
The JSON structure MUST be exactly:
[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "The exact string from options that is correct",
    "hint": "A small hint to help the user if they use a power-up",
    "difficulty": "Easy" 
  },
  ...
]
PROMPT;

    $maxRetries = 3;
    $lastError = '';

    for ($attempt = 0; $attempt < $maxRetries; $attempt++) {
        try {
            $responseText = callGeminiAPI($apiKey, $prompt);
            
            // Clean markdown code blocks if present
            $responseText = trim($responseText);
            if (str_starts_with($responseText, '```json')) {
                $responseText = substr($responseText, 7);
            }
            if (str_starts_with($responseText, '```')) {
                $responseText = substr($responseText, 3);
            }
            if (str_ends_with($responseText, '```')) {
                $responseText = substr($responseText, 0, -3);
            }
            $responseText = trim($responseText);

            $parsed = json_decode($responseText, true);
            if ($parsed === null) {
                throw new Exception('Invalid JSON response from Gemini');
            }

            // Validate: must be array of exactly 9 questions
            if (!is_array($parsed) || count($parsed) !== 9) {
                throw new Exception('Expected exactly 9 questions, got ' . (is_array($parsed) ? count($parsed) : 'non-array'));
            }

            // Validate each question structure
            foreach ($parsed as $i => $q) {
                if (empty($q['question']) || empty($q['options']) || empty($q['correctAnswer']) || empty($q['hint']) || empty($q['difficulty'])) {
                    throw new Exception("Question $i is missing required fields");
                }
                if (!is_array($q['options']) || count($q['options']) !== 4) {
                    throw new Exception("Question $i must have exactly 4 options");
                }
                if (!in_array($q['correctAnswer'], $q['options'], true)) {
                    throw new Exception("Question $i: correctAnswer not found in options");
                }
            }

            echo json_encode(['buffer' => $parsed]);
            return;

        } catch (Exception $e) {
            $lastError = $e->getMessage();
            error_log("Attempt " . ($attempt + 1) . " failed: " . $lastError);

            // If rate limited, abort immediately
            if (strpos($lastError, '429') !== false) {
                http_response_code(429);
                echo json_encode(['error' => 'Rate Limit Exceeded. Wait 1 minute.']);
                return;
            }

            // Wait before retrying (don't rapid-fire)
            if ($attempt < $maxRetries - 1) {
                sleep(3);
            }
        }
    }

    http_response_code(500);
    echo json_encode(['error' => 'Failed to generate question batch after multiple attempts']);
}

/**
 * POST /api/submit-score
 * Saves a score to the database and returns the updated leaderboard
 */
function handleSubmitScore() {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'] ?? null;
    $score = $input['score'] ?? null;
    $date = $input['date'] ?? date('Y-m-d H:i:s');

    if (!$username || !is_numeric($score)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid score data']);
        return;
    }

    $pdo = getDBConnection();

    // Insert the score
    $stmt = $pdo->prepare('INSERT INTO scores (username, score, date) VALUES (:username, :score, :date)');
    $stmt->execute([
        ':username' => $username,
        ':score' => (int) $score,
        ':date' => $date,
    ]);

    // Return updated leaderboard
    $leaderboard = getLeaderboardData($pdo);
    echo json_encode(['success' => true, 'leaderboard' => $leaderboard]);
}

/**
 * GET /api/leaderboard
 * Returns top 50 scores sorted by score descending
 */
function handleLeaderboard() {
    $pdo = getDBConnection();
    $leaderboard = getLeaderboardData($pdo);
    echo json_encode($leaderboard);
}

// ─── Helper Functions ────────────────────────────────────────────

/**
 * Fetch top 50 scores from the database
 */
function getLeaderboardData(PDO $pdo): array {
    $stmt = $pdo->query('SELECT username, score, date FROM scores ORDER BY score DESC LIMIT 50');
    return $stmt->fetchAll();
}

/**
 * Call the Google Gemini REST API using cURL
 */
function callGeminiAPI(string $apiKey, string $prompt): string {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey";

    $payload = [
        'contents' => [
            [
                'role' => 'user',
                'parts' => [
                    ['text' => $prompt]
                ]
            ]
        ],
        'generationConfig' => [
            'temperature' => 0.7
        ]
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => 60,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        throw new Exception("cURL error: $curlError");
    }

    if ($httpCode === 429) {
        throw new Exception("429 Rate Limit Exceeded");
    }

    if ($httpCode !== 200) {
        throw new Exception("Gemini API returned HTTP $httpCode: $response");
    }

    $data = json_decode($response, true);
    if (!$data) {
        throw new Exception("Failed to parse Gemini API response");
    }

    // Extract text from Gemini response structure
    $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
    if (!$text) {
        throw new Exception("No text content in Gemini API response");
    }

    return $text;
}
