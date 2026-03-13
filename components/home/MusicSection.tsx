'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const MusicSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    if (cardsRef.current) {
      const cards = cardsRef.current.children
      Array.from(cards).forEach((card, index) => {
        ;(card as HTMLElement).style.transitionDelay = `${index * 0.1}s`
        observer.observe(card)
      })
    }

    return () => observer.disconnect()
  }, [])

  const musicPlatforms = [
    {
      name: 'Spotify',
      description: 'Stream our monthly studio playlists and runway selections.',
      action: 'Open Profile',
      color: '#1DB954',
      logo: 'https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg',
      hoverColor: 'group-hover:bg-[#1DB954]',
      link: 'https://open.spotify.com/artist/2REObag4jzlespV0dJ1FF3?si=CqQxf508Q-2ojnQQh0HRiA'
    },
    {
      name: 'Apple Music',
      description: 'Immerse yourself in high-fidelity audio brand experiences.',
      action: 'Open Profile',
      color: '#FA243C', 
      logo: 'https://cdn.brandfetch.io/id_yBTuraI/theme/light/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B',
      hoverColor: 'group-hover:bg-[#FA243C]',
      link: 'https://music.apple.com/us/artist/dearholly/1868404640'
    },
    {
      name: 'Youtube Music',
      description: 'Raw demos, behind-the-scenes audio, and exclusive beats.',
      action: 'Open Profile',   
      color: '#FFA200',
      logo: 'https://cdn.iconscout.com/icon/free/png-512/free-youtube-music-icon-svg-download-png-3357685.png?f=webp&w=256',
      hoverColor: 'group-hover:bg-[#FFA200]',
      link: 'https://music.youtube.com/channel/UCpHK_o8QZ1EeIkwMloOrS8Q?si=34dq2Ql2aiQCInrC'
    },
    {
      name: 'Audiomack',
      description: 'Raw demos, behind-the-scenes audio, and exclusive beats.',
      action: 'Open Profile',   
      color: '#FFA200',
      logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/audiomack-icon.png',
      hoverColor: 'group-hover:bg-[#FFA200]',
      link: ''
    }
  ]

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-deep-green">
      <div className="text-center mb-10 sm:mb-12 lg:mb-16 animate-on-scroll">
        <h3 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase mb-2 sm:mb-4 text-white">The Sound of Holly</h3>
        <p className="text-white/70 text-sm sm:text-base font-medium max-w-xl mx-auto">
          Curated soundscapes and exclusive drops from the DearHolly creative studio.
        </p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {musicPlatforms.map((platform, index) => (
          <Link
            key={index}
            href={platform.link}
            target='_blank'
            className="group relative bg-white/10 backdrop-blur-sm border border-white/20 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center animate-on-scroll"
          >
            <div 
              className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6 transition-all duration-500 group-hover:scale-110`}
              style={{ 
                backgroundColor: `${platform.color}20`,
                color: platform.color
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = platform.color
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${platform.color}20`
                e.currentTarget.style.color = platform.color
              }}
            >
                <img src={platform.logo} alt={platform.name} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
            </div>
            
            <h4 className="text-lg sm:text-xl font-bold mb-2 text-white">{platform.name}</h4>
            <p className="text-white/70 text-xs sm:text-sm mb-4 sm:mb-6">{platform.description}</p>
            
            <span 
              className="text-xs font-black uppercase tracking-widest transition-colors duration-300"
              style={{ color: platform.color }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = platform.color}
            >
              {platform.action}
            </span>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
                 style={{ backgroundColor: platform.color }}></div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default MusicSection