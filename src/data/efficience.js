// Dashboard 3 – Charge & Efficience DSI (iTop)
// Périmètre : Décembre 2025 (exports iTop fournis)

export const itopDec2025 = {
  kpi: {
    ticketsTotal: 18,
    incidents: 10,
    demandes: 8,
    mttrIncidentsH: 8.7, // moyenne (521 min)
    slaIncidentsPct: 40, // % incidents résolus <= 4h (hypothèse SLA interne)
    backlogDemandesOuvertes: 4
  },

  volumes: {
    byType: [
      { name: "Incidents", value: 10 },
      { name: "Demandes", value: 8 }
    ],

    urgenceIncidents: [
      { name: "Haute", value: 6 },
      { name: "Moyenne", value: 4 },
      { name: "Basse", value: 0 }
    ],

    incidentsParService: [
      { service: "Gestion des Identités", nb: 5 },
      { service: "Applicatif", nb: 2 },
      { service: "Cleanroom", nb: 2 },
      { service: "Autres", nb: 1 }
    ]
  },

  performance: {
    resolutionIncidents: [
      { tranche: "≤ 2h", nb: 3 },
      { tranche: "2–4h", nb: 1 },
      { tranche: "4–8h", nb: 1 },
      { tranche: "8–24h", nb: 3 },
      { tranche: "> 24h", nb: 2 }
    ],

    backlogAging: [
      { tranche: "≤ 7j", nb: 0 },
      { tranche: "8–14j", nb: 1 },
      { tranche: "15–30j", nb: 3 },
      { tranche: "> 30j", nb: 0 }
    ],

    weeklyTrend: [
      { semaine: "S1", tickets: 3 },
      { semaine: "S2", tickets: 4 },
      { semaine: "S3", tickets: 6 },
      { semaine: "S4", tickets: 5 }
    ]
  }
};
