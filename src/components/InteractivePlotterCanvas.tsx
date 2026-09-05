import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Download, Volume2, VolumeX, Cpu, Layers, Sparkles } from 'lucide-react';

type PresetType = 'hexagon' | 'topography' | 'moire' | 'isometric';

export const InteractivePlotterCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [preset, setPreset] = useState<PresetType>('hexagon');
  const [density, setDensity] = useState<number>(36);
  const [frequency, setFrequency] = useState<number>(4);
  const [nibSize, setNibSize] = useState<number>(1.2);
  const [inkColor, setInkColor] = useState<string>('#000000');
  const [isPlotting, setIsPlotting] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState({
    x: 0,
    y: 0,
    progress: 0,
    penDown: true,
    totalVectors: 0,
  });

  // Audio Context reference for gentle mechanical plotter hum
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Generate vector paths based on chosen preset & parameters
  const generatePaths = (width: number, height: number, type: PresetType, linesCount: number, freq: number) => {
    const paths: Array<Array<{ x: number; y: number }>> = [];
    const centerX = width / 2;
    const centerY = height / 2;

    if (type === 'hexagon') {
      // Hexagonal concentric harmonic rings & tessellation
      const maxRadius = Math.min(width, height) * 0.42;
      for (let r = 0; r < linesCount; r++) {
        const radius = (r / linesCount) * maxRadius + 15;
        const sides = 6;
        const currentPath: Array<{ x: number; y: number }> = [];
        const angleOffset = (r * freq * Math.PI) / 180;
        for (let i = 0; i <= sides; i++) {
          const angle = (i * 2 * Math.PI) / sides + angleOffset;
          const noise = Math.sin(angle * freq + r * 0.2) * (radius * 0.08);
          const x = centerX + Math.cos(angle) * (radius + noise);
          const y = centerY + Math.sin(angle) * (radius + noise);
          currentPath.push({ x, y });
        }
        paths.push(currentPath);
      }
    } else if (type === 'topography') {
      // Flowing Perlin contour isolines
      const padding = 40;
      const plotWidth = width - padding * 2;
      const plotHeight = height - padding * 2;
      const stepY = plotHeight / linesCount;

      for (let j = 0; j < linesCount; j++) {
        const currentPath: Array<{ x: number; y: number }> = [];
        const baseY = padding + j * stepY;
        const numPoints = 80;
        for (let i = 0; i <= numPoints; i++) {
          const x = padding + (i / numPoints) * plotWidth;
          const wave1 = Math.sin((i * freq * 0.1) + j * 0.2) * 18;
          const wave2 = Math.cos((i * 0.05) - j * 0.15) * 12;
          const bell = Math.sin((i / numPoints) * Math.PI); // tapering edges
          const y = baseY + (wave1 + wave2) * bell;
          currentPath.push({ x, y });
        }
        paths.push(currentPath);
      }
    } else if (type === 'moire') {
      // Radial dual-axis spirograph / moiré interference
      const rings = linesCount;
      const maxR = Math.min(width, height) * 0.42;
      for (let k = 0; k < rings; k++) {
        const currentPath: Array<{ x: number; y: number }> = [];
        const numPts = 120;
        const rBase = (k / rings) * maxR;
        const rotation = (k * freq * 0.04);
        for (let p = 0; p <= numPts; p++) {
          const theta = (p / numPts) * Math.PI * 2;
          const r = rBase + Math.sin(theta * freq + rotation) * 15;
          const x = centerX + Math.cos(theta) * r;
          const y = centerY + Math.sin(theta) * r;
          currentPath.push({ x, y });
        }
        paths.push(currentPath);
      }
    } else if (type === 'isometric') {
      // Isometric geometric cubes / axonometric lines
      const size = 32;
      const cols = Math.floor(width / (size * 1.5));
      const rows = Math.floor(height / (size * 1.5));
      for (let r = 0; r < Math.min(linesCount, rows); r++) {
        for (let c = 0; c < cols; c++) {
          const x0 = 50 + c * (size * 1.5);
          const y0 = 50 + r * (size * 1.5) + (c % 2 === 0 ? 0 : size * 0.75);
          // 3 axes
          paths.push([
            { x: x0, y: y0 },
            { x: x0, y: y0 + size * 0.8 },
            { x: x0 + size * 0.7, y: y0 + size * 1.2 },
            { x: x0 + size * 0.7, y: y0 + size * 0.4 },
            { x: x0, y: y0 }
          ]);
          paths.push([
            { x: x0, y: y0 },
            { x: x0 - size * 0.7, y: y0 + size * 0.4 },
            { x: x0 - size * 0.7, y: y0 + size * 1.2 },
            { x: x0, y: y0 + size * 0.8 }
          ]);
        }
      }
    }

    return paths;
  };

  // State to hold compiled path data and current animation progress
  const pathsRef = useRef<Array<Array<{ x: number; y: number }>>>([]);
  const currentPathIdxRef = useRef<number>(0);
  const currentPointIdxRef = useRef<number>(0);
  const isPlottingRef = useRef<boolean>(isPlotting);

  useEffect(() => {
    isPlottingRef.current = isPlotting;
  }, [isPlotting]);

  // Audio stepper sound
  const playStepperTick = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 80, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio not permitted or supported
    }
  };

  // Reset and restart plotting
  const resetPlot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas and draw paper texture background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle paper deckle frame
    ctx.strokeStyle = '#EFEFEF';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Regenerate paths
    const newPaths = generatePaths(canvas.width, canvas.height, preset, density, frequency);
    pathsRef.current = newPaths;
    currentPathIdxRef.current = 0;
    currentPointIdxRef.current = 0;
    setIsPlotting(true);

    let totalPoints = 0;
    newPaths.forEach(p => totalPoints += p.length);
    setTelemetry({
      x: 0,
      y: 0,
      progress: 0,
      penDown: true,
      totalVectors: totalPoints
    });
  };

  // Canvas drawing loop
  useEffect(() => {
    resetPlot();
  }, [preset, density, frequency, nibSize, inkColor]);

  useEffect(() => {
    let lastTick = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderLoop = (time: number) => {
      if (isPlottingRef.current && pathsRef.current.length > 0) {
        const paths = pathsRef.current;
        const currentPIdx = currentPathIdxRef.current;

        if (currentPIdx < paths.length) {
          const path = paths[currentPIdx];
          const pointIdx = currentPointIdxRef.current;

          if (pointIdx < path.length - 1) {
            const p1 = path[pointIdx];
            const p2 = path[pointIdx + 1];

            ctx.strokeStyle = inkColor;
            ctx.lineWidth = nibSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            currentPointIdxRef.current += 1;

            // Telemetry update
            if (time - lastTick > 60) {
              lastTick = time;
              playStepperTick();
              const progressPct = Math.round((currentPIdx / paths.length) * 100);
              setTelemetry(prev => ({
                ...prev,
                x: Math.round((p2.x / canvas.width) * 297), // simulated A4 mm
                y: Math.round((p2.y / canvas.height) * 210),
                progress: progressPct,
                penDown: true
              }));
            }
          } else {
            // Next path
            currentPathIdxRef.current += 1;
            currentPointIdxRef.current = 0;
          }
        } else {
          // Completed
          setIsPlotting(false);
          setTelemetry(prev => ({ ...prev, progress: 100, penDown: false }));
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [inkColor, nibSize, soundEnabled]);

  // Export as PNG
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `frameworks-generative-plot-${preset}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Export as Vector SVG
  const handleExportSVG = () => {
    const paths = pathsRef.current;
    const canvas = canvasRef.current;
    if (!canvas || paths.length === 0) return;

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" width="${canvas.width}" height="${canvas.height}">\n`;
    svgContent += `  <rect width="100%" height="100%" fill="#ffffff" />\n`;
    svgContent += `  <!-- Generated by FRAMEWORKS Studio Elias Thorne // Algorithmic Plotter -->\n`;
    svgContent += `  <g fill="none" stroke="${inkColor}" stroke-width="${nibSize}" stroke-linecap="round" stroke-linejoin="round">\n`;

    paths.forEach((path) => {
      if (path.length > 1) {
        const d = path.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`, '');
        svgContent += `    <path d="${d}" />\n`;
      }
    });

    svgContent += `  </g>\n</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `frameworks-vector-plot-${preset}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="interactive-plotter" className="py-24 sm:py-32 bg-[#FBFBFB] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Live Studio AxiDraw Hardware Simulator
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-black font-normal tracking-tight">
            Interactive Plotter Studio
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base mt-2 font-light">
            Adjust algorithm parameters to watch the simulated mechanical pen carriage draft custom vector toolpaths in real time. Download your generated design as an authentic vector SVG or high-resolution plot.
          </p>
        </div>

        {/* Plotter Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: Canvas Stage (Gallery Mat) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#F4F4F4] p-4 sm:p-8 border border-zinc-300 relative shadow-sm">
              
              {/* Plotter Bed Telemetry Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-zinc-200 text-xs font-mono text-zinc-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 font-medium text-black">
                    <Cpu className="w-3.5 h-3.5" />
                    AxiDraw V3 Engine
                  </span>
                  <span>|</span>
                  <span>Coord: X={telemetry.x}mm, Y={telemetry.y}mm</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    isPlotting ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {isPlotting ? `Drawing (${telemetry.progress}%)` : 'Plot Ready (100%)'}
                  </span>
                </div>
              </div>

              {/* Physical Canvas Surface */}
              <div className="relative aspect-[4/3] bg-white border border-zinc-300 shadow-[0_4px_25px_rgba(0,0,0,0.06)] overflow-hidden flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-full object-contain cursor-crosshair"
                />

                {/* Plotter Pen Crosshair Simulation */}
                {isPlotting && (
                  <div
                    className="absolute pointer-events-none transition-all duration-75 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${(telemetry.x / 297) * 100}%`,
                      top: `${(telemetry.y / 210) * 100}%`,
                    }}
                  >
                    <div className="w-4 h-4 border border-red-500 rounded-full animate-ping opacity-60"></div>
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                )}
              </div>

              {/* Live Canvas Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-2 border-t border-zinc-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlotting(!isPlotting)}
                    className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {isPlotting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlotting ? 'Pause Toolpath' : 'Resume Plot'}</span>
                  </button>

                  <button
                    onClick={resetPlot}
                    className="px-3.5 py-2 border border-zinc-300 text-zinc-700 text-xs uppercase tracking-wider font-medium hover:border-black hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer bg-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Redraw</span>
                  </button>

                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-2 border text-xs transition-colors cursor-pointer ${
                      soundEnabled ? 'border-black bg-zinc-100 text-black' : 'border-zinc-300 text-zinc-400 bg-white'
                    }`}
                    title={soundEnabled ? 'Disable Stepper Sound' : 'Enable Stepper Sound'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportSVG}
                    className="px-3.5 py-2 border border-zinc-300 bg-white text-zinc-800 text-xs font-mono uppercase tracking-wider hover:border-black transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Vector SVG</span>
                  </button>
                  <button
                    onClick={handleExportPNG}
                    className="px-3.5 py-2 bg-zinc-800 text-white text-xs font-mono uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Hi-Res PNG</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Algorithm Control Board */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 border border-zinc-200 space-y-6">
            <div>
              <h3 className="font-serif text-2xl text-black font-medium">Algorithm Controls</h3>
              <p className="text-xs text-zinc-500 mt-1 font-sans">
                Adjust generative variables directly impacting the mechanical G-code translation.
              </p>
            </div>

            {/* Algorithm Presets */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                Mathematical Model
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'hexagon', label: 'Harmonic Hexagon' },
                  { id: 'topography', label: 'Simplex Contour' },
                  { id: 'moire', label: 'Radial Moiré' },
                  { id: 'isometric', label: 'Isometric Grid' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPreset(item.id as PresetType)}
                    className={`py-2.5 px-3 text-xs text-left font-medium border transition-all cursor-pointer truncate ${
                      preset === item.id
                        ? 'border-black bg-black text-white'
                        : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 bg-zinc-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Density Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-600">Vector Density / Passes</span>
                <span className="font-semibold text-black">{density} lines</span>
              </div>
              <input
                type="range"
                min={12}
                max={72}
                step={2}
                value={density}
                onChange={(e) => setDensity(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            {/* Wave Frequency / Oscillation */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-600">Harmonic Frequency</span>
                <span className="font-semibold text-black">{frequency}x</span>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                step={1}
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            {/* Pen Nib Calibration */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                Pen Nib Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { size: 0.8, label: '0.1mm' },
                  { size: 1.2, label: '0.2mm' },
                  { size: 1.8, label: '0.35mm' },
                  { size: 2.6, label: '0.5mm' }
                ].map((nib) => (
                  <button
                    key={nib.label}
                    onClick={() => setNibSize(nib.size)}
                    className={`py-2 text-xs font-mono border transition-all cursor-pointer ${
                      nibSize === nib.size
                        ? 'border-black bg-zinc-100 font-bold text-black ring-1 ring-black'
                        : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    {nib.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ink Pigment Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                Pigment Ink
              </label>
              <div className="flex items-center gap-3">
                {[
                  { color: '#000000', name: 'Carbon Black' },
                  { color: '#1B2A4A', name: 'Prussian Blue' },
                  { color: '#4A2E18', name: 'Raw Umber' },
                  { color: '#8A2016', name: 'Vermilion' }
                ].map((ink) => (
                  <button
                    key={ink.color}
                    onClick={() => setInkColor(ink.color)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      inkColor === ink.color ? 'scale-125 border-black ring-2 ring-black/20' : 'border-zinc-300 hover:scale-110'
                    }`}
                    style={{ backgroundColor: ink.color }}
                    title={ink.name}
                  />
                ))}
              </div>
            </div>

            {/* Studio Note */}
            <div className="p-3 bg-zinc-50 border border-zinc-200 text-[11px] font-mono text-zinc-500 leading-relaxed">
              Every parameter configured here can be submitted as a custom G-code instruction for unique physical plots.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
