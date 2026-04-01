'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, ExternalLink, Music, Headphones } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface MusicRecord {
  id: string
  title: string
  description: string
  coverImage: string
  releaseDate: string
  genre: string
  duration: string
  platforms: {
    name: string
    url: string
    icon: string
  }[]
}

const musicRecords: MusicRecord[] = [
  {
    id: '1',
    title: 'Hold On',
    description: 'A soulful journey through the night, blending R&B melodies with contemporary beats. Perfect for late-night reflections and intimate moments.',
    coverImage: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/25/34/d3/2534d3ea-5bc9-066c-6aeb-017bb1a0e4bb/artwork.jpg/316x316bb.webp',
    releaseDate: '2026',
    genre: 'Afro-Beat',
    duration: '2:23',
    platforms: [
      {
        name: 'Spotify',
        url: 'https://open.spotify.com/track/4zdZnTFGcskz8MVW6Jc45b?si=4bc20240f382429f',
        icon: 'https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg'
      },
      {
        name: 'Apple Music',
        url: 'https://music.apple.com/us/album/hold-on-single/1881030293',
        icon: 'https://cdn.brandfetch.io/id_yBTuraI/theme/light/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B'
      },
      {
        name: 'YouTube Music',
        url: 'https://music.youtube.com/watch?v=7F8kAHR3SS4&si=7CmKu1o3qeQBoq3H',
        icon: 'https://cdn.iconscout.com/icon/free/png-512/free-youtube-music-icon-svg-download-png-3357685.png?f=webp&w=256'
      }
    ]
  },
  {
    id: '2',
    title: 'Heist',
    description: 'Capturing the essence of city life with smooth vocals and atmospheric production. A track that resonates with the modern soul.',
    coverImage: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c7/76/f1/c776f137-07d3-724e-8aa5-0213feadb9dd/artwork.jpg/316x316bf.webp',
    releaseDate: '2026',
    genre: 'Afro-Beat',
    duration: '3:08',
    platforms: [
      {
        name: 'Spotify',
        url: 'https://open.spotify.com/track/0wPxkCbf8jfzXZ9UmUUS9K?si=0fb6e1a1c08c4905',
        icon: 'https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg'
      },
      {
        name: 'Apple Music',
        url: 'https://music.apple.com/us/album/heist-single/1881178601',
        icon: 'https://cdn.brandfetch.io/id_yBTuraI/theme/light/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B'
      },
      {
        name: 'YouTube Music',
        url: 'https://music.youtube.com/watch?v=5nFXK5ly2-0&si=VfxTxbk-gIMxcq0m',
        icon: 'https://cdn.iconscout.com/icon/free/png-512/free-youtube-music-icon-svg-download-png-3357685.png?f=webp&w=256'
      }
    ]
  },
  {
    id: '3',
    title: 'Peace',
    description: 'Smooth melodies that wrap you in comfort, perfect for those quiet evenings when you want to unwind and reflect.',
    coverImage: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5b/aa/34/5baa343b-39c2-9828-d1d7-0f2e7378e489/artwork.jpg/316x316bb.webp',
    releaseDate: '2026',
    genre: 'Afro-Beat',
    duration: '3:05',
    platforms: [
      {
        name: 'Spotify',
        url: 'https://open.spotify.com/track/3A7LO9ds4QJviUg4XcnxvV?si=7e9e7e5fd8154f7c',
        icon: 'https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg'
      },
      {
        name: 'Apple Music',
        url: 'https://music.apple.com/us/album/peace-single/1870481989',
        icon: 'https://cdn.brandfetch.io/id_yBTuraI/theme/light/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B'
      },
      {
        name: 'YouTube Music',
        url: 'https://music.youtube.com/watch?v=hhPdUe8pP_Q&si=ZHmRcbiOO5ANAQCT',
        icon: 'https://cdn.iconscout.com/icon/free/png-512/free-youtube-music-icon-svg-download-png-3357685.png?f=webp&w=256'
      }
    ]
  },
  {
    id: '4',
    title: 'My Soul',
    description: 'Forward-thinking soundscapes that blend traditional R&B with modern electronic elements. A glimpse into the future of soul music.',
    coverImage: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/09/33/1d093353-e12e-cf8c-6ffd-f3eb0ec06d90/artwork.jpg/316x316bb.webp',
    releaseDate: '2026',
    genre: 'Afro-Beat',
    duration: '2:38',
    platforms: [
      {
        name: 'Spotify',
        url: 'https://open.spotify.com/track/0AWNnUfDPzI5Oxu2v8Tsyf?si=2c33c28a43024971',
        icon: 'https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg'
      },
      {
        name: 'Apple Music',
        url: 'https://music.apple.com/us/album/my-soul-single/1870472652',
        icon: 'https://cdn.brandfetch.io/id_yBTuraI/theme/light/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B'
      },
      {
        name: 'YouTube Music',
        url: 'https://music.youtube.com/watch?v=1kIbtyZYGok&si=Men39CbYAbBourfS',
        icon: 'https://cdn.iconscout.com/icon/free/png-512/free-youtube-music-icon-svg-download-png-3357685.png?f=webp&w=256'
      }
    ]
  },
  {
    id: '5',
    title: 'Real Ones',
    description: 'Intimate acoustic arrangements that speak volumes without words. A collection of moments captured in melody.',
    coverImage: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b8/96/c9/b896c9f6-f836-2f0b-2d3c-5931286d5e03/artwork.jpg/316x316bb.webp',
    releaseDate: '2026',
    genre: 'Afro-Beat',
    duration: '2:44',
    platforms: [
      {
        name: 'Spotify',
        url: 'https://open.spotify.com/track/4kWxGrgplOPiWQqecqGjbV?si=9cdc3ce6da734f93',
        icon: 'https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg'
      },
      {
        name: 'Apple Music',
        url: 'https://music.apple.com/us/album/real-ones-single/1872015484',
        icon: 'https://cdn.brandfetch.io/id_yBTuraI/theme/light/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B'
      },
      {
        name: 'YouTube Music',
        url: 'https://music.youtube.com/watch?v=nbCn8LXL2Gs&si=f8sawoeaoBozHy6K',
        icon: 'https://cdn.iconscout.com/icon/free/png-512/free-youtube-music-icon-svg-download-png-3357685.png?f=webp&w=256'
      }
    ]
  },
  {
    id: '6',
    title: 'Big Wood',
    description: 'Urban anthems with a modern twist, capturing the energy of city lights and late-night adventures.',
    coverImage: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/66/f0/6b/66f06b37-dd25-766f-bebc-51cbaa0a96c6/artwork.jpg/316x316bb.webp',
    releaseDate: '2026',
    genre: 'Afro-Beat',
    duration: '3:19',
    platforms: [
      {
        name: 'Spotify',
        url: 'https://open.spotify.com/track/3ATIAx67VydCQBK8S0S3Rt?si=463b1cf828494748',
        icon: 'https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg'
      },
      {
        name: 'Apple Music',
        url: 'https://music.apple.com/us/album/real-ones-single/1872015484',
        icon: 'https://cdn.brandfetch.io/id_yBTuraI/theme/light/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B'
      },
      {
        name: 'YouTube Music',
        url: 'https://music.youtube.com/watch?v=WrMm0qgTaEc&si=hQrLoWeL76TH6Tjn',
        icon: 'https://cdn.iconscout.com/icon/free/png-512/free-youtube-music-icon-svg-download-png-3357685.png?f=webp&w=256'
      }
    ]
  }
]

