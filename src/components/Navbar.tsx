import React from 'react';
import { Compass, Info, Layers, X, Menu } from 'lucide-react';

interface NavbarProps {
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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

        {/* Desktop Navigation Links - positioned over to the right */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-8 text-sm tracking-[0.2em] uppercase font-medium text-[#4A4A4A] ml-auto">
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

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-black hover:bg-zinc-100 transition-colors"
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
            <span>Gallery</span>
            <Layers className="w-4 h-4 text-zinc-400" />
          </button>
          <button
            id="mobile-link-process"
            onClick={() => scrollTo('process')}
            className="w-full text-left text-xs uppercase tracking-[0.2em] font-medium text-black py-2.5 flex items-center justify-between border-b border-zinc-100"
          >
            <span>Process</span>
            <Compass className="w-4 h-4 text-zinc-400" />
          </button>
          <button
            id="mobile-link-artist"
            onClick={() => scrollTo('artist')}
            className="w-full text-left text-xs uppercase tracking-[0.2em] font-medium text-black py-2.5 flex items-center justify-between"
          >
            <span>Artist</span>
            <Info className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      )}
    </header>
  );
};
