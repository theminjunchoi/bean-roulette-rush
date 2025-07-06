
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  winProbability: number;
  isReady: boolean;
}

interface RouletteWheelProps {
  participants: Participant[];
  isSpinning: boolean;
  winner: Participant | null;
}

export const RouletteWheel = ({ participants, isSpinning, winner }: RouletteWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number}>>([]);
  
  useEffect(() => {
    if (isSpinning) {
      const finalRotation = 1800 + Math.random() * 720; // 5-7 full rotations
      setRotation(finalRotation);
      
      // Add sparkle effect during spin
      const sparkleInterval = setInterval(() => {
        setSparkles(prev => [
          ...prev.slice(-10), // Keep only last 10 sparkles
          {
            id: Date.now(),
            x: Math.random() * 300,
            y: Math.random() * 300
          }
        ]);
      }, 100);
      
      setTimeout(() => {
        clearInterval(sparkleInterval);
        setSparkles([]);
      }, 3000);
      
      return () => clearInterval(sparkleInterval);
    }
  }, [isSpinning]);

  if (participants.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-amber-50 rounded-xl border-2 border-amber-200">
        <div className="text-center">
          <div className="text-6xl mb-4">☕</div>
          <p className="text-amber-700 text-lg">참가자가 없습니다</p>
          <p className="text-amber-600 text-sm">게임에 참가해보세요!</p>
        </div>
      </div>
    );
  }

  const colors = [
    '#92400e', '#a16207', '#b45309', '#c2410c', '#dc2626',
    '#ea580c', '#f59e0b', '#d97706', '#ca8a04', '#b91c1c'
  ];

  const totalProbability = participants.reduce((sum, p) => sum + p.winProbability, 0);
  let currentAngle = 0;
  
  const segments = participants.map((participant, index) => {
    const segmentAngle = (participant.winProbability / totalProbability) * 360;
    const startAngle = currentAngle;
    currentAngle += segmentAngle;
    
    return {
      ...participant,
      startAngle,
      endAngle: currentAngle,
      color: colors[index % colors.length],
      segmentAngle
    };
  });

  return (
    <div className="flex flex-col items-center relative">
      {/* Sparkles during spin */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full pointer-events-none z-10"
          style={{ left: sparkle.x, top: sparkle.y }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          ✨
        </motion.div>
      ))}
      
      <div className="relative">
        {/* Enhanced Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-20">
          <div className="relative">
            <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-amber-800 drop-shadow-lg"></div>
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-amber-800 rounded-full"></div>
          </div>
        </div>
        
        {/* Enhanced Wheel */}
        <motion.div
          className="w-80 h-80 rounded-full relative overflow-hidden border-8 border-amber-900 shadow-2xl bg-white"
          animate={{ rotate: rotation }}
          transition={{ 
            duration: isSpinning ? 3 : 0,
            ease: "easeOut"
          }}
          style={{
            boxShadow: isSpinning 
              ? '0 0 50px rgba(146, 64, 14, 0.3), 0 0 100px rgba(251, 191, 36, 0.2)' 
              : '0 20px 40px rgba(146, 64, 14, 0.2)'
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 200 200">
            {segments.map((segment, index) => {
              const startAngleRad = (segment.startAngle - 90) * (Math.PI / 180);
              const endAngleRad = (segment.endAngle - 90) * (Math.PI / 180);
              
              const x1 = 100 + 90 * Math.cos(startAngleRad);
              const y1 = 100 + 90 * Math.sin(startAngleRad);
              const x2 = 100 + 90 * Math.cos(endAngleRad);
              const y2 = 100 + 90 * Math.sin(endAngleRad);
              
              const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
              
              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              const textAngle = (segment.startAngle + segment.endAngle) / 2;
              const textAngleRad = (textAngle - 90) * (Math.PI / 180);
              
              // 텍스트 겹침 방지를 위한 개선된 위치 계산
              const isVerySmallSegment = segment.segmentAngle < 30;
              const isSmallSegment = segment.segmentAngle < 50;
              
              if (isVerySmallSegment) {
                // 매우 작은 세그먼트는 텍스트를 표시하지 않음
                return (
                  <g key={segment.id}>
                    <path
                      d={pathData}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth="2"
                    />
                  </g>
                );
              }
              
              const textRadius = isSmallSegment ? 55 : 50;
              const textX = 100 + textRadius * Math.cos(textAngleRad);
              const textY = 100 + textRadius * Math.sin(textAngleRad);
              
              // 텍스트 크기를 세그먼트 크기에 따라 조정
              const nameFontSize = isSmallSegment ? "9" : "11";
              const probFontSize = isSmallSegment ? "8" : "10";
              
              // 텍스트 간격 조정
              const nameOffset = isSmallSegment ? -4 : -6;
              const probOffset = isSmallSegment ? 6 : 8;
              
              // 텍스트 길이 제한
              const displayName = segment.name.length > (isSmallSegment ? 4 : 6) 
                ? segment.name.substring(0, isSmallSegment ? 4 : 6) + '...' 
                : segment.name;
              
              return (
                <g key={segment.id}>
                  <path
                    d={pathData}
                    fill={segment.color}
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* 이름 텍스트 */}
                  <text
                    x={textX}
                    y={textY + nameOffset}
                    fill="white"
                    fontSize={nameFontSize}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${textAngle}, ${textX}, ${textY + nameOffset})`}
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {displayName}
                  </text>
                  {/* 확률 텍스트 */}
                  <text
                    x={textX}
                    y={textY + probOffset}
                    fill="white"
                    fontSize={probFontSize}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${textAngle}, ${textX}, ${textY + probOffset})`}
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {segment.winProbability}%
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-amber-900 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
            <Coffee className="h-8 w-8 text-amber-50" />
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced Status */}
      <div className="mt-8 text-center">
        {isSpinning && (
          <motion.div 
            className="text-amber-800 font-bold text-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            🎲 룰렛이 돌아가고 있습니다... 🎲
          </motion.div>
        )}
        {winner && !isSpinning && (
          <motion.div 
            className="bg-gradient-to-r from-amber-800 to-orange-700 text-white p-6 rounded-xl border-4 border-amber-300 shadow-xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="text-4xl font-bold mb-2">
              🏆 {winner.name} 당첨! 🏆
            </div>
            <div className="text-xl">
              커피 한턱 내주세요! ☕
            </div>
          </motion.div>
        )}
        {!isSpinning && !winner && participants.length > 0 && (
          <div className="text-amber-700 text-lg">
            룰렛을 시작하려면 '룰렛 시작!' 버튼을 클릭하세요
          </div>
        )}
      </div>
    </div>
  );
};