export default function MusicPage() {
  const [hoveredRecord, setHoveredRecord] = useState<string | null>(null)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 pt-20 pb-16">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Music className="w-8 h-8 text-white" />
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                  Music Collection
                </h1>
              </div>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Discover the soundtrack to DearHolly. Each track tells a story, captures a moment, and embodies the soul of our brand.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Music Records Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {musicRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                onMouseEnter={() => setHoveredRecord(record.id)}
                onMouseLeave={() => setHoveredRecord(null)}
              >
                {/* Cover Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={record.coverImage}
                    alt={record.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg"
                    >
                      <Play className="w-6 h-6 text-gray-900" />
                    </motion.button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                      {record.releaseDate}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {record.title}
                      </h3>
                      <p className="text-sm text-emerald-600 font-medium">
                        {record.genre}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {record.duration}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {record.description}
                  </p>

                  {/* Streaming Platforms */}
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-gray-400" />
                    <div className="flex gap-2">
                      {record.platforms.map((platform) => (
                        <a
                          key={platform.name}
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center group/platform"
                          title={`Listen on ${platform.name}`}
                        >
                          <img
                            src={platform.icon}
                            alt={platform.name}
                            className="w-4 h-4 object-contain"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-emerald-500 to-green-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Follow the Sound
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Stay connected with DearHolly's musical journey. Follow us on all platforms for new releases, behind-the-scenes content, and exclusive tracks.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {musicRecords[0].platforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white transition-all duration-300 hover:scale-105"
                  >
                    <img
                      src={platform.icon}
                      alt={platform.name}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">Follow on {platform.name}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer variant="green" />
    </>
  )
}