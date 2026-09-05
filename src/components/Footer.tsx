import React, { useState } from 'react';
import { ArrowUp, Mail, Instagram, Check, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white pt-20 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Top Newsletter & Studio Inquiries Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-zinc-800">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase block">
              Studio Dispatch // Private Collector List
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-white">
              Stay Informed on New Drops
            </h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-md">
              Each algorithm series is strictly limited to 50 physical editions. Subscribers receive priority 24-hour advance access before public gallery release.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 max-w-md">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collector@example.com"
                  className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-zinc-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {subscribed ? 'Subscribed' : 'Join'}
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>You are on the private collector priority list.</span>
                </p>
              )}
            </form>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs font-sans">
            <div>
              <div className="font-mono text-zinc-400 uppercase tracking-wider mb-3">Collector Care</div>
              <ul className="space-y-2 text-zinc-300">
                <li className="text-zinc-400">Custom Framing Guide</li>
                <li className="text-zinc-400">Archival UV Protection</li>
                <li className="text-zinc-400">Insured Worldwide Freight</li>
                <li className="text-zinc-400">Certificate Validation</li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-zinc-400 uppercase tracking-wider mb-3">Studio Location</div>
              <div className="text-zinc-300 space-y-1">
                <p className="font-medium text-white">Elias Thorne Studio</p>
                <p>Hackney</p>
                <p>London, E8 2NG</p>
                <p className="text-zinc-400 font-mono text-[11px]">United Kingdom</p>
                <p className="pt-2 text-zinc-400 font-mono">visits@thorne.art</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} FRAMEWORKS STUDIO • ELIAS THORNE. ALL RIGHTS RESERVED.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
          >
            <span>Return to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
