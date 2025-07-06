
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, Clock, Hash } from 'lucide-react';

interface MiniGameModalProps {
  gameType: 'rock-paper-scissors' | 'tap-timing' | 'number-guess';
  onComplete: (won: boolean, bonusPercent: number) => void;
  onClose: () => void;
  onGameTypeChange: (gameType: 'rock-paper-scissors' | 'tap-timing' | 'number-guess') => void;
}

export const MiniGameModal = ({ gameType, onComplete, onClose, onGameTypeChange }: MiniGameModalProps) => {
  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-orange-800">
            확률 조절 미니게임
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={gameType} onValueChange={(value) => onGameTypeChange(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rock-paper-scissors" className="text-xs">
              <Scissors className="h-4 w-4 mr-1" />
              가위바위보
            </TabsTrigger>
            <TabsTrigger value="tap-timing" className="text-xs">
              <Clock className="h-4 w-4 mr-1" />
              탭 타이밍
            </TabsTrigger>
            <TabsTrigger value="number-guess" className="text-xs">
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

  const choices = [
    { value: 'rock', emoji: '✊', name: '바위' },
    { value: 'paper', emoji: '✋', name: '보' },
    { value: 'scissors', emoji: '✌️', name: '가위' }
  ];

  const playGame = (choice: string) => {
    setPlayerChoice(choice);
    setGameStarted(true);
    
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
      
      setTimeout(() => {
        if (gameResult === 'win') {
          onComplete(true, 10); // +10% for winning
        } else if (gameResult === 'lose') {
          onComplete(false, 0); // -10% handled in parent
        } else {
          // Draw - no change
          onComplete(true, 0);
        }
      }, 2000);
    }, 1000);
  };

  return (
    <div className="space-y-4 text-center">
      <div className="bg-orange-50 p-3 rounded-lg">
        <Badge className="bg-orange-100 text-orange-800 mb-2">승리 시 +10% 확률</Badge>
        <p className="text-sm text-gray-600">컴퓨터와 가위바위보를 해보세요!</p>
      </div>
      
      {!gameStarted ? (
        <div className="grid grid-cols-3 gap-3">
          {choices.map((choice) => (
            <Button
              key={choice.value}
              onClick={() => playGame(choice.value)}
              className="h-20 flex flex-col items-center justify-center text-2xl hover:scale-105 transition-transform"
              variant="outline"
            >
              <div className="text-3xl mb-1">{choice.emoji}</div>
              <div className="text-sm">{choice.name}</div>
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-4xl mb-2">
                {choices.find(c => c.value === playerChoice)?.emoji}
              </div>
              <div className="text-sm text-gray-600">나</div>
            </div>
            
            <div className="text-2xl">VS</div>
            
            <div className="text-center">
              <div className="text-4xl mb-2">
                {computerChoice ? choices.find(c => c.value === computerChoice)?.emoji : '🤖'}
              </div>
              <div className="text-sm text-gray-600">컴퓨터</div>
            </div>
          </div>
          
          {result && (
            <div className={`p-4 rounded-lg text-lg font-semibold ${
              result === 'win' ? 'bg-green-100 text-green-800' :
              result === 'lose' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {result === 'win' ? '승리! +10% 확률 증가!' :
               result === 'lose' ? '패배! -10% 확률 감소' :
               '무승부! 확률 변화 없음'}
            </div>
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

  const startGame = () => {
    setGameState('countdown');
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setGameState('active');
          setTargetTime(1000 + Math.random() * 2000); // 1-3 seconds
          setStartTime(Date.now());
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
    const accuracyPercent = Math.max(0, 100 - (diff / 50)); // 50ms tolerance per 1%
    
    setAccuracy(accuracyPercent);
    setGameState('finished');
    
    setTimeout(() => {
      const won = accuracyPercent >= 70; // 70% accuracy needed to win
      onComplete(won, won ? 15 : 0); // +15% for winning
    }, 2000);
  };

  return (
    <div className="space-y-4 text-center">
      <div className="bg-orange-50 p-3 rounded-lg">
        <Badge className="bg-orange-100 text-orange-800 mb-2">성공 시 +15% 확률</Badge>
        <p className="text-sm text-gray-600">박자에 맞춰 정확한 타이밍에 탭하세요!</p>
      </div>
      
      {gameState === 'ready' && (
        <div className="space-y-4">
          <p className="text-gray-600">준비되면 시작 버튼을 클릭하세요</p>
          <Button onClick={startGame} className="bg-orange-500 hover:bg-orange-600 text-white">
            게임 시작
          </Button>
        </div>
      )}
      
      {gameState === 'countdown' && (
        <div className="space-y-4">
          <div className="text-6xl font-bold text-orange-600 animate-pulse">
            {countdown}
          </div>
          <p className="text-gray-600">게임이 곧 시작됩니다...</p>
        </div>
      )}
      
      {gameState === 'active' && (
        <div className="space-y-4">
          <div className="text-2xl text-green-600 animate-pulse">
            지금 탭하세요!
          </div>
          <Button
            onClick={handleTap}
            className="w-32 h-32 rounded-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold animate-pulse"
          >
            TAP!
          </Button>
        </div>
      )}
      
      {gameState === 'finished' && (
        <div className="space-y-4">
          <div className="text-4xl font-bold text-orange-600">
            {accuracy.toFixed(1)}%
          </div>
          <div className={`p-4 rounded-lg text-lg font-semibold ${
            accuracy >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {accuracy >= 70 ? '성공! +15% 확률 증가!' : '실패! -10% 확률 감소'}
          </div>
        </div>
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

  const startGame = () => {
    setTargetNumber(Math.floor(Math.random() * 20) + 1);
    setGameStarted(true);
    setAttempts(0);
    setGuess('');
    setResult(null);
  };

  const makeGuess = () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 20) return;
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (guessNum === targetNumber) {
      setResult('win');
      setTimeout(() => {
        onComplete(true, 20); // +20% for winning
      }, 2000);
    } else if (newAttempts >= 3) {
      setResult('lose');
      setTimeout(() => {
        onComplete(false, 0); // -10% handled in parent
      }, 2000);
    } else {
      const hint = guessNum < targetNumber ? '더 큰 수입니다!' : '더 작은 수입니다!';
      setResult(hint);
      setGuess('');
    }
  };

  return (
    <div className="space-y-4 text-center">
      <div className="bg-orange-50 p-3 rounded-lg">
        <Badge className="bg-orange-100 text-orange-800 mb-2">성공 시 +20% 확률</Badge>
        <p className="text-sm text-gray-600">1~20 사이의 숫자를 3번 안에 맞춰보세요!</p>
      </div>
      
      {!gameStarted ? (
        <div className="space-y-4">
          <p className="text-gray-600">숫자 맞히기 게임을 시작할까요?</p>
          <Button onClick={startGame} className="bg-orange-500 hover:bg-orange-600 text-white">
            게임 시작
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-lg font-semibold">
            시도 횟수: {attempts}/3
          </div>
          
          {result === 'win' ? (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg text-lg font-semibold">
              정답! +20% 확률 증가!
            </div>
          ) : result === 'lose' ? (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg text-lg font-semibold">
              실패! 정답은 {targetNumber}이었습니다. -10% 확률 감소
            </div>
          ) : (
            <div className="space-y-3">
              {result && (
                <div className="bg-yellow-100 text-yellow-800 p-2 rounded">
                  {result}
                </div>
              )}
              
              <div className="flex gap-2 justify-center">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="1~20"
                  className="w-20 px-3 py-2 border rounded text-center"
                />
                <Button onClick={makeGuess} disabled={!guess}>
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
