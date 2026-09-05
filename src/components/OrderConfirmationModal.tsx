import React from 'react';
import { CheckCircle2, FileText, Printer, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { OrderRecord } from '../types';

interface OrderConfirmationModalProps {
  order: OrderRecord | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div
      id="order-confirmation-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      <div
        className="relative bg-white w-full max-w-3xl border border-zinc-300 shadow-2xl overflow-hidden p-6 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate / Receipt Header */}
        <div className="text-center pb-8 border-b border-zinc-200">
          <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-300">
            <CheckCircle2 className="w-6 h-6 text-black" />
          </div>

          <div className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-1">
            Studio Acquisition Confirmed
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-black font-medium">
            Thank You, {order.shippingAddress.firstName}
          </h2>
          <p className="text-zinc-600 text-sm mt-2 font-light">
            Your original plot order <span className="font-mono font-medium text-black">#{order.orderId}</span> has been queued for mechanical drawing and archival packaging in our London studio.
          </p>
        </div>

        {/* Certificate of Authenticity Card Preview */}
        <div className="my-8 p-6 bg-[#F4F4F4] border border-zinc-300 relative space-y-4">
          {/* Corner Registration Marks */}
          <div className="absolute top-2 left-2 font-mono text-[8px] text-zinc-400 select-none">+</div>
          <div className="absolute top-2 right-2 font-mono text-[8px] text-zinc-400 select-none">+</div>
          <div className="absolute bottom-2 left-2 font-mono text-[8px] text-zinc-400 select-none">+</div>
          <div className="absolute bottom-2 right-2 font-mono text-[8px] text-zinc-400 select-none">+</div>

          <div className="flex items-center justify-between border-b border-zinc-300 pb-3">
            <div>
              <span className="font-serif text-lg font-semibold tracking-wider text-black block">
                FRAMEWORKS STUDIO • CERTIFICATE OF AUTHENTICITY
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Algorithm Provenance & Physical Edition Master
              </span>
            </div>
            <div className="font-mono text-xs text-black font-semibold">
              ORDER #{order.orderId}
            </div>
          </div>

          {/* Acquired Works Breakdown */}
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-mono text-zinc-700 bg-white p-3 border border-zinc-200">
                <div>
                  <span className="font-bold text-black">{item.artwork.title}</span> ({item.artwork.edition}) ×{item.quantity}
                  <span className="text-zinc-400 block text-[11px]">
                    Framing: {item.frameOption === 'unframed' ? 'Unframed Archival Mat' : item.frameOption === 'black-gallery' ? 'Black Aluminum Frame' : 'English Natural Oak'}
                  </span>
                </div>
                <span className="font-semibold text-black">£{(item.artwork.price + item.framePrice) * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono pt-2 border-t border-zinc-300">
            <div>
              <span className="text-zinc-400 text-[10px] uppercase block">Acquisition Date</span>
              <span className="text-black font-medium">{order.date}</span>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] uppercase block">Total Amount</span>
              <span className="text-black font-semibold">£{order.total} GBP</span>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] uppercase block">Destination</span>
              <span className="text-black font-medium truncate">{order.shippingAddress.city}, {order.shippingAddress.country}</span>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] uppercase block">Cryptographic Hash</span>
              <span className="text-zinc-600 truncate block">SHA-256: 8f4e2a9b...</span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 font-serif italic text-center pt-2">
            "Signed in graphite and blind-embossed by Elias Thorne in London, United Kingdom."
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-2.5 border border-zinc-300 hover:border-black text-black text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Collector Invoice</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <span>Return to Studio Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
