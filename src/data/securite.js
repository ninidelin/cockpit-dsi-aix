// Dashboard 1 – Sécurité – Menaces & Protection
// Périmètre : Décembre 2025
// Sources : Proofpoint (messagerie) + Bitdefender (poste) + hypothèse Wi‑Fi (moy/j)

export const securityDec2025 = {
  kpi: {
    messagesTraites: 38698,
    messagesBloques: 22252,
    tauxBlocage: 0.575,
    phishingBloques: 3836,
    sitesBloques: 21131,
    appsBloquees: 2077,
    utilisateursWifiMoyJour: 780
  },

  messagerie: {
    // Acceptés vs Bloqués (Proofpoint)
    repartition: [
      { name: "Bloqués", value: 22252 },
      { name: "Acceptés", value: 16446 }
    ],

    // Détail des blocages (Proofpoint)
    detailsBlocage: [
      { name: "PDR", value: 19760 },
      { name: "Spam", value: 790 },
      { name: "Others", value: 1441 },
      { name: "Email / Firewall", value: 261 }
    ],

    // Visuel simple « volume » (Déc. 2025) : Total vs Bloqués
    volumeDec: [
      { label: "Déc.", total: 38698, bloques: 22252 }
    ]
  },

  endpoint: {
    // Bitdefender – Top catégories sites
    websites: [
      { name: "Pornography", value: 11880 },
      { name: "Hate", value: 4057 },
      { name: "Mature Content", value: 1498 },
      { name: "Gambling", value: 1136 },
      { name: "Online Dating", value: 849 }
    ],

    // Bitdefender – Top applications bloquées
    applications: [
      { name: "just_convert.exe", value: 134 },
      { name: "pdfalcon.exe", value: 101 },
      { name: "just_convert(1).exe", value: 94 },
      { name: "just_convert(2).exe", value: 74 },
      { name: "PDFpower (1).exe", value: 67 }
    ]
  }
};
