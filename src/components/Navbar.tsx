import React from 'react';
import { ShoppingBag, Compass, Info, Layers, X, Menu } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ cart, onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      id="site-navbar"
      className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E5E5] transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-baseline space-x-3">
          <a
            id="nav-brand-logo"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group block"
          >
            <span className="font-serif text-2xl tracking-[0.15em] font-semibold uppercase block leading-none">
              FRAMEWORKS
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#717171] uppercase font-sans mt-1 block">
              Ben Scott • Data & Ink Studio
            </span>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-medium text-[#4A4A4A]">
          <button
            id="nav-link-gallery"
            onClick={() => scrollTo('gallery')}
            className="hover:text-black transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-black hover:after:w-full after:transition-all cursor-pointer"
          >
            Gallery
          </button>
          <button
            id="nav-link-process"
            onClick={() => scrollTo('process')}
            className="hover:text-black transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-black hover:after:w-full after:transition-all cursor-pointer"
          >
            Process
          </button>
          <button
            id="nav-link-artist"
            onClick={() => scrollTo('artist')}
            className="hover:text-black transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-black hover:after:w-full after:transition-all cursor-pointer"
          >
            Artist
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          <button
            id="nav-cart-btn"
            onClick={onOpenCart}
            className="group relative flex items-center space-x-2.5 px-4 py-2 border border-black hover:bg-black hover:text-white transition-all duration-200 text-xs uppercase tracking-[0.15em] font-medium cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">Cart</span>
            <span
              id="cart-badge-count"
              className={`inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[10px] font-bold rounded-full ${
                totalCartCount > 0
                  ? 'bg-black text-white group-hover:bg-white group-hover:text-black'
                  : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-800 group-hover:text-white'
              }`}
            >
              {totalCartCount}
            </span>
          </button>

          {/* Mobile menu trigger */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-black hover:bg-zinc-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-nav-menu" className="md:hidden bg-white border-b border-zinc-200 px-6 py-6 space-y-4">
          <button
            id="mobile-link-gallery"
            onClick={() => scrollTo('gallery')}
            className="w-full text-left text-xs uppercase tracking-[0.2em] font-medium text-black py-2.5 flex items-center justify-between border-b border-zinc-100"
          >
            <span>Gallery Collection</span>
            <Layers className="w-4 h-4 text-zinc-400" />
          </button>
          <button
            id="mobile-link-process"
            onClick={() => scrollTo('process')}
            className="w-full text-left text-xs uppercase tracking-[0.2em] font-medium text-black py-2.5 flex items-center justify-between border-b border-zinc-100"
          >
            <span>Process & Machine</span>
            <Compass className="w-4 h-4 text-zinc-400" />
          </button>
          <button
            id="mobile-link-artist"
            onClick={() => scrollTo('artist')}
            className="w-full text-left text-xs uppercase tracking-[0.2em] font-medium text-black py-2.5 flex items-center justify-between"
          >
            <span>About Elias Thorne</span>
            <Info className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      )}
    </header>
  );
};
