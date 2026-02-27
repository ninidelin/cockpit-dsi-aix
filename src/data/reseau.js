// Dashboard 2 – Réseau & Wi‑Fi – Disponibilité & Usages
// Périmètre : Décembre 2025 (consolidation progressive)
// Note : les séries 6 mois sont celles disponibles dans les exports Wi‑Fi fournis.

export const reseauWifiDec2025 = {
  kpi: {
    disponibiliteReseau: 98.9,
    connexionsMax: 1050,
    volumeTraficGo: 560,
    utilisateursWifiMoyJour: 780,
    incidentsReseau: 0 // iTop (filtre réseau) – Déc. 2025
  },
  wifi: {
    utilisateursTrend: [
      { mois: "Juin", value: 720 },
      { mois: "Juil", value: 750 },
      { mois: "Août", value: 700 },
      { mois: "Sept", value: 780 },
      { mois: "Oct", value: 820 },
      { mois: "Nov", value: 850 }
    ],
    traficTrendGo: [
      { mois: "Juin", value: 410 },
      { mois: "Juil", value: 460 },
      { mois: "Août", value: 380 },
      { mois: "Sept", value: 520 },
      { mois: "Oct", value: 560 },
      { mois: "Nov", value: 540 }
    ],
    topSites: [
      { site: "Hôtel de Ville", value: 820 },
      { site: "Police Municipale", value: 780 },
      { site: "Écoles", value: 640 },
      { site: "Bât. administratifs", value: 580 },
      { site: "CCAS", value: 420 }
    ],
    bornesSaturees: [
      { borne: "Gymnase Martel", taux: 95 },
      { borne: "École Valabre", taux: 90 },
      { borne: "HDV – Accueil", taux: 88 },
      { borne: "Médiathèque", taux: 84 },
      { borne: "Centre sportif", taux: 81 }
    ]
  }
};
