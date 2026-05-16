<?php
/**
 * Database Connection & Setup
 * Connects to MySQL via PDO and auto-creates the database + table if they don't exist.
 */

// Load environment variables from .env file
function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || $line[0] === '#') continue;
        if (strpos($line, '=') === false) continue;
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, " \t\n\r\0\x0B\"'");
        $_ENV[$key] = $value;
        putenv("$key=$value");
    }
}

// Load .env from the same directory
loadEnv(__DIR__ . '/.env');

/**
 * Get a PDO database connection.
 * Creates the database and scores table if they don't exist.
 */
function getDBConnection() {
    $host = getenv('DB_HOST') ?: 'localhost';
    $port = getenv('DB_PORT') ?: '3306';
    $user = getenv('DB_USER') ?: 'root';
    $pass = getenv('DB_PASS') ?: '';
    $dbname = getenv('DB_NAME') ?: 'ai_quiz_battle';

    try {
        // First connect without database to create it if needed
        $pdo = new PDO(
            "mysql:host=$host;port=$port;charset=utf8mb4",
            $user,
            $pass,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );

        // Create database if it doesn't exist
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo->exec("USE `$dbname`");

        // Create scores table if it doesn't exist
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS scores (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                score INT NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_score_desc (score DESC)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");

        return $pdo;

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
        exit;
    }
}
