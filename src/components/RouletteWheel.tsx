
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
  
  useEffect(() => {
    if (isSpinning) {
      const finalRotation = 1800 + Math.random() * 720; // 5-7 full rotations
      setRotation(finalRotation);
    }
  }, [isSpinning]);

  if (participants.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">참가자가 없습니다</p>
      </div>
    );
  }

  const colors = [
    '#F97316', '#EAB308', '#84CC16', '#06B6D4', '#8B5CF6', 
    '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#F43F5E'
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
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
        </div>
        
        {/* Wheel */}
        <motion.div
          className="w-64 h-64 rounded-full relative overflow-hidden border-4 border-orange-300 shadow-lg"
          animate={{ rotate: rotation }}
          transition={{ 
            duration: isSpinning ? 3 : 0,
            ease: "easeOut"
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
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                  >
                    {segment.name.length > 4 ? segment.name.substring(0, 4) + '...' : segment.name}
                  </text>
                  <text
                    x={textX}
                    y={textY + 15}
                    fill="white"
                    fontSize="10"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${textAngle}, ${textX}, ${textY + 15})`}
                  >
                    {segment.winProbability}%
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>
      </div>
      
      {/* Status */}
      <div className="mt-6 text-center">
        {isSpinning && (
          <div className="text-orange-600 font-semibold text-lg animate-pulse">
            룰렛이 돌아가고 있습니다...
          </div>
        )}
        {winner && !isSpinning && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700 mb-1">
              🎉 {winner.name} 당첨! 🎉
            </div>
            <div className="text-green-600">
              커피 한턱 내주세요! ☕
            </div>
          </div>
        )}
        {!isSpinning && !winner && participants.length > 0 && (
          <div className="text-gray-600">
            룰렛을 시작하려면 '룰렛 시작!' 버튼을 클릭하세요
          </div>
        )}
      </div>
    </div>
  );
};
