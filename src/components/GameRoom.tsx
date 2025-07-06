
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Users, ArrowLeft, Gamepad2, MessageCircle, Play, RotateCcw } from 'lucide-react';
import { MiniGameModal } from './MiniGameModal';
import { RouletteWheel } from './RouletteWheel';
import { ChatPanel } from './ChatPanel';
import { toast } from "@/hooks/use-toast";

interface Participant {
  id: string;
  name: string;
  winProbability: number;
  isReady: boolean;
}

interface GameRoomProps {
  roomId: string;
  userName: string;
  onBack: () => void;
}

export const GameRoom = ({ roomId, userName, onBack }: GameRoomProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [selectedGame, setSelectedGame] = useState<'rock-paper-scissors' | 'tap-timing' | 'number-guess'>('rock-paper-scissors');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Initialize current user
    const userId = Math.random().toString(36).substring(2, 15);
    const newUser: Participant = {
      id: userId,
      name: userName,
      winProbability: 50, // Base 50% probability
      isReady: false
    };
    
    setCurrentUser(newUser);
    setParticipants([newUser]);
    
    // Simulate some other participants joining
    setTimeout(() => {
      const demoParticipants: Participant[] = [
        { id: '2', name: '이다빈', winProbability: 45, isReady: true },
        { id: '3', name: '최양락', winProbability: 30, isReady: false },
        { id: '4', name: '김솔', winProbability: 65, isReady: true },
      ];
      setParticipants(prev => [...prev, ...demoParticipants]);
    }, 2000);
  }, [userName]);

  const handleJoinGame = () => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, isReady: !currentUser.isReady };
    setCurrentUser(updatedUser);
    setParticipants(prev => 
      prev.map(p => p.id === updatedUser.id ? updatedUser : p)
    );
    
    toast({
      title: updatedUser.isReady ? "게임 참가!" : "게임 취소",
      description: updatedUser.isReady ? "커피 룰렛에 참가했습니다!" : "게임 참가를 취소했습니다.",
    });
  };

  const handleMiniGameComplete = (won: boolean, bonusPercent: number) => {
    if (!currentUser) return;
    
    let newProbability = currentUser.winProbability;
    
    if (won) {
      newProbability = Math.min(95, currentUser.winProbability + bonusPercent);
      toast({
        title: "게임 성공! 🎉",
        description: `당첨 확률이 ${bonusPercent}% 증가했습니다! (${currentUser.winProbability}% → ${newProbability}%)`,
      });
    } else {
      newProbability = Math.max(5, currentUser.winProbability - 10);
      toast({
        title: "아쉽네요! 😅",
        description: `당첨 확률이 10% 감소했습니다. (${currentUser.winProbability}% → ${newProbability}%)`,
      });
    }
    
    const updatedUser = { ...currentUser, winProbability: newProbability };
    setCurrentUser(updatedUser);
    setParticipants(prev => 
      prev.map(p => p.id === updatedUser.id ? updatedUser : p)
    );
    
    setShowMiniGame(false);
  };

  const startRoulette = () => {
    const readyParticipants = participants.filter(p => p.isReady);
    if (readyParticipants.length < 2) {
      toast({
        title: "참가자 부족",
        description: "최소 2명 이상이 참가해야 합니다!",
        variant: "destructive"
      });
      return;
    }
    
    setIsSpinning(true);
    setWinner(null);
    
    // Simulate roulette spin
    setTimeout(() => {
      // Weighted random selection based on probabilities
      const totalWeight = readyParticipants.reduce((sum, p) => sum + p.winProbability, 0);
      let random = Math.random() * totalWeight;
      
      let selectedWinner = readyParticipants[0];
      for (const participant of readyParticipants) {
        if (random < participant.winProbability) {
          selectedWinner = participant;
          break;
        }
        random -= participant.winProbability;
      }
      
      setWinner(selectedWinner);
      setIsSpinning(false);
      
      toast({
        title: "당첨자 발표! 🏆",
        description: `${selectedWinner.name}님이 커피를 사게 되었습니다!`,
      });
    }, 3000);
  };

  const resetGame = () => {
    setWinner(null);
    setParticipants(prev => 
      prev.map(p => ({ ...p, isReady: false, winProbability: 50 }))
    );
    if (currentUser) {
      setCurrentUser({ ...currentUser, isReady: false, winProbability: 50 });
    }
  };

  const readyCount = participants.filter(p => p.isReady).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="flex items-center gap-2 border-2 border-black hover:bg-black hover:text-white font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black">방 #{roomId}</h1>
            <p className="text-gray-600 text-lg">참가자 {participants.length}명 • 준비완료 {readyCount}명</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowChat(!showChat)}
            className="flex items-center gap-2 border-2 border-black hover:bg-black hover:text-white font-bold"
          >
            <MessageCircle className="h-4 w-4" />
            채팅
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Roulette Wheel */}
            <Card className="border-4 border-black shadow-2xl bg-white">
              <CardHeader className="text-center bg-black text-white">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                  <Coffee className="h-7 w-7" />
                  커피 룰렛
                  <Coffee className="h-7 w-7" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <RouletteWheel 
                  participants={participants.filter(p => p.isReady)} 
                  isSpinning={isSpinning}
                  winner={winner}
                />
                
                <div className="flex justify-center gap-6 mt-8">
                  <Button
                    onClick={startRoulette}
                    disabled={readyCount < 2 || isSpinning}
                    className="bg-black hover:bg-gray-800 text-white px-10 py-4 text-xl font-bold shadow-lg transition-all duration-300"
                  >
                    <Play className="mr-3 h-6 w-6" />
                    {isSpinning ? '룰렛 돌리는 중...' : '룰렛 시작!'}
                  </Button>
                  
                  {winner && (
                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 text-xl font-bold"
                    >
                      <RotateCcw className="mr-3 h-5 w-5" />
                      다시 하기
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current User Controls */}
            {currentUser && (
              <Card className="border-4 border-gray-300 shadow-xl bg-white">
                <CardHeader className="bg-gray-100">
                  <CardTitle className="text-xl text-black font-bold">
                    {currentUser.name}님의 상태
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <span className="text-lg font-medium">당첨 확률:</span>
                    <Badge variant="secondary" className="text-2xl px-4 py-2 bg-black text-white font-bold">
                      {currentUser.winProbability}%
                    </Badge>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      onClick={handleJoinGame}
                      variant={currentUser.isReady ? "destructive" : "default"}
                      className={currentUser.isReady 
                        ? "text-xl py-4 px-6 font-bold" 
                        : "bg-green-600 hover:bg-green-700 text-white text-xl py-4 px-6 font-bold"
                      }
                    >
                      {currentUser.isReady ? '참가 취소' : '게임 참가'}
                    </Button>
                    
                    <Button
                      onClick={() => setShowMiniGame(true)}
                      variant="outline"
                      className="border-2 border-black text-black hover:bg-black hover:text-white text-xl py-4 px-6 font-bold"
                    >
                      <Gamepad2 className="mr-2 h-5 w-5" />
                      미니게임
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Participants Panel */}
          <div className="space-y-8">
            <Card className="border-4 border-gray-300 shadow-xl bg-white">
              <CardHeader className="bg-gray-100">
                <CardTitle className="text-xl text-black font-bold flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  참가자 목록
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                        participant.isReady 
                          ? 'bg-green-50 border-green-400 shadow-md' 
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${
                          participant.isReady ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                        }`} />
                        <span className="font-bold text-lg">
                          {participant.name}
                          {participant.id === currentUser?.id && " (나)"}
                        </span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-lg px-3 py-1 border-2 border-black font-bold"
                      >
                        {participant.winProbability}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Winner Display */}
            {winner && (
              <Card className="border-4 border-green-500 bg-green-50 shadow-2xl">
                <CardHeader className="bg-green-500 text-white">
                  <CardTitle className="text-2xl font-bold text-center">
                    🏆 당첨자 발표! 🏆
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center p-8">
                  <div className="text-4xl font-bold text-green-700 mb-4">
                    {winner.name}
                  </div>
                  <p className="text-2xl text-green-600 font-bold">
                    커피 한턱 내주세요! ☕
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="fixed bottom-4 right-4 w-80 h-96 z-50">
            <ChatPanel roomId={roomId} userName={userName} />
          </div>
        )}

        {/* Mini Game Modal */}
        {showMiniGame && (
          <MiniGameModal
            gameType={selectedGame}
            onComplete={handleMiniGameComplete}
            onClose={() => setShowMiniGame(false)}
            onGameTypeChange={setSelectedGame}
          />
        )}
      </div>
    </div>
  );
};
