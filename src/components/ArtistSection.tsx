import React from 'react';
import { MapPin, Mail, Instagram, Compass } from 'lucide-react';

export const ArtistSection: React.FC = () => {
  return (
    <section id="artist" className="py-24 sm:py-32 bg-white border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Artist Portrait & Gallery Mat */}
          <div className="lg:col-span-5">
            <div className="bg-[#F4F4F4] p-6 sm:p-8 border border-zinc-200 relative">
              <div className="absolute top-2 left-2 font-mono text-[8px] text-zinc-400">+</div>
              <div className="absolute top-2 right-2 font-mono text-[8px] text-zinc-400">+</div>
              <div className="absolute bottom-2 left-2 font-mono text-[8px] text-zinc-400">+</div>
              <div className="absolute bottom-2 right-2 font-mono text-[8px] text-zinc-400">+</div>

              <div className="relative aspect-[3/4] bg-white shadow-md border border-zinc-200 overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuASG50_yy4YLZr23CflMYKpyYCtegTdDH8Pcy3zQcUZoCcqJgwHsIfJLYsf55qTfJH2nv4XTyWh_CiR3d1DOPKZgm_lbMuTRnADrvzah7cOR0jgooT8uNbjn3VM4b3pUuFUI77gzK6iMclnpbNPWXvKTDopugszplKe04mF6X8jertUXnx-DjcpMqoUThkiWVddvlmk-GWJui0bSX4MQUteXLWDwkZxYcQMMAgfxPC1sbMlkENaM7gS"
                  alt="Ben Scott in London print studio"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Ben Scott</span>
                <span>Studio Master // 2024</span>
              </div>
            </div>
          </div>

          {/* Bio & Artist Statement */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                London, UK Studio
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl text-black font-normal tracking-tight">
                About Ben Scott
              </h2>
            </div>

            <p className="text-zinc-700 text-base font-light leading-relaxed font-sans">
              Ben Scott is an algorithmic artist, software engineer, and physical printmaker based in London, United Kingdom. His work investigates the boundary between deterministic code and organic physical media.
            </p>

            <blockquote className="border-l-2 border-black pl-5 italic font-serif text-lg sm:text-xl text-black font-normal leading-relaxed my-4">
              "We spend our lives staring at glowing RGB pixels that disappear the second power is cut. Pen plotting forces digital mathematics to manifest in physical carbon, ink, and cotton — creating a permanent artifact of ephemeral code."
            </blockquote>

            <p className="text-zinc-600 text-sm font-light leading-relaxed">
              Every drawing is executed in his London studio on calibrated AxiDraw plotters using technical pens from Rotring and Staedtler. Rather than mass-producing commercial prints, Elias limits each algorithm edition to 50 unique physical runs, celebrating the subtle micro-variations that occur as ink absorbs into paper fiber.
            </p>

            {/* Studio Contact / Quick Details */}
            <div className="pt-6 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <div className="font-mono text-zinc-400 uppercase tracking-wider mb-1">Direct Inquiries</div>
                <a
                  href="mailto:elias@thorne-data-art.studio"
                  className="text-black font-medium hover:underline flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-600" />
                  <span>ben.berlin2@hotmail.com</span>
                </a>
              </div>

              <div>
                <div className="font-mono text-zinc-400 uppercase tracking-wider mb-1">Studio Visits</div>
                <span className="text-zinc-700">Open by private appointment for collectors in Hackney, London.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
