export type FinanceOption = {
  id: string;
  termLabel: string;
  profile: string;
  frequency: "Monthly" | "Quarterly";
  factor: number;
};

export type Supplier = {
  id: string;
  name: string;
  rateCard: string;
  minValue: number;
  maxValue: number;
  options: FinanceOption[];
};

export const suppliers: Supplier[] = [
  {
    id: "Sigma",
    name: "Sigma Lobby Markets",
    rateCard: "Sigma Lobby Markets 2026",
    minValue: 1000,
    maxValue: 100000,
    options: [
      { id: "cps-3-11", termLabel: "3 Year", profile: "Quarterly 1 + 11", frequency: "Quarterly", factor: 100.69 },
      { id: "cps-3-12", termLabel: "3 Year", profile: "Quarterly 1 + 12", frequency: "Quarterly", factor: 94.09 },
      { id: "cps-5-19", termLabel: "5 Year", profile: "Quarterly 1 + 19", frequency: "Quarterly", factor: 66.56 },
      { id: "cps-5-20", termLabel: "5 Year", profile: "Quarterly 1 + 20", frequency: "Quarterly", factor: 64.15 },
      { id: "cps-6-23", termLabel: "6 Year", profile: "Quarterly 1 + 23", frequency: "Quarterly", factor: 58.03 },
      { id: "cps-6-24", termLabel: "6 Year", profile: "Quarterly 1 + 24", frequency: "Quarterly", factor: 56.47 }
    ]
  },
  {
    id: "demo-coffee",
    name: "Demo Coffee Supplier",
    rateCard: "DEMO — Vending",
    minValue: 1500,
    maxValue: 50000,
    options: [
      { id: "demo-c-36", termLabel: "3 Year", profile: "Monthly 1 + 35", frequency: "Monthly", factor: 34.8 },
      { id: "demo-c-60", termLabel: "5 Year", profile: "Monthly 1 + 59", frequency: "Monthly", factor: 23.1 }
    ]
  },
  {
    id: "demo-garage",
    name: "Demo Garage Equipment Supplier",
    rateCard: "DEMO — Garage",
    minValue: 2500,
    maxValue: 75000,
    options: [
      { id: "demo-g-36", termLabel: "3 Year", profile: "Monthly 1 + 35", frequency: "Monthly", factor: 33.9 },
      { id: "demo-g-48", termLabel: "4 Year", profile: "Monthly 1 + 47", frequency: "Monthly", factor: 27.2 },
      { id: "demo-g-60", termLabel: "5 Year", profile: "Monthly 1 + 59", frequency: "Monthly", factor: 22.7 }
    ]
  }
];
