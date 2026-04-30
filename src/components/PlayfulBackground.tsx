import React, { useMemo, useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

interface PlayfulBackgroundProps {
  level: number;
}

export const PlayfulBackground: React.FC<PlayfulBackgroundProps> = ({ level }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Instant response springs for high-end feel
  const springFast = useSpring(mouseX, { damping: 30, stiffness: 400 });
  const springFastY = useSpring(mouseY, { damping: 30, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (level === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#080808]">
      {level === 1 && <ModeKoopGrid mouseX={mouseX} mouseY={mouseY} />}
      {level === 2 && <ModeDeformingGrid mouseX={mouseX} mouseY={mouseY} />}
      {level === 3 && <ModeInteractiveLines mouseX={mouseX} mouseY={mouseY} />}
      {level === 4 && <ModeDeepFocus mouseX={springFast} mouseY={springFastY} />}
      {level === 5 && <ModeChaos mouseX={springFast} mouseY={springFastY} />}
    </div>
  );
};

// --- MODE 1: Koopbin Style Dot Grid with Repulsion ---
const ModeKoopGrid = ({ mouseX, mouseY }: any) => {
  const dots = useMemo(() => {
    const d = [];
    const stepX = 40; // Denser grid
    const stepY = 40;
    const cols = Math.ceil(window.innerWidth / stepX) + 1;
    const rows = Math.ceil(window.innerHeight / stepY) + 1;
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        d.push({ id: `${i}-${j}`, x: i * stepX, y: j * stepY });
      }
    }
    return d;
  }, []);

  return (
    <div className="absolute inset-0">
      {dots.map(dot => <GridDot key={dot.id} dot={dot} mouseX={mouseX} mouseY={mouseY} />)}
    </div>
  );
};

const GridDot = ({ dot, mouseX, mouseY }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(0.1);

  // Use springs for smooth repulsion and return
  const springX = useSpring(x, { damping: 20, stiffness: 150 });
  const springY = useSpring(y, { damping: 20, stiffness: 150 });

  useEffect(() => {
    return mouseX.on('change', (lx: number) => {
      const dx = lx - dot.x;
      const dy = mouseY.get() - dot.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const maxDist = 200;
      if (dist < maxDist) {
        const factor = Math.pow(1 - dist / maxDist, 2);
        // Repulsion: move away from cursor
        x.set(-(dx / dist) * 20 * factor);
        y.set(-(dy / dist) * 20 * factor);
        opacity.set(0.1 + factor * 0.8);
        scale.set(1 + factor * 1.5);
      } else {
        x.set(0);
        y.set(0);
        opacity.set(0.1);
        scale.set(1);
      }
    });
  }, [dot.x, dot.y]);

  return (
    <motion.div 
      className="absolute w-[2px] h-[2px] bg-white rounded-full translate-x-[-50%] translate-y-[-50%]"
      style={{ 
        left: dot.x, 
        top: dot.y,
        x: springX,
        y: springY,
        opacity,
        scale
      }}
    />
  );
};

// --- MODE 2: Deforming Grid (Warping Lines) ---
const ModeDeformingGrid = ({ mouseX, mouseY }: any) => {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const r = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);

  const gap = 50;
  const hLines = useMemo(() => Array.from({ length: Math.ceil(size.h / gap) + 1 }).map((_, i) => i * gap), [size.h]);
  const vLines = useMemo(() => Array.from({ length: Math.ceil(size.w / gap) + 1 }).map((_, i) => i * gap), [size.w]);

  return (
    <svg className="absolute inset-0 w-full h-full opacity-10">
      {hLines.map(y => <Line key={`h-${y}`} initial={y} orientation="h" mouseX={mouseX} mouseY={mouseY} size={size} />)}
      {vLines.map(x => <Line key={`v-${x}`} initial={x} orientation="v" mouseX={mouseX} mouseY={mouseY} size={size} />)}
    </svg>
  );
};

