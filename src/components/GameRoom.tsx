
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-orange-800">방 #{roomId}</h1>
            <p className="text-gray-600">참가자 {participants.length}명 • 준비완료 {readyCount}명</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowChat(!showChat)}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            채팅
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Roulette Wheel */}
            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-orange-800 flex items-center justify-center gap-2">
                  <Coffee className="h-6 w-6" />
                  커피 룰렛
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RouletteWheel 
                  participants={participants.filter(p => p.isReady)} 
                  isSpinning={isSpinning}
                  winner={winner}
                />
                
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    onClick={startRoulette}
                    disabled={readyCount < 2 || isSpinning}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 text-lg font-semibold"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    {isSpinning ? '룰렛 돌리는 중...' : '룰렛 시작!'}
                  </Button>
                  
                  {winner && (
                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      다시 하기
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current User Controls */}
            {currentUser && (
              <Card className="border-orange-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-800">
                    {currentUser.name}님의 상태
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>당첨 확률:</span>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {currentUser.winProbability}%
                    </Badge>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleJoinGame}
                      variant={currentUser.isReady ? "destructive" : "default"}
                      className={currentUser.isReady ? "" : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"}
                    >
                      {currentUser.isReady ? '참가 취소' : '게임 참가'}
                    </Button>
                    
                    <Button
                      onClick={() => setShowMiniGame(true)}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      미니게임
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Participants Panel */}
          <div className="space-y-6">
            <Card className="border-orange-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  참가자 목록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        participant.isReady 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          participant.isReady ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="font-medium">
                          {participant.name}
                          {participant.id === currentUser?.id && " (나)"}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {participant.winProbability}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Winner Display */}
            {winner && (
              <Card className="border-green-200 bg-green-50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800 text-center">
                    🏆 당첨자 발표!
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-green-700 mb-2">
                    {winner.name}
                  </div>
                  <p className="text-green-600">
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
