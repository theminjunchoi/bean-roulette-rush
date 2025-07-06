
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, X } from 'lucide-react';

interface Message {
  id: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'system';
}

interface ChatPanelProps {
  roomId: string;
  userName: string;
}

export const ChatPanel = ({ roomId, userName }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with some demo messages
    const demoMessages: Message[] = [
      {
        id: '1',
        userName: 'System',
        message: `${userName}님이 채팅방에 입장했습니다.`,
        timestamp: new Date(),
        type: 'system'
      },
      {
        id: '2',
        userName: '이다빈',
        message: '안녕하세요! 커피 빨리 뽑아봐요 ㅎㅎ',
        timestamp: new Date(Date.now() - 60000),
        type: 'user'
      },
      {
        id: '3',
        userName: '김솔',
        message: '미니게임 먼저 해서 확률 올려야지!',
        timestamp: new Date(Date.now() - 30000),
        type: 'user'
      }
    ];
    setMessages(demoMessages);
  }, [userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userName,
      message: newMessage,
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate other users responding
    setTimeout(() => {
      const responses = [
        '그러게요!',
        'ㅋㅋㅋ 재밌네요',
        '어서 뽑아봅시다',
        '화이팅!',
        '누가 걸릴까요?'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const responders = ['최양락', '박지현', '이다빈', '김솔'].filter(name => name !== userName);
      const randomResponder = responders[Math.floor(Math.random() * responders.length)];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        userName: randomResponder,
        message: randomResponse,
        timestamp: new Date(),
        type: 'user'
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000 + Math.random() * 2000);
  };

  return (
    <Card className="h-full border-orange-200 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-orange-800">채팅</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-2 rounded-lg max-w-[90%] ${
                message.type === 'system'
                  ? 'bg-gray-100 text-gray-600 text-center text-sm mx-auto'
                  : message.userName === userName
                  ? 'bg-orange-500 text-white ml-auto'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.type === 'user' && message.userName !== userName && (
                <div className="text-xs font-semibold mb-1">{message.userName}</div>
              )}
              <div className="text-sm">{message.message}</div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-orange-200">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
