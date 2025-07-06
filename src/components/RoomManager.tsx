
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Copy, Check } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface RoomManagerProps {
  roomId: string;
  onJoinRoom: (roomId: string) => void;
}

export const RoomManager = ({ roomId, onJoinRoom }: RoomManagerProps) => {
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      toast({
        title: "복사 완료!",
        description: "방 코드가 클립보드에 복사되었습니다.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "방 코드 복사에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const shareRoom = async () => {
    const shareUrl = `${window.location.origin}?room=${roomId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BeanRoulette - 커피 룰렛',
          text: '커피 룰렛 게임에 참여하세요!',
          url: shareUrl,
        });
      } catch (err) {
        copyRoomCode();
      }
    } else {
      copyRoomCode();
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-4 border-black shadow-2xl bg-white">
        <CardHeader className="bg-black text-white">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            방 관리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <label className="block text-lg font-bold text-black mb-3">
              현재 방 코드
            </label>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-2xl px-6 py-3 font-mono font-bold border-2 border-black">
                {roomId}
              </Badge>
              <Button
                onClick={copyRoomCode}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-2 border-black hover:bg-black hover:text-white font-bold"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? '복사됨' : '복사'}
              </Button>
            </div>
          </div>

          <Button
            onClick={shareRoom}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 text-lg font-bold"
          >
            방 링크 공유하기
          </Button>
        </CardContent>
      </Card>

      <Card className="border-4 border-gray-300 shadow-xl bg-white">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-xl text-black font-bold">
            다른 방 참여하기
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <label className="block text-lg font-bold text-black mb-3">
              방 코드 입력
            </label>
            <Input
              placeholder="방 코드를 입력하세요"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="border-2 border-gray-300 focus:border-black focus:ring-black text-lg py-3"
            />
          </div>

          <Button
            onClick={() => joinCode && onJoinRoom(joinCode.toUpperCase())}
            disabled={!joinCode.trim()}
            variant="outline"
            className="w-full border-2 border-black text-black hover:bg-black hover:text-white py-4 text-lg font-bold"
          >
            방 참여하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
