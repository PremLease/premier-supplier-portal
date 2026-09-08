"use client";

import { useMemo, useState } from "react";
import { suppliers, Supplier, FinanceOption } from "../lib/data";

type Role = "supplier" | "admin";
type Page = "dashboard" | "calculator" | "newquote" | "history" | "admin";

type Quote = {
  id: string;
  supplierId: string;
  customer: string;
  equipment: string;
  cost: number;
  optionId: string;
  payment: number;
  created: string;
};

const starterQuotes: Quote[] = [
  {
    id: "PQ-260901",
    supplierId: "cps",
    customer: "ABC Security Ltd",
    equipment: "CCTV & access control",
    cost: 25000,
    optionId: "cps-5-19",
    payment: 1664,
    created: "01 Sep 2026"
  }
];

const money = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);

const paymentFor = (cost: number, option: FinanceOption) => (cost / 1000) * option.factor;

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>("supplier");
  const [supplierId, setSupplierId] = useState("cps");
  const [page, setPage] = useState<Page>("dashboard");
  const [quotes, setQuotes] = useState<Quote[]>(starterQuotes);
  const [calcCost, setCalcCost] = useState(25000);
  const [adminSupplierId, setAdminSupplierId] = useState("cps");

  const supplier = suppliers.find((s) => s.id === supplierId) ?? suppliers[0];
  const adminSupplier = suppliers.find((s) => s.id === adminSupplierId) ?? suppliers[0];

  const visibleQuotes = useMemo(
    () => (role === "admin" ? quotes : quotes.filter((q) => q.supplierId === supplierId)),
    [quotes, role, supplierId]
  );

  if (!loggedIn) {
    return <Login onLogin={(newRole, newSupplier) => {
      setRole(newRole);
      setSupplierId(newSupplier);
      setAdminSupplierId(newSupplier);
      setLoggedIn(true);
      setPage("dashboard");
    }} />;
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">PREMIER LEASING &amp; FINANCE</div>
          <h1>{titleFor(page)}</h1>
        </div>
        <div className="topActions">
          <span className="pill">{role === "admin" ? "Premier Admin" : supplier.name}</span>
          <button className="button secondary" onClick={() => setLoggedIn(false)}>Sign out</button>
        </div>
      </header>

      <div className="layout">
        <nav className="sidebar">
          <Nav active={page === "dashboard"} onClick={() => setPage("dashboard")}>Dashboard</Nav>
          <Nav active={page === "calculator"} onClick={() => setPage("calculator")}>Finance Calculator</Nav>
          <Nav active={page === "newquote"} onClick={() => setPage("newquote")}>Create Quote</Nav>
          <Nav active={page === "history"} onClick={() => setPage("history")}>Quote History</Nav>
          {role === "admin" && <Nav active={page === "admin"} onClick={() => setPage("admin")}>Premier Admin</Nav>}
        </nav>

        <section className="content">
          {page === "dashboard" && (
            <Dashboard
              role={role}
              supplier={supplier}
              quotes={visibleQuotes}
              onNewQuote={() => setPage("newquote")}
            />
          )}
          {page === "calculator" && (
            <Calculator
              role={role}
              supplierId={supplierId}
              setSupplierId={setSupplierId}
              cost={calcCost}
              setCost={setCalcCost}
            />
          )}
          {page === "newquote" && (
            <CreateQuote
              supplier={supplier}
              onSave={(quote) => {
                setQuotes((q) => [...q, quote]);
                setPage("history");
              }}
            />
          )}
          {page === "history" && <QuoteHistory quotes={visibleQuotes} />}
          {page === "admin" && role === "admin" && (
            <Admin supplier={adminSupplier} supplierId={adminSupplierId} setSupplierId={setAdminSupplierId} />
          )}
        </section>
      </div>

      <footer className="footer">Indicative finance figures only. Subject to credit approval. Payments exclude VAT.</footer>
    </main>
  );
}

