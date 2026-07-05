import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';

// --- 3D GRID COMPONENT (Untouched, exact physics from before) ---
function GravityGrid() {
  const lineRef = useRef();

  const GRID_RES = 57;
  const MASS = 5;
  const INFLUENCE_RADIUS = 10;
  const SPRING_CONSTANT = 0.1;
  const DAMPING = 0.88;

  const { positions, indices, originalPositions, velocities } = useMemo(() => {
    const pos = [];
    const idx = [];
    const orig = [];
    const vel = [];
    const SIZE = 100; 

    for (let i = 0; i <= GRID_RES; i++) {
      for (let j = 0; j <= GRID_RES; j++) {
        const x = (i / GRID_RES - 0.5) * SIZE;
        const y = (j / GRID_RES - 0.5) * SIZE;
        pos.push(x, y, 0);
        orig.push(x, y, 0);
        vel.push(0);
      }
    }

    for (let i = 0; i <= GRID_RES; i++) {
      for (let j = 0; j < GRID_RES; j++) {
        const current = i * (GRID_RES + 1) + j;
        idx.push(current, current + 1);
      }
    }

    for (let j = 0; j <= GRID_RES; j++) {
      for (let i = 0; i < GRID_RES; i++) {
        const current = i * (GRID_RES + 1) + j;
        const next = (i + 1) * (GRID_RES + 1) + j;
        idx.push(current, next);
      }
    }

    return {
      positions: new Float32Array(pos),
      indices: new Uint16Array(idx),
      originalPositions: new Float32Array(orig),
      velocities: new Float32Array(vel),
    };
  }, []);

  useFrame(({ pointer, viewport }) => {
    if (!lineRef.current) return;

    const mouseX = (pointer.x * viewport.width) / 2;
    const mouseY = (pointer.y * viewport.height) / 2;
    const currentPositions = lineRef.current.geometry.attributes.position.array;
    const radiusSq = INFLUENCE_RADIUS * INFLUENCE_RADIUS;

    for (let i = 0; i < velocities.length; i++) {
      const px = originalPositions[i * 3];
      const py = originalPositions[i * 3 + 1];
      const dx = px - mouseX;
      const dy = py - mouseY;
      const distSq = dx * dx + dy * dy;

      const targetZ = -(MASS * radiusSq) / (distSq + radiusSq);
      const currentZ = currentPositions[i * 3 + 2];
      const force = (targetZ - currentZ) * SPRING_CONSTANT;

      velocities[i] += force;
      velocities[i] *= DAMPING;
      currentPositions[i * 3 + 2] += velocities[i];
    }
    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="index" array={indices} count={indices.length} itemSize={1} />
      </bufferGeometry>
      <lineBasicMaterial color="#0ea5e9" transparent opacity={0.35} />
    </lineSegments>
  );
}

// --- MAIN PAGE LAYOUT ---
export default function HomePage() {
  const navigate = useNavigate();

  return (
    // Changed main container to allow vertical scrolling
    <div className="w-full h-full overflow-y-auto bg-slate-50">
      
      {/* 1. HERO SECTION (Takes up exactly the first screen height) */}
      <div className="relative w-full h-[calc(100vh-60px)] bg-white overflow-hidden shrink-0">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 40], fov: 60 }}>
            <GravityGrid />
          </Canvas>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-white/50 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold text-blue-600 mb-6 border border-blue-100 shadow-sm">
            v2.0  SAHU ji Performance Engine is Now Live
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 select-none text-center leading-tight">
            Universal Data <br /> Intelligence UDA
          </h1>
          
          <p className="text-slate-500 mb-10 max-w-xl text-center font-medium select-none text-lg">
            Upload any dataset. Our engine automatically detects the schema, builds interactive charts, and lets you explore your data with zero setup.
          </p>
          
          <div className="pointer-events-auto flex gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition hover:scale-105 hover:shadow-blue-500/30"
            >
              Launch Dashboard
            </button>
            <button className="px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-full font-bold shadow-sm hover:bg-slate-50 transition hover:scale-105">
              Documentation
            </button>
          </div>
        </div>
      </div>

      {/* 2. SOCIAL PROOF BANNER */}
      <div className="w-full py-10 bg-white border-y border-slate-200 flex flex-col items-center justify-center">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Trusted by data teams worldwide</p>
        <div className="flex flex-wrap gap-12 md:gap-24 opacity-40 grayscale">
          {/* Mock Logos - Replace with real SVGs later */}
          <span className="text-xl font-black tracking-tighter font-serif">TEAM7</span>
          <span className="text-xl font-black tracking-tighter">Batch4</span>
          <span className="text-xl font-black tracking-tighter italic">Sab tv</span>
          <span className="text-xl font-black tracking-tighter uppercase">didi tera dewar diwana</span>
        </div>
      </div>

      {/* 3. THE BENTO BOX FEATURE GRID */}
      <div className="max-w-6xl mx-auto py-24 px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Everything you need, in one view.</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Stop wrestling with Excel and complex BI tools. Our modular dashboard handles parsing, visualizing, and analyzing simultaneously.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          
          {/* Bento Card 1: Wide (Interactive Charts) */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110"></div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">Google-Maps Style Navigation</h3>
            <p className="text-slate-500 relative z-10 max-w-sm">Infinite panning and dynamic zoom algorithms let you inspect micro-clusters in massive datasets with zero latency.</p>
            {/* Decorative Mock Chart UI */}
            <div className="absolute bottom-0 right-0 w-3/4 h-32 bg-gradient-to-t from-slate-100 to-transparent border-t border-l border-slate-200 rounded-tl-xl translate-y-4 group-hover:translate-y-0 transition-transform"></div>
          </div>

          {/* Bento Card 2: Square (Auto Schema) */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-400 text-2xl">⚡</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Auto-Schema Detection</h3>
              <p className="text-slate-400 text-sm">Upload raw CSVs. The engine automatically segregates numeric and categorical data instantly.</p>
            </div>
          </div>

          {/* Bento Card 3: Square (Multi-Line) */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 text-emerald-500 text-2xl">📊</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Multi-Metric Overlays</h3>
            <p className="text-slate-500 text-sm">Stack multiple readings on a single shared axis to discover hidden correlations effortlessly.</p>
          </div>

          {/* Bento Card 4: Wide (Live Stats) */}
          <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-sm text-white relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative z-10 flex flex-col justify-center h-full">
              <h3 className="text-2xl font-bold mb-2">Real-Time Statistical Summaries</h3>
              <p className="text-blue-100 max-w-md">Mean, Median, Standard Deviation, and Variance are calculated instantly on your active viewport data.</p>
            </div>
            {/* Decorative Numbers */}
            <div className="absolute right-[-20px] bottom-[-40px] text-[150px] font-black opacity-10 select-none">∑</div>
          </div>

        </div>
      </div>

      {/* 4. FINAL CTA / FOOTER */}
      <div className="w-full bg-slate-900 py-24 text-center">
        <h2 className="text-4xl font-black text-white tracking-tight mb-6">Ready to see your data clearly?</h2>
        <button 
          onClick={() => navigate('/upload')}
          className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:bg-blue-50 hover:text-blue-600 transition hover:scale-105"
        >
          Upload Your First Dataset
        </button>
        <p className="text-slate-500 mt-12 text-sm">© 2026 AI Benchmark Hub.  BY NIKHIL SAHU. All rights reserved.</p>
      </div>

    </div>
  );
}