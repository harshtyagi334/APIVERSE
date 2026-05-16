import { motion } from "motion/react";
import { Check, Zap, Rocket, Building, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      icon: Zap,
      price: "₹0",
      description: "For individual developers exploring APIs.",
      features: [
        "1,000 API calls / month",
        "Community support",
        "Public playground access",
        "Basic documentation",
        "AI endpoint summaries"
      ],
      color: "indigo"
    },
    {
      name: "Pro Developer",
      icon: Rocket,
      price: "₹2407",
      period: "/ mo",
      description: "For professional developers building apps.",
      features: [
        "50,000 API calls / month",
        "Priority support",
        "AI SDK Generator",
        "Advanced API monitoring",
        "Private test collections",
        "Premium tutorials"
      ],
      color: "purple",
      featured: true
    },
    {
      name: "Enterprise",
      icon: Building,
      price: "Custom",
      description: "For scaling organizations and teams.",
      features: [
        "Unlimited API calls",
        "Dedicated account manager",
        "Custom AI model training",
        "On-premise deployment",
        "SLA guarantee",
        "Advanced audit trails"
      ],
      color: "cyan"
    }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-grid">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 uppercase tracking-widest"
          >
            Pricing & Plans
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-tight italic">
            CHOOSE YOUR <span className="text-indigo-500">POWER</span>
          </h1>
          <p className="text-muted-foreground text-xl">
            Scale your API intelligence with plans designed for every stage of development.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 border-none px-4 py-1 rounded-full uppercase tracking-widest text-[10px] font-black">
                    Most Popular
                  </Badge>
                </div>
              )}
              <Card className={`h-full flex flex-col justify-between glass border-border rounded-[2.5rem] overflow-hidden transition-all hover:border-indigo-500/30 ${plan.featured ? 'ring-2 ring-indigo-500/20 border-indigo-500/30' : ''}`}>
                <CardHeader className="p-10 pb-0">
                  <div className={`w-14 h-14 rounded-2xl bg-${plan.color}-500/10 flex items-center justify-center mb-6`}>
                    <plan.icon className={`w-8 h-8 text-${plan.color === 'indigo' ? 'indigo' : plan.color === 'purple' ? 'purple' : 'cyan'}-500`} />
                  </div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tight mb-2">{plan.name}</CardTitle>
                  <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                    <span className="text-muted-foreground font-semibold">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-10 pt-0 flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                           <Check className="w-3 h-3 text-indigo-500" />
                        </div>
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-10 pt-0">
                  <Button className={`w-full rounded-2xl py-8 text-lg font-bold uppercase tracking-widest transition-all ${
                    plan.featured ? 'bg-indigo-500 hover:bg-indigo-600 shadow-xl shadow-indigo-500/20' : 'glass bg-foreground/5 hover:bg-foreground/10 border-border'
                  }`}>
                    {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Security / Trust */}
        <div className="p-12 md:p-16 rounded-[4rem] glass-premium border-border text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="relative z-10">
                <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-8" />
                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">SECURE TRANSACTIONS</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-12 text-lg">
                    We use Stripe for all payments. All subscriptions include localized billing and 24/7 security monitoring. Managed by our enterprise-grade security team.
                </p>
                <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
                    {['STRIPE', 'RAZORPAY', 'PAYPAL', 'VISA', 'MASTERCARD'].map(b => (
                        <span key={b} className="text-xl font-black tracking-widest">{b}</span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
