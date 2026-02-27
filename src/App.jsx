import { Routes, Route, NavLink } from 'react-router-dom'
import DashboardSecurite from './components/DashboardSecurite'
import DashboardReseau from './components/DashboardReseau'
import DashboardEfficience from './components/DashboardEfficience'
import DashboardSysteme from './components/DashboardSysteme'
import DashboardTelephonie from './components/DashboardTelephonie'
import DashboardExecutive from './components/DashboardExecutive'

export default function App() {
  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded text-sm font-semibold transition-all border ${
      isActive
        ? 'bg-[#E22019] text-white border-[#E22019] shadow'
        : 'bg-transparent border-transparent text-white/70 hover:text-white hover:bg-white/10'
    }`

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header — Noir avec liseré rouge (charte Aix) */}
      <header className="sticky top-0 z-20 bg-[#1A1A1A] border-b-[3px] border-[#E22019]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-0 flex items-center justify-between h-14">
          {/* Logo + titre */}
          <div className="flex items-center gap-3">
            <img
              src="/logo-aix-blanc.png"
              alt="Ville d'Aix-en-Provence"
              className="h-9 w-auto"
            />
            <div className="hidden sm:block">
              <div className="text-white font-bold text-sm leading-tight">
                <span className="text-[#E22019] font-extrabold">DSI</span>
                <span className="mx-1.5 opacity-30">|</span>
                Cockpit Décisionnel
              </div>
              <div className="text-white/40 text-[10px]">Déc. 2025</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 flex-wrap justify-end">
            <NavLink to="/" className={linkClass} end>
              Synthèse
            </NavLink>
            <NavLink to="/securite" className={linkClass}>
              Sécurité
            </NavLink>
            <NavLink to="/reseau" className={linkClass}>
              Réseau & Wi‑Fi
            </NavLink>
            <NavLink to="/efficience" className={linkClass}>
              Charge & Efficience
            </NavLink>
            <NavLink to="/systeme" className={linkClass}>
              Système
            </NavLink>
            <NavLink to="/telephonie" className={linkClass}>
              Téléphonie
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto">
        <Routes>
          <Route path="/" element={<DashboardExecutive />} />
          <Route path="/securite" element={<DashboardSecurite />} />
          <Route path="/reseau" element={<DashboardReseau />} />
          <Route path="/efficience" element={<DashboardEfficience />} />
          <Route path="/systeme" element={<DashboardSysteme />} />
          <Route path="/telephonie" element={<DashboardTelephonie />} />
        </Routes>
      </main>

      {/* Footer — charte Aix */}
      <footer className="bg-[#1A1A1A] border-t-[3px] border-[#E22019] mt-4">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-white/40 text-[11px]">
            Direction des Systèmes d'Information · Ville d'Aix-en-Provence · Données consolidées Déc. 2025
          </div>
          <div className="flex items-center gap-3">
            <img
              src="/logo-aix-blanc.png"
              alt="Ville d'Aix-en-Provence"
              className="h-7 w-auto opacity-80"
            />
          </div>
        </div>
      </footer>
    </div>
  )
}
