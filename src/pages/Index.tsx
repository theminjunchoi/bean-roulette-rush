
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Users, Gamepad2, MessageCircle, Plus, Hash, Zap } from 'lucide-react';
import { RoomManager } from '@/components/RoomManager';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 bg-black rounded-full">
              <Coffee className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-black">
              BeanRoulette
            </h1>
          </div>
          <p className="text-2xl text-gray-700 mb-4 font-medium">
            랜덤 커피 러시 플랫폼 ☕
          </p>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            "누가 살 건데?" 회의 끝나고 머뭇대지 말고,<br/>
            한 방에 커피 당번 뽑고 가벼운 게임으로 운빨까지 조절하는 팀 놀이터!
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <Card className="text-center border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-black">방 생성 & 초대</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">아무나 방 파서 링크 뿌리면 끝</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                <Coffee className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-black">랜덤 추첨</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">참가 버튼 누른 사람 중 한 놈 당첨</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-black">미니게임</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">가위바위보, 탭 타이밍, 숫자 맞히기</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-black">실시간 채팅</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">결과까지 수다 떨 공간</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Area */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-gray-300 shadow-2xl bg-white">
            <CardHeader className="text-center bg-black text-white">
              <CardTitle className="text-3xl">시작하기</CardTitle>
              <CardDescription className="text-gray-300">이름을 입력하고 방을 만들거나 참여하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div>
                <label className="block text-lg font-semibold text-black mb-3">
                  닉네임
                </label>
                <Input
                  placeholder="이름을 입력하세요"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-xl py-4 border-2 border-gray-300 focus:border-black focus:ring-black"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Create Room */}
                <div className="space-y-4">
                  <Button
                    onClick={createRoom}
                    className="w-full bg-black hover:bg-gray-800 text-white py-6 text-xl font-bold shadow-lg transition-all duration-300 hover:shadow-xl"
                    disabled={!userName.trim()}
                  >
                    <Plus className="mr-3 h-6 w-6" />
                    새 방 만들기
                  </Button>
                </div>

                {/* Join Room */}
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="방 코드 입력"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                      className="border-2 border-gray-300 focus:border-black focus:ring-black text-lg py-3"
                    />
                  </div>
                  <Button
                    onClick={joinRoom}
                    variant="outline"
                    className="w-full border-2 border-black text-black hover:bg-black hover:text-white py-6 text-xl font-bold transition-all duration-300"
                    disabled={!userName.trim() || !roomCode.trim()}
                  >
                    <Hash className="mr-3 h-6 w-6" />
                    방 참여하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black mb-4">게임 팁</h2>
            <p className="text-gray-600">미니게임으로 당첨 확률을 조절해보세요!</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="text-3xl mb-2">✂️</div>
                <CardTitle className="text-lg text-black">가위바위보</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-2">승리 시 <span className="font-bold text-green-600">+10%</span></p>
                <p className="text-xs text-gray-500">빠르고 간단한 운빨 게임</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="text-3xl mb-2">⏱️</div>
                <CardTitle className="text-lg text-black">탭 타이밍</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-2">성공 시 <span className="font-bold text-green-600">+15%</span></p>
                <p className="text-xs text-gray-500">정확한 타이밍이 관건</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <CardTitle className="text-lg text-black">숫자 맞히기</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-2">성공 시 <span className="font-bold text-green-600">+20%</span></p>
                <p className="text-xs text-gray-500">가장 높은 보상, 가장 어려운 난이도</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
