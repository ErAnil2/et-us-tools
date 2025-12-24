'use client';

import { useEffect, useRef, useCallback } from 'react';

interface VictoryModalOptions {
  icon?: string;
  title?: string;
  message?: string;
  titleColor?: string;
  stats?: string;
  showFirecrackers?: boolean;
}

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  options: VictoryModalOptions;
}

export default function VictoryModal({ isOpen, onClose, onPlayAgain, options }: VictoryModalProps) {
  const firecrackerContainerRef = useRef<HTMLDivElement>(null);

  const createFirecrackers = useCallback(() => {
    const container = firecrackerContainerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8B94', '#A8E6CF', '#FFD93D', '#95E1D3', '#F38181'];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'firecracker-particle';

        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        particle.style.left = startX + '%';
        particle.style.top = startY + '%';

        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        const size = Math.random() * 8 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        const duration = Math.random() * 1 + 0.5;
        particle.style.animationDuration = duration + 's';

        container.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, duration * 1000);
      }, i * 30);
    }
  }, []);

  useEffect(() => {
    if (isOpen && options.showFirecrackers !== false && options.icon !== '🤝') {
      createFirecrackers();
    }
  }, [isOpen, options.showFirecrackers, options.icon, createFirecrackers]);

  if (!isOpen) return null;

  const titleColorClass = options.titleColor || 'text-gray-900';

  return (
    <>
      <style jsx global>{`
        .firecracker-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: explode linear forwards;
        }

        @keyframes explode {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(
              calc((var(--random-x, 50) - 50) * 3px),
              calc((var(--random-y, 50) - 50) * 3px)
            ) scale(0);
            opacity: 0;
          }
        }

        .firecracker-particle:nth-child(odd) {
          animation: explode1 linear forwards;
        }

        .firecracker-particle:nth-child(even) {
          animation: explode2 linear forwards;
        }

        @keyframes explode1 {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(calc((50 - var(--tx, 50)) * 5px), calc((50 - var(--ty, 50)) * 5px)) scale(0) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes explode2 {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(calc((var(--tx, 50) - 50) * 5px), calc((var(--ty, 50) - 50) * 5px)) scale(0) rotate(-720deg);
            opacity: 0;
          }
        }

        .victory-modal-content {
          transform: scale(1);
          transition: transform 0.3s ease-out;
        }
      `}</style>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative transform transition-all victory-modal-content">
          {/* Firecracker Container */}
          <div ref={firecrackerContainerRef} className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl sm:rounded-3xl"></div>

          {/* Modal Content */}
          <div className="relative z-10">
            <div className="text-center mb-4 sm:mb-6">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-bounce">{options.icon || '🎉'}</div>
              <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${titleColorClass}`}>{options.title || 'You Win!'}</h2>
              <p className="text-gray-600 text-base sm:text-lg">{options.message || 'Congratulations!'}</p>
            </div>

            {/* Victory Stats */}
            {options.stats && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div dangerouslySetInnerHTML={{ __html: options.stats }} />
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white py-3 px-4 sm:px-6 rounded-xl font-semibold transition-colors text-sm sm:text-base touch-manipulation"
              >
                Close
              </button>
              <button
                onClick={onPlayAgain}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 active:from-green-800 active:to-blue-800 text-white py-3 px-4 sm:px-6 rounded-xl font-semibold transition-colors text-sm sm:text-base touch-manipulation"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
