import { useState } from "react";
import { motion } from "motion/react";
import { 
    LayoutDashboard, Database, Activity, 
    Settings, Users, CreditCard, Bell,
    ArrowUpRight, ArrowDownRight, TrendingUp,
    Zap, Globe, Shield, User as UserIcon, Coins, Key
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip as RechartsTooltip, ResponsiveContainer,
    AreaChart, Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ErrorBoundary from "@/components/error-boundary";

const data = [
    { name: '00:00', requests: 4000, latency: 45, errors: 2 },
    { name: '04:00', requests: 3000, latency: 48, errors: 1 },
    { name: '08:00', requests: 7000, latency: 42, errors: 4 },
    { name: '12:00', requests: 9000, latency: 40, errors: 3 },
    { name: '16:00', requests: 12000, latency: 55, errors: 12 },
    { name: '20:00', requests: 8000, latency: 50, errors: 5 },
    { name: '23:59', requests: 6000, latency: 46, errors: 2 },
];

export default function Dashboard() {
    const { profile, loading } = useUser();
    const [activeTab, setActiveTab] = useState('Overview');

    if (loading) {
        return (
            <div className="pt-24 min-h-screen bg-background p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <Skeleton className="h-12 w-64 rounded-xl" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Skeleton className="h-32 rounded-3xl" />
                        <Skeleton className="h-32 rounded-3xl" />
                        <Skeleton className="h-32 rounded-3xl" />
                        <Skeleton className="h-32 rounded-3xl" />
                    </div>
                    <Skeleton className="h-[400px] rounded-[2.5rem]" />
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="pt-32 min-h-screen bg-background flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Secure Area</h2>
                    <p className="text-muted-foreground mb-8">Please sign in to access your personal developer dashboard and monitor your API integrations.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-background">
            <div className="flex flex-col lg:flex-row">
                {/* Mobile Tab Scroller */}
                <div className="lg:hidden sticky top-20 z-30 bg-background/80 backdrop-blur-xl border-b border-border overflow-x-auto no-scrollbar">
                    <div className="flex px-4 py-2 min-w-max">
                        {[
                            { name: 'Overview', icon: LayoutDashboard },
                            { name: 'API Usage', icon: Activity },
                            { name: 'Subscriptions', icon: Coins },
                            { name: 'Endpoints', icon: Database },
                            { name: 'Billing', icon: CreditCard },
                            { name: 'Settings', icon: Settings },
                        ].map((item) => (
                            <button
                                key={item.name}
                                onClick={() => setActiveTab(item.name)}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                    activeTab === item.name 
                                    ? "text-white" 
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {activeTab === item.name && (
                                    <motion.div 
                                        layoutId="activeTabMobile"
                                        className="absolute inset-0 bg-indigo-500 rounded-full -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <item.icon className="w-3 h-3" />
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="w-64 shrink-0 border-r border-border/40 p-6 hidden lg:block lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-6rem)] lg:overflow-y-auto no-scrollbar">
                    <nav className="space-y-2">
                            {[
                                { name: 'Overview', icon: LayoutDashboard },
                                { name: 'API Usage', icon: Activity },
                                { name: 'Subscriptions', icon: Coins },
                                { name: 'Endpoints', icon: Database },
                                { name: 'Billing', icon: CreditCard },
                                { name: 'Settings', icon: Settings },
                            ].map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => setActiveTab(item.name)}
                                    className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                                        activeTab === item.name 
                                        ? "text-white" 
                                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                                    }`}
                                >
                                    {activeTab === item.name && (
                                        <motion.div 
                                            layoutId="activeTabDesktop"
                                            className="absolute inset-0 bg-indigo-500 rounded-xl -z-10 shadow-lg shadow-indigo-500/20"
                                            transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                                        />
                                    )}
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                </button>
                            ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-grow p-6 lg:p-8 bg-grid min-h-screen">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                            <div className="flex items-center gap-6">
                                <Avatar className="w-20 h-20 border-2 border-indigo-500/50 p-1">
                                    <AvatarImage src={profile.avatarUrl} className="rounded-full" />
                                    <AvatarFallback>{profile.displayName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-4xl font-black tracking-tighter italic uppercase">{profile.displayName.split(' ')[0]} <span className="text-indigo-500">DASHBOARD</span></h1>
                                    <div className="flex items-center gap-3 mt-1">
                                        <Badge className="bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border-none px-3">
                                            {profile.role.toUpperCase()}
                                        </Badge>
                                        <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-black">NODE ID: {profile.uid.slice(0, 8)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Card className="glass border-border py-3 px-6 rounded-2xl flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                        <Coins className="w-4 h-4 text-yellow-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Credits</p>
                                        <p className="font-bold">{profile.points}</p>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {activeTab === 'Overview' && (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                    {[
                                        { title: "API Keys", value: "3 Active", trend: "+1", positive: true, icon: Key },
                                        { title: "Data Ingress", value: "482GB", trend: "+12.5%", positive: true, icon: Zap },
                                        { title: "Uptime Avg", value: "99.98%", trend: "+0.01%", positive: true, icon: Activity },
                                        { title: "Active Subs", value: "12", trend: "+2", positive: true, icon: Coins },
                                    ].map((stat) => (
                                        <Card key={stat.title} className="glass border-border rounded-3xl overflow-hidden group hover:border-indigo-500/30 transition-all">
                                            <CardContent className="p-8">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                                        <stat.icon className="w-5 h-5 text-indigo-500" />
                                                    </div>
                                                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.positive ? "text-green-500" : "text-red-500"}`}>
                                                        {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                        {stat.trend}
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-black tracking-tighter mb-1">{stat.value}</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{stat.title}</div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Charts Area */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                                    <Card className="lg:col-span-8 glass border-border rounded-[2.5rem] p-8">
                                        <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle className="text-xl font-bold tracking-tight uppercase">Request Volume</CardTitle>
                                                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Global Traffic Analysis</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge variant="outline" className="rounded-full font-bold">24H</Badge>
                                                <Badge variant="outline" className="rounded-full opacity-30 font-bold">7D</Badge>
                                            </div>
                                        </CardHeader>
                                        <div className="h-[350px] w-full">
                                            <ErrorBoundary fallback={<div className="h-full w-full bg-foreground/5 rounded-2xl flex items-center justify-center font-mono text-[10px] uppercase tracking-widest">Analytics Module Down</div>}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={data}>
                                                        <defs>
                                                            <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--foreground) / 0.05)" vertical={false} />
                                                        <XAxis dataKey="name" stroke="hsl(var(--foreground) / 0.2)" fontSize={10} tickLine={false} axisLine={false} />
                                                        <YAxis stroke="hsl(var(--foreground) / 0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v/1000}k`} />
                                                        <RechartsTooltip 
                                                            contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                                                        />
                                                        <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </ErrorBoundary>
                                        </div>
                                    </Card>

                                    <Card className="lg:col-span-4 glass border-border rounded-[2.5rem] p-8 flex flex-col justify-between">
                                        <div>
                                            <CardHeader className="p-0 mb-8">
                                                <CardTitle className="text-xl font-bold tracking-tight uppercase">System Health</CardTitle>
                                                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Real-time Node Status</p>
                                            </CardHeader>
                                            <div className="space-y-6">
                                                {[
                                                    { region: 'US East', status: 'Optimal', load: '45%', color: 'green' },
                                                    { region: 'EU West', status: 'Optimal', load: '32%', color: 'green' },
                                                    { region: 'Asia SE', status: 'Warning', load: '89%', color: 'yellow' },
                                                ].map((node) => (
                                                    <div key={node.region} className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full bg-${node.color}-500 animate-pulse`} />
                                                            <span className="text-sm font-bold">{node.region}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-[10px] font-black uppercase text-muted-foreground">{node.status}</span>
                                                            <span className="text-xs font-mono font-bold">{node.load}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-8 border-t border-border">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                                                     <Globe className="w-6 h-6 text-green-500" />
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-sm tracking-tight">Global CDN</h5>
                                                    <p className="text-xs text-muted-foreground">Active in 84 locations</p>
                                                </div>
                                            </div>
                                            <Button className="w-full rounded-2xl glass hover:bg-foreground/5 uppercase font-black text-[10px] tracking-[0.2em] h-12">
                                                Network Map
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            </>
                        )}

                        {activeTab === 'Subscriptions' && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-8">Active <span className="text-indigo-500">Subscriptions</span></h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { name: 'Gemini Pro vision', provider: 'Google AI', tier: 'Pro Plan', price: '₹4067/mo', status: 'Active', renewal: 'May 12, 2026' },
                                        { name: 'Stripe Global Pay', provider: 'Stripe', tier: 'Enterprise', price: '₹16517/mo', status: 'Active', renewal: 'June 01, 2026' },
                                        { name: 'WeatherSphere Pro', provider: 'WeatherSphere', tier: 'Developer', price: '₹1577/mo', status: 'Trial', renewal: 'May 18, 2026' },
                                    ].map((sub) => (
                                        <Card key={sub.name} className="glass border-border p-8 rounded-[2rem] overflow-hidden relative group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-all" />
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold uppercase tracking-tight">{sub.name}</h3>
                                                    <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">{sub.provider}</p>
                                                </div>
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none uppercase text-[8px] font-black tracking-widest">{sub.status}</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-8 mb-8">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Current Tier</p>
                                                    <p className="text-sm font-bold">{sub.tier}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Pricing</p>
                                                    <p className="text-sm font-bold font-mono">{sub.price}</p>
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-border flex justify-between items-center">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase">Renewal: {sub.renewal}</p>
                                                <Button variant="link" className="text-indigo-500 p-0 h-auto text-[10px] uppercase font-black tracking-widest">Manage &rarr;</Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'API Usage' && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Usage <span className="text-indigo-500">Analytics</span></h2>
                                <Card className="glass border-border p-8 rounded-[2.5rem]">
                                    <div className="h-[400px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={data}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--foreground) / 0.05)" vertical={false} />
                                                <XAxis dataKey="name" stroke="hsl(var(--foreground) / 0.2)" fontSize={10} />
                                                <YAxis stroke="hsl(var(--foreground) / 0.2)" fontSize={10} />
                                                <RechartsTooltip 
                                                     contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                                                />
                                                <Line type="monotone" dataKey="latency" stroke="#fbbf24" strokeWidth={3} dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                                <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-8 grid grid-cols-3 gap-8">
                                        <div className="text-center p-6 bg-foreground/5 rounded-2xl">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-2">Avg Latency</p>
                                            <p className="text-2xl font-black tracking-tighter">46.5ms</p>
                                        </div>
                                        <div className="text-center p-6 bg-foreground/5 rounded-2xl">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-2">Error Rate</p>
                                            <p className="text-2xl font-black tracking-tighter text-red-500">0.04%</p>
                                        </div>
                                        <div className="text-center p-6 bg-foreground/5 rounded-2xl">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-2">Success Rate</p>
                                            <p className="text-2xl font-black tracking-tighter text-emerald-500">99.96%</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'Endpoints' && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Deployment <span className="text-indigo-500">Endpoints</span></h2>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Production Nexus', url: 'https://api.apiverse.io/v1/nexus', region: 'Global Edge', auth: 'API Key', status: 'Active' },
                                        { name: 'Staging Environment', url: 'https://staging.apiverse.io/v1/nexus', region: 'US-East-1', auth: 'Bearer Token', status: 'Active' },
                                        { name: 'Internal QA Node', url: 'https://qa-node-04.apiverse.dev', region: 'Private VPC', auth: 'mTLS', status: 'Standby' },
                                    ].map((endpoint) => (
                                        <Card key={endpoint.url} className="glass border-border p-6 rounded-2xl overflow-hidden group">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-bold uppercase tracking-tight">{endpoint.name}</h4>
                                                        <Badge variant="outline" className="text-[8px] tracking-[0.2em] font-black">{endpoint.region}</Badge>
                                                    </div>
                                                    <code className="text-xs text-indigo-400 font-mono bg-indigo-500/5 px-3 py-1 rounded-md">{endpoint.url}</code>
                                                </div>
                                                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                                    <div className="text-right">
                                                        <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Auth Type</p>
                                                        <p className="text-[10px] font-bold uppercase">{endpoint.auth}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground/5 border border-border">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${endpoint.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-yellow-500'} animate-pulse`} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{endpoint.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                    <Button className="w-full h-14 rounded-2xl bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-[10px] mt-4">
                                        Provision New Endpoint
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Billing' && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Financial <span className="text-indigo-500">Settlements</span></h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card className="glass border-border p-8 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-transparent">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Account Balance</p>
                                        <h3 className="text-4xl font-black tracking-tighter mb-6">₹69927.50</h3>
                                        <Button className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-xl uppercase font-black text-[10px] tracking-widest h-12 shadow-lg shadow-indigo-500/20">
                                            Top Up Credits
                                        </Button>
                                    </Card>
                                    <Card className="glass border-border p-8 rounded-[2rem] md:col-span-2">
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Payment Methods</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-xl border border-border">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-[10px] font-bold text-white">VISA</div>
                                                    <div>
                                                        <p className="text-xs font-bold font-mono">•••• •••• •••• 4242</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-black">EXP: 12/28</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-indigo-500 text-white border-none text-[8px] font-black">DEFAULT</Badge>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                <Card className="glass border-border rounded-[2rem] overflow-hidden">
                                     <div className="p-8 border-b border-border">
                                         <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Invoicing History</h4>
                                     </div>
                                     <div className="overflow-x-auto">
                                         <table className="w-full text-left">
                                             <thead className="bg-foreground/5 border-b border-border">
                                                 <tr>
                                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Invoice ID</th>
                                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Action</th>
                                                 </tr>
                                             </thead>
                                             <tbody className="divide-y divide-border/40">
                                                 {[
                                                     { id: 'INV-2026-004', date: 'May 01, 2026', amount: '₹10292.00', status: 'Paid' },
                                                     { id: 'INV-2026-003', date: 'Apr 01, 2026', amount: '₹7428.50', status: 'Paid' },
                                                     { id: 'INV-2026-002', date: 'Mar 01, 2026', amount: '₹19928.30', status: 'Paid' },
                                                 ].map(inv => (
                                                     <tr key={inv.id} className="hover:bg-foreground/[0.02] transition-colors">
                                                         <td className="px-8 py-4 text-xs font-mono font-bold">{inv.id}</td>
                                                         <td className="px-8 py-4 text-xs text-muted-foreground font-bold">{inv.date}</td>
                                                         <td className="px-8 py-4 text-xs font-black">{inv.amount}</td>
                                                         <td className="px-8 py-4">
                                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black">{inv.status}</Badge>
                                                         </td>
                                                         <td className="px-8 py-4 text-right underline text-[10px] font-black text-indigo-500 cursor-pointer">DOWNLOAD</td>
                                                     </tr>
                                                 ))}
                                             </tbody>
                                         </table>
                                     </div>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'Settings' && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Node <span className="text-indigo-500">Configuration</span></h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <Card className="glass border-border p-8 rounded-[2rem]">
                                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Profile Settings</h4>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-2">Public Identity</label>
                                                    <input 
                                                        className="w-full h-12 bg-foreground/5 border border-border rounded-xl px-4 text-sm font-bold focus:ring-1 focus:ring-indigo-500/50 outline-none" 
                                                        defaultValue={profile.displayName}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-2">Email Hook</label>
                                                    <input 
                                                        className="w-full h-12 bg-foreground/5 border border-border rounded-xl px-4 text-sm font-bold text-muted-foreground/50 outline-none" 
                                                        defaultValue="tyagiharsh2627@gmail.com"
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <Button className="w-full mt-8 bg-indigo-500 hover:bg-indigo-600 rounded-xl uppercase font-black text-[10px] tracking-widest h-12">
                                                Commit Changes
                                            </Button>
                                        </Card>
                                    </div>

                                    <div className="space-y-6">
                                        <Card className="glass border-border p-8 rounded-[2rem]">
                                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">System Preferences</h4>
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-black uppercase tracking-tight">Email Notifications</p>
                                                        <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">Usage alerts & billing</p>
                                                    </div>
                                                    <div className="w-10 h-5 bg-indigo-500 rounded-full flex items-center px-1">
                                                        <div className="w-3 h-3 bg-white rounded-full translate-x-5" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-black uppercase tracking-tight">Two-Factor Auth</p>
                                                        <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">mTLS + biometric verify</p>
                                                    </div>
                                                    <div className="w-10 h-5 bg-foreground/10 rounded-full flex items-center px-1">
                                                        <div className="w-3 h-3 bg-white/20 rounded-full" />
                                                    </div>
                                                </div>
                                                 <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-black uppercase tracking-tight text-red-500">Danger Zone</p>
                                                        <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">Terminate profile & purge records</p>
                                                    </div>
                                                    <Button variant="ghost" className="text-red-500 uppercase text-[8px] font-black tracking-widest h-8">Delete Node</Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
