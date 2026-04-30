import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isPointer, setIsPointer] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A'
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Ultra Deep Environmental Bloom */}
      <motion.div
        className="absolute w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[120px]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      {/* Target Bloom */}
      <motion.div
        className="absolute w-32 h-32 bg-white/5 rounded-full blur-[60px]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      {/* Deep Bloom Effect */}
      <motion.div
        className="absolute w-24 h-24 bg-white/10 rounded-full blur-3xl"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isPointer ? 1.8 : 1,
          opacity: isPointer ? 0.2 : 0.1,
        }}
      />

      {/* Main Bloom Effect */}
      <motion.div
        className="absolute w-12 h-12 bg-white/30 rounded-full blur-xl"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
          opacity: isPointer ? 0.6 : 0.4,
        }}
      />
      
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute w-4 h-4 bg-white/40 rounded-full blur-[2px]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isPointer ? 2.5 : 1,
        }}
      />

      {/* Main White Dot */}
      <motion.div
        className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1),0_0_30px_rgba(255,255,255,0.5)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isPointer ? 1.4 : 1,
        }}
      />
    </div>
  );
};
