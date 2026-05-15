const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'leaderboard.json');

// Initialize DB file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

const getLeaderboard = () => {
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
};

const saveScore = (scoreEntry) => {
  const leaderboard = getLeaderboard();
  leaderboard.push(scoreEntry);
  
  // Sort by score descending and keep top 50
  leaderboard.sort((a, b) => b.score - a.score);
  const topScores = leaderboard.slice(0, 50);
  
  fs.writeFileSync(DB_FILE, JSON.stringify(topScores, null, 2));
  return topScores;
};

module.exports = {
  getLeaderboard,
  saveScore
};
