
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Plus, Hash } from 'lucide-react';
import { GameRoom } from '@/components/GameRoom';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [roomCode, setRoomCode] = useState('');
  const [currentRoomId, setCurrentRoomId] = useState('');
  const [userName, setUserName] = useState('');

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = () => {
    if (!userName.trim()) {
      alert('이름을 입력해주세요!');
      return;
    }
    const newRoomCode = generateRoomCode();
    setCurrentRoomId(newRoomCode);
    setCurrentView('room');
  };

  const joinRoom = () => {
    if (!userName.trim()) {
      alert('이름을 입력해주세요!');
      return;
    }
    if (!roomCode.trim()) {
      alert('방 코드를 입력해주세요!');
      return;
    }
    setCurrentRoomId(roomCode.toUpperCase());
    setCurrentView('room');
  };

  const backToHome = () => {
    setCurrentView('home');
    setCurrentRoomId('');
    setRoomCode('');
  };

  if (currentView === 'room') {
    return <GameRoom roomId={currentRoomId} userName={userName} onBack={backToHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="p-4 bg-amber-800 rounded-full shadow-lg">
              <Coffee className="h-12 w-12 text-amber-50" />
            </div>
            <h1 className="text-7xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
              BeanRoulette
            </h1>
          </div>
          <p className="text-2xl text-amber-700 mb-6 font-medium">
            랜덤 커피 러시 플랫폼 ☕
          </p>
          <p className="text-lg text-amber-600 max-w-2xl mx-auto leading-relaxed">
            회의 후 커피 당번을 재밌게 정하는 가장 쉬운 방법!<br/>
            미니게임으로 확률을 조절하고 공정하게 추첨하세요.
          </p>
        </div>

        {/* Main Action Card */}
        <div className="max-w-lg mx-auto mb-16">
          <Card className="border-2 border-amber-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center bg-gradient-to-r from-amber-800 to-orange-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl">시작하기</CardTitle>
              <CardDescription className="text-amber-100">
                이름을 입력하고 방을 만들거나 참여하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div>
                <label className="block text-lg font-semibold text-amber-800 mb-3">
                  닉네임
                </label>
                <Input
                  placeholder="이름을 입력하세요"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-lg py-3 border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-4">
                <Button
                  onClick={createRoom}
                  className="w-full bg-amber-800 hover:bg-amber-700 text-white py-4 text-lg font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                  disabled={!userName.trim()}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  새 방 만들기
                </Button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-amber-200"></div>
                  <span className="text-amber-600 text-sm">또는</span>
                  <div className="flex-1 h-px bg-amber-200"></div>
                </div>

                <div className="space-y-3">
                  <Input
                    placeholder="방 코드 입력"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className="border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500 text-lg py-3"
                  />
                  <Button
                    onClick={joinRoom}
                    variant="outline"
                    className="w-full border-2 border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white py-4 text-lg font-bold transition-all duration-300"
                    disabled={!userName.trim() || !roomCode.trim()}
                  >
                    <Hash className="mr-2 h-5 w-5" />
                    방 참여하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-800 mb-4">게임 방식</h2>
            <p className="text-amber-600">미니게임으로 당첨 확률을 조절하세요!</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border border-amber-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80">
              <CardHeader className="text-center">
                <div className="text-4xl mb-3">✂️</div>
                <CardTitle className="text-xl text-amber-800">가위바위보</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-amber-700 mb-2">승리 시 <span className="font-bold text-green-600">+10%</span></p>
                <p className="text-xs text-amber-600">빠르고 간단한 운빨 게임</p>
              </CardContent>
            </Card>

            <Card className="border border-amber-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80">
              <CardHeader className="text-center">
                <div className="text-4xl mb-3">⏱️</div>
                <CardTitle className="text-xl text-amber-800">탭 타이밍</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-amber-700 mb-2">성공 시 <span className="font-bold text-green-600">+15%</span></p>
                <p className="text-xs text-amber-600">정확한 타이밍이 관건</p>
              </CardContent>
            </Card>

            <Card className="border border-amber-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80">
              <CardHeader className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <CardTitle className="text-xl text-amber-800">숫자 맞히기</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-amber-700 mb-2">성공 시 <span className="font-bold text-green-600">+20%</span></p>
                <p className="text-xs text-amber-600">가장 높은 보상의 도전</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
