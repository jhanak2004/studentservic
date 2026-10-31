import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Services from './pages/Services'
import TrackOrder from './pages/TrackOrder'
import MyOrders from './pages/MyOrders'
import ScholarshipAffidavit from './pages/ScholarshipAffidavit'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#16161f', color: '#e8e8f0', border: '1px solid #1e1e2e' },
            success: { iconTheme: { primary: '#43e97b', secondary: '#16161f' } },
            error:   { iconTheme: { primary: '#ff6584', secondary: '#16161f' } },
          }}
        />
        <Navbar />
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/services"    element={<Services />} />
          <Route path="/track"       element={<TrackOrder />} />
          <Route path="/my-orders"   element={<MyOrders />} />
          <Route path="/scholarship" element={<ScholarshipAffidavit />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
