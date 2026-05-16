import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowLeft, Book, Code, Terminal, Play, 
  ChevronRight, Database, Globe, Copy, 
  Check, Info, AlertTriangle, Cpu, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAPI } from "@/hooks/useAPI";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";

export default function Documentation() {
  const { apiId } = useParams();
  const { api, loading } = useAPI(apiId);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-background">
        <div className="border-b border-border bg-background/50 backdrop-blur-md sticky top-20 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-6 w-48" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 flex gap-12">
          <aside className="w-64 hidden lg:block space-y-8">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </aside>
          <main className="flex-grow max-w-4xl space-y-8">
             <Skeleton className="h-12 w-3/4 rounded-xl" />
             <Skeleton className="h-24 w-full rounded-xl" />
             <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-40 rounded-[2rem]" />
                <Skeleton className="h-40 rounded-[2rem]" />
             </div>
             <Skeleton className="h-[400px] rounded-[2.5rem]" />
          </main>
        </div>
      </div>
    );
  }

  if (!api) {
    return (
      <div className="pt-32 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Protocol Not Found</h2>
          <p className="text-muted-foreground mb-8">The requested protocol identity could not be verified in the nexus.</p>
          <Link to="/marketplace">
            <Button className="rounded-full bg-indigo-500 hover:bg-indigo-600 px-8 h-12 uppercase font-black tracking-widest text-[10px]">
              Return to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const codeExamples: Record<string, string> = {
    javascript: `fetch('${api.baseUrl}${api.endpoints[0]?.path || "/v1/data"}', {
  method: '${api.endpoints[0]?.method || "GET"}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,
    python: `import requests

url = "${api.baseUrl}${api.endpoints[0]?.path || "/v1/data"}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.request("${api.endpoints[0]?.method || "GET"}", url, headers=headers)
print(response.json())`,
    curl: `curl --request ${api.endpoints[0]?.method || "GET"} \\
  --url ${api.baseUrl}${api.endpoints[0]?.path || "/v1/data"} \\
  --header 'Authorization: Bearer YOUR_API_KEY' \\
  --header 'Content-Type: application/json'`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[selectedLanguage]);
    setCopied(true);
    toast.success("Code snippet copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="border-b border-border bg-background/50 backdrop-blur-md sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/marketplace">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-3">
               <img src={api.icon} alt="" className="w-8 h-8 rounded-lg" />
               <h1 className="text-xl font-bold tracking-tight">{api.name} <span className="text-muted-foreground font-medium ml-2">v2.0.0</span></h1>
            </div>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="rounded-full gap-2 transition-all hover:bg-indigo-500/10 hover:border-indigo-500/50">
                <Code className="w-4 h-4" />
                SDKs
             </Button>
             <Link to="/playground">
               <Button className="rounded-full gap-2 bg-indigo-500 hover:bg-indigo-600">
                  <Play className="w-4 h-4" />
                  Try it Live
               </Button>
             </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block">
           <div className="sticky top-40 space-y-8">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-4 px-2">Introduction</h4>
                <ul className="space-y-1">
                  {["Overview", "Authentication", "Rate Limits", "Errors"].map(item => (
                    <li key={item}>
                      <button className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:bg-foreground/5 text-muted-foreground hover:text-foreground">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-4 px-2">Endpoints</h4>
                <ul className="space-y-1">
                  {api.endpoints.map(ep => (
                    <li key={ep.id}>
                      <button className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all bg-foreground/5 text-foreground font-medium flex items-center gap-2">
                        <Badge className="bg-green-500/20 text-green-400 border-none text-[8px] px-1 py-0">{ep.method}</Badge>
                        <span className="truncate">{ep.path}</span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:bg-foreground/5 text-muted-foreground hover:text-foreground italic">
                      + 12 more endpoints
                    </button>
                  </li>
                </ul>
              </div>
           </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow max-w-4xl">
           <section className="mb-16">
              <h2 className="text-4xl font-black mb-6 tracking-tight stagger-text">Quickstart Guide</h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Connect your application to {api.name} in minutes. Follow our step-by-step guide to authenticate and make your first request.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                 <div className="p-6 rounded-3xl glass border-white/5 flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                        <Shield className="text-indigo-400 w-6 h-6" />
                    </div>
                    <h5 className="font-bold">Authentication</h5>
                    <p className="text-sm text-muted-foreground">Learn how to securely authenticate your requests using API keys or OAuth2.</p>
                    <Link to="#" className="text-indigo-500 text-xs font-bold hover:underline flex items-center">
                       Setup Auth <ChevronRight className="w-3 h-3" />
                    </Link>
                 </div>
                 <div className="p-6 rounded-3xl glass border-white/5 flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                        <Terminal className="text-purple-400 w-6 h-6" />
                    </div>
                    <h5 className="font-bold">Error Handling</h5>
                    <p className="text-sm text-muted-foreground">Understand response codes and how to handle edge cases in your code.</p>
                    <Link to="#" className="text-purple-500 text-xs font-bold hover:underline flex items-center">
                       Read Guide <ChevronRight className="w-3 h-3" />
                    </Link>
                 </div>
              </div>

              <div className="mb-12">
                <Tabs defaultValue="javascript" className="w-full" onValueChange={setSelectedLanguage}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold tracking-tight">Code Examples</h3>
                    <TabsList className="glass border-white/5 bg-background/50 h-9 p-1">
                      <TabsTrigger value="javascript" className="text-[10px] uppercase font-bold px-4 h-7">JS</TabsTrigger>
                      <TabsTrigger value="python" className="text-[10px] uppercase font-bold px-4 h-7">Python</TabsTrigger>
                      <TabsTrigger value="curl" className="text-[10px] uppercase font-bold px-4 h-7">cURL</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute top-4 right-4 z-10">
                      <Button variant="ghost" size="sm" className="glass bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase" onClick={handleCopy}>
                        {copied ? <Check className="w-3 h-3 mr-2 text-green-500" /> : <Copy className="w-3 h-3 mr-2" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <div className="rounded-[2.5rem] overflow-hidden border border-white/5 h-[350px] shadow-2xl">
                      <Editor
                        height="100%"
                        language={selectedLanguage === 'curl' ? 'shell' : selectedLanguage}
                        theme="vs-dark"
                        value={codeExamples[selectedLanguage]}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 14,
                          padding: { top: 30, bottom: 20 },
                          scrollBeyondLastLine: false,
                          lineNumbers: "on",
                          renderLineHighlight: "none",
                        }}
                      />
                    </div>
                  </div>
                </Tabs>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 flex gap-4">
                  <Info className="text-indigo-500 w-6 h-6 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm mb-2 italic">Pro Tip from APIVerse AI</h4>
                    <p className="text-sm text-indigo-200/70">
                      You can use our global SDK generator to create typesafe clients for this API in TypeScript, Go, and Rust. 
                      <Link to="#" className="text-indigo-400 font-bold ml-1 hover:underline">Try SDK Generator →</Link>
                    </p>
                  </div>
                </div>
              </div>
           </section>

           <section className="pt-12 border-t border-border/40">
              <h2 className="text-3xl font-black mb-8 tracking-tight">Endpoint Reference</h2>
              {api.endpoints.map(ep => (
                <div key={ep.id} className="mb-12 last:mb-0">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-green-500/20 text-green-400 border-none font-black text-sm px-3 py-1">{ep.method}</Badge>
                    <code className="text-xl font-mono font-bold tracking-tight text-foreground/80">{ep.path}</code>
                  </div>
                  <p className="text-muted-foreground mb-8">{ep.description}</p>
                  
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-6">Response Schema</h4>
                  <div className="glass rounded-3xl p-6 border-white/5 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                       <thead className="text-muted-foreground border-b border-white/5">
                          <tr>
                            <th className="pb-4 font-semibold uppercase tracking-widest text-[10px]">Field</th>
                            <th className="pb-4 font-semibold uppercase tracking-widest text-[10px]">Type</th>
                            <th className="pb-4 font-semibold uppercase tracking-widest text-[10px]">Description</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {[
                            { name: "id", type: "string", desc: "Unique identifier for the resource" },
                            { name: "status", type: "enum", desc: "Current status of the operation (pending, completed, failed)" },
                            { name: "created_at", type: "timestamp", desc: "ISO 8601 formatted timestamp" }
                          ].map(field => (
                            <tr key={field.name} className="group">
                              <td className="py-4 font-mono text-indigo-400 font-bold">{field.name}</td>
                              <td className="py-4 text-xs font-medium text-muted-foreground">{field.type}</td>
                              <td className="py-4 text-muted-foreground">{field.desc}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
                </div>
              ))}
           </section>

           <section className="pt-12 border-t border-border/40">
              <div className="p-8 rounded-3xl bg-indigo-500/5 border border-indigo-500/20">
                <h2 className="text-3xl font-black mb-6 tracking-tight">Theoretical Overview</h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">What does {api.name} do?</h3>
                    <p>{api.description} This powerful protocol operates within the {api.category} ecosystem, delivering enterprise-grade performance with an average latency of {api.latency}ms.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Key Use Cases</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Automated integration workflows and dynamic data synchronization.</li>
                      <li>High-throughput data pipelines relying on robust infrastructure.</li>
                      <li>Building scalable applications requiring {api.tags[0]} features.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Integration Examples</h3>
                    <p>Developers typically integrate {api.name} into backend microservices or edge functions. With our provided SDKs, establishing a connection takes just a few lines of code. For instance, Node.js applications can utilize the npm package to handle token rotation and exponential backoff automatically.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Rate Limits and Error Handling</h3>
                    <p>The standard {api.pricing} tier provides a baseline limit of 1000 requests per minute. Errors are returned in standard JSON format, adhering to RESTful conventions. An HTTP 429 response will be issued if limits are exceeded, containing a <code>Retry-After</code> header.</p>
                  </div>
                </div>
              </div>
           </section>
        </main>
      </div>
    </div>
  );
}
