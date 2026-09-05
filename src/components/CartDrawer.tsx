import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.artwork.price + item.framePrice) * item.quantity;
  }, 0);

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="w-5 h-5 text-black" />
            <h3 className="font-serif text-xl font-medium text-black">Studio Collector Bag</h3>
            <span className="text-xs font-mono text-zinc-400">
              ({cart.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Items List */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto stroke-[1]" />
              <p className="font-serif text-xl text-zinc-700">Your bag is currently empty</p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto font-light">
                Explore the gallery collection to discover signed generative pen plotter drawings.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-zinc-800 transition-colors"
              >
                Browse Gallery
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, idx) => {
                const itemTotal = (item.artwork.price + item.framePrice) * item.quantity;
                return (
                  <div key={idx} className="flex gap-4 pb-6 border-b border-zinc-100 items-start">
                    {/* Thumbnail in Gallery Mat */}
                    <div className="relative w-20 h-24 bg-[#F4F4F4] p-1 border border-zinc-200 flex-shrink-0">
                      <img
                        src={item.artwork.image}
                        alt={item.artwork.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif text-base font-medium text-black truncate">
                          {item.artwork.title}
                        </h4>
                        <span className="font-sans text-sm font-semibold text-black whitespace-nowrap">
                          £{itemTotal}
                        </span>
                      </div>

                      <div className="text-xs text-zinc-500 font-mono mt-0.5">
                        {item.artwork.edition}
                      </div>

                      <div className="text-[11px] text-zinc-600 mt-1">
                        Framing: <span className="font-medium text-black">{
                          item.frameOption === 'unframed' ? 'Unframed Archival Mat (£0)' :
                          item.frameOption === 'black-gallery' ? 'Black Aluminum Gallery Frame (+£120)' :
                          'English Natural Oak Frame (+£140)'
                        }</span>
                      </div>

                      {/* Quantity and Delete Controls */}
                      <div className="flex items-center justify-between mt-3 pt-2">
                        <div className="flex items-center border border-zinc-200">
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100 hover:text-black"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-mono font-medium text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100 hover:text-black"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-zinc-50 border-t border-zinc-200 space-y-4">
            <div className="space-y-2 text-xs font-sans">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-black">£{subtotal} GBP</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Insured Studio Freight</span>
                <span className="font-mono font-medium text-emerald-700">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-black pt-2 border-t border-zinc-200">
                <span>Estimated Total</span>
                <span className="font-sans font-bold text-base">£{subtotal} GBP</span>
              </div>
            </div>

            <button
              id="btn-drawer-checkout"
              onClick={onCheckout}
              className="w-full py-3.5 px-4 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-zinc-500 text-center font-mono flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
              <span>Signed Certificate of Authenticity Included</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
