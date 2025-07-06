
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, Clock, Hash, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface MiniGameModalProps {
  gameType: 'rock-paper-scissors' | 'tap-timing' | 'number-guess';
  onComplete: (won: boolean, bonusPercent: number) => void;
  onClose: () => void;
  onGameTypeChange: (gameType: 'rock-paper-scissors' | 'tap-timing' | 'number-guess') => void;
}

export const MiniGameModal = ({ gameType, onComplete, onClose, onGameTypeChange }: MiniGameModalProps) => {
  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg bg-white border-4 border-black">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-black font-bold flex items-center justify-center gap-2">
            <Zap className="h-6 w-6" />
            확률 조절 미니게임
            <Zap className="h-6 w-6" />
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={gameType} onValueChange={(value) => onGameTypeChange(value as any)}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="rock-paper-scissors" className="text-sm font-bold data-[state=active]:bg-black data-[state=active]:text-white">
              <Scissors className="h-4 w-4 mr-1" />
              가위바위보
            </TabsTrigger>
            <TabsTrigger value="tap-timing" className="text-sm font-bold data-[state=active]:bg-black data-[state=active]:text-white">
              <Clock className="h-4 w-4 mr-1" />
              탭 타이밍
            </TabsTrigger>
            <TabsTrigger value="number-guess" className="text-sm font-bold data-[state=active]:bg-black data-[state=active]:text-white">
              <Hash className="h-4 w-4 mr-1" />
              숫자 맞히기
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rock-paper-scissors">
            <RockPaperScissorsGame onComplete={onComplete} />
          </TabsContent>
          
          <TabsContent value="tap-timing">
            <TapTimingGame onComplete={onComplete} />
          </TabsContent>
          
          <TabsContent value="number-guess">
            <NumberGuessGame onComplete={onComplete} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const RockPaperScissorsGame = ({ onComplete }: { onComplete: (won: boolean, bonusPercent: number) => void }) => {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showBattle, setShowBattle] = useState(false);

  const choices = [
    { value: 'rock', emoji: '✊', name: '바위', battleEmoji: '🪨' },
    { value: 'paper', emoji: '✋', name: '보', battleEmoji: '📄' },
    { value: 'scissors', emoji: '✌️', name: '가위', battleEmoji: '✂️' }
  ];

  const playGame = (choice: string) => {
    setPlayerChoice(choice);
    setGameStarted(true);
    setShowBattle(true);
    
    setTimeout(() => {
      const computerChoice = choices[Math.floor(Math.random() * 3)].value;
      setComputerChoice(computerChoice);
      
      let gameResult;
      if (choice === computerChoice) {
        gameResult = 'draw';
      } else if (
        (choice === 'rock' && computerChoice === 'scissors') ||
        (choice === 'paper' && computerChoice === 'rock') ||
        (choice === 'scissors' && computerChoice === 'paper')
      ) {
        gameResult = 'win';
      } else {
        gameResult = 'lose';
      }
      
      setResult(gameResult);
      setShowBattle(false);
      
      setTimeout(() => {
        if (gameResult === 'win') {
          onComplete(true, 10);
        } else if (gameResult === 'lose') {
          onComplete(false, 0);
        } else {
          onComplete(true, 0);
        }
      }, 2500);
    }, 2000);
  };

  return (
    <div className="space-y-6 text-center p-4">
      <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
        <Badge className="bg-black text-white mb-3 text-lg px-4 py-2">승리 시 +10% 확률 ⚡</Badge>
        <p className="text-gray-700 font-medium">컴퓨터와 가위바위보 대결!</p>
      </div>
      
      {!gameStarted ? (
        <motion.div 
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {choices.map((choice) => (
            <motion.div
              key={choice.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => playGame(choice.value)}
                className="h-28 w-full flex flex-col items-center justify-center text-2xl hover:scale-105 transition-all duration-200 bg-white border-4 border-black hover:bg-black hover:text-white"
                variant="outline"
              >
                <div className="text-4xl mb-2">{choice.emoji}</div>
                <div className="text-lg font-bold">{choice.name}</div>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="space-y-6">
          {showBattle ? (
            <motion.div 
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <div className="text-6xl mb-4 animate-bounce">⚔️</div>
              <div className="text-2xl font-bold text-black">배틀 중...</div>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-center items-center gap-12">
                <motion.div 
                  className="text-center"
                  initial={{ x: -50 }}
                  animate={{ x: 0 }}
                >
                  <div className="text-6xl mb-3">
                    {choices.find(c => c.value === playerChoice)?.battleEmoji}
                  </div>
                  <div className="text-lg font-bold text-black">나</div>
                </motion.div>
                
                <motion.div 
                  className="text-4xl font-black"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  VS
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ x: 50 }}
                  animate={{ x: 0 }}
                >
                  <div className="text-6xl mb-3">
                    {computerChoice ? choices.find(c => c.value === computerChoice)?.battleEmoji : '🤖'}
                  </div>
                  <div className="text-lg font-bold text-black">컴퓨터</div>
                </motion.div>
              </div>
              
              {result && (
                <motion.div 
                  className={`p-6 rounded-xl text-2xl font-bold border-4 ${
                    result === 'win' ? 'bg-green-50 text-green-800 border-green-500' :
                    result === 'lose' ? 'bg-red-50 text-red-800 border-red-500' :
                    'bg-yellow-50 text-yellow-800 border-yellow-500'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  {result === 'win' ? '🎉 승리! +10% 확률 증가!' :
                   result === 'lose' ? '😢 패배! -10% 확률 감소' :
                   '🤝 무승부! 확률 변화 없음'}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

const TapTimingGame = ({ onComplete }: { onComplete: (won: boolean, bonusPercent: number) => void }) => {
  const [gameState, setGameState] = useState<'ready' | 'countdown' | 'active' | 'finished'>('ready');
  const [countdown, setCountdown] = useState(3);
  const [targetTime, setTargetTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(1);

  const startGame = () => {
    setGameState('countdown');
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setGameState('active');
          const target = 1500 + Math.random() * 1500; // 1.5-3 seconds
          setTargetTime(target);
          setStartTime(Date.now());
          
          // Pulse effect that gets faster as target approaches
          const pulseInterval = setInterval(() => {
            setPulseIntensity(prev => prev === 1 ? 1.2 : 1);
          }, target / 10);
          
          setTimeout(() => {
            clearInterval(pulseInterval);
            setPulseIntensity(1);
          }, target);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTap = () => {
    if (gameState !== 'active') return;
    
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const diff = Math.abs(elapsed - targetTime);
    const accuracyPercent = Math.max(0, 100 - (diff / 20)); // 20ms tolerance per 1%
    
    setAccuracy(accuracyPercent);
    setGameState('finished');
    
    setTimeout(() => {
      const won = accuracyPercent >= 75; // 75% accuracy needed to win
      onComplete(won, won ? 15 : 0);
    }, 2500);
  };

  return (
    <div className="space-y-6 text-center p-4">
      <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
        <Badge className="bg-black text-white mb-3 text-lg px-4 py-2">성공 시 +15% 확률 ⚡</Badge>
        <p className="text-gray-700 font-medium">정확한 타이밍에 탭하세요! (75% 이상 정확도 필요)</p>
      </div>
      
      {gameState === 'ready' && (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-6xl mb-4">⏰</div>
          <p className="text-xl text-gray-700 font-medium">준비되면 시작 버튼을 클릭하세요</p>
          <Button 
            onClick={startGame} 
            className="bg-black hover:bg-gray-800 text-white text-xl py-4 px-8 font-bold"
          >
            게임 시작
          </Button>
        </motion.div>
      )}
      
      {gameState === 'countdown' && (
        <motion.div 
          className="space-y-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <motion.div 
            className="text-8xl font-bold text-black"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            {countdown}
          </motion.div>
          <p className="text-xl text-gray-700">게임이 곧 시작됩니다...</p>
        </motion.div>
      )}
      
      {gameState === 'active' && (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="text-3xl text-green-600 font-bold"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.2, repeat: Infinity }}
          >
            지금 탭하세요! 🎯
          </motion.div>
          <motion.div
            animate={{ scale: pulseIntensity }}
            transition={{ duration: 0.1 }}
          >
            <Button
              onClick={handleTap}
              className="w-40 h-40 rounded-full bg-green-500 hover:bg-green-600 text-white text-2xl font-bold shadow-2xl"
              style={{
                background: 'radial-gradient(circle, #10b981, #059669)',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
              }}
            >
              TAP!
            </Button>
          </motion.div>
        </motion.div>
      )}
      
      {gameState === 'finished' && (
        <motion.div 
          className="space-y-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div className="text-6xl font-bold text-black">
            {accuracy.toFixed(1)}%
          </div>
          <motion.div 
            className={`p-6 rounded-xl text-2xl font-bold border-4 ${
              accuracy >= 75 ? 'bg-green-50 text-green-800 border-green-500' : 'bg-red-50 text-red-800 border-red-500'
            }`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {accuracy >= 75 ? '🎉 성공! +15% 확률 증가!' : '😅 실패! -10% 확률 감소'}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

const NumberGuessGame = ({ onComplete }: { onComplete: (won: boolean, bonusPercent: number) => void }) => {
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hints, setHints] = useState<string[]>([]);

  const startGame = () => {
    setTargetNumber(Math.floor(Math.random() * 50) + 1); // 1-50 for more challenge
    setGameStarted(true);
    setAttempts(0);
    setGuess('');
    setResult(null);
    setHints([]);
  };

  const makeGuess = () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 50) return;
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (guessNum === targetNumber) {
      setResult('win');
      setTimeout(() => {
        onComplete(true, 20);
      }, 2500);
    } else if (newAttempts >= 5) { // 5 attempts instead of 3
      setResult('lose');
      setTimeout(() => {
        onComplete(false, 0);
      }, 2500);
    } else {
      const diff = Math.abs(guessNum - targetNumber);
      let hint = '';
      
      if (diff > 20) {
        hint = guessNum < targetNumber ? '🔥 훨씬 더 큰 수!' : '🧊 훨씬 더 작은 수!';
      } else if (diff > 10) {
        hint = guessNum < targetNumber ? '📈 더 큰 수!' : '📉 더 작은 수!';
      } else if (diff > 5) {
        hint = guessNum < targetNumber ? '⬆️ 조금 더 큰 수!' : '⬇️ 조금 더 작은 수!';
      } else {
        hint = guessNum < targetNumber ? '🎯 아주 조금 더 큰 수!' : '🎯 아주 조금 더 작은 수!';
      }
      
      setHints(prev => [...prev, `${guessNum} → ${hint}`]);
      setResult(hint);
      setGuess('');
    }
  };

  return (
    <div className="space-y-6 text-center p-4">
      <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
        <Badge className="bg-black text-white mb-3 text-lg px-4 py-2">성공 시 +20% 확률 ⚡</Badge>
        <p className="text-gray-700 font-medium">1~50 사이의 숫자를 5번 안에 맞춰보세요!</p>
      </div>
      
      {!gameStarted ? (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-xl text-gray-700 font-medium">숫자 맞히기 게임을 시작할까요?</p>
          <Button 
            onClick={startGame} 
            className="bg-black hover:bg-gray-800 text-white text-xl py-4 px-8 font-bold"
          >
            게임 시작
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="text-2xl font-bold text-black">
            시도 횟수: {attempts}/5
          </div>
          
          {/* Hints display */}
          {hints.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl max-h-32 overflow-y-auto">
              <div className="text-sm font-medium text-gray-600 mb-2">힌트 기록:</div>
              {hints.map((hint, index) => (
                <div key={index} className="text-sm text-gray-700 mb-1">
                  {hint}
                </div>
              ))}
            </div>
          )}
          
          {result === 'win' ? (
            <motion.div 
              className="bg-green-50 text-green-800 p-6 rounded-xl text-2xl font-bold border-4 border-green-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              🎉 정답! +20% 확률 증가!
            </motion.div>
          ) : result === 'lose' ? (
            <motion.div 
              className="bg-red-50 text-red-800 p-6 rounded-xl text-2xl font-bold border-4 border-red-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              😢 실패! 정답은 {targetNumber}이었습니다.<br/>-10% 확률 감소
            </motion.div>
          ) : (
            <div className="space-y-4">
              {result && (
                <motion.div 
                  className="bg-blue-50 text-blue-800 p-4 rounded-xl font-bold text-lg border-2 border-blue-300"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {result}
                </motion.div>
              )}
              
              <div className="flex gap-3 justify-center items-center">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="1~50"
                  className="w-24 px-4 py-3 border-2 border-black rounded-lg text-center text-xl font-bold"
                  onKeyPress={(e) => e.key === 'Enter' && makeGuess()}
                />
                <Button 
                  onClick={makeGuess} 
                  disabled={!guess}
                  className="bg-black hover:bg-gray-800 text-white px-6 py-3 font-bold"
                >
                  확인
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
