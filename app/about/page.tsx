'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/60 z-10"></div>
            <img 
              alt="Elegant piano in a bright room" 
              className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-7000" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_5wyQX3_Vkdc_TTVWMI8QDRV5abzJNwa87C-V3ax4PSpmzp8Cq6ZC8ILa04gMbjfrr68w-D4sysVnuFrQOU1mhk3R23H4EjREbchnFXO1vAd6YrzRaXsvmcrhpulJ4o9kgfSSmGxkAebJSbIIovumeyrhhLhmD9DwuG_Lq4g2wQZr98AS3VBj-t-royxanucSulwVdyFxjM5g4Xk-skgZ4HRkchNEWrdO2u4-xst8iJHshHYE6-PhwxuJMC5XrNXWP4Yhlg5fIUPC"
            />
          </div>
          <div className="relative z-20 text-center px-4 max-w-4xl animate-fade-in">
            <span className="inline-block px-4 py-1 mb-4 sm:mb-6 rounded-full bg-accent-green text-deep-green text-xs font-bold tracking-[0.2em] uppercase animate-slide-down">
              Est. 2024
            </span>
            <h1 className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 leading-[0.9] tracking-tighter animate-slide-up">
              Where Music <br /><span className="text-primary italic">Meets Soul.</span>
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed animate-slide-up animate-delay-200">
              A narrative of passion, elegance, and the timeless resonance of sound. Discover the journey behind DearHolly.
            </p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background-light">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 lg:space-y-8 animate-slide-right">
              <h2 className="text-primary text-sm font-bold uppercase tracking-[0.3em]">The Prelude</h2>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl text-green-800 font-bold leading-tight">Crafting melodies into masterpieces.</h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Founded on the rhythm of life and the melodies that define our most intimate moments, DearHolly emerged from a simple desire: to bridge the gap between technical precision and emotional resonance.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                We believe that every object should carry a note of inspiration. Our collections are curated not just for their aesthetic appeal, but for their ability to evoke a feeling, a memory, or a song.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="h-px w-12 bg-primary self-center"></div>
                <span className="italic font-serif text-xl text-green-800">The Holly Philosophy</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 animate-slide-left">
              <div className="space-y-4">
                <img 
                  className="rounded-2xl w-full h-48 sm:h-56 lg:h-64 object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhqUXSDk86BVeI8_tWc1bqjTZ9qFOtsNgIniHJq6lfYGEQY3MIqlkM_KRSkKQ1v8LVNwDrRayw3xB4i1PgK7GN_luHEdpTDAmo8BcYpXUfHKnqq0EG8Js4zQAyqv6Y7Pz755TD9SYRZ7sKZWBzJYlSse0aQxobDT2lcZAvVK663BbW93NJeVLBJ7JDfggyDB_56RUnaXL--_KAVVBu8EfYan8sTbjo2bYnnjWfFhq3wxvMD8ZxPcoriwexO-jYWZnHTWVZCLDGr8zR" 
                  alt="Abstract music soundboard equipment"
                />
                <img 
                  className="rounded-2xl w-full h-56 sm:h-64 lg:h-80 object-cover hover:scale-105 transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAql2ZJjiOna5ak1kAsEoY68wQKkOotahJMgjahizHZVdd5bh86i_bEsmsMGev_EBWI6LmDw4iimISdF2UqcbS_I8FGafdpquFqflfO9dPsN3he0ahd89MHi7vt8q7zIEwJ939NcOoE2cwiYoOLFGpd4se1edjqIOb1SJiZPiUo9h28UOMRcTYINqRxXU9D86ekfRkVCfVz3PC8Ry7YjFzGa9Yd7cYbdz17jiqmD2Iyg_706qJIcfftZq92R5b2ZNw7YJFXaE12JmUi" 
                  alt="Vintage violin resting on music sheets"
                />
              </div>
              <div className="pt-8 sm:pt-10 lg:pt-12 space-y-4">
                <img 
                  className="rounded-2xl w-full h-64 sm:h-72 lg:h-96 object-cover hover:scale-105 transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7XoXGSKKG7c2p7W-9aLD2vWadCEl6w8oOHJvDIGqXeyni0US1R0vGfhvUG4ALthRfUDcZFstZ4x5AtxLkqQL1rmIIjhPL6G85xDsau-boc1NHtnui6eFPFJkP7IsvEQLVkAhqgr2cZApDv754ECAsqIxTOUW4XYFjw-b8drbOwh26TH0oP5unDwVvSDxmcH6c2OnzxqJVGOK5ue3EhwZzQO0RY2nsB3MfYA8-1018vEMFPnk7T0QXrq-bLvlfcXz4tyJHH-ALCu78" 
                  alt="Person playing a cello with emotion"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-accent-green/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
              <div className="w-full lg:w-1/2 relative animate-float">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl"></div>
                <img 
                  className="rounded-3xl shadow-2xl relative z-10 w-full aspect-[4/5] object-cover hover:scale-[1.02] transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAShYygvhKDkr_wn2YJRoCtZfI4XxbV-JDHSnXYOMwsymE77-Bd2Yhg75ATqxkoAw-9TVlWKJz60kNr3F9a7L1YozLzMajNibE9i83nhwAscxFDdF7ShTzg4BTr8GtaY6CdykO2Yes4l6mIASrIuARRC671XTe67Zm7I4zUbGRii9Vk6uUdjgMuczNoHhKdykiRNncVtabJ7qOdxLw8ef6_QOJ3RFN503NoMDYALGgnjfpzpRZ_MuTPFx5Ml1pYEfHQUKfduSM_9hh3" 
                  alt="Portrait of Amaru Paul Odiana, professional and stylish"
                />
                <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white p-4 sm:p-6 rounded-2xl shadow-xl z-20 hidden lg:block border-l-4 border-primary">
                  <p className="text-primary font-bold text-base sm:text-lg italic">"Music is the architecture of the soul."</p>
                </div>
              </div>

              <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 animate-slide-left">
                <h2 className="text-primary text-sm font-bold uppercase tracking-[0.3em]">The Conductor</h2>
                <h3 className="text-3xl text-white sm:text-4xl lg:text-5xl font-bold leading-tight">Amaru Paul Odiana</h3>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
                  Founder & Creative Director
                </p>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  Amaru's journey began in the vibrant heart of Lagos, where the pulse of the city taught him that sound is not just heard—it is felt. With a background in classical composition and modern industrial design, he envisioned a brand that spoke to both worlds.
                </p>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  Under his leadership, DearHolly has become a sanctuary for those who seek beauty in the details and harmony in their surroundings. His vision remains clear: to create enduring pieces that resonate across generations.
                </p>
                <div className="flex items-center gap-4 sm:gap-6 pt-4">
                  {['brand_awareness', 'podcasts', 'share'].map((icon) => (
                    <a 
                      key={icon}
                      href="#" 
                      className="text-gray-300 hover:text-deep-green transition-all duration-300 hover:scale-110"
                    >
                      <span className="material-symbols-outlined text-2xl sm:text-3xl">{icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center space-y-8 lg:space-y-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight animate-slide-down">
              Become part of the symphony.
            </h2>
            <p className="text-white/80 text-lg sm:text-xl font-light italic leading-relaxed max-w-2xl mx-auto animate-fade-in">
              "We don't just sell collections; we curate experiences that linger long after the music stops."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 sm:pt-8 animate-slide-up">
              <Link href="/shop">
                <button className="w-full sm:w-auto bg-white text-primary px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold uppercase tracking-widest hover:bg-accent-green hover:text-deep-green transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                  Explore Collections
                </button>
              </Link>
              <button className="w-full sm:w-auto border-2 border-white/30 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
                Listen to the Playlist
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="green" />
    </>
  )
}