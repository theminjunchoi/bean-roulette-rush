
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Users, Gamepad2, MessageCircle, Plus, Hash } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Coffee className="h-12 w-12 text-orange-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              BeanRoulette
            </h1>
          </div>
          <p className="text-xl text-gray-700 mb-4">
            랜덤 커피 러시 플랫폼 ☕
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            "누가 살 건데?" 회의 끝나고 머뭇대지 말고, 한 방에 커피 당번 뽑고 가벼운 게임으로 운빨까지 조절하는 팀 놀이터!
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">방 생성 & 초대</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">아무나 방 파서 링크 뿌리면 끝</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Coffee className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">랜덤 추첨</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">참가 버튼 누른 사람 중 한 놈 당첨</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Gamepad2 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">미니게임</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">가위바위보, 탭 타이밍, 숫자 맞히기</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">실시간 채팅</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">결과까지 수다 떨 공간</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Area */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-orange-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-orange-800">시작하기</CardTitle>
              <CardDescription>이름을 입력하고 방을 만들거나 참여하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임
                </label>
                <Input
                  placeholder="이름을 입력하세요"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-lg py-3 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Create Room */}
                <div className="space-y-4">
                  <Button
                    onClick={createRoom}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-6 text-lg font-semibold shadow-lg"
                    disabled={!userName.trim()}
                  >
                    <Plus className="mr-2 h-5 w-5" />
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
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                  <Button
                    onClick={joinRoom}
                    variant="outline"
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 py-6 text-lg font-semibold"
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

        {/* Personas Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-orange-800 mb-8">
            어떤 타입이세요?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-2xl mb-2">☕</div>
                <CardTitle className="text-lg text-orange-700">카페인 애딕트</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">커피 없으면 멘탈 터지는 자</p>
                <p className="text-xs text-orange-600 mt-2">→ 최대한 빨리 당첨 확인</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-2xl mb-2">💸</div>
                <CardTitle className="text-lg text-orange-700">짠돌 당번 회피러</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">돈 쓰기 싫어 증발하려는 자</p>
                <p className="text-xs text-orange-600 mt-2">→ 낮은 당첨 확률 추구</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-2xl mb-2">🎮</div>
                <CardTitle className="text-lg text-orange-700">게임 광신도</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">미니게임만 보고 온 자</p>
                <p className="text-xs text-orange-600 mt-2">→ 실력 기반 확률 뻥튀기</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-2xl mb-2">👔</div>
                <CardTitle className="text-lg text-orange-700">팀 리더</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">팀 분위기 챙겨야 하는 리더</p>
                <p className="text-xs text-orange-600 mt-2">→ 공정한 추첨, 빠른 진행</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
