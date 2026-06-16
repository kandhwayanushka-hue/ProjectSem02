import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import BannerSection from './components/BannerSection'
import HeroSection from './components/HeroSection'
import FeatureCards from './components/FeatureCards'
import ShowcaseSection from './components/ShowcaseSection'
import SecondShowcase from './components/SecondShowcase'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Suppliers from './pages/Suppliers'
import Reports from './pages/Reports'
import Warehouse from './pages/Warehouse'

function Home() {
  return (
    <>
      <BannerSection />
      <HeroSection />
      <FeatureCards />
      <ShowcaseSection />
      <SecondShowcase />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/warehouse" element={<Warehouse />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
