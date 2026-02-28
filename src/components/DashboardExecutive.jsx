import { useState, useEffect } from 'react'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const C = {
  rouge: "#E22019", bleu: "#2563eb", or: "#CBA930",
  vert: "#16a34a", orange: "#f59e0b", gris: "#64748b",
  noir: "#1A1A1A", blanc: "#FFFFFF",
};
const PIE = [C.rouge, C.bleu, C.or, C.vert, C.gris, "#4f46e5", "#0ea5e9"];

const DATA = {
  itop: {
    ticketsTotal: 18, incidents: 10, demandes: 8,
    mttrH: 8.7, slaPct: 40, backlog: 4,
    byType: [{ name: "Incidents", value: 10 }, { name: "Demandes", value: 8 }],
    urgence: [{ name: "Haute", value: 6 }, { name: "Moyenne", value: 4 }, { name: "Basse", value: 0 }],
  },
  wifi: {
    usagers: 780, dispo: 98.9, pic: 1050, trafic: 560,
    bornes: [
      { borne: "Gymnase Martel", taux: 95 }, { borne: "École Valabre", taux: 90 },
      { borne: "HDV – Accueil", taux: 88 }, { borne: "Médiathèque", taux: 84 },
      { borne: "Centre sportif", taux: 81 },
    ],
  },
  systeme: {
    vm: 402, occPct: 66, datastoresAlert: 3, ramGB: 5063,
    topDS: [
      { name: "skocab-ds1", pct: 94.5 }, { name: "retaindata", pct: 94.5 },
      { name: "vmstor-009", pct: 88.2 },
    ],
  },
  tel: {
    dec2025: 109, backlogTotal: 114,
    backlog: [
      { name: "Attente matériel", value: 62 }, { name: "Refusée", value: 26 },
      { name: "Pris en charge", value: 15 }, { name: "A traiter", value: 6 },
      { name: "Attente travaux", value: 3 }, { name: "Attente opérateur", value: 2 },
    ],
    secteurs: [
      { secteur: "CENTRE VILLE", value: 3335 }, { secteur: "SUD", value: 607 },
      { secteur: "OUEST", value: 281 }, { secteur: "EST", value: 185 },
      { secteur: "ECOLES", value: 173 }, { secteur: "NORD", value: 129 },
    ],
  },
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

/* ─── Composants UI ─── */

function KpiSmall({ label, value, sub, accent = C.bleu }) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-md px-3 py-2.5"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#1A1A1A] leading-tight mt-0.5">{value}</div>
      {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function Badge({ status }) {
  const styles = {
    ok: "bg-green-100 text-green-800",
    watch: "bg-yellow-100 text-yellow-800",
  };
  const text = { ok: "Maîtrisé", watch: "Attention" };
  return (
    <span className={`${styles[status] || styles.ok} text-[11px] font-bold px-2.5 py-1 rounded-full`}>
      {text[status] || text.ok}
    </span>
  );
}

function SectionBlock({ number, title, status, message, children }) {
  const borderColor = status === "ok" ? C.vert : C.orange;
  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-5 overflow-hidden">
      <div
        className="px-4 sm:px-5 py-3 border-b border-gray-100 flex items-center justify-between"
        style={{ borderLeft: `4px solid ${borderColor}` }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base flex-shrink-0">{number}</span>
          <h2 className="text-sm sm:text-[15px] font-extrabold text-[#1A1A1A] m-0 leading-snug">{title}</h2>
        </div>
        <Badge status={status} />
      </div>
      <div className="px-4 sm:px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-600 leading-relaxed italic">
        💬 {message}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function ChartCard({ title, right, children, reading, readingColor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="px-3 sm:px-3.5 py-2.5 border-b border-gray-100 flex justify-between items-center gap-2">
        <span className="text-xs sm:text-[13px] font-bold text-[#1A1A1A] leading-snug">{title}</span>
        {right && <span className="text-[10px] text-gray-400 flex-shrink-0">{right}</span>}
      </div>
      <div className="p-3 sm:p-3.5">
        {children}
        {reading && (
          <div className="text-[11px] mt-2 font-semibold" style={{ color: readingColor || C.orange }}>
            {reading}
          </div>
        )}
      </div>
    </div>
  );
}

function ChartWrap({ className = "h-[150px] sm:h-[200px]", children }) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
    </div>
  );
}

/* ─── Blocs de contenu ─── */

function Bloc1DSI() {
  const d = DATA.itop;
  const fs = useChartFs();
  return (
    <SectionBlock number="①" title="La DSI est-elle sous tension opérationnelle ?" status="ok"
      message="En décembre, la DSI a traité 18 tickets (10 incidents / 8 demandes), ce qui représente un volume faible et maîtrisé. Il n'y a pas de surcharge volumétrique. En revanche, le temps moyen de résolution est de 8,7 heures, ce qui entraîne un respect des SLA limité à 40%. 👉 Le sujet n'est donc pas un manque de capacité, mais un enjeu d'organisation, de priorisation et de pilotage des demandes et des urgences.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
        <KpiSmall accent={C.bleu} label="Tickets total" value={d.ticketsTotal} sub="Déc. 2025" />
        <KpiSmall accent={C.orange} label="MTTR moyen" value={`${d.mttrH} h`} sub="incidents" />
        <KpiSmall accent={d.slaPct < 60 ? C.rouge : C.vert} label="SLA incidents" value={`${d.slaPct}%`} sub="≤ 4h (hypothèse)" />
        <KpiSmall accent={C.gris} label="Backlog demandes" value={d.backlog} sub="au 31/12" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ChartCard title="Incidents vs Demandes" right="iTop · Déc." reading="56% d'incidents — part élevée" readingColor={C.rouge}>
          <ChartWrap className="h-[150px] sm:h-[190px]">
            <PieChart>
              <Pie data={d.byType} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                <Cell fill={C.rouge} /><Cell fill={C.bleu} />
              </Pie>
              <Tooltip /><Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: fs }} />
            </PieChart>
          </ChartWrap>
        </ChartCard>
        <ChartCard title="Répartition urgence (incidents)" right="Distribution" reading="60% urgence haute — priorisation nécessaire" readingColor={C.orange}>
          <ChartWrap className="h-[150px] sm:h-[190px]">
            <BarChart data={d.urgence}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: fs }} />
              <YAxis allowDecimals={false} tick={{ fontSize: fs }} />
              <Tooltip /><Bar dataKey="value" name="Incidents" fill={C.rouge} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartWrap>
        </ChartCard>
      </div>
    </SectionBlock>
  );
}

function Bloc2Wifi() {
  const d = DATA.wifi;
  const fs = useChartFs();
  const yAxisW = fs === 9 ? 90 : 120;
  const bornesColored = d.bornes.map(b => ({ ...b, fill: b.taux >= 90 ? C.rouge : b.taux >= 85 ? C.orange : C.vert }));
  const bornesAlert = d.bornes.filter(b => b.taux >= 88).length;
  return (
    <SectionBlock number="②" title="Le Wi-Fi et le réseau sont-ils dimensionnés pour l'usage réel ?" status="watch"
      message="Le réseau affiche une excellente disponibilité (98,9%) et supporte 780 utilisateurs par jour en moyenne, ce qui confirme son rôle critique. Cependant, plusieurs bornes atteignent 80 à 95% de charge, notamment sur les sites prioritaires. 👉 Le service fonctionne aujourd'hui correctement, mais la marge de capacité se réduit. Un investissement préventif ciblé permettra d'éviter une dégradation future.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
        <KpiSmall accent={C.bleu} label="Utilisateurs Wi-Fi" value={d.usagers.toLocaleString("fr-FR")} sub="moyenne/jour · Déc. 2025" />
        <KpiSmall accent={C.vert} label="Disponibilité réseau" value={`${d.dispo}%`} />
        <KpiSmall accent={C.gris} label="Connexions pic" value={d.pic.toLocaleString("fr-FR")} sub="simultanées" />
        <KpiSmall accent={C.orange} label="Trafic réseau" value={`${d.trafic} Go`} sub="Déc. 2025" />
      </div>
      <ChartCard title="Bornes sous tension" right="Charge %" reading={`⚠ ${bornesAlert} bornes ≥ 88% — investissement requis`} readingColor={C.rouge}>
        <ChartWrap className="h-[150px] sm:h-[220px]">
          <BarChart data={bornesColored} layout="vertical" margin={{ left: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: fs }} />
            <YAxis type="category" dataKey="borne" width={yAxisW} tick={{ fontSize: fs }} />
            <Tooltip />
            <Bar dataKey="taux" name="Charge (%)">
              {bornesColored.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ChartWrap>
      </ChartCard>
    </SectionBlock>
  );
}

function Bloc3Infra() {
  const d = DATA.systeme;
  const fs = useChartFs();
  return (
    <SectionBlock number="③" title="L'infrastructure serveur est-elle sous pression ?" status="ok"
      message="L'infrastructure héberge 402 machines virtuelles avec un taux d'occupation global de 66%, ce qui laisse une capacité confortable à court terme. Seuls quelques datastores dépassent les 85% d'occupation, nécessitant une surveillance ciblée. 👉 Aucun besoin d'investissement urgent sur le socle serveur. La situation est maîtrisée sous réserve d'un suivi des zones à risque.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
        <KpiSmall accent={d.occPct >= 80 ? C.rouge : C.vert} label="Occupation stockage" value={`${d.occPct}%`} />
        <KpiSmall accent={d.datastoresAlert > 0 ? C.orange : C.vert} label="Zones à surveiller" value={d.datastoresAlert} sub="Datastores ≥ 85%" />
        <KpiSmall accent={C.bleu} label="VM totales" value={d.vm} />
        <KpiSmall accent={C.gris} label="RAM totale" value={`${d.ramGB.toLocaleString("fr-FR")} Go`} />
      </div>
      <ChartCard title="Top 3 datastores sous tension" right="Occupation %" reading="2 datastores à 94,5% — action requise" readingColor={C.rouge}>
        <ChartWrap className="h-[150px] sm:h-[160px]">
          <BarChart data={d.topDS}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: fs }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: fs }} />
            <Tooltip />
            <Bar dataKey="pct" name="Occupation %">
              {d.topDS.map((entry, i) => <Cell key={i} fill={entry.pct >= 90 ? C.rouge : entry.pct >= 85 ? C.orange : C.vert} />)}
            </Bar>
          </BarChart>
        </ChartWrap>
      </ChartCard>
    </SectionBlock>
  );
}

