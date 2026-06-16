import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotificationProvider } from './context/NotificationContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import BannerSection from './components/BannerSection'
import HeroSection from './components/HeroSection'
import FeatureCards from './components/FeatureCards'
import ShowcaseSection from './components/ShowcaseSection'
import SecondShowcase from './components/SecondShowcase'
import Footer from './components/Footer'
import Toast from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Suppliers from './pages/Suppliers'
import Reports from './pages/Reports'
import Warehouse from './pages/Warehouse'
import Login from './pages/Login'
import Signup from './pages/Signup'

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

function P({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<P><Dashboard /></P>} />
            <Route path="/products" element={<P><Products /></P>} />
            <Route path="/orders" element={<P><Orders /></P>} />
            <Route path="/suppliers" element={<P><Suppliers /></P>} />
            <Route path="/reports" element={<P><Reports /></P>} />
            <Route path="/warehouse" element={<P><Warehouse /></P>} />
          </Routes>
          <Footer />
          <Toast />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
