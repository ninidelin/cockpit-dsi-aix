import { useState, useEffect } from 'react'
import { Card, CardContent } from "./ui/Card";
import { Server, Cpu, HardDrive, Database, Gauge, Layers } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";
import { systeme } from "../data/systeme";

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
    <div className="rounded-xl shadow-sm text-white px-4 sm:px-5 py-4" style={{ background: color }}>
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

export default function DashboardSysteme() {
  const { kpi, clusters, datastoresTop } = systeme;
  const fs = useChartFs();
  const yAxisW = fs === 9 ? 100 : 160;

  const datastoresForChart = datastoresTop
    .slice()
    .sort((a, b) => b.usedPct - a.usedPct)
    .map((d) => ({
      name: d.name,
      usedTB: d.usedTB,
      freeTB: d.freeTB,
      usedPct: d.usedPct
    }));

  const clustersForChart = clusters
    .slice()
    .sort((a, b) => b.ramGB - a.ramGB)
    .map((c) => ({
      cluster: c.cluster,
      ramGB: c.ramGB,
      vms: c.vms
    }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">
          Systèmes – Capacité & Stockage
        </h1>
        <p className="text-gray-600 mt-1">Consolidation RVTools (saldebaran + saldebaran-vdi)</p>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <KpiTile
          color="#2563eb"
          icon={Server}
          label="VM totales"
          value={kpi.totalVM.toLocaleString()}
        />
        <KpiTile
          color="#0ea5e9"
          icon={Cpu}
          label="RAM totale"
          value={`${kpi.totalRamGB.toLocaleString()} Go`}
          sub={`Moyenne : ${kpi.avgRamGB} Go / VM`}
        />
        <KpiTile
          color="#10b981"
          icon={Database}
          label="Capacité stockage"
          value={`${kpi.capacityTB.toLocaleString()} To`}
        />
        <KpiTile
          color="#f59e0b"
          icon={HardDrive}
          label="Stockage utilisé"
          value={`${kpi.usedTB.toLocaleString()} To`}
          sub={`Occupation : ${kpi.occupationPct}%`}
        />
        <KpiTile
          color="#8b5cf6"
          icon={Layers}
          label="Datastores"
          value={kpi.datastores.toLocaleString()}
        />
        <KpiTile
          color="#ef4444"
          icon={Gauge}
          label="Zones à surveiller"
          value={datastoresTop.filter((d) => d.usedPct >= 85).length}
          sub="Datastores ≥ 85%"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cluster RAM */}
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-1">RAM par cluster</h2>
            <p className="text-sm text-gray-500 mb-4">
              Lecture : où se concentre la consommation mémoire (proxy de charge VMs).
            </p>
            <div className="h-[200px] sm:h-[320px] overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clustersForChart} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: fs }} />
                  <YAxis type="category" dataKey="cluster" width={yAxisW} tick={{ fontSize: fs }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: fs }} />
                  <Bar dataKey="ramGB" name="RAM (Go)" fill="#0ea5e9" />
                  <Bar dataKey="vms" name="VMs" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Datastore capacity */}
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Top datastores sous tension</h2>
            <p className="text-sm text-gray-500 mb-4">
              Lecture : capacité (To) et occupation (%) sur les datastores les plus chargés.
            </p>
            <div className="h-[200px] sm:h-[320px] overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datastoresForChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: fs }} interval={0} angle={-20} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: fs }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: fs }} />
                  <Bar dataKey="usedTB" name="Utilisé (To)" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="freeTB" name="Libre (To)" stackId="a" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-white/90">
              <span className="font-semibold">À retenir :</span> {kpi.occupationPct}% d'occupation globale, mais plusieurs datastores
              dépassent 85% (risque saturation / performance).
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table-like list */}
      <Card className="bg-white border shadow-sm">
        <CardContent className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Détail – Top 10 datastores (occupation)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="py-2 pr-4">Datastore</th>
                  <th className="py-2 pr-4">Capacité (To)</th>
                  <th className="py-2 pr-4">Utilisé (To)</th>
                  <th className="py-2 pr-4">Libre (To)</th>
                  <th className="py-2 pr-2">Occupation</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {datastoresTop.map((d) => (
                  <tr key={d.name} className="border-t">
                    <td className="py-2 pr-4 whitespace-nowrap">{d.name}</td>
                    <td className="py-2 pr-4">{d.capacityTB}</td>
                    <td className="py-2 pr-4">{d.usedTB}</td>
                    <td className="py-2 pr-4">{d.freeTB}</td>
                    <td className="py-2 pr-2 font-semibold">
                      <span className={d.usedPct >= 85 ? "text-red-600" : d.usedPct >= 75 ? "text-orange-600" : "text-green-700"}>
                        {d.usedPct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Message */}
      <Card className="bg-[#1A1A1A] text-white border-0 shadow-sm">
        <CardContent className="p-5 text-sm text-white/90">
          <h3 className="font-semibold mb-2">Messages clés (DSI / DG)</h3>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              L'infrastructure consolide <strong>{kpi.totalVM}</strong> VM pour <strong>{kpi.totalRamGB} Go</strong> de RAM allouée
              (moyenne <strong>{kpi.avgRamGB} Go</strong> / VM).
            </li>
            <li>
              Le stockage total est de <strong>{kpi.capacityTB} To</strong>, occupé à <strong>{kpi.occupationPct}%</strong> :
              marge globale correcte, mais attention aux points chauds.
            </li>
            <li>
              Priorité : surveiller et traiter les datastores ≥ 85% pour éviter saturation, incidents et dégradation de performance.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
