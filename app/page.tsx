'use client'

import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import LatestDrops from '@/components/home/LatestDrops'
import NarrativeSection from '@/components/home/NarrativeSection'
import MusicSection from '@/components/home/MusicSection'
import AnnouncementBanner from '@/components/home/AnnouncementBanner'

export default function Home() {
  useEffect(() => {
    // Intersection Observer for scroll animations
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

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <AnnouncementBanner />
      <main className="pt-20">
        <HeroSection />
        <LatestDrops />
        <NarrativeSection />
        <MusicSection />
      </main>
      <Footer variant="green" />
    </>
  )
}