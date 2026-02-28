import { useState, useEffect } from 'react'
import { Card } from "./ui/Card";
import { Phone, CheckCircle2, CalendarDays, Inbox, PackageSearch, MapPin } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";

import { telephonie } from "../data/telephonie";

const COLORS = ["#2563eb", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#0ea5e9", "#64748b"];

/* Hook responsive pour la taille des labels Recharts */
function useChartFs() {
  const [fs, setFs] = useState(() => window.innerWidth < 640 ? 9 : 11)
  useEffect(() => {
    const handler = () => setFs(window.innerWidth < 640 ? 9 : 11)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return fs
}

function KpiTile({ color, icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl px-4 sm:px-5 py-4 text-white shadow-sm" style={{ background: color }}>
      <div className="flex items-center justify-between">
        <Icon className="opacity-90" />
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-extrabold leading-none">{value}</div>
          {sub ? <div className="text-xs opacity-90 mt-1">{sub}</div> : null}
        </div>
      </div>
      <div className="mt-3 text-sm font-medium opacity-95">{label}</div>
    </div>
  );
}

export default function DashboardTelephonie() {
  const { kpi, trendByYear, topTypes, topSecteurs, dec2025TopTypes, backlogByStatus } = telephonie;
  const fs = useChartFs();
  const yAxisW = fs === 9 ? 90 : 140;

  const tauxTxt = `${kpi.tauxTraitementPct.toFixed(2)}%`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">
          Téléphonie – Activité & Service rendu
        </h1>
        <p className="text-gray-600 mt-1">Périmètre : 2019 → 2026 + focus Décembre 2025</p>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <KpiTile
          color="#2563eb"
          icon={Phone}
          label="Demandes (2019–2026)"
          value={kpi.totalDemandes.toLocaleString()}
        />
        <KpiTile
          color="#10b981"
          icon={CheckCircle2}
          label="Taux de traitement"
          value={tauxTxt}
          sub={`${kpi.totalTraitees.toLocaleString()} traitées`}
        />
        <KpiTile
          color="#f59e0b"
          icon={CalendarDays}
          label="Déc. 2025 – demandes"
          value={kpi.dec2025Demandes.toLocaleString()}
          sub="volume mensuel observé"
        />
        <KpiTile
          color="#ef4444"
          icon={Inbox}
          label="Backlog ouvert"
          value={kpi.backlogOuvert.toLocaleString()}
          sub="non traitées"
        />
        <KpiTile
          color="#8b5cf6"
          icon={PackageSearch}
          label={`Backlog – ${kpi.backlogTop1Label}`}
          value={kpi.backlogTop1Value.toLocaleString()}
          sub="cause principale"
        />
      </div>

      {/* Zone 1: trend + donut types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Tendance des demandes (par année)</h2>
            <div className="text-sm text-gray-500">Vue globale</div>
          </div>
          <div className="h-[150px] sm:h-[260px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendByYear}>
                <XAxis dataKey="annee" tick={{ fontSize: fs }} />
                <YAxis tick={{ fontSize: fs }} />
                <Tooltip />
                <Line type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Lecture : pics 2024–2025, puis 2026 en cours d'année.
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Top types (global)</h2>
            <div className="text-sm text-gray-500">Poids des demandes</div>
          </div>
          <div className="h-[150px] sm:h-[260px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topTypes.slice(0, 5)} dataKey="value" nameKey="name" cx="50%" cy="42%" innerRadius={52} outerRadius={78} paddingAngle={2} labelLine={false}>
                  {topTypes.slice(0, 5).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={60} iconSize={10} wrapperStyle={{ fontSize: fs, lineHeight: "16px" }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Lecture : majorité du volume = correctif (dépannage + paramétrage).
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Déc. 2025 – types principaux</h2>
            <div className="text-sm text-gray-500">Focus mensuel</div>
          </div>
          <div className="h-[150px] sm:h-[260px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dec2025TopTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis tick={{ fontSize: fs }} />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Lecture : Déc. 2025 concentré sur dépannage/paramétrage.
          </p>
        </Card>
      </div>

      {/* Zone 2: secteurs + backlog */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={18} />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Top secteurs (global)</h2>
          </div>
          <div className="h-[150px] sm:h-[280px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSecteurs} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: fs }} />
                <YAxis type="category" dataKey="secteur" width={yAxisW} tick={{ fontSize: fs }} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Lecture : très forte concentration Centre Ville, puis Sud/Ouest.
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Backlog – répartition par statut</h2>
            <div className="text-sm text-gray-500">À date (export)</div>
          </div>
          <div className="h-[150px] sm:h-[280px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={backlogByStatus} dataKey="value" nameKey="name" cx="50%" cy="42%" innerRadius={54} outerRadius={80} paddingAngle={2} labelLine={false}>
                  {backlogByStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[(i + 1) % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={56} wrapperStyle={{ fontSize: fs }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Lecture : la majorité du backlog vient de l'<strong>attente matériel</strong> (dépendances externes).
          </p>
        </Card>
      </div>

      {/* Executive message */}
      <div className="rounded-xl bg-[#1A1A1A] text-white p-5">
        <h3 className="font-semibold text-white mb-2">Message exécutif (DG / DSI)</h3>
        <ul className="list-disc ml-5 text-sm text-white/90 space-y-1">
          <li>
            Le service téléphonie traite <strong>{tauxTxt}</strong> des demandes sur 2019–2026 (exécution opérationnelle maîtrisée).
          </li>
          <li>
            En <strong>décembre 2025</strong>, on observe <strong>{kpi.dec2025Demandes}</strong> demandes : utile pour calibrer la charge mensuelle.
          </li>
          <li>
            Le <strong>backlog</strong> est de <strong>{kpi.backlogOuvert}</strong> demandes, majoritairement en <strong>{kpi.backlogTop1Label}</strong> :
            enjeu de dépendance (fournisseurs/approvisionnement), plus que de capacité interne.
          </li>
          <li>
            Les volumes sont concentrés sur <strong>Centre Ville</strong> : levier pour prioriser le support et organiser la proximité.
          </li>
        </ul>
      </div>
    </div>
  );
}
