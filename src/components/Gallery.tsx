import React, { useState } from 'react';
import { Eye, ShoppingBag, ArrowUpRight, Check, SlidersHorizontal } from 'lucide-react';
import { Artwork } from '../types';

interface GalleryProps {
  artworks: Artwork[];
  onSelectArtwork: (artwork: Artwork) => void;
  onAddToCart: (artwork: Artwork) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ artworks, onSelectArtwork, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Works' },
    { id: 'geometric', label: 'Geometric & Tessellation' },
    { id: 'topography', label: 'Topography & Flow' },
    { id: 'moire', label: 'Moiré & Symmetries' },
    { id: 'isometric', label: 'Isometric Wireframes' },
  ];

  const filteredArtworks = selectedCategory === 'all'
    ? artworks
    : artworks.filter(art => art.category === selectedCategory);

  const handleQuickAdd = (e: React.MouseEvent, art: Artwork) => {
    e.stopPropagation();
    onAddToCart(art);
    setAddedId(art.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-white border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-2">
              Catalog // Series 2024
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-black font-normal tracking-tight">
              Selected Original Plots
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base mt-2 max-w-xl font-light">
              Limited algorithmic editions, drawn one-by-one in the London studio. Each piece is signed, numbered, and accompanied by a cryptographic algorithm certificate.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`filter-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.15em] font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-black text-white'
                    : 'bg-[#F4F4F4] text-zinc-600 hover:bg-zinc-200 hover:text-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredArtworks.map((art) => (
            <article
              key={art.id}
              id={`artwork-card-${art.id}`}
              className="group bg-white border border-zinc-200 transition-all duration-300 hover:border-black flex flex-col justify-between"
            >
              {/* Gallery Mat Framing with generous white space */}
              <div
                onClick={() => onSelectArtwork(art)}
                className="cursor-pointer bg-[#F4F4F4] p-6 sm:p-8 relative overflow-hidden transition-colors group-hover:bg-[#EFEFEF]"
              >
                {/* Registration Marks */}
                <div className="absolute top-2 left-2 font-mono text-[8px] text-zinc-400 select-none">+</div>
                <div className="absolute top-2 right-2 font-mono text-[8px] text-zinc-400 select-none">+</div>
                <div className="absolute bottom-2 left-2 font-mono text-[8px] text-zinc-400 select-none">+</div>
                <div className="absolute bottom-2 right-2 font-mono text-[8px] text-zinc-400 select-none">+</div>

                {/* Artwork Image Container */}
                <div className="relative aspect-[4/5] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-zinc-200 overflow-hidden">
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white text-black px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Details</span>
                    </div>
                  </div>

                  {/* Edition Tag */}
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-mono text-zinc-800 border border-zinc-200">
                    {art.edition}
                  </div>
                </div>
              </div>

              {/* Artwork Metadata & Actions */}
              <div className="p-6 flex flex-col flex-grow justify-between border-t border-zinc-100 bg-white">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                      onClick={() => onSelectArtwork(art)}
                      className="font-serif text-xl sm:text-2xl text-black font-medium hover:underline cursor-pointer"
                    >
                      {art.title}
                    </h3>
                    <span className="font-sans text-lg font-semibold text-black whitespace-nowrap">
                      £{art.price}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 font-sans line-clamp-1 mb-3">
                    {art.subtitle}
                  </p>

                  <div className="space-y-1 text-xs font-mono text-zinc-600 bg-zinc-50 p-3 border border-zinc-100 mb-5">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Dimensions:</span>
                      <span>{art.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Medium:</span>
                      <span className="truncate ml-2">{art.pen}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Paper:</span>
                      <span className="truncate ml-2">{art.paper}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    id={`btn-view-${art.id}`}
                    onClick={() => onSelectArtwork(art)}
                    className="flex-1 py-2.5 px-3 border border-black text-black text-xs uppercase tracking-[0.15em] font-medium hover:bg-black hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>View & Buy</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`btn-quick-add-${art.id}`}
                    onClick={(e) => handleQuickAdd(e, art)}
                    className={`py-2.5 px-3 border text-xs uppercase tracking-[0.15em] font-medium transition-all cursor-pointer flex items-center justify-center ${
                      addedId === art.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-zinc-300 text-zinc-700 hover:border-black hover:text-black hover:bg-zinc-50'
                    }`}
                    title="Quick Add to Bag"
                  >
                    {addedId === art.id ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Studio Note Banner */}
        <div className="mt-16 p-8 bg-[#F4F4F4] border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-serif text-xl text-black font-medium">Custom Commission Plots Available</h4>
            <p className="text-zinc-600 text-sm font-light">
              Have specific geographical, audio, or mathematical telemetry data you want translated into a one-of-a-kind physical ink drawing?
            </p>
          </div>
          <a
            href="mailto:studio@eliasthorne-plotter.art?subject=Custom%20Pen%20Plotter%20Commission%20Inquiry"
            className="px-6 py-3 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-zinc-800 transition-colors whitespace-nowrap"
          >
            Inquire Commission
          </a>
        </div>
      </div>
    </section>
  );
};
