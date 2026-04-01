'use client'

import { useEffect, useRef } from 'react'

const NarrativeSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    if (imageRef.current) observer.observe(imageRef.current)
    if (contentRef.current) observer.observe(contentRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="bg-accent-green py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        <div ref={imageRef} className="relative animate-on-scroll">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-200 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
            <div 
              className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-700"
              style={{ 
                backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCKMNgKZa0mI2mGI_iXQKk3JgdawhEEl3iEav8mMM_9vZUh9OP_mcMVfhFk9m0J1vfasd9tA_aeOc1fc2c-nb5iFaUA5LyEvVPbRUFh01A0o52QhUCUvAB8VABsLUOsm8qS_9B9MV_zTi3HjZb34jlbywLKSNuUf7IPw_LM9X5l84s9zYnzagHW1I81M8TgTXqgg2oJeYgOkyxCZn_-9hYdNP1J8lr4etphfGH7zFp4gyhmSX0LlOHn6p4_uYk7cIMw4qBVL9DEm7bC)'
              }}
            />
          </div>
          <div className="absolute -bottom-8 sm:-bottom-10 -left-8 sm:-left-10 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 bg-primary rounded-2xl -rotate-6 flex items-center justify-center p-4 sm:p-6 md:p-8 text-white animate-float">
            <p className="font-black text-base sm:text-lg md:text-xl italic tracking-tighter text-center">SOUND IS FABRIC</p>
          </div>
        </div>

        <div ref={contentRef} className="animate-on-scroll space-y-4 sm:space-y-6">
          <h3 className="text-primary text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-4 sm:mb-6">
            The Narrative
          </h3>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4 sm:mb-6 md:mb-8">
            WHERE THE STUDIO MEETS THE ATELIER
          </h2>
          <p className="text-base sm:text-lg text-slate-700 font-medium mb-4 leading-relaxed">
            For Amavu Paul Odiana, fashion is not just visual—it's acoustic. Every stitch in DearHolly is inspired by the frequencies of contemporary urban soundscapes.
          </p>
          <p className="text-base sm:text-lg text-slate-700 font-medium mb-6 sm:mb-8 md:mb-10 leading-relaxed">
            We don't just dress artists; we translate their resonance into tangible silhouettes. High-fashion streetwear for those who hear the world differently.
          </p>
          <div className="border-l-4 border-primary pl-4 sm:pl-6 py-2 italic text-slate-500 font-semibold text-sm sm:text-base">
            "If you can't hear the garment, it isn't DearHolly." — Amavu
          </div>
        </div>
      </div>
    </section>
  )
}

export default NarrativeSection