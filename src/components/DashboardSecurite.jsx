import { useState, useEffect } from 'react'
import { Card, CardContent } from "./ui/Card";
import { Shield, Mail, Wifi, Globe, Flame, Siren, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";
import { securityDec2025 } from "../data/securite";
import { TONES, CHART_COLORS } from "./ui/theme";

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

function KpiTile({ tone = "bleu", icon: Icon, label, value, sub }) {
  return (
    <div className={`rounded-xl shadow-lg bg-gradient-to-br ${TONES[tone]} text-white p-4 sm:p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium opacity-90">{label}</div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">{value}</div>
          {sub && <div className="text-xs opacity-80 mt-1">{sub}</div>}
        </div>
        {Icon && (
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, children, right }) {
  return (
    <Card className="bg-white shadow-md border border-slate-100">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                <Icon size={14} className="text-slate-600" />
              </div>
            )}
            <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          </div>
          {right && <div className="text-[11px] text-slate-400">{right}</div>}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export default function DashboardSecurite() {
  const d = securityDec2025;
  const fs = useChartFs();
  const yAxisW = fs === 9 ? 80 : 110;
  const sitesApps = d.kpi.sitesBloques + d.kpi.appsBloquees;
  const phishingVsAutres = [
    { name: "Phishing", value: d.kpi.phishingBloques },
    { name: "Autres menaces", value: Math.max(0, d.kpi.messagesBloques - d.kpi.phishingBloques) }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="text-center mb-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          Sécurité – Menaces & Protection
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Périmètre : Décembre 2025 (données consolidées)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <KpiTile tone="bleu" icon={Mail} label="Messages traités" value={d.kpi.messagesTraites.toLocaleString("fr-FR")} />
        <KpiTile tone="rouge" icon={Shield} label="Menaces bloquées" value={d.kpi.messagesBloques.toLocaleString("fr-FR")} sub={`${Math.round(d.kpi.tauxBlocage * 100)}% des emails`} />
        <KpiTile tone="orange" icon={Siren} label="Phishing bloqué" value={d.kpi.phishingBloques.toLocaleString("fr-FR")} sub="Bitdefender + Proofpoint" />
        <KpiTile tone="vert" icon={Wifi} label="Utilisateurs Wi‑Fi" value={d.kpi.utilisateursWifiMoyJour.toLocaleString("fr-FR")} sub="moyenne / jour" />
        <KpiTile tone="gris" icon={Globe} label="Sites / apps bloqués" value={sitesApps.toLocaleString("fr-FR")} sub={`${d.kpi.sitesBloques.toLocaleString("fr-FR")} sites · ${d.kpi.appsBloquees.toLocaleString("fr-FR")} apps`} />
      </div>

      {/* Messagerie & menaces */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-red-50 flex items-center justify-center">
            <Flame size={14} className="text-red-600" />
          </div>
          <h2 className="font-bold text-slate-800 text-sm">Messagerie & menaces</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Panel title="Volume de mails traités" right="Déc. 2025" icon={Mail}>
            <div className="h-[150px] sm:h-[200px] overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.messagerie.volumeDec}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: fs }} />
                  <YAxis tick={{ fontSize: fs }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: fs }} />
                  <Bar dataKey="total" name="Total" fill={CHART_COLORS.bleu} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="bloques" name="Bloqués" fill={CHART_COLORS.rouge} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Lecture : 57% des messages sont bloqués automatiquement.</p>
          </Panel>

          <Panel title="Répartition des mails" icon={Shield}>
            <div className="h-[150px] sm:h-[200px] overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={d.messagerie.repartition} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={2} label>
                    <Cell fill={CHART_COLORS.rouge} />
                    <Cell fill={CHART_COLORS.bleu} />
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: fs }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Lecture : ratio simple et lisible pour élus / DG.</p>
          </Panel>

          <Panel title="Types de menaces bloquées" icon={AlertTriangle}>
            <div className="h-[150px] sm:h-[200px] overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.messagerie.detailsBlocage} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: fs }} />
                  <YAxis type="category" dataKey="name" width={yAxisW} tick={{ fontSize: fs }} />
                  <Tooltip />
                  <Bar dataKey="value" name="Bloqués" fill={CHART_COLORS.rouge} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Lecture : la protection email absorbe l'essentiel des menaces.</p>
          </Panel>
        </div>
      </div>

      {/* Sécurité Web & Postes */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center">
            <Shield size={14} className="text-amber-600" />
          </div>
          <h2 className="font-bold text-slate-800 text-sm">Sécurité Web & postes</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Panel title="Phishing vs autres menaces" icon={Siren} right="Déc. 2025">
            <div className="h-[150px] sm:h-[200px] overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phishingVsAutres}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: fs }} />
                  <YAxis tick={{ fontSize: fs }} />
                  <Tooltip />
                  <Bar dataKey="value" name="Tentatives" fill={CHART_COLORS.orange} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Le phishing représente un volume significatif même en local.</p>
          </Panel>

          <Panel title="Sites bloqués (Top catégories)" icon={Globe} right="Bitdefender">
            <div className="h-[150px] sm:h-[200px] overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.endpoint.websites} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: fs }} />
                  <YAxis type="category" dataKey="name" width={yAxisW} tick={{ fontSize: fs }} />
                  <Tooltip />
                  <Bar dataKey="value" name="Bloqués" fill={CHART_COLORS.bleu} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Les catégories à risque dominent les blocages.</p>
          </Panel>

          <Panel title="Applications bloquées (Top)" icon={AlertTriangle} right="Bitdefender">
            <div className="h-[150px] sm:h-[200px] overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.endpoint.applications} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: fs }} />
                  <YAxis type="category" dataKey="name" width={fs === 9 ? 100 : 130} tick={{ fontSize: fs }} />
                  <Tooltip />
                  <Bar dataKey="value" name="Bloquées" fill={CHART_COLORS.gris} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Logiciels récurrents à risque identifiés.</p>
          </Panel>
        </div>
      </div>

      {/* Enjeux */}
      <Card className="bg-aix-noir text-white shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} />
            <h3 className="font-bold text-sm">Enjeux & messages clés (pour élus / DG)</h3>
          </div>
          <ul className="list-disc ml-5 space-y-1.5 text-sm text-white/90">
            <li>Un niveau de menaces élevé est absorbé automatiquement : <strong>{d.kpi.messagesBloques.toLocaleString("fr-FR")}</strong> blocages sur <strong>{d.kpi.messagesTraites.toLocaleString("fr-FR")}</strong> messages.</li>
            <li>La protection « poste + web » complète la messagerie : <strong>{sitesApps.toLocaleString("fr-FR")}</strong> sites/apps bloqués.</li>
            <li>Priorité : consolider les sources et automatiser le reporting pour piloter, comparer et justifier les décisions.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