function Bloc4Tel() {
  const d = DATA.tel;
  const fs = useChartFs();
  const yAxisW = fs === 9 ? 80 : 100;
  return (
    <SectionBlock number="④" title="La téléphonie est-elle un problème organisationnel ou structurel ?" status="watch"
      message="Le volume de demandes téléphonie est maîtrisé et la majorité des tickets sont traités efficacement. En revanche, le backlog est principalement constitué de demandes en attente de matériel (62 cas), ce qui traduit une dépendance fournisseur plutôt qu'un problème de capacité interne. 👉 L'enjeu est contractuel et logistique, non organisationnel côté DSI.">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
        <KpiSmall accent={C.bleu} label="Demandes Déc. 2025" value={d.dec2025} />
        <KpiSmall accent={C.rouge} label="Backlog ouvert" value={d.backlogTotal} sub="non traitées" />
        <KpiSmall accent={C.orange} label="Attente matériel" value={62} sub="54% du backlog" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ChartCard title="Backlog – répartition par statut" right="Export" reading="54% = attente matériel (dépendance fournisseur)" readingColor={C.orange}>
          <ChartWrap className="h-[150px] sm:h-[200px]">
            <PieChart>
              <Pie data={d.backlog} dataKey="value" nameKey="name" cx="50%" cy="42%" innerRadius={40} outerRadius={68} paddingAngle={2} labelLine={false}>
                {d.backlog.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
              </Pie>
              <Legend verticalAlign="bottom" height={52} wrapperStyle={{ fontSize: fs - 1 }} /><Tooltip />
            </PieChart>
          </ChartWrap>
        </ChartCard>
        <ChartCard title="Top secteurs (global)" reading="Centre Ville concentre 58% des demandes" readingColor={C.bleu}>
          <ChartWrap className="h-[150px] sm:h-[200px]">
            <BarChart data={d.secteurs} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: fs }} />
              <YAxis type="category" dataKey="secteur" width={yAxisW} tick={{ fontSize: fs }} />
              <Tooltip /><Bar dataKey="value" fill={C.vert} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartWrap>
        </ChartCard>
      </div>
    </SectionBlock>
  );
}

