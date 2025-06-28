// src/app/page.tsx
import HeroSection from '@/components/sections/HeroSection'
import PopularTours from '@/components/sections/PopularTours'
import TourCategories from '@/components/sections/TourCategories'
import AirportTransfer from '@/components/sections/AirportTransfer'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PopularTours />
      <TourCategories />
      <AirportTransfer />
    </main>
  )
}