function Login({ onLogin }: { onLogin: (role: Role, supplierId: string) => void }) {
  const [choice, setChoice] = useState("cps");
  return (
    <main className="loginWrap">
      <div className="brandBlock">
        <div className="eyebrow">PREMIER LEASING &amp; FINANCE</div>
        <h1>Supplier Portal</h1>
        <p>Secure supplier finance quotations</p>
      </div>
      <div className="card loginCard">
        <h2>Sign in</h2>
        <label>Demo account</label>
        <select value={choice} onChange={(e) => setChoice(e.target.value)}>
          <option value="cps">Crime Prevention Services Ltd</option>
          <option value="demo-coffee">Demo Coffee Supplier</option>
          <option value="demo-garage">Demo Garage Equipment Supplier</option>
          <option value="admin">Premier Admin</option>
        </select>
        <label>Email</label>
        <input defaultValue="supplier@example.co.uk" />
        <label>Password</label>
        <input type="password" defaultValue="demo123" />
        <button className="button primary full" onClick={() => onLogin(choice === "admin" ? "admin" : "supplier", choice === "admin" ? "cps" : choice)}>Sign in to Portal</button>
        <div className="note">Prototype login only. Production authentication will be added with the database.</div>
      </div>
    </main>
  );
}

function Dashboard({ role, supplier, quotes, onNewQuote }: { role: Role; supplier: Supplier; quotes: Quote[]; onNewQuote: () => void }) {
  const total = quotes.reduce((sum, q) => sum + q.cost, 0);
  return (
    <>
      <div className="card welcome">
        <div>
          <div className="muted">Welcome</div>
          <h2>{role === "admin" ? "Premier Administration" : supplier.name}</h2>
          <p>{role === "admin" ? "Manage suppliers, rate cards and finance quotations from one place." : `Your active rate card is ${supplier.rateCard}.`}</p>
        </div>
        <span className="pill">{role === "admin" ? "Admin access" : "Supplier access"}</span>
      </div>
      <div className="kpiGrid">
        <Kpi label="Quotes" value={String(quotes.length)} />
        <Kpi label="Quoted value" value={money(total)} />
        <Kpi label="Available terms" value={String(supplier.options.length)} />
      </div>
      <div className="card">
        <div className="sectionHead"><h2>Recent quotes</h2><button className="button primary" onClick={onNewQuote}>New Quote</button></div>
        <QuoteTable quotes={[...quotes].reverse().slice(0, 5)} />
      </div>
    </>
  );
}

function Calculator({ role, supplierId, setSupplierId, cost, setCost }: { role: Role; supplierId: string; setSupplierId: (id: string) => void; cost: number; setCost: (n: number) => void }) {
  const supplier = suppliers.find((s) => s.id === supplierId) ?? suppliers[0];
  const valid = cost >= supplier.minValue && cost <= supplier.maxValue;
  return (
    <>
      <div className="card formGrid">
        <div><label>Equipment cost — excluding VAT</label><input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} /></div>
        <div><label>Supplier / Rate Card</label><select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} disabled={role !== "admin"}>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
        <div className="wide muted">Rate card: {supplier.rateCard} • Finance range {money(supplier.minValue)} – {money(supplier.maxValue)}</div>
      </div>
      {!valid && <div className="warning">Enter an equipment value within the permitted finance range.</div>}
      <div className="optionGrid">
        {valid && supplier.options.map((o) => {
          const p = paymentFor(cost, o);
          const monthly = o.frequency === "Monthly" ? p : p / 3;
          const weekly = o.frequency === "Monthly" ? p / 4.333 : p / 13;
          return <div className="card optionCard" key={o.id}>
            <h3>{o.termLabel}</h3><div className="muted">{o.profile}</div>
            <div className="smallLabel">{o.frequency} payment</div><div className="bigMoney">{money(p)}</div>
            <div className="miniGrid"><div><span>Monthly equiv.</span><strong>{money(monthly)}</strong></div><div><span>Weekly equiv.</span><strong>{money(weekly)}</strong></div></div>
          </div>;
        })}
      </div>
    </>
  );
}

