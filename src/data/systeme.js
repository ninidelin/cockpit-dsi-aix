// Données réelles consolidées depuis RVTools (saldebaran + saldebaran-vdi)
// Périmètre : exports fournis (hypothèse : représentatif Déc. 2025)

export const systeme = {
  kpi: {
    totalVM: 402,
    totalRamGB: 5062.68,
    avgRamGB: 12.59,
    datastores: 46,
    capacityTB: 124.37,
    usedTB: 82.14,
    occupationPct: 66.05
  },

  // Vue cluster (RAM)
  clusters: [
  {
    "cluster": "Maix-cluster1-intra",
    "vms": 207,
    "ramGB": 2990.0
  },
  {
    "cluster": "Cluster-vdi1",
    "vms": 110,
    "ramGB": 1079.68
  },
  {
    "cluster": "Maix-DMZ1",
    "vms": 82,
    "ramGB": 933.0
  },
  {
    "cluster": "(non renseigné)",
    "vms": 3,
    "ramGB": 60.0
  }
],

  // Top 10 datastores les plus “sous tension” (occupation)
  datastoresTop: [
  {
    "name": "skocab-datastore1",
    "capacityTB": 0.26,
    "usedTB": 0.25,
    "freeTB": 0.01,
    "usedPct": 94.5
  },
  {
    "name": "psmaix1-intra-retaindata",
    "capacityTB": 9.0,
    "usedTB": 8.5,
    "freeTB": 0.5,
    "usedPct": 94.5
  },
  {
    "name": "psmaix1-intra-vmstor-009",
    "capacityTB": 4.0,
    "usedTB": 3.53,
    "freeTB": 0.47,
    "usedPct": 88.2
  },
  {
    "name": "psmaix1-intra-vmstor-011",
    "capacityTB": 5.0,
    "usedTB": 4.24,
    "freeTB": 0.76,
    "usedPct": 84.7
  },
  {
    "name": "psmaix1-intra-vmstor-001",
    "capacityTB": 5.0,
    "usedTB": 4.22,
    "freeTB": 0.78,
    "usedPct": 84.3
  },
  {
    "name": "psmaix1-intra-vmstor-005",
    "capacityTB": 4.0,
    "usedTB": 3.36,
    "freeTB": 0.64,
    "usedPct": 84.0
  },
  {
    "name": "psmaix1-vdi-vmstor-003",
    "capacityTB": 2.5,
    "usedTB": 2.08,
    "freeTB": 0.42,
    "usedPct": 83.3
  },
  {
    "name": "psmaix1-vdi-vmstor-004",
    "capacityTB": 2.5,
    "usedTB": 2.07,
    "freeTB": 0.43,
    "usedPct": 82.8
  },
  {
    "name": "psmaix1-vdi-vmstor-001",
    "capacityTB": 2.5,
    "usedTB": 2.06,
    "freeTB": 0.44,
    "usedPct": 82.5
  },
  {
    "name": "psmaix1-intra-vmstor-006",
    "capacityTB": 4.0,
    "usedTB": 3.28,
    "freeTB": 0.72,
    "usedPct": 82.1
  }
]
};
