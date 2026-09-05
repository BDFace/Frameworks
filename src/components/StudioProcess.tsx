import React from 'react';
import { PenTool, Cpu, ShieldCheck, Box, Compass, Sparkles } from 'lucide-react';

export const StudioProcess: React.FC = () => {
  return (
    <section id="process" className="py-24 sm:py-32 bg-white border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-2">
            Technique // Hardware & Paper
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-black font-normal tracking-tight leading-tight">
            <span className="italic">The Quiet Space between <br />
            Algorithm & Mechanical Ink</span>
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base mt-4 font-light leading-relaxed">
            In an era of instant pixel generation, pen plotted art is deliberately slow. It requires calculating millions of vector coordinates, calibrating physical pen pressure, and observing ink absorb into the tooth of 300gsm cotton paper over five hours.
          </p>
        </div>

        {/* 3 Step Process Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-20">
          
          <div className="bg-[#F4F4F4] p-8 border border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest mb-4">
                Phase 01 // Computation
              </div>
              <h3 className="font-serif text-2xl text-black font-medium mb-3">
                Algorithmic Synthesis
              </h3>
              <p className="text-zinc-600 text-sm font-light leading-relaxed mb-6">
                Custom procedural code written in TypeScript and Python explores mathematical manifolds, Simplex wave propagation, and moiré harmonics. Over 500 digital iterations are evaluated to select a single plot master.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-200 text-xs font-mono text-zinc-500 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-zinc-800" />
              <span>Vector Path Optimization (G-Code)</span>
            </div>
          </div>

          <div className="bg-[#F4F4F4] p-8 border border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest mb-4">
                Phase 02 // Execution
              </div>
              <h3 className="font-serif text-2xl text-black font-medium mb-3">
                Mechanical Drawing
              </h3>
              <p className="text-zinc-600 text-sm font-light leading-relaxed mb-6">
                An AxiDraw V3 precision plotter translates pure vector coordinates into physical movement. A 0.2mm archival technical pen traces continuous paths across heavy paper at 20mm/second without lifting for hours.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-200 text-xs font-mono text-zinc-500 flex items-center gap-2">
              <PenTool className="w-3.5 h-3.5 text-zinc-800" />
              <span>Rotring Isograph & Staedtler Pigment</span>
            </div>
          </div>

          <div className="bg-[#F4F4F4] p-8 border border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest mb-4">
                Phase 03 // Provenance
              </div>
              <h3 className="font-serif text-2xl text-black font-medium mb-3">
                Archival Embossing
              </h3>
              <p className="text-zinc-600 text-sm font-light leading-relaxed mb-6">
                Every physical print is inspected under studio light, hand-numbered in 2B graphite, blind embossed with the studio maker's mark, and paired with a cryptographic certificate documenting the algorithm seed.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-200 text-xs font-mono text-zinc-500 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-800" />
              <span>Blind Seal & Graphite Inscription</span>
            </div>
          </div>

        </div>

        {/* Studio Image & Hardware Exhibition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F4F4F4] p-6 sm:p-12 border border-zinc-200">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] bg-white border border-zinc-300 shadow-md overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNMoupTpvlktCSWHukA12kTry28-AjU7C3GwLPDoYq-t_-YZrWs3DH6g-9hzaQFazYszYUveV_B0CW2LW_L38wkdZfEgaMQfma5p4Mn1kHonkEFhp0O6AtMsxR0BRqifeyggKFA1Olwt0gRU0P3um9ZSENQQ3JFRKNqjsVR33wzVsgPDRNuNY_-ktujAV8pPGtEOmkbkZZpuHhuEGj6r2dr4WhDdkx7M_E3Wja2LNR8CDv8dqpz1Q8"
                alt="Studio drafting desk with vintage plotter and technical tools"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-white/90 px-2.5 py-1 text-[11px] font-mono text-zinc-800 border border-zinc-200">
                London Studio Workspace • AxiDraw V3 Pen Carriage
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="text-xs font-mono uppercase text-zinc-400 tracking-wider mb-1">
                Studio Standards
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-black font-medium">
                Materials Built for Centuries
              </h3>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="border-b border-zinc-300 pb-3">
                <div className="font-semibold text-black text-sm mb-1">Fabriano & Arches 300gsm Cotton Rag</div>
                <p className="text-zinc-600 font-light">
                  Mould-made 100% long cotton fibers, acid-free, buffered with calcium carbonate to resist atmospheric degradation and yellowing for over 200 years.
                </p>
              </div>

              <div className="border-b border-zinc-300 pb-3">
                <div className="font-semibold text-black text-sm mb-1">Archival Carbon & Pigment Inks</div>
                <p className="text-zinc-600 font-light">
                  Lightfastness rating I (highest possible permanence). Waterproof, non-bleeding, and resistant to UV fading under indoor display conditions.
                </p>
              </div>

              <div>
                <div className="font-semibold text-black text-sm mb-1">Rigid Custom Portfolio Packaging</div>
                <p className="text-zinc-600 font-light">
                  Each unframed print is encased in archival acid-free glassine, suspended between two 6mm reinforced cellular boards to ensure completely flat, pristine delivery.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