function CreateQuote({ supplier, onSave }: { supplier: Supplier; onSave: (q: Quote) => void }) {
  const [customer, setCustomer] = useState("");
  const [equipment, setEquipment] = useState("");
  const [cost, setCost] = useState(25000);
  const [optionId, setOptionId] = useState(supplier.options[0]?.id ?? "");
  const [preview, setPreview] = useState(false);
  const option = supplier.options.find((o) => o.id === optionId) ?? supplier.options[0];
  const valid = !!customer && !!option && cost >= supplier.minValue && cost <= supplier.maxValue;
  const payment = option ? paymentFor(cost, option) : 0;
  return <div className="twoCol">
    <div className="card">
      <h2>Customer &amp; equipment</h2>
      <label>Customer name</label><input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Customer company name" />
      <label>Equipment description</label><textarea value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder="e.g. CCTV system, installation and commissioning" />
      <label>Equipment cost — excluding VAT</label><input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
      <label>Finance option</label><select value={optionId} onChange={(e) => setOptionId(e.target.value)}>{supplier.options.map((o) => <option key={o.id} value={o.id}>{o.termLabel} — {o.profile}</option>)}</select>
      <button className="button primary full" onClick={() => setPreview(true)} disabled={!valid}>Preview Customer Quote</button>
    </div>
    <div className="card">
      <h2>Customer quote preview</h2>
      {!preview ? <div className="note">Complete the details to generate an indicative finance illustration.</div> : <div className="quotePreview">
        <div className="eyebrow">PREMIER LEASING &amp; FINANCE</div>
        <h2>Finance Illustration</h2>
        <p><span>Supplier:</span> {supplier.name}</p><p><span>Customer:</span> {customer}</p><p><span>Equipment:</span> {equipment || "—"}</p><p><span>Equipment value:</span> <strong>{money(cost)}</strong></p>
        <hr />
        <h3>{option.termLabel} — {option.profile}</h3>
        <div className="bigMoney">{money(payment)}</div><div className="muted">{option.frequency.toLowerCase()} payment</div>
      </div>}
      <button className="button primary full" disabled={!preview || !valid} onClick={() => onSave({ id: `PQ-${String(Date.now()).slice(-6)}`, supplierId: supplier.id, customer, equipment, cost, optionId: option.id, payment, created: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) })}>Save Quote</button>
    </div>
  </div>;
}

function QuoteHistory({ quotes }: { quotes: Quote[] }) {
  const [search, setSearch] = useState("");
  const filtered = quotes.filter((q) => `${q.id} ${q.customer} ${q.equipment}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="card"><div className="sectionHead"><h2>Quote History</h2><input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search quotes…" /></div><QuoteTable quotes={[...filtered].reverse()} /></div>;
}

function Admin({ supplier, supplierId, setSupplierId }: { supplier: Supplier; supplierId: string; setSupplierId: (id: string) => void }) {
  return <div className="twoCol adminGrid">
    <div className="card"><h2>Suppliers</h2><div className="supplierList">{suppliers.map((s) => <button key={s.id} className={`supplierRow ${supplierId === s.id ? "selected" : ""}`} onClick={() => setSupplierId(s.id)}><strong>{s.name}</strong><span>{s.rateCard} • {s.options.length} options</span></button>)}</div></div>
    <div className="card"><h2>Rate Card Management</h2><p className="muted">{supplier.name} — {supplier.rateCard}</p><div className="tableWrap"><table><thead><tr><th>Term</th><th>Profile</th><th>Frequency</th><th>Rate factor</th></tr></thead><tbody>{supplier.options.map((o) => <tr key={o.id}><td><strong>{o.termLabel}</strong></td><td>{o.profile}</td><td>{o.frequency}</td><td>{o.factor.toFixed(2)}</td></tr>)}</tbody></table></div><div className="note">Prototype only. Production rate cards will be stored server-side with version history and supplier permissions.</div></div>
  </div>;
}

function QuoteTable({ quotes }: { quotes: Quote[] }) {
  if (!quotes.length) return <div className="note">No quotes yet.</div>;
  return <div className="tableWrap"><table><thead><tr><th>Quote</th><th>Customer</th><th>Equipment value</th><th>Payment</th><th>Date</th></tr></thead><tbody>{quotes.map((q) => <tr key={q.id}><td><strong>{q.id}</strong></td><td>{q.customer}</td><td>{money(q.cost)}</td><td><strong>{money(q.payment)}</strong></td><td>{q.created}</td></tr>)}</tbody></table></div>;
}

function Nav({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button className={`navButton ${active ? "active" : ""}`} onClick={onClick}>{children}</button>; }
function Kpi({ label, value }: { label: string; value: string }) { return <div className="card"><div className="muted">{label}</div><div className="kpi">{value}</div></div>; }
function titleFor(page: Page) { return ({ dashboard: "Dashboard", calculator: "Finance Calculator", newquote: "Create Customer Quote", history: "Quote History", admin: "Premier Admin" })[page]; }
