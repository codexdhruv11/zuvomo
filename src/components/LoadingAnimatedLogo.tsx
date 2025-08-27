import React from 'react';

interface LoadingAnimatedLogoProps {
  className?: string;
  size?: number;
  showProgress?: boolean;
  progress?: number;
}

export const LoadingAnimatedLogo: React.FC<LoadingAnimatedLogoProps> = ({ 
  className = "w-16 h-16", 
  size = 64,
  showProgress = false,
  progress = 0
}) => {
  return (
    <div className={`${className} flex items-center justify-center relative`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="loading-logo"
      >
        <defs>
          <linearGradient id="bgGradientLoading" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="25%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="75%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
          
          <linearGradient id="zGradientLoading" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.4)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
          </radialGradient>

          <filter id="innerGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="outerGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Animated Outer Glow Ring */}
        <circle
          cx="60"
          cy="60"
          r="58"
          fill="none"
          stroke="url(#glowGradient)"
          strokeWidth="2"
          className="outer-glow-ring"
          filter="url(#outerGlow)"
        />

        {/* Progress Ring */}
        {showProgress && (
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 52}`}
            strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
            className="progress-ring"
            transform="rotate(-90 60 60)"
          />
        )}

        {/* Main Background Circle */}
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="url(#bgGradientLoading)"
          className="main-circle"
          filter="url(#innerGlow)"
        />

        {/* Rotating Inner Rings */}
        <circle
          cx="60"
          cy="60"
          r="42"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          strokeDasharray="8 4"
          className="inner-ring-1"
        />
        
        <circle
          cx="60"
          cy="60"
          r="38"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
          strokeDasharray="4 2"
          className="inner-ring-2"
        />

        {/* Animated Z Letter Parts */}
        <g className="z-container">
          {/* Z Top Line with Animation */}
          <rect
            x="28"
            y="33"
            width="64"
            height="8"
            rx="2"
            fill="url(#zGradientLoading)"
            className="z-part z-top-part"
          />
          
          {/* Z Diagonal with Draw Effect */}
          <path
            d="M87 41 L33 79 L28 79 L28 75 L75 41 L87 41 Z"
            fill="url(#zGradientLoading)"
            className="z-part z-diagonal-part"
          />
          
          {/* Z Bottom Line */}
          <rect
            x="28"
            y="79"
            width="64"
            height="8"
            rx="2"
            fill="url(#zGradientLoading)"
            className="z-part z-bottom-part"
          />
        </g>

        {/* Floating Energy Particles */}
        <g className="energy-particles">
          <circle cx="20" cy="30" r="1.5" fill="#FFFFFF" opacity="0.8" className="energy-dot dot-1" />
          <circle cx="100" cy="25" r="1" fill="#FFFFFF" opacity="0.6" className="energy-dot dot-2" />
          <circle cx="15" cy="60" r="1.2" fill="#FFFFFF" opacity="0.7" className="energy-dot dot-3" />
          <circle cx="105" cy="60" r="0.8" fill="#FFFFFF" opacity="0.5" className="energy-dot dot-4" />
          <circle cx="20" cy="90" r="1" fill="#FFFFFF" opacity="0.6" className="energy-dot dot-5" />
          <circle cx="100" cy="95" r="1.3" fill="#FFFFFF" opacity="0.8" className="energy-dot dot-6" />
        </g>

        {/* Pulse Rings */}
        <circle
          cx="60"
          cy="60"
          r="30"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          className="pulse-ring pulse-1"
        />
        
        <circle
          cx="60"
          cy="60"
          r="35"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.5"
          className="pulse-ring pulse-2"
        />
      </svg>

      <style jsx>{`
        .loading-logo {
          animation: logoElevate 3s ease-in-out infinite;
          filter: drop-shadow(0 10px 25px rgba(59, 130, 246, 0.3));
        }

        .outer-glow-ring {
          animation: glowRing 2s ease-in-out infinite alternate;
          transform-origin: center;
        }

        .main-circle {
          animation: breathe 3s ease-in-out infinite, colorShift 6s ease-in-out infinite;
          transform-origin: center;
        }

        .inner-ring-1 {
          animation: rotateClockwise 4s linear infinite;
          transform-origin: center;
        }

        .inner-ring-2 {
          animation: rotateCounterClockwise 6s linear infinite;
          transform-origin: center;
        }

        .progress-ring {
          transition: stroke-dashoffset 0.3s ease;
        }

        .z-container {
          animation: zPulse 2.5s ease-in-out infinite;
          transform-origin: center;
        }

        .z-top-part {
          animation: slideInFromLeft 1s ease-out 0.2s both, shimmer 3s ease-in-out infinite 1.5s;
        }

        .z-diagonal-part {
          animation: drawDiagonalAdvanced 1.5s ease-out 0.8s both, shimmer 3s ease-in-out infinite 2s;
        }

        .z-bottom-part {
          animation: slideInFromRight 1s ease-out 1.4s both, shimmer 3s ease-in-out infinite 2.5s;
        }

        .energy-dot {
          animation-fill-mode: both;
        }

        .dot-1 { animation: energyFloat1 3s ease-in-out infinite 0s; }
        .dot-2 { animation: energyFloat2 3.5s ease-in-out infinite 0.3s; }
        .dot-3 { animation: energyFloat3 4s ease-in-out infinite 0.6s; }
        .dot-4 { animation: energyFloat4 3.2s ease-in-out infinite 0.9s; }
        .dot-5 { animation: energyFloat5 3.8s ease-in-out infinite 1.2s; }
        .dot-6 { animation: energyFloat6 4.2s ease-in-out infinite 1.5s; }

        .pulse-1 {
          animation: pulseOut 2s ease-out infinite;
        }

        .pulse-2 {
          animation: pulseOut 2s ease-out infinite 1s;
        }

        @keyframes logoElevate {
          0%, 100% { transform: translateY(0px) scale(1) rotateY(0deg); }
          25% { transform: translateY(-4px) scale(1.02) rotateY(5deg); }
          50% { transform: translateY(-8px) scale(1.05) rotateY(0deg); }
          75% { transform: translateY(-4px) scale(1.02) rotateY(-5deg); }
        }

        @keyframes glowRing {
          0% { 
            transform: scale(0.9);
            opacity: 0.4;
          }
          100% { 
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }

        @keyframes colorShift {
          0%, 100% { filter: hue-rotate(0deg); }
          33% { filter: hue-rotate(10deg); }
          66% { filter: hue-rotate(-10deg); }
        }

        @keyframes rotateClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes rotateCounterClockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes zPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.03); opacity: 0.9; }
        }

        @keyframes slideInFromLeft {
          from { 
            transform: translateX(-40px) scale(0.8);
            opacity: 0;
          }
          to { 
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes slideInFromRight {
          from { 
            transform: translateX(40px) scale(0.8);
            opacity: 0;
          }
          to { 
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes drawDiagonalAdvanced {
          from { 
            clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
            opacity: 0;
          }
          to { 
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0%, 100% { filter: brightness(1) saturate(1); }
          50% { filter: brightness(1.2) saturate(1.3); }
        }

        @keyframes energyFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          25% { transform: translate(8px, -12px) scale(1.3); opacity: 1; }
          50% { transform: translate(-6px, -20px) scale(0.7); opacity: 0.4; }
          75% { transform: translate(-10px, -8px) scale(1.1); opacity: 0.9; }
        }

        @keyframes energyFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          33% { transform: translate(-12px, 8px) scale(1.4); opacity: 0.9; }
          66% { transform: translate(6px, -10px) scale(0.8); opacity: 0.3; }
        }

        @keyframes energyFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          20% { transform: translate(15px, -5px) scale(1.2); opacity: 1; }
          40% { transform: translate(10px, -15px) scale(0.9); opacity: 0.5; }
          60% { transform: translate(-8px, -12px) scale(1.3); opacity: 0.8; }
          80% { transform: translate(-12px, 5px) scale(0.7); opacity: 0.4; }
        }

        @keyframes energyFloat4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(-15px, -15px) scale(1.5); opacity: 0.9; }
        }

        @keyframes energyFloat5 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          30% { transform: translate(10px, -18px) scale(1.1); opacity: 0.8; }
          70% { transform: translate(-8px, 12px) scale(0.8); opacity: 0.3; }
        }

        @keyframes energyFloat6 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          25% { transform: translate(-10px, -8px) scale(1.2); opacity: 1; }
          50% { transform: translate(-20px, -16px) scale(0.6); opacity: 0.4; }
          75% { transform: translate(8px, -12px) scale(1.4); opacity: 0.7; }
        }

        @keyframes pulseOut {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimatedLogo;

