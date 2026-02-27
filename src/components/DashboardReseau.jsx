import { Card, CardContent } from "./ui/Card";
import { Wifi, Users, Activity, AlertTriangle, Network, ArrowUpRight } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar, CartesianGrid, Legend
} from "recharts";
import { reseauWifiDec2025 } from "../data/reseau";
import { TONES, CHART_COLORS } from "./ui/theme";

function KpiTile({ tone, icon: Icon, label, value, sub }) {
  return (
    <div className={`rounded-xl shadow-lg bg-gradient-to-br ${TONES[tone]} text-white p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium opacity-90">{label}</div>
          <div className="text-3xl font-extrabold tracking-tight mt-1">{value}</div>
          {sub && <div className="text-xs opacity-80 mt-1">{sub}</div>}
        </div>
        {Icon && (
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}

function Panel({ title, right, children }) {
  return (
    <Card className="bg-white shadow-md border border-slate-100">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          {right && <div className="text-[11px] text-slate-400">{right}</div>}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export default function DashboardReseau() {
  const { kpi, wifi } = reseauWifiDec2025;

  return (
    <div className="p-6 space-y-5">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Réseau & Wi‑Fi – Disponibilité & Usages</h1>
        <p className="text-slate-500 mt-1 text-sm">Périmètre : décembre 2025 (consolidation progressive)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiTile tone="bleu" icon={Network} label="Disponibilité réseau" value={`${kpi.disponibiliteReseau}%`} />
        <KpiTile tone="indigo" icon={Users} label="Connexions simultanées (pic)" value={kpi.connexionsMax.toLocaleString("fr-FR")} />
        <KpiTile tone="orange" icon={Activity} label="Trafic réseau" value={`${kpi.volumeTraficGo.toLocaleString("fr-FR")} Go`} />
        <KpiTile tone="vert" icon={Wifi} label="Utilisateurs Wi‑Fi (moy/j)" value={kpi.utilisateursWifiMoyJour.toLocaleString("fr-FR")} sub="Hypothèse : période déc. 2025" />
        <KpiTile tone="rouge" icon={AlertTriangle} label="Incidents réseau (iTop)" value={kpi.incidentsReseau.toLocaleString("fr-FR")} sub="Déc. 2025 – export iTop" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Panel title="Usagers Wi‑Fi (6 derniers mois)" right={<span className="inline-flex items-center gap-1"><ArrowUpRight size={12} /> tendance</span>}>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wifi.utilisateursTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" name="Utilisateurs" stroke={CHART_COLORS.bleu} strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Hausse progressive des usagers Wi‑Fi, avec pics sur les sites critiques.</p>
        </Panel>

        <Panel title="Trafic Wi‑Fi (Go) – 6 derniers mois">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wifi.traficTrendGo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" name="Go" fill={CHART_COLORS.or} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Volume important, justifiant une supervision et une capacité dimensionnée.</p>
        </Panel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Panel title="Top sites Wi‑Fi les plus sollicités">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wifi.topSites} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="site" width={130} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" name="Connexions" fill={CHART_COLORS.vert} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Concentration des usages sur Hôtel de Ville, Police, Écoles.</p>
        </Panel>

        <Panel title="Bornes sous tension (taux de charge)">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wifi.bornesSaturees} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="borne" width={130} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="taux" name="Charge (%)" fill={CHART_COLORS.rouge} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Bornes proches de 90–95% : risque de dégradation, à prioriser.</p>
        </Panel>
      </div>

      <Card className="bg-aix-noir text-white shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-sm mb-3">Enjeux & messages clés</h3>
          <ul className="list-disc ml-5 space-y-1.5 text-sm text-white/90">
            <li>Le Wi‑Fi est un service critique : ~<strong>{kpi.utilisateursWifiMoyJour.toLocaleString("fr-FR")}</strong> usagers/jour et un pic à <strong>{kpi.connexionsMax.toLocaleString("fr-FR")}</strong> connexions.</li>
            <li>Les usages se concentrent sur des sites sensibles : prioriser des investissements ciblés.</li>
            <li>Des bornes sont « sous tension » (&gt;85%) : renforcer la capacité et industrialiser la supervision.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
