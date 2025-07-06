
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
        // Fallback to copy
        copyRoomCode();
      }
    } else {
      copyRoomCode();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            방 관리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 방 코드
            </label>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-lg px-4 py-2 font-mono">
                {roomId}
              </Badge>
              <Button
                onClick={copyRoomCode}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? '복사됨' : '복사'}
              </Button>
            </div>
          </div>

          <Button
            onClick={shareRoom}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
          >
            방 링크 공유하기
          </Button>
        </CardContent>
      </Card>

      <Card className="border-orange-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-orange-800">
            다른 방 참여하기
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              방 코드 입력
            </label>
            <Input
              placeholder="방 코드를 입력하세요"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>

          <Button
            onClick={() => joinCode && onJoinRoom(joinCode.toUpperCase())}
            disabled={!joinCode.trim()}
            variant="outline"
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            방 참여하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