export default function DashboardExecutive() {
  return (
    <div className="p-4 sm:p-6 space-y-0">
      <div className="text-center py-5 pb-1.5">
        <h1 className="text-lg sm:text-xl md:text-[26px] font-black text-[#1A1A1A] m-0 tracking-tight">
          Synthèse Exécutive — Cockpit DSI
        </h1>
        <p className="text-sm text-gray-500 mt-1">Données consolidées Déc. 2025</p>
      </div>

      <div className="bg-[#1A1A1A] rounded-lg px-4 sm:px-6 py-4 mb-3 mt-3 border-l-4 border-[#E22019]">
        <div className="text-sm font-extrabold text-white mb-1.5">Points clés</div>
        <p className="text-sm leading-7 m-0" style={{ color: "rgba(255,255,255,0.85)" }}>
          L'infrastructure est <span className="text-green-400 font-bold">globalement maîtrisée</span>.
          Le Wi-Fi nécessite une <span className="text-yellow-300 font-bold">anticipation d'investissement</span>.
          La téléphonie dépend d'un <span style={{ color: C.or }} className="font-bold">enjeu fournisseur</span>.
          La performance support relève d'un <span className="text-blue-400 font-bold">pilotage organisationnel</span>.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-3">
        <KpiSmall accent={C.rouge} label="Menaces bloquées" value="22 252" sub="/mois (57%)" />
        <KpiSmall accent={C.vert} label="Dispo réseau" value="98,9%" />
        <KpiSmall accent={C.bleu} label="Usagers Wi-Fi/j" value="780" sub="pic 1 050" />
        <KpiSmall accent={C.bleu} label="VM gérées" value="402" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
        <KpiSmall accent={C.orange} label="Stockage" value="66%" sub="3 pts chauds ≥85%" />
        <KpiSmall accent={C.noir} label="Tickets DSI" value="18" sub="10 incidents · 8 dem." />
        <KpiSmall accent={C.rouge} label="MTTR / SLA" value="8,7h / 40%" sub="marge de progrès" />
        <KpiSmall accent={C.orange} label="Backlog téléph." value="114" sub="62 attente matériel" />
      </div>

      <Bloc1DSI />
      <Bloc2Wifi />
      <Bloc3Infra />
      <Bloc4Tel />

      <div className="bg-white border border-gray-200 rounded-lg mb-5 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <span className="text-base">④</span>
          <h2 className="text-sm sm:text-[15px] font-extrabold text-[#1A1A1A] m-0">Décisions proposées 2026</h2>
        </div>
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {[
            { label: "Investissement Wi-Fi", desc: "Ajouter des bornes sur sites critiques, moderniser les bornes anciennes, mettre en place un monitoring plus fin, plan d'investissement ciblé 2026.", color: C.rouge },
            { label: "Pilotage support & priorisation", desc: "Mieux prioriser et piloter les demandes (rituel hebdo, catégorisation, SLA/urgences), réduire le MTTR, et envisager un renfort ponctuel si la tendance se confirme.", color: C.bleu },
            { label: "Téléphonie – axe fournisseur & stock", desc: "Renégocier fournisseur, mettre en place un stock tampon, simplifier les modèles de postes, planifier un renouvellement global si matériel vieillissant.", color: C.or },
          ].map((d, i) => (
            <div key={i} className="py-3.5 px-4 bg-gray-50 rounded-r-md" style={{ borderLeft: `4px solid ${d.color}` }}>
              <div className="text-sm font-extrabold text-[#1A1A1A] mb-1">{d.label}</div>
              <div className="text-xs text-gray-600 leading-relaxed">{d.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 sm:px-5 py-3.5">
        <p className="text-xs text-gray-600 leading-relaxed m-0">
          <strong style={{ color: C.rouge }}>Note méthodologique :</strong> Ce cockpit consolide des données réelles (Proofpoint, Bitdefender, iTop, RVTools, exports téléphonie ODS).
          Les hypothèses et extrapolations sont signalées dans chaque onglet détaillé. Prochaine itération : données Wi-Fi temps réel et automatisation des exports.
        </p>
      </div>
    </div>
  );
}
