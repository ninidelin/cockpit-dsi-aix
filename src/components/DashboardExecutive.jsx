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

function KpiSmall({ label, value, sub, accent = C.bleu }) {
  return (
    <div style={{
      background: C.blanc, border: "1px solid #e5e7eb", borderLeft: `4px solid ${accent}`,
      borderRadius: 6, padding: "10px 14px",
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.noir, lineHeight: 1.1, marginTop: 3 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Badge({ status }) {
  const m = {
    ok: { bg: "#dcfce7", color: "#166534", text: "Maîtrisé" },
    watch: { bg: "#fef3c7", color: "#92400e", text: "Attention" },
  };
  const s = m[status] || m.ok;
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{s.text}</span>;
}

function SectionBlock({ number, title, status, message, children }) {
  const borderColor = status === "ok" ? C.vert : C.orange;
  return (
    <div style={{ background: C.blanc, border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 20, overflow: "hidden" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: `4px solid ${borderColor}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{number}</span>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: C.noir, margin: 0 }}>{title}</h2>
        </div>
        <Badge status={status} />
      </div>
      <div style={{ padding: "10px 20px", background: "#f9fafb", borderBottom: "1px solid #f3f4f6", fontSize: 12, color: "#4b5563", lineHeight: 1.6, fontStyle: "italic" }}>
        💬 {message}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

function ChartCard({ title, right, children, reading, readingColor }) {
  return (
    <div style={{ background: C.blanc, border: "1px solid #e5e7eb", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.noir }}>{title}</span>
        {right && <span style={{ fontSize: 10, color: "#9ca3af" }}>{right}</span>}
      </div>
      <div style={{ padding: 14 }}>
        {children}
        {reading && <div style={{ fontSize: 11, color: readingColor || C.orange, marginTop: 8, fontWeight: 600 }}>{reading}</div>}
      </div>
    </div>
  );
}

function ChartWrap({ h = 200, children }) {
  return (
    <div style={{ width: "100%", height: h, overflow: "hidden" }}>
      <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
    </div>
  );
}

function Bloc1DSI() {
  const d = DATA.itop;
  return (
    <SectionBlock number="①" title="La DSI est-elle sous tension opérationnelle ?" status="ok"
      message="En décembre, la DSI a traité 18 tickets (10 incidents / 8 demandes), ce qui représente un volume faible et maîtrisé. Il n'y a pas de surcharge volumétrique. En revanche, le temps moyen de résolution est de 8,7 heures, ce qui entraîne un respect des SLA limité à 40%. 👉 Le sujet n'est donc pas un manque de capacité, mais un enjeu d'organisation, de priorisation et de pilotage des demandes et des urgences.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        <KpiSmall accent={C.bleu} label="Tickets total" value={d.ticketsTotal} sub="Déc. 2025" />
        <KpiSmall accent={C.orange} label="MTTR moyen" value={`${d.mttrH} h`} sub="incidents" />
        <KpiSmall accent={d.slaPct < 60 ? C.rouge : C.vert} label="SLA incidents" value={`${d.slaPct}%`} sub="≤ 4h (hypothèse)" />
        <KpiSmall accent={C.gris} label="Backlog demandes" value={d.backlog} sub="au 31/12" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <ChartCard title="Incidents vs Demandes" right="iTop · Déc." reading="56% d'incidents — part élevée" readingColor={C.rouge}>
          <ChartWrap h={190}>
            <PieChart>
              <Pie data={d.byType} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                <Cell fill={C.rouge} /><Cell fill={C.bleu} />
              </Pie>
              <Tooltip /><Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ChartWrap>
        </ChartCard>
        <ChartCard title="Répartition urgence (incidents)" right="Distribution" reading="60% urgence haute — priorisation nécessaire" readingColor={C.orange}>
          <ChartWrap h={190}>
            <BarChart data={d.urgence}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
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
  const bornesColored = d.bornes.map(b => ({ ...b, fill: b.taux >= 90 ? C.rouge : b.taux >= 85 ? C.orange : C.vert }));
  const bornesAlert = d.bornes.filter(b => b.taux >= 88).length;
  return (
    <SectionBlock number="②" title="Le Wi-Fi et le réseau sont-ils dimensionnés pour l'usage réel ?" status="watch"
      message="Le réseau affiche une excellente disponibilité (98,9%) et supporte 780 utilisateurs par jour en moyenne, ce qui confirme son rôle critique. Cependant, plusieurs bornes atteignent 80 à 95% de charge, notamment sur les sites prioritaires. 👉 Le service fonctionne aujourd'hui correctement, mais la marge de capacité se réduit. Un investissement préventif ciblé permettra d'éviter une dégradation future.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        <KpiSmall accent={C.bleu} label="Utilisateurs Wi-Fi" value={d.usagers.toLocaleString("fr-FR")} sub="moyenne/jour · Déc. 2025" />
        <KpiSmall accent={C.vert} label="Disponibilité réseau" value={`${d.dispo}%`} />
        <KpiSmall accent={C.gris} label="Connexions pic" value={d.pic.toLocaleString("fr-FR")} sub="simultanées" />
        <KpiSmall accent={C.orange} label="Trafic réseau" value={`${d.trafic} Go`} sub="Déc. 2025" />
      </div>
      <ChartCard title="Bornes sous tension" right="Charge %" reading={`⚠ ${bornesAlert} bornes ≥ 88% — investissement requis`} readingColor={C.rouge}>
        <ChartWrap h={220}>
          <BarChart data={bornesColored} layout="vertical" margin={{ left: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="borne" width={120} tick={{ fontSize: 11 }} />
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
  return (
    <SectionBlock number="③" title="L'infrastructure serveur est-elle sous pression ?" status="ok"
      message="L'infrastructure héberge 402 machines virtuelles avec un taux d'occupation global de 66%, ce qui laisse une capacité confortable à court terme. Seuls quelques datastores dépassent les 85% d'occupation, nécessitant une surveillance ciblée. 👉 Aucun besoin d'investissement urgent sur le socle serveur. La situation est maîtrisée sous réserve d'un suivi des zones à risque.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        <KpiSmall accent={d.occPct >= 80 ? C.rouge : C.vert} label="Occupation stockage" value={`${d.occPct}%`} />
        <KpiSmall accent={d.datastoresAlert > 0 ? C.orange : C.vert} label="Zones à surveiller" value={d.datastoresAlert} sub="Datastores ≥ 85%" />
        <KpiSmall accent={C.bleu} label="VM totales" value={d.vm} />
        <KpiSmall accent={C.gris} label="RAM totale" value={`${d.ramGB.toLocaleString("fr-FR")} Go`} />
      </div>
      <ChartCard title="Top 3 datastores sous tension" right="Occupation %" reading="2 datastores à 94,5% — action requise" readingColor={C.rouge}>
        <ChartWrap h={160}>
          <BarChart data={d.topDS}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
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
  return (
    <SectionBlock number="④" title="La téléphonie est-elle un problème organisationnel ou structurel ?" status="watch"
      message="Le volume de demandes téléphonie est maîtrisé et la majorité des tickets sont traités efficacement. En revanche, le backlog est principalement constitué de demandes en attente de matériel (62 cas), ce qui traduit une dépendance fournisseur plutôt qu'un problème de capacité interne. 👉 L'enjeu est contractuel et logistique, non organisationnel côté DSI.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
        <KpiSmall accent={C.bleu} label="Demandes Déc. 2025" value={d.dec2025} />
        <KpiSmall accent={C.rouge} label="Backlog ouvert" value={d.backlogTotal} sub="non traitées" />
        <KpiSmall accent={C.orange} label="Attente matériel" value={62} sub="54% du backlog" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <ChartCard title="Backlog – répartition par statut" right="Export" reading="54% = attente matériel (dépendance fournisseur)" readingColor={C.orange}>
          <ChartWrap h={200}>
            <PieChart>
              <Pie data={d.backlog} dataKey="value" nameKey="name" cx="50%" cy="42%" innerRadius={40} outerRadius={68} paddingAngle={2} labelLine={false}>
                {d.backlog.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
              </Pie>
              <Legend verticalAlign="bottom" height={52} wrapperStyle={{ fontSize: 10 }} /><Tooltip />
            </PieChart>
          </ChartWrap>
        </ChartCard>
        <ChartCard title="Top secteurs (global)" reading="Centre Ville concentre 58% des demandes" readingColor={C.bleu}>
          <ChartWrap h={200}>
            <BarChart data={d.secteurs} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="secteur" width={100} tick={{ fontSize: 10 }} />
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
    <div className="p-6 space-y-0">
      <div style={{ textAlign: "center", padding: "20px 0 6px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: C.noir, margin: 0, letterSpacing: "-0.01em" }}>
          Synthèse Exécutive — Cockpit DSI
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Données consolidées Déc. 2025</p>
      </div>

      <div style={{ background: C.noir, borderRadius: 8, padding: "16px 24px", marginBottom: 12, borderLeft: `4px solid ${C.rouge}`, marginTop: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.blanc, marginBottom: 6 }}>Points clés</div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0 }}>
          L'infrastructure est <span style={{ color: "#4ade80", fontWeight: 700 }}>globalement maîtrisée</span>.
          Le Wi-Fi nécessite une <span style={{ color: "#fbbf24", fontWeight: 700 }}>anticipation d'investissement</span>.
          La téléphonie dépend d'un <span style={{ color: C.or, fontWeight: 700 }}>enjeu fournisseur</span>.
          La performance support relève d'un <span style={{ color: "#60a5fa", fontWeight: 700 }}>pilotage organisationnel</span>.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
        <KpiSmall accent={C.rouge} label="Menaces bloquées" value="22 252" sub="/mois (57%)" />
        <KpiSmall accent={C.vert} label="Dispo réseau" value="98,9%" />
        <KpiSmall accent={C.bleu} label="Usagers Wi-Fi/j" value="780" sub="pic 1 050" />
        <KpiSmall accent={C.bleu} label="VM gérées" value="402" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        <KpiSmall accent={C.orange} label="Stockage" value="66%" sub="3 pts chauds ≥85%" />
        <KpiSmall accent={C.noir} label="Tickets DSI" value="18" sub="10 incidents · 8 dem." />
        <KpiSmall accent={C.rouge} label="MTTR / SLA" value="8,7h / 40%" sub="marge de progrès" />
        <KpiSmall accent={C.orange} label="Backlog téléph." value="114" sub="62 attente matériel" />
      </div>

      <Bloc1DSI />
      <Bloc2Wifi />
      <Bloc3Infra />
      <Bloc4Tel />

      <div style={{ background: C.blanc, border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>④</span>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: C.noir, margin: 0 }}>Décisions proposées 2026</h2>
        </div>
        <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { label: "Investissement Wi-Fi", desc: "Ajouter des bornes sur sites critiques, moderniser les bornes anciennes, mettre en place un monitoring plus fin, plan d'investissement ciblé 2026.", color: C.rouge },
            { label: "Pilotage support & priorisation", desc: "Mieux prioriser et piloter les demandes (rituel hebdo, catégorisation, SLA/urgences), réduire le MTTR, et envisager un renfort ponctuel si la tendance se confirme.", color: C.bleu },
            { label: "Téléphonie – axe fournisseur & stock", desc: "Renégocier fournisseur, mettre en place un stock tampon, simplifier les modèles de postes, planifier un renouvellement global si matériel vieillissant.", color: C.or },
          ].map((d, i) => (
            <div key={i} style={{ padding: "14px 18px", borderLeft: `4px solid ${d.color}`, background: "#f9fafb", borderRadius: "0 6px 6px 0" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.noir, marginBottom: 4 }}>{d.label}</div>
              <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.6 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "14px 20px" }}>
        <p style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: C.rouge }}>Note méthodologique :</strong> Ce cockpit consolide des données réelles (Proofpoint, Bitdefender, iTop, RVTools, exports téléphonie ODS).
          Les hypothèses et extrapolations sont signalées dans chaque onglet détaillé. Prochaine itération : données Wi-Fi temps réel et automatisation des exports.
        </p>
      </div>
    </div>
  );
}
