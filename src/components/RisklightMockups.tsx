import React from 'react';
import { motion } from 'motion/react';

const MOCKUP_IMAGES = [
  '/images/projects/1.webp',
  '/images/projects/2.webp',
  '/images/projects/3.webp',
];

const ROTATIONS = [-8, 0, 8];
const FLOAT_DELAYS = [0, 0.4, 0.8];

interface RisklightMockupsProps {
  variant: 'hero' | 'card';
  fallbackImage?: string;
  /** For card: pass through from parent for parallax */
  style?: React.CSSProperties;
  /** For card: pass through for scale on hover */
  className?: string;
}

export function RisklightMockups({
  variant,
  fallbackImage = '/images/projects/risklight.png',
  style,
  className = '',
}: RisklightMockupsProps) {
  const isHero = variant === 'hero';

  const sizes = isHero
    ? { center: 'clamp(180px, 38%, 320px)', side: 'clamp(120px, 26%, 220px)' }
    : { center: 'clamp(100px, 35%, 200px)', side: 'clamp(70px, 24%, 140px)' };

  return (
    <div
      className={`relative w-full h-full min-h-0 flex items-center justify-center overflow-hidden bg-black ${
        isHero ? 'rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem]' : ''
      } ${className}`}
      style={{ perspective: 1200, ...style }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {MOCKUP_IMAGES.map((src, i) => {
          const isCenter = i === 1;
          const isLeft = i === 0;
          return (
            <motion.div
              key={i}
              className="absolute flex items-center justify-center"
              style={{
                width: isCenter ? sizes.center : sizes.side,
                left: isLeft ? '5%' : isCenter ? '50%' : undefined,
                right: !isLeft && !isCenter ? '5%' : undefined,
                transform: isCenter ? 'translateX(-50%)' : undefined,
                zIndex: isCenter ? 2 : 1,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  y: [0, -8, 0],
                  scale: 1,
                  rotateY: ROTATIONS[i],
                }}
                transition={{
                  opacity: { duration: 0.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] },
                  y: {
                    repeat: Infinity,
                    duration: 3,
                    delay: FLOAT_DELAYS[i],
                    ease: 'easeInOut',
                  },
                  scale: { duration: 0.8, delay: i * 0.2 },
                  rotateY: { duration: 0.8, delay: i * 0.2 },
                }}
                style={{ transformStyle: 'preserve-3d', width: '100%' }}
              >
                <img
                  src={src}
                  alt={`RiskLight mockup ${i + 1}`}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (fallbackImage && target.src !== fallbackImage) {
                      target.src = fallbackImage;
                    }
                  }}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
