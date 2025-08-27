import React from 'react';

interface AnimatedLogoProps {
  className?: string;
  size?: number;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  className = "w-16 h-16", 
  size = 64 
}) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-logo"
      >
        {/* Background Circle with Gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="zGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Animated Background Circle */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="url(#bgGradient)"
          className="circle-bg"
          filter="url(#glow)"
        />

        {/* Animated Inner Circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          className="circle-inner"
        />

        {/* Main Z Letter - Animated Paths */}
        <g className="z-letter">
          {/* Top horizontal line */}
          <path
            d="M30 35 L90 35 L90 45 L30 45 Z"
            fill="url(#zGradient)"
            className="z-top"
          />
          
          {/* Diagonal line */}
          <path
            d="M85 45 L35 75 L30 75 L80 45 Z"
            fill="url(#zGradient)"
            className="z-diagonal"
          />
          
          {/* Bottom horizontal line */}
          <path
            d="M30 75 L90 75 L90 85 L30 85 Z"
            fill="url(#zGradient)"
            className="z-bottom"
          />
        </g>

        {/* Animated Dots/Particles */}
        <circle cx="25" cy="25" r="2" fill="#FFFFFF" opacity="0.6" className="particle particle-1" />
        <circle cx="95" cy="25" r="1.5" fill="#FFFFFF" opacity="0.4" className="particle particle-2" />
        <circle cx="25" cy="95" r="1" fill="#FFFFFF" opacity="0.5" className="particle particle-3" />
        <circle cx="95" cy="95" r="2" fill="#FFFFFF" opacity="0.3" className="particle particle-4" />
      </svg>

      <style jsx>{`
        .animate-logo {
          animation: logoFloat 3s ease-in-out infinite;
        }

        .circle-bg {
          animation: pulseGlow 2s ease-in-out infinite alternate;
          transform-origin: center;
        }

        .circle-inner {
          animation: rotate 8s linear infinite;
          transform-origin: center;
        }

        .z-letter {
          animation: zBreathe 3s ease-in-out infinite;
          transform-origin: center;
        }

        .z-top {
          animation: slideInTop 1s ease-out 0.2s both;
        }

        .z-diagonal {
          animation: drawDiagonal 1.5s ease-out 0.6s both;
        }

        .z-bottom {
          animation: slideInBottom 1s ease-out 1.1s both;
        }

        .particle-1 {
          animation: float1 4s ease-in-out infinite;
        }

        .particle-2 {
          animation: float2 3.5s ease-in-out infinite 0.5s;
        }

        .particle-3 {
          animation: float3 4.5s ease-in-out infinite 1s;
        }

        .particle-4 {
          animation: float4 3.8s ease-in-out infinite 1.5s;
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }

        @keyframes pulseGlow {
          0% { 
            transform: scale(0.95);
            filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
          }
          100% { 
            transform: scale(1.05);
            filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.8));
          }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes zBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        @keyframes slideInTop {
          from { 
            transform: translateY(-20px);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes drawDiagonal {
          from { 
            transform: scaleX(0);
            opacity: 0;
          }
          to { 
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes slideInBottom {
          from { 
            transform: translateY(20px);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(5px, -5px) scale(1.2); opacity: 0.8; }
          50% { transform: translate(-3px, -8px) scale(0.8); opacity: 0.4; }
          75% { transform: translate(-5px, 3px) scale(1.1); opacity: 0.7; }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          33% { transform: translate(-8px, 5px) scale(1.3); opacity: 0.6; }
          66% { transform: translate(4px, -6px) scale(0.9); opacity: 0.3; }
        }

        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          40% { transform: translate(6px, -8px) scale(1.1); opacity: 0.7; }
          80% { transform: translate(-4px, 4px) scale(0.8); opacity: 0.3; }
        }

        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          30% { transform: translate(-6px, -4px) scale(1.4); opacity: 0.5; }
          70% { transform: translate(8px, 6px) scale(0.7); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedLogo;

