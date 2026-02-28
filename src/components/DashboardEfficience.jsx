import { useState, useEffect } from 'react'
import { Card, CardContent } from "./ui/Card";
import { ClipboardList, AlertTriangle, ListChecks, Timer, CheckCircle2, Inbox } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";

import { itopDec2025 } from "../data/efficience";

const COLORS = {
  blue: "#2563eb",
  red: "#dc2626",
  indigo: "#4f46e5",
  orange: "#f59e0b",
  green: "#16a34a",
  slate: "#64748b"
};

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

function KpiTile({ tone, icon: Icon, label, value, sub }) {
  const toneMap = {
    blue: "from-blue-600 to-blue-500",
    red: "from-red-600 to-red-500",
    indigo: "from-indigo-600 to-indigo-500",
    orange: "from-orange-500 to-orange-400",
    green: "from-green-600 to-green-500",
    slate: "from-slate-700 to-slate-600"
  };

  return (
    <div className={`rounded-xl shadow-lg bg-gradient-to-br ${toneMap[tone]} text-white p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[12px] opacity-90">{label}</div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">{value}</div>
          {sub ? <div className="text-[12px] opacity-90 mt-1">{sub}</div> : null}
        </div>
        {Icon ? (
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Icon size={22} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Panel({ title, children, right }) {
  return (
    <Card className="bg-white shadow-lg border border-slate-100 rounded-xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          {right ? <div className="text-xs text-slate-500">{right}</div> : null}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export default function DashboardEfficience() {
  const d = itopDec2025;
  const fs = useChartFs();
  const yAxisW = fs === 9 ? 110 : 160;

  return (
    <div className="p-4 sm:p-6 bg-slate-50 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Charge & Efficience DSI – Déc. 2025
        </h1>
        <p className="text-slate-600 mt-2">Données issues des exports iTop fournis (Incidents + Demandes)</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <KpiTile tone="blue" icon={ClipboardList} label="Tickets total" value={d.kpi.ticketsTotal} sub="Déc. 2025" />
        <KpiTile tone="red" icon={AlertTriangle} label="Incidents" value={d.kpi.incidents} />
        <KpiTile tone="indigo" icon={ListChecks} label="Demandes" value={d.kpi.demandes} />
        <KpiTile tone="orange" icon={Timer} label="MTTR incidents" value={`${d.kpi.mttrIncidentsH} h`} sub="moyenne" />
        <KpiTile tone="green" icon={CheckCircle2} label="SLA incidents" value={`${d.kpi.slaIncidentsPct}%`} sub="≤ 4h (hypothèse)" />
        <KpiTile tone="slate" icon={Inbox} label="Backlog demandes" value={d.kpi.backlogDemandesOuvertes} sub="au 31/12" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Panel title="Volume tickets (Incidents vs Demandes)">
          <div className="h-[150px] sm:h-[280px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={d.volumes.byType}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={2}
                  label
                >
                  <Cell fill={COLORS.red} />
                  <Cell fill={COLORS.indigo} />
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: fs }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Répartition urgence (incidents)">
          <div className="h-[150px] sm:h-[280px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.volumes.urgenceIncidents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: fs }} />
                <YAxis allowDecimals={false} tick={{ fontSize: fs }} />
                <Tooltip />
                <Bar dataKey="value" name="Incidents" fill={COLORS.red} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Panel title="Incidents par service">
          <div className="h-[150px] sm:h-[280px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.volumes.incidentsParService} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: fs }} />
                <YAxis type="category" dataKey="service" width={yAxisW} tick={{ fontSize: fs }} />
                <Tooltip />
                <Bar dataKey="nb" name="Incidents" fill={COLORS.blue} radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Temps de résolution (incidents)">
          <div className="h-[150px] sm:h-[280px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.performance.resolutionIncidents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tranche" tick={{ fontSize: fs }} />
                <YAxis allowDecimals={false} tick={{ fontSize: fs }} />
                <Tooltip />
                <Bar dataKey="nb" name="Incidents" fill={COLORS.orange} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Panel title="Backlog demandes ouvertes (âge)" right="au 31/12">
          <div className="h-[150px] sm:h-[280px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.performance.backlogAging}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tranche" tick={{ fontSize: fs }} />
                <YAxis allowDecimals={false} tick={{ fontSize: fs }} />
                <Tooltip />
                <Bar dataKey="nb" name="Demandes" fill={COLORS.indigo} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Tendance hebdo (tickets)" right="Décembre">
          <div className="h-[150px] sm:h-[280px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.performance.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semaine" tick={{ fontSize: fs }} />
                <YAxis allowDecimals={false} tick={{ fontSize: fs }} />
                <Tooltip />
                <Line type="monotone" dataKey="tickets" name="Tickets" stroke={COLORS.green} strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Card className="bg-[#1A1A1A] text-white rounded-xl shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold mb-2">Lecture « pilotage » (exemple de discours)</h3>
          <ul className="list-disc ml-5 space-y-1 text-sm text-white/90">
            <li>
              Sur décembre, le volume est modéré (<strong>{d.kpi.ticketsTotal}</strong> tickets) mais la part d'incidents est élevée ({Math.round((d.kpi.incidents / d.kpi.ticketsTotal) * 100)}%).
            </li>
            <li>
              Le MTTR est à <strong>{d.kpi.mttrIncidentsH}h</strong> et le SLA (≤4h) à <strong>{d.kpi.slaIncidentsPct}%</strong> : on a une marge de progrès sur la rapidité de résolution.
            </li>
            <li>
              Les incidents se concentrent sur <strong>Gestion des Identités</strong> : prioriser une action ciblée (causes racines, automatisation, documentation).
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
