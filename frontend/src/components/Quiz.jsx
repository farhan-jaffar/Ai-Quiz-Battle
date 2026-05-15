import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useSounds } from '../hooks/useSounds';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Clock, Zap, Target, Lightbulb, ShieldAlert } from 'lucide-react';

const TOTAL_ROUNDS = 5;
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function Quiz() {
  const { userProfile, setGameResult, questionBuffer, setQuestionBuffer, settings } = useGame();
  const sfx = useSounds();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userProfile.username || !questionBuffer || questionBuffer.length === 0) {
      navigate('/');
    }
  }, [userProfile.username, questionBuffer, navigate]);

  const [round, setRound] = useState(1);
  const [difficulty, setDifficulty] = useState(userProfile.difficulty || 'Medium');
  const [questionData, setQuestionData] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings?.timerDuration || 15);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [usedPowerUps, setUsedPowerUps] = useState({ fifty: false, time: false, hint: false });
  const [showHint, setShowHint] = useState('');
  const [aiStatus, setAiStatus] = useState('thinking');
  const [aiChoice, setAiChoice] = useState({ isCorrect: false });
  const aiTimerRef = useRef(null);

  const loadNextQuestionFromBuffer = (targetDifficulty) => {
    let targetIdx = questionBuffer.findIndex(q => q.difficulty === targetDifficulty);
    if (targetIdx === -1) targetIdx = 0;

    if (targetIdx !== -1) {
      const nextQ = questionBuffer[targetIdx];
      const newBuf = [...questionBuffer];
      newBuf.splice(targetIdx, 1);
      setQuestionBuffer(newBuf);
      setQuestionData(nextQ);
      setHiddenOptions([]);
      setShowHint('');
      setIsAnswered(false);
      setSelectedAnswer(null);
      setTimeLeft(settings?.timerDuration || 15);
      setAiStatus('thinking');
      simulateAiOpponent(targetDifficulty);
    }
  };

  useEffect(() => {
    if (questionBuffer && questionBuffer.length > 0 && !questionData && round === 1) {
      loadNextQuestionFromBuffer(difficulty);
    }
  }, [questionBuffer]);

  const simulateAiOpponent = (currentDiff) => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    const thinkTime = Math.floor(Math.random() * 4000) + 1000;
    let accuracy = 0.5;
    if (currentDiff === 'Medium') accuracy = 0.75;
    if (currentDiff === 'Hard') accuracy = 0.90;
    const willBeCorrect = Math.random() <= accuracy;
    aiTimerRef.current = setTimeout(() => {
      setAiChoice({ isCorrect: willBeCorrect });
      setAiStatus('answered');
    }, thinkTime);
  };

  useEffect(() => {
    if (isAnswered || timeLeft <= 0 || !questionData) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next > 0 && next <= 5) sfx.criticalTick();
        else if (next > 5 && next % 3 === 0) sfx.tick();
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isAnswered, timeLeft, questionData]);

  useEffect(() => {
    if (timeLeft <= 0 && !isAnswered && questionData) {
      sfx.timeout();
      handleAnswer(null);
    }
  }, [timeLeft, isAnswered, questionData]);

  const adjustDifficulty = (isCorrect, timeTaken) => {
    const levels = ['Easy', 'Medium', 'Hard'];
    let idx = levels.indexOf(difficulty);
    if (isCorrect && timeTaken < 8 && idx < 2) return levels[idx + 1];
    if (!isCorrect && idx > 0) return levels[idx - 1];
    return difficulty;
  };

  const handleAnswer = (option) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer(option);
    const isCorrect = option === questionData?.correctAnswer;
    const timeTaken = (settings?.timerDuration || 15) - timeLeft;

    // Sound feedback
    if (option === null) { /* timeout — already played */ }
    else if (isCorrect) sfx.correct();
    else sfx.wrong();

    let newPlayerScore = playerScore;
    if (isCorrect) {
      newPlayerScore += 100 + (timeLeft * 10);
      setPlayerScore(newPlayerScore);
    }

    let newAiScore = aiScore;
    if (aiStatus === 'answered' && aiChoice.isCorrect) {
      newAiScore += 100 + (Math.floor(Math.random() * 10) * 10);
    } else if (aiStatus === 'thinking') {
      clearTimeout(aiTimerRef.current);
      setAiStatus('answered');
      if (aiChoice.isCorrect) newAiScore += 100;
    }
    setAiScore(newAiScore);

    const nextDifficulty = adjustDifficulty(isCorrect, timeTaken);
    setDifficulty(nextDifficulty);

    setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        setGameResult({ playerScore: newPlayerScore, aiScore: newAiScore });
        navigate('/result');
      } else {
        setRound(r => r + 1);
        loadNextQuestionFromBuffer(nextDifficulty);
      }
    }, 2500);
  };

  const useFiftyFifty = () => {
    if (usedPowerUps.fifty || isAnswered || !questionData) return;
    sfx.powerUp();
    const wrongOptions = questionData.options.filter(o => o !== questionData.correctAnswer);
    const toHide = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
    setHiddenOptions(toHide);
    setUsedPowerUps(p => ({ ...p, fifty: true }));
  };

  const useExtraTime = () => {
    if (usedPowerUps.time || isAnswered) return;
    sfx.powerUp();
    setTimeLeft(t => t + 10);
    setUsedPowerUps(p => ({ ...p, time: true }));
  };

  const useHint = () => {
    if (usedPowerUps.hint || isAnswered || !questionData) return;
    sfx.powerUp();
    setShowHint(questionData.hint);
    setUsedPowerUps(p => ({ ...p, hint: true }));
  };

  if (!questionData) return null;

  const TIMER_DURATION = settings?.timerDuration || 15;
  const timerPct = (timeLeft / TIMER_DURATION) * 100;
  const isTimerCritical = timeLeft < 5;
  const diffColors = {
    Easy: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.4)' },
    Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)' },
    Hard: { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.4)' },
  };
  const dc = diffColors[difficulty];

  return (
    <div className="w-full max-w-3xl flex flex-col gap-5">

      {/* Score Bar */}
      <div className="grid grid-cols-3 gap-3 items-center">
        {/* Player */}
        <div className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-blue-300 flex-shrink-0"
            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}
          >
            {(userProfile.username || 'P').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest truncate">{userProfile.username}</p>
            <p className="text-2xl font-black text-white leading-none">{playerScore}</p>
          </div>
        </div>

        {/* Center info */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs text-slate-500 font-bold tracking-widest uppercase">
            Round <span className="text-white">{round}</span> / {TOTAL_ROUNDS}
          </div>
          {/* Round pips */}
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i < round - 1 ? '#6366f1' : i === round - 1 ? '#a5b4fc' : 'rgba(255,255,255,0.1)',
                  boxShadow: i === round - 1 ? '0 0 8px rgba(165,180,252,0.6)' : 'none'
                }}
              />
            ))}
          </div>
          <div className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: dc.bg, border: `1px solid ${dc.border}`, color: dc.color }}
          >
            {difficulty}
          </div>
        </div>

        {/* AI */}
        <div className="rounded-2xl p-4 flex items-center justify-end gap-3"
          style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}
        >
          <div className="text-right min-w-0">
            <div className="flex items-center justify-end gap-1.5 mb-0.5">
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full"
                  style={{
                    background: aiStatus === 'thinking' ? '#fbbf24' : '#22c55e',
                    boxShadow: aiStatus === 'thinking' ? '0 0 8px rgba(251,191,36,0.8)' : '0 0 8px rgba(34,197,94,0.8)'
                  }}
                />
              </div>
              <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">AI Opponent</p>
            </div>
            <p className="text-2xl font-black text-white leading-none">{aiScore}</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)' }}
          >
            <Bot className="w-5 h-5 text-rose-400" />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={questionData.question}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl relative overflow-hidden"
          style={{ background: 'rgba(8,8,20,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Timer bar */}
          <div className="h-1 w-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: timerPct + '%' }}
              transition={{ duration: 1, ease: 'linear' }}
              className="h-full rounded-full"
              style={{
                background: isTimerCritical
                  ? 'linear-gradient(90deg, #ef4444, #f97316)'
                  : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                boxShadow: isTimerCritical
                  ? '0 0 12px rgba(239,68,68,0.6)'
                  : '0 0 12px rgba(99,102,241,0.6)'
              }}
            />
          </div>

          <div className="p-6 sm:p-8">
            {/* Top bar: timer + powerups */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg"
                style={{
                  background: isTimerCritical ? 'rgba(239,68,68,0.12)' : 'rgba(99,102,241,0.12)',
                  border: `1px solid ${isTimerCritical ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.3)'}`,
                  color: isTimerCritical ? '#f87171' : '#a5b4fc'
                }}
              >
                <Clock className="w-5 h-5" />
                <span className="font-black tabular-nums">{String(timeLeft).padStart(2, '0')}s</span>
              </div>

              <div className="flex gap-2">
                {[
                  { key: 'fifty', label: '50/50', icon: Target, color: '#a5b4fc', border: 'rgba(99,102,241,0.4)', action: useFiftyFifty, hint: '50/50' },
                  { key: 'time', label: '+10s', icon: Zap, color: '#7dd3fc', border: 'rgba(59,130,246,0.4)', action: useExtraTime, hint: 'Extra Time' },
                  { key: 'hint', label: 'Hint', icon: Lightbulb, color: '#fcd34d', border: 'rgba(245,158,11,0.4)', action: useHint, hint: 'Get Hint' },
                ].map(({ key, label, icon: Icon, color, border, action }) => {
                  const used = usedPowerUps[key] || isAnswered;
                  return (
                    <button
                      key={key}
                      onClick={action}
                      disabled={used}
                      title={label}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                      style={{
                        background: used ? 'rgba(255,255,255,0.03)' : `rgba(${color},0.08)`,
                        border: `1px solid ${used ? 'rgba(255,255,255,0.06)' : border}`,
                        color: used ? '#374151' : color,
                        cursor: used ? 'not-allowed' : 'pointer',
                        opacity: used ? 0.4 : 1,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hint */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="p-3.5 rounded-xl flex gap-3 text-sm font-medium"
                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#fcd34d' }}
                  >
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {showHint}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Question */}
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-7 leading-relaxed">
              {questionData?.question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {questionData?.options.map((opt, i) => {
                if (hiddenOptions.includes(opt)) return null;
                const isCorrect = opt === questionData.correctAnswer;
                const isSelected = selectedAnswer === opt;
                const label = OPTION_LABELS[i];

                let style = {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: '#e2e8f0',
                };

                if (isAnswered) {
                  if (isCorrect) {
                    style = {
                      background: 'rgba(34,197,94,0.12)',
                      border: '1px solid rgba(34,197,94,0.5)',
                      color: '#86efac',
                      boxShadow: '0 0 16px rgba(34,197,94,0.15)',
                    };
                  } else if (isSelected) {
                    style = {
                      background: 'rgba(244,63,94,0.12)',
                      border: '1px solid rgba(244,63,94,0.5)',
                      color: '#fca5a5',
                      boxShadow: '0 0 16px rgba(244,63,94,0.15)',
                    };
                  } else {
                    style = {
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      color: '#334155',
                    };
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(opt)}
                    className="p-4 rounded-2xl text-left font-semibold text-sm transition-all duration-200 flex items-center gap-3 group disabled:cursor-not-allowed"
                    style={style}
                    onMouseEnter={e => {
                      if (!isAnswered) {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.12)';
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)';
                        e.currentTarget.style.color = '#c7d2fe';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isAnswered) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                        e.currentTarget.style.color = '#e2e8f0';
                      }
                    }}
                  >
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 transition-all"
                      style={{
                        background: isAnswered && isCorrect ? 'rgba(34,197,94,0.25)' : isAnswered && isSelected ? 'rgba(244,63,94,0.25)' : 'rgba(255,255,255,0.06)',
                        color: isAnswered && isCorrect ? '#4ade80' : isAnswered && isSelected ? '#fb7185' : 'inherit',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      {label}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Post-answer AI feedback */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-5 overflow-hidden"
                >
                  <div className="p-4 rounded-xl flex items-center gap-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: aiChoice.isCorrect ? 'rgba(244,63,94,0.15)' : 'rgba(34,197,94,0.1)' }}
                    >
                      <Bot className="w-4 h-4" style={{ color: aiChoice.isCorrect ? '#f87171' : '#6b7280' }} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">AI Network</p>
                      <p className="text-sm font-semibold" style={{ color: aiChoice.isCorrect ? '#f87171' : '#475569' }}>
                        {aiChoice.isCorrect
                          ? '⚡ AI answered correctly (+100 pts)!'
                          : 'AI failed to compute the correct answer.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
