import React, { useState } from 'react';
import { X, Check, ShieldCheck, Truck, Sparkles, ShoppingBag, ArrowRight, CornerUpLeft, ZoomIn } from 'lucide-react';
import { Artwork, FrameOption } from '../types';

interface ArtworkDetailModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onAddToCart: (artwork: Artwork, frame: FrameOption, quantity: number) => void;
  onDirectCheckout: (artwork: Artwork, frame: FrameOption, quantity: number) => void;
}

export const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({
  artwork,
  onClose,
  onAddToCart,
  onDirectCheckout
}) => {
  if (!artwork) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>('unframed');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const frameOptions: Array<{ id: FrameOption; name: string; price: number; description: string }> = [
    {
      id: 'unframed',
      name: 'Unframed Archival Mat',
      price: 0,
      description: 'Shipped flat in heavy museum-grade acid-free portfolio box with glassine interleaf.'
    },
    {
      id: 'black-gallery',
      name: 'Black Aluminum Gallery Frame',
      price: 120,
      description: 'Ultra-slim matte black anodized aluminum frame with TruVue 99% UV-blocking museum acrylic.'
    },
    {
      id: 'natural-oak',
      name: 'Handcrafted English Natural Oak',
      price: 140,
      description: 'Solid FSC-certified English White Oak, hand-rubbed with natural wax finish and archival spacer.'
    }
  ];

  const currentFrameObj = frameOptions.find(f => f.id === selectedFrame)!;
  const totalPrice = (artwork.price + currentFrameObj.price) * quantity;

  // Compile image list: artwork primary image + additionalImages
  const allImages = [
    {
      url: artwork.image,
      caption: 'Full View — Primary Algorithmic Plot',
      alt: artwork.title
    },
    ...artwork.additionalImages
  ];

  const handleAdd = () => {
    onAddToCart(artwork, selectedFrame, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    onDirectCheckout(artwork, selectedFrame, quantity);
  };

  return (
    <div
      id="artwork-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-6xl max-h-[92vh] overflow-y-auto border border-zinc-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs text-zinc-400 uppercase">CATALOG // {artwork.id}</span>
            <span className="text-zinc-300">•</span>
            <span className="font-serif text-base text-black font-medium">{artwork.title}</span>
          </div>

          <button
            id="btn-close-detail"
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Left Column: Multi-Image Showcase with Gallery Mat */}
            <div className="lg:col-span-7 space-y-6">
              {/* Primary Active Image Box with Gallery Mat */}
              <div className="bg-[#F4F4F4] p-4 sm:p-8 border border-zinc-200 relative">
                {/* Registration Marks */}
                <div className="absolute top-2 left-2 font-mono text-[9px] text-zinc-400">+ (0,0)</div>
                <div className="absolute top-2 right-2 font-mono text-[9px] text-zinc-400">+ (X_MAX,0)</div>
                <div className="absolute bottom-2 left-2 font-mono text-[9px] text-zinc-400">+ (0,Y_MAX)</div>
                <div className="absolute bottom-2 right-2 font-mono text-[9px] text-zinc-400">+ (X_MAX,Y_MAX)</div>

                <div className="relative aspect-[4/3] sm:aspect-[4/3] bg-white shadow-lg border border-zinc-200 overflow-hidden flex items-center justify-center">
                  <img
                    src={allImages[activeImageIndex]?.url}
                    alt={allImages[activeImageIndex]?.alt || artwork.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain object-center transition-all duration-300"
                  />

                  {/* Caption badge */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-sans text-zinc-700 border border-zinc-200 text-center sm:text-left">
                    {allImages[activeImageIndex]?.caption}
                  </div>
                </div>
              </div>

              {/* Extra Images Thumbnail Strip (Like eCommerce & Gallery sites) */}
              <div>
                <div className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider mb-2">
                  Studio Angles & Process Views ({allImages.length})
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      id={`thumbnail-img-${idx}`}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square bg-[#F4F4F4] p-1 border transition-all cursor-pointer overflow-hidden ${
                        activeImageIndex === idx
                          ? 'border-black ring-1 ring-black'
                          : 'border-zinc-200 hover:border-zinc-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Artist Concept & Narrative */}
              <div className="pt-6 border-t border-zinc-200 space-y-4">
                <h4 className="font-serif text-xl font-medium text-black">Concept & Algorithm Philosophy</h4>
                <p className="text-zinc-600 text-sm font-light leading-relaxed">
                  {artwork.story}
                </p>
                <div className="p-4 bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-600 space-y-1">
                  <div className="text-black font-semibold uppercase tracking-wider mb-1 font-sans">
                    Physical Hardware Telemetry:
                  </div>
                  <div>• Plot Duration: {artwork.plotTime} continuous mechanical runtime</div>
                  <div>• Pen Traversal Speed: {artwork.plotSpeed}</div>
                  <div>• Paper: {artwork.paper}</div>
                  <div>• Archival Inks: Carbon-pigment waterproof fade-resistant</div>
                </div>
              </div>
            </div>

            {/* Right Column: Specifications, Framing Options & Purchase */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                {/* Title & Price Header */}
                <div className="pb-6 border-b border-zinc-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-800 text-[10px] font-mono uppercase tracking-widest border border-zinc-200">
                      {artwork.edition}
                    </span>
                    <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      {artwork.inStock} Original Plots Remaining
                    </span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-4xl text-black font-medium leading-tight">
                    {artwork.title}
                  </h1>
                  <p className="text-zinc-500 text-sm mt-1">
                    {artwork.subtitle}
                  </p>

                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="font-sans text-3xl font-semibold text-black">
                      £{totalPrice}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">GBP • FREE INSURED SHIPPING</span>
                  </div>
                </div>

                {/* Framing Selection */}
                <div className="py-6 border-b border-zinc-200">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-mono uppercase tracking-wider text-black font-medium">
                      Select Framing Presentation
                    </label>
                    <span className="text-xs font-mono text-zinc-400">
                      {selectedFrame === 'unframed' ? 'Shipped Flat' : 'Ready to Hang'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {frameOptions.map((f) => (
                      <div
                        key={f.id}
                        id={`frame-option-${f.id}`}
                        onClick={() => setSelectedFrame(f.id)}
                        className={`p-3.5 border transition-all cursor-pointer ${
                          selectedFrame === f.id
                            ? 'border-black bg-zinc-50 ring-1 ring-black'
                            : 'border-zinc-200 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-black">{f.name}</span>
                          <span className="font-mono text-xs font-semibold text-black">
                            {f.price === 0 ? 'Included (£0)' : `+£${f.price}`}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1 font-light">
                          {f.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Specifications Grid */}
                <div className="py-6 border-b border-zinc-200">
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                    Technical Specifications
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <dt className="text-zinc-400 font-mono">Dimensions</dt>
                      <dd className="font-medium text-black mt-0.5">{artwork.dimensions}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-400 font-mono">Pen & Nib</dt>
                      <dd className="font-medium text-black mt-0.5">{artwork.pen}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-400 font-mono">Algorithm</dt>
                      <dd className="font-medium text-black mt-0.5 truncate">{artwork.algorithm}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-400 font-mono">Creation Year</dt>
                      <dd className="font-medium text-black mt-0.5">{artwork.year} (Studio Master)</dd>
                    </div>
                  </dl>
                </div>

                {/* Quantity & Action Controls */}
                <div className="pt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-zinc-300 bg-white">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-zinc-600 hover:text-black hover:bg-zinc-100 text-sm font-medium"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-sm font-mono font-medium text-black min-w-[40px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(artwork.inStock, quantity + 1))}
                        className="px-3 py-2 text-zinc-600 hover:text-black hover:bg-zinc-100 text-sm font-medium"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      id="btn-add-to-bag"
                      onClick={handleAdd}
                      className="flex-1 py-3 px-4 border border-black text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{addedToast ? 'Added to Bag!' : 'Add to Bag'}</span>
                    </button>
                  </div>

                  {/* Direct Instant Checkout Button */}
                  <button
                    id="btn-direct-checkout"
                    onClick={handleBuyNow}
                    className="w-full py-4 px-6 bg-black text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Proceed to Payment (${totalPrice})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Local Artist Authenticity Guarantee */}
                  <div className="bg-[#F4F4F4] p-4 border border-zinc-200 text-xs text-zinc-600 space-y-2 mt-4">
                    <div className="flex items-center gap-2 font-medium text-black">
                      <ShieldCheck className="w-4 h-4 text-zinc-800" />
                      <span>Direct from Elias Thorne Studio (London, UK)</span>
                    </div>
                    <p className="font-light text-[11px] leading-relaxed">
                      Every print includes a hand-signed Certificate of Authenticity with the exact G-code algorithm seed hash, edition numbering in 2B graphite, and blind embossed studio seal.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1 border-t border-zinc-200">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Dispatches within 48 hours in reinforced flat-pack crate.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
