import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings'; // Placeholder components
import History from './components/History';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Sub-routes replace the <Outlet /> inside Layout */}
        <Route index element={<Home />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="result" element={<Result />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        
        {/* Full Routes */}
        <Route path="settings" element={<Settings />} />
        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  );
}

export default App;