const Line = ({ initial, orientation, mouseX, mouseY, size }: any) => {
  const [path, setPath] = useState('');

  useEffect(() => {
    return mouseX.on('change', (lx) => {
      const ly = mouseY.get();
      const points = 20;
      let d = '';

      if (orientation === 'h') {
        d = `M 0 ${initial}`;
        for (let i = 1; i <= points; i++) {
          const px = (i / points) * size.w;
          const py = initial;
          const dist = Math.sqrt((lx - px) ** 2 + (ly - py) ** 2);
          const influence = 200;
          const offset = dist < influence ? (1 - dist / influence) * (ly - py) * 0.4 : 0;
          d += ` L ${px} ${py + offset}`;
        }
      } else {
        d = `M ${initial} 0`;
        for (let i = 1; i <= points; i++) {
          const px = initial;
          const py = (i / points) * size.h;
          const dist = Math.sqrt((lx - px) ** 2 + (ly - py) ** 2);
          const influence = 200;
          const offset = dist < influence ? (1 - dist / influence) * (lx - px) * 0.4 : 0;
          d += ` L ${px + offset} ${py}`;
        }
      }
      setPath(d);
    });
  }, [initial, orientation, size]);

  return <path d={path} stroke="white" strokeWidth="1" fill="none" />;
};

// --- MODE 3: Spiderweb / Constellation (Koopbin Connection Effect) ---
const ModeInteractiveLines = ({ mouseX, mouseY }: any) => {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const dots = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));
  }, []);

  const [positions, setPositions] = useState(dots);

  useEffect(() => {
    const r = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', r);
    
    let animationFrame: number;
    const animate = () => {
      setPositions(prev => prev.map(p => {
        let nx = p.x + p.vx;
        let ny = p.y + p.vy;
        if (nx < 0 || nx > window.innerWidth) p.vx *= -1;
        if (ny < 0 || ny > window.innerHeight) p.vy *= -1;
        return { ...p, x: nx, y: ny };
      }));
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    
    return () => {
      window.removeEventListener('resize', r);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <svg className="absolute inset-0 w-full h-full">
        <Connections positions={positions} mouseX={mouseX} mouseY={mouseY} />
      </svg>
      {positions.map(p => (
        <div 
          key={p.id} 
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{ left: p.x, top: p.y, transform: 'translate(-50%, -50%)' }}
        />
      ))}
    </div>
  );
};

const Connections = ({ positions, mouseX, mouseY }: any) => {
  const [path, setPath] = useState('');

  useEffect(() => {
    return mouseX.on('change', (lx) => {
      const ly = mouseY.get();
      let d = '';
      const maxDist = 150;

      positions.forEach((p: any) => {
        const dx = lx - p.x;
        const dy = ly - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < maxDist) {
          d += `M ${p.x} ${p.y} L ${lx} ${ly} `;
        }

        // Connect nearby points to each other
        positions.forEach((p2: any) => {
          if (p.id === p2.id) return;
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2*dx2 + dy2*dy2);
          if (dist2 < 80) {
            d += `M ${p.x} ${p.y} L ${p2.x} ${p2.y} `;
          }
        });
      });
      setPath(d);
    });
  }, [positions]);

  return <path d={path} stroke="white" strokeWidth="0.5" strokeOpacity="0.15" fill="none" />;
};

// --- MODE 4: Deep Focus (Glow) ---
const ModeDeepFocus = ({ mouseX, mouseY }: any) => {
  return (
    <>
      <motion.div
        className="absolute w-[1000px] h-[1000px] bg-white/[0.03] rounded-full blur-[150px]"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,1)]"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  );
};

// --- MODE 5: Chaos Grid ---
const ModeChaos = ({ mouseX, mouseY }: any) => {
  return (
    <div className="w-full h-full">
      {Array.from({ length: 100 }).map((_, i) => (
        <ChaosParticle key={i} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
};

const ChaosParticle = ({ mouseX, mouseY }: any) => {
  const x = useMotionValue(Math.random() * window.innerWidth);
  const y = useMotionValue(Math.random() * window.innerHeight);
  
  useEffect(() => {
    return mouseX.on('change', (lx) => {
      const dx = lx - x.get();
      const dy = mouseY.get() - y.get();
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 200) {
        x.set(x.get() - (dx / dist) * 10);
        y.set(y.get() - (dy / dist) * 10);
      }
    });
  }, []);

  return <motion.div className="absolute w-px h-px bg-white/20" style={{ x, y }} />;
};
