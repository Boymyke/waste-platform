import Link from 'next/link';
import { BarChart3, Bell, CircleDollarSign, ClipboardList, CreditCard, LayoutDashboard, LifeBuoy, MapPin, MessageSquareText, PackageCheck, Recycle, Search, Settings, ShieldCheck, Truck, Users, WalletCards } from 'lucide-react';

const pickups = [
  ['PK-1048','Mixed recyclables','Lekki Phase 1','Scheduled'],
  ['PK-1047','Plastic & cans','Yaba','Assigned'],
  ['PK-1046','Household waste','Ikoyi','Completed'],
];

export default function Dashboard(){
  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brandmark"><Recycle size={20}/></div><span>WasteOS</span></div>
      <div style={{position:'relative'}}><Search size={15} style={{position:'absolute',left:12,top:12,color:'#879087'}}/><input className="search" placeholder="     Search"/></div>
      <div className="nav-title">Main menu</div>
      <nav className="nav">
        <a className="active" href="#"><LayoutDashboard size={18}/><span>Dashboard</span></a>
        <a href="#"><BarChart3 size={18}/><span>Analytics</span></a>
        <a href="#"><ClipboardList size={18}/><span>Pickups</span></a>
        <a href="#"><Truck size={18}/><span>Collectors</span></a>
        <a href="#"><Users size={18}/><span>Customers</span></a>
      </nav>
      <div className="nav-title">Operations</div>
      <nav className="nav">
        <a href="#"><MapPin size={18}/><span>Service areas</span></a>
        <a href="#"><CreditCard size={18}/><span>Payments</span></a>
        <a href="#"><MessageSquareText size={18}/><span>Support</span></a>
        <a href="#"><ShieldCheck size={18}/><span>Admin access</span></a>
      </nav>
      <div className="nav-title">General</div>
      <nav className="nav">
        <a href="#"><Settings size={18}/><span>Settings</span></a><a href="#"><LifeBuoy size={18}/><span>Help desk</span></a>
      </nav>
      <div className="sidebar-bottom"><div className="upgrade"><strong>Cleaner cities. Smarter ops.</strong><p>Track pickup demand, collectors and waste recovery in one place.</p><button className="btn">View impact</button></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumbs">WasteOS &nbsp;›&nbsp; Dashboard</div><div className="top-actions"><button className="iconbtn hide-mobile"><Bell size={18}/></button><div className="avatar">SM</div><Link href="/login" className="btn" style={{textDecoration:'none'}}>Open app</Link></div></header>
      <div className="section-head"><div><h1>Overview</h1><div className="muted">Here is the summary of your waste operations</div></div><span className="role-chip"><ShieldCheck size={14}/> Super Admin</span></div>
      <section className="cards">
        <div className="card stat primary"><div className="stat-top"><div className="stat-icon"><CircleDollarSign size={20}/></div><span>•••</span></div><p>Revenue this month</p><h3>₦2,450,000</h3><p>+18.6% from last month</p></div>
        <div className="card stat"><div className="stat-top"><div className="stat-icon"><PackageCheck size={20}/></div><span>•••</span></div><p>Completed pickups</p><h3>1,284</h3><p>94.2% completion rate</p></div>
        <div className="card stat"><div className="stat-top"><div className="stat-icon"><Recycle size={20}/></div><span>•••</span></div><p>Waste recovered</p><h3>38.6 t</h3><p>12.4 t sent to recycling</p></div>
      </section>
      <section className="grid2">
        <div className="card"><div className="table-head"><div><strong>Operations</strong><div className="muted">Today at a glance</div></div><button className="btn">+ New pickup</button></div><div className="wallet-grid"><div className="mini"><Truck size={20}/><strong>42 active</strong><div className="status">Collectors online</div></div><div className="mini"><ClipboardList size={20}/><strong>67 pending</strong><div className="status">Pickup requests</div></div><div className="mini"><Users size={20}/><strong>3,842</strong><div className="status">Verified users</div></div><div className="mini"><WalletCards size={20}/><strong>₦684k</strong><div className="status">Collector payouts</div></div></div><div className="pickup-list">{pickups.map(([id,type,area,status])=><div className="pickup" key={id}><div className="badge"><Recycle size={19}/></div><div><strong>{type}</strong><small>{id} · {area}</small></div><span className="pill">{status}</span></div>)}</div></div>
        <div className="card"><div className="table-head"><div><strong>Pickup volume</strong><div className="muted">Requests completed this week</div></div><span className="pill">Weekly</span></div><div className="chart">{[['Mon',44],['Tue',61],['Wed',53],['Thu',82],['Fri',73],['Sat',91],['Sun',65]].map(([d,h],i)=><div className="barwrap" key={String(d)}><div className={'bar '+(i===5?'active':'')} style={{height:`${h}%`}}></div>{d}</div>)}</div></div>
      </section>
      <section className="card table-card"><div className="table-head"><div><strong>Recent pickups</strong><div className="muted">Latest customer requests and collection status</div></div><Search size={18}/></div><table className="table"><thead><tr><th>Pickup ID</th><th>Customer</th><th>Area</th><th>Collector</th><th>Amount</th><th>Status</th></tr></thead><tbody><tr><td>PK-1048</td><td>Chisom N.</td><td>Lekki</td><td>GreenHaul 04</td><td>₦4,500</td><td><span className="pill">Scheduled</span></td></tr><tr><td>PK-1047</td><td>David A.</td><td>Yaba</td><td>EcoMove 12</td><td>₦3,200</td><td><span className="pill">Assigned</span></td></tr><tr><td>PK-1046</td><td>Sarah T.</td><td>Ikoyi</td><td>GreenHaul 08</td><td>₦6,800</td><td><span className="pill">Completed</span></td></tr></tbody></table></section>
    </main>
  </div>
}
