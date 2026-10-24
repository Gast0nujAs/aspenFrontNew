import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import ScrollTop from "./components/ScrollTop"
import Inicio from "./pages/Inicio"
import ViewUsados from "./pages/ViewUsados"
import ViewNuevos from "./pages/ViewNuevos"
import AutosVista from "./pages/AutosVista"
import Financiacion from "./pages/Financiacion"
import Nosotros from "./pages/Nosotros"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AdminVehiculoForm from "./pages/AdminVehiculoForm"
import VendeTuAuto from "./pages/VendeTuAuto"
import { AuthProvider } from "./contexts/AuthContext"
import Motos from "./pages/Motos"
import { ComparadorProvider } from "./contexts/ComparadorContext"
import Comparar from "./pages/Comparar"
import BarraComparador from "./components/BarraComparador"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
  return user ? children : <Navigate to="/admin/login" />
}

function App() {
  return (
    <AuthProvider>
      <ComparadorProvider>
        <BrowserRouter>
          <ScrollTop />
          <BarraComparador />
          <Routes>
            <Route path="/" element={<><NavBar /><Inicio /><Footer /></>} />
            <Route path="/usados" element={<><NavBar /><ViewUsados /><Footer /></>} />
            <Route path="/usados/:id" element={<><NavBar /><AutosVista tipo="usados" /><Footer /></>} />
            <Route path="/nuevos" element={<><NavBar /><ViewNuevos /><Footer /></>} />
            <Route path="/nuevos/:id" element={<><NavBar /><AutosVista tipo="nuevos" /><Footer /></>} />
            <Route path="/motos" element={<><NavBar /><Motos /><Footer /></>} />
            <Route path="/motos/:id" element={<><NavBar /><AutosVista tipo="motos" /><Footer /></>} />
            <Route path="/vende-tu-auto" element={<><NavBar /><VendeTuAuto /><Footer /></>} />
            <Route path="/comparar" element={<><NavBar /><Comparar /><Footer /></>} />
            <Route path="/financiacion" element={<><NavBar /><Financiacion /><Footer /></>} />
            <Route path="/nosotros" element={<><NavBar /><Nosotros /><Footer /></>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/vehiculos/nuevo" element={<ProtectedRoute><AdminVehiculoForm /></ProtectedRoute>} />
            <Route path="/admin/vehiculos/editar/:id" element={<ProtectedRoute><AdminVehiculoForm /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </ComparadorProvider>
    </AuthProvider>
  )
}

export default App