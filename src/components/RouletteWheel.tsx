
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
      <div className="flex items-center justify-center h-80 bg-gray-50 rounded-xl border-2 border-gray-200">
        <div className="text-center">
          <div className="text-6xl mb-4">☕</div>
          <p className="text-gray-500 text-lg">참가자가 없습니다</p>
          <p className="text-gray-400 text-sm">게임에 참가해보세요!</p>
        </div>
      </div>
    );
  }

  const colors = [
    '#000000', '#404040', '#606060', '#808080', '#202020', 
    '#101010', '#303030', '#505050', '#707070', '#909090'
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
      color: colors[index % colors.length]
    };
  });

  return (
    <div className="flex flex-col items-center relative">
      {/* Sparkles during spin */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full pointer-events-none"
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
            <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-red-600 drop-shadow-lg"></div>
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full"></div>
          </div>
        </div>
        
        {/* Enhanced Wheel */}
        <motion.div
          className="w-80 h-80 rounded-full relative overflow-hidden border-8 border-black shadow-2xl bg-white"
          animate={{ rotate: rotation }}
          transition={{ 
            duration: isSpinning ? 3 : 0,
            ease: "easeOut"
          }}
          style={{
            boxShadow: isSpinning 
              ? '0 0 50px rgba(0,0,0,0.3), 0 0 100px rgba(255,215,0,0.2)' 
              : '0 20px 40px rgba(0,0,0,0.2)'
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
              const textX = 100 + 60 * Math.cos(textAngleRad);
              const textY = 100 + 60 * Math.sin(textAngleRad);
              
              return (
                <g key={segment.id}>
                  <path
                    d={pathData}
                    fill={segment.color}
                    stroke="white"
                    strokeWidth="3"
                  />
                  {/* Name text */}
                  <text
                    x={textX}
                    y={textY - 5}
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${textAngle}, ${textX}, ${textY - 5})`}
                  >
                    {segment.name.length > 5 ? segment.name.substring(0, 5) + '...' : segment.name}
                  </text>
                  {/* Probability text */}
                  <text
                    x={textX}
                    y={textY + 10}
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${textAngle}, ${textX}, ${textY + 10})`}
                  >
                    {segment.winProbability}%
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black rounded-full border-4 border-white flex items-center justify-center shadow-lg">
            <Coffee className="h-8 w-8 text-white" />
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced Status */}
      <div className="mt-8 text-center">
        {isSpinning && (
          <motion.div 
            className="text-black font-bold text-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            🎲 룰렛이 돌아가고 있습니다... 🎲
          </motion.div>
        )}
        {winner && !isSpinning && (
          <motion.div 
            className="bg-black text-white p-6 rounded-xl border-4 border-gray-300 shadow-xl"
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
          <div className="text-gray-600 text-lg">
            룰렛을 시작하려면 '룰렛 시작!' 버튼을 클릭하세요
          </div>
        )}
      </div>
    </div>
  );
};
