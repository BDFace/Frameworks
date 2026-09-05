import React, { useState, useEffect } from 'react';
import { ARTWORKS } from './data/artworks';
import { Artwork, CartItem, FrameOption, OrderRecord } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { StudioProcess } from './components/StudioProcess';
import { ArtistSection } from './components/ArtistSection';
import { ArtworkDetailModal } from './components/ArtworkDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { Footer } from './components/Footer';

export function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('frameworks_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [currentView, setCurrentView] = useState<'main' | 'checkout'>('main');
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);
  const [activeSection, setActiveSection] = useState('gallery');

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('frameworks_cart', JSON.stringify(cart));
    } catch {
      // LocalStorage unavailable
    }
  }, [cart]);

  // Frame pricing calculator helper
  const getFramePrice = (frame: FrameOption): number => {
    switch (frame) {
      case 'black-gallery': return 120;
      case 'natural-oak': return 140;
      default: return 0;
    }
  };

  const handleAddToCart = (artwork: Artwork, frame: FrameOption = 'unframed', quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.artwork.id === artwork.id && item.frameOption === frame
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            artwork,
            quantity,
            frameOption: frame,
            framePrice: getFramePrice(frame)
          }
        ];
      }
    });
  };

  const handleDirectCheckout = (artwork: Artwork, frame: FrameOption, quantity: number) => {
    // Add to cart and navigate immediately to checkout view
    handleAddToCart(artwork, frame, quantity);
    setSelectedArtwork(null);
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
    } else {
      setCart((prev) => {
        const updated = [...prev];
        updated[index].quantity = newQty;
        return updated;
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderComplete = (order: OrderRecord) => {
    setCart([]);
    setCompletedOrder(order);
    setCurrentView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Top Fixed Header Navbar */}
      <Navbar
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        activeSection={activeSection}
      />

      {currentView === 'checkout' ? (
        <CheckoutView
          cart={cart}
          onBack={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOrderComplete={handleOrderComplete}
        />
      ) : (
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
            onAddToCart={(art) => handleAddToCart(art, 'unframed', 1)}
          />

          {/* Machine Process & Craft Section */}
          <StudioProcess />

          {/* Artist Bio & Statement Section */}
          <ArtistSection />

          {/* Site Footer & Dispatch Signup */}
          <Footer />
        </main>
      )}

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleProceedToCheckout}
      />

      {/* Artwork Detailed Inspection & Multi-Image Modal */}
      <ArtworkDetailModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onAddToCart={handleAddToCart}
        onDirectCheckout={handleDirectCheckout}
      />

      {/* Order Confirmation Certificate Modal */}
      <OrderConfirmationModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />
    </div>
  );
}

export default App;
