import React, { useState } from 'react';
import { ARTWORKS } from './data/artworks';
import { Artwork } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { StudioProcess } from './components/StudioProcess';
import { ArtistSection } from './components/ArtistSection';
import { ArtworkDetailModal } from './components/ArtworkDetailModal';
import { Footer } from './components/Footer';

export function App() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Top Fixed Header Navbar */}
      <Navbar />

      <main className="w-full">
        {/* Hero Section */}
        <Hero
          featuredArtwork={ARTWORKS[0]}
          onSelectArtwork={(art) => setSelectedArtwork(art)}
        />

        {/* Primary Gallery Section */}
        <Gallery
          artworks={ARTWORKS}
          onSelectArtwork={(art) => setSelectedArtwork(art)}
        />

        {/* Machine Process & Craft Section */}
        <StudioProcess />

        {/* Artist Bio & Statement Section */}
        <ArtistSection />

        {/* Site Footer & Dispatch Signup */}
        <Footer />
      </main>

      {/* Artwork Detailed Inspection & Commission Modal */}
      <ArtworkDetailModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />
    </div>
  );
}

export default App;
