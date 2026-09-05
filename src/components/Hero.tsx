import React from 'react';
import { ExternalLink, Compass } from 'lucide-react';
import { Artwork } from '../types';

interface HeroProps {
  onSelectArtwork: (artwork: Artwork) => void;
  featuredArtwork: Artwork;
}

export const Hero: React.FC<HeroProps> = ({ onSelectArtwork, featuredArtwork }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="hero-section" className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Header Text with white space and typography */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 text-zinc-800 text-[11px] font-mono tracking-widest uppercase mb-6 rounded-none border border-zinc-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-900 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-900"></span>
            </span>
            London, England • Pen Plotter Generative Art
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-black leading-[1.08] mb-6">
            The Intersection of <br />
            <span className="font-normal">Data and Ink</span>
          </h1>

          <p className="text-[#4A4A4A] text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-8 font-sans">
            Algorithmic drawings rendered with mathematical precision. Each piece is generated through custom software and drawn line-by-line using a mechanical pen plotter on heavy archival cotton rag.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              id="hero-explore-btn"
              onClick={() => scrollTo('gallery')}
              className="px-8 py-3.5 bg-emerald-900 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-zinc-800 transition-all cursor-pointer shadow-sm hover:shadow"
            >
              Explore Collection
            </button>
            <button
              id="hero-process-btn"
              onClick={() => scrollTo('process')}
              className="px-6 py-3.5 border border-zinc-300 text-black text-xs uppercase tracking-[0.2em] font-medium hover:border-black hover:bg-zinc-50 transition-all cursor-pointer flex items-center gap-2"
            >
              <Compass className="w-3.5 h-3.5 text-zinc-600" />
              <span>Studio Process</span>
            </button>
          </div>
        </div>

        {/* Hero Artwork Spotlight with Gallery Mat Aesthetic */}
        <div className="max-w-4xl mx-auto">
          <div
            id="hero-artwork-frame"
            onClick={() => onSelectArtwork(featuredArtwork)}
            className="group cursor-pointer relative bg-[#F4F4F4] p-6 sm:p-12 md:p-16 border border-[#E5E5E5] transition-all duration-300 hover:border-zinc-400"
          >
            {/* Corner Registration Marks reminiscent of pen plotter drafting sheets */}
            <div className="absolute top-3 left-3 font-mono text-[9px] text-zinc-400 select-none">+ (0,0)</div>
            <div className="absolute top-3 right-3 font-mono text-[9px] text-zinc-400 select-none">(X_MAX, 0) +</div>
            <div className="absolute bottom-3 left-3 font-mono text-[9px] text-zinc-400 select-none">+ (0, Y_MAX)</div>
            <div className="absolute bottom-3 right-3 font-mono text-[9px] text-zinc-400 select-none">AXIDRAW V3 +</div>

            {/* Artwork Paper Mockup */}
            <div className="relative bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)] border border-zinc-200 overflow-hidden transition-transform duration-500 group-hover:scale-[1.01]">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc0eZoTuAGgtdAqjCefTn7kVcA2UBq65bwnI0uLUg8s89HFnkCmUrTiaZklyimEEP4qug9SMy8tVftgqUg8zovQA1klrWdPmnDSL4jNSuoH5KEFGA5WNLV-lHDSNSFA_UAG1SyKkw_6Lu3DoQEQIqfL_8k4hU1-3CPz-UzNIY-Tds1h44GVe1IChHk4eZwvK5aR1koRKizgMVRa7N3fyZzdEjCi9LSyzgdzZHpj4sJl4ZhbOkjSY_O"
                  alt="Pen plotter drawing macro in progress"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                />

                {/* Overlay hover prompt */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white px-5 py-3 text-black text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-2 shadow-xl">
                    <span>Inspect Piece & Acquire</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Plaque / Metadata strip */}
              <div className="p-4 sm:p-6 bg-white border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="font-serif text-lg sm:text-xl font-medium text-black">
                    {featuredArtwork.title} — {featuredArtwork.subtitle}
                  </div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">
                    {featuredArtwork.edition} • {featuredArtwork.pen} • {featuredArtwork.paper}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-zinc-400 uppercase font-sans tracking-wider block">Acquire Original</span>
                    <span className="text-base font-semibold text-black">£{featuredArtwork.price} GBP</span>
                  </div>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-black text-black group-hover:bg-black group-hover:text-white transition-colors">
                    →
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats strip below hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-zinc-100 text-center sm:text-left">
            <div>
              <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Archival Paper</div>
              <div className="text-sm font-medium text-black mt-1">300gsm Cotton Rag</div>
            </div>
            <div>
              <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Plotter Hardware</div>
              <div className="text-sm font-medium text-black mt-1">AxiDraw V3 / G-Code</div>
            </div>
            <div>
              <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Edition Series</div>
              <div className="text-sm font-medium text-black mt-1">50 Signed & Numbered</div>
            </div>
            <div>
              <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Studio Location</div>
              <div className="text-sm font-medium text-black mt-1">London, United Kingdom</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
