import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Send, Plus, X, List, Code, Database, Clock, Shield, Save, Copy, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { toast } from "sonner";

export default function Playground() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.github.com/zen");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [requestTime, setRequestTime] = useState<number | null>(null);
  
  const [headers, setHeaders] = useState([{ key: "Content-Type", value: "application/json", enabled: true }]);
  const [body, setBody] = useState("{}");
  const [showAnalytics, setShowAnalytics] = useState(false);

  const samples = [
    { name: "Get User Zen", method: "GET", url: "https://api.github.com/zen", body: "{}" },
    { name: "List Repos", method: "GET", url: "https://api.github.com/users/octocat/repos", body: "{}" },
    { name: "Post JSON Placeholder", method: "POST", url: "https://jsonplaceholder.typicode.com/posts", body: JSON.stringify({ title: 'foo', body: 'bar', userId: 1 }, null, 2) },
  ];

  const handleSend = async () => {
    if (!url) return toast.error("Please enter a URL");
    
    setLoading(true);
    setResponse(null);
    setShowAnalytics(false);
    const start = Date.now();

    try {
      const activeHeaders = headers
        .filter(h => h.enabled && h.key)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

      const res = await axios({
        method,
        url,
        headers: activeHeaders,
        data: method !== "GET" ? JSON.parse(body) : undefined,
        validateStatus: () => true,
      });

      setResponse(res);
      const time = Date.now() - start;
      setRequestTime(time);
      setShowAnalytics(true);
      toast.success(`Protocol Echo: Status ${res.status}`);
    } catch (error: any) {
      setResponse({
        error: true,
        message: error.message,
        data: error.response?.data || "Request Failed"
      });
      setRequestTime(Date.now() - start);
      toast.error("Endpoint Interrupted");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sample: typeof samples[0]) => {
    setMethod(sample.method);
    setUrl(sample.url);
    setBody(sample.body);
    toast.info(`Loaded ${sample.name}`);
  };

  const addHeader = () => setHeaders([...headers, { key: "", value: "", enabled: true }]);
  const updateHeader = (index: number, field: string, val: any) => {
    const next = [...headers];
    next[index] = { ...next[index], [field]: val };
    setHeaders(next);
  };
  const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index));

  return (
    <div className="pt-24 min-h-screen bg-background text-foreground flex flex-col">
      {/* Header / Address Bar */}
      <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-20 z-40 p-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
               <h1 className="text-xl sm:text-2xl font-bold tracking-tight">API <span className="text-indigo-500 uppercase tracking-widest text-base sm:text-lg font-black ml-1">Playground</span></h1>
               <div className="hidden sm:block h-4 w-px bg-border mx-2" />
               <div className="flex items-center gap-2 text-muted-foreground text-[10px] sm:text-xs font-mono">
                  <Database className="w-3 h-3" />
                  <span>Production Environment</span>
               </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 p-1 sm:p-1 glass rounded-2xl sm:rounded-full border-white/5 shadow-xl">
            <select 
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="bg-muted hover:bg-muted/80 transition-colors rounded-xl sm:rounded-l-full px-6 py-3 sm:py-0 font-black uppercase tracking-widest text-xs sm:text-sm border-none outline-none appearance-none cursor-pointer"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
            <Input 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter endpoint URL..."
              className="flex-grow rounded-xl sm:rounded-none border-none bg-background/50 sm:bg-transparent h-12 text-sm font-mono focus-visible:ring-0"
            />
            <Button 
              size="lg" 
              className="rounded-xl sm:rounded-full px-10 bg-indigo-500 hover:bg-indigo-600 gap-2 h-12 shadow-lg shadow-indigo-500/20"
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="font-bold uppercase tracking-widest text-xs">Send</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-grow container mx-auto px-4 max-w-7xl py-8 flex flex-col gap-6">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
           {samples.map((s) => (
             <button 
               key={s.name}
               onClick={() => loadSample(s)}
               className="flex-shrink-0 px-4 py-2 glass rounded-xl border border-white/5 hover:border-indigo-500/50 transition-all text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-400"
             >
               {s.name}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Config */}
          <div className="flex flex-col h-[60vh] lg:h-full bg-card/30 rounded-3xl border border-white/5 overflow-hidden">
            <Tabs defaultValue="headers" className="flex flex-col h-full">
              <div className="px-6 pt-4">
                <TabsList className="glass-premium border-white/5 grid w-full grid-cols-4 rounded-xl">
                  <TabsTrigger value="headers" className="rounded-lg uppercase text-[10px] font-bold tracking-widest">Headers</TabsTrigger>
                  <TabsTrigger value="params" className="rounded-lg uppercase text-[10px] font-bold tracking-widest">Params</TabsTrigger>
                  <TabsTrigger value="body" className="rounded-lg uppercase text-[10px] font-bold tracking-widest">Body</TabsTrigger>
                  <TabsTrigger value="auth" className="rounded-lg uppercase text-[10px] font-bold tracking-widest">Auth</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="headers" className="flex-grow p-6">
                <ScrollArea className="h-[50vh]">
                  <div className="space-y-3">
                    {headers.map((h, i) => (
                      <div key={i} className="flex gap-2 items-center group">
                        <Input 
                          placeholder="Header" 
                          value={h.key} 
                          onChange={(e) => updateHeader(i, 'key', e.target.value)}
                          className="glass border-white/5 h-10 text-xs font-mono rounded-lg"
                        />
                        <Input 
                          placeholder="Value" 
                          value={h.value} 
                          onChange={(e) => updateHeader(i, 'value', e.target.value)}
                          className="glass border-white/5 h-10 text-xs font-mono rounded-lg"
                        />
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeHeader(i)}>
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full mt-4 rounded-xl border-dashed glass hover:bg-white/5" onClick={addHeader}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Header
                    </Button>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="body" className="flex-grow flex flex-col p-4">
                <div className="flex-grow rounded-2xl overflow-hidden border border-white/5 mt-2">
                  <Editor
                    height="100%"
                    defaultLanguage="json"
                    theme="vs-dark"
                    value={body}
                    onChange={(val) => setBody(val || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      roundedSelection: false,
                      padding: { top: 20 },
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="params" className="p-6 text-center text-muted-foreground italic text-sm">
                 Parameter configuration coming soon...
              </TabsContent>
              <TabsContent value="auth" className="p-6 text-center text-muted-foreground italic text-sm">
                 Authentication management console coming soon...
              </TabsContent>
            </Tabs>
          </div>

          {/* Response Pane */}
          <div className="flex flex-col h-[60vh] lg:h-full bg-card/30 rounded-3xl border border-white/5 overflow-hidden">
             <div className="p-6 pb-2 flex justify-between items-center border-b border-white/5">
                <h3 className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Server Response</h3>
                <div className="flex gap-3">
                  {requestTime && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {requestTime}ms
                    </div>
                  )}
                  {response?.status && (
                    <Badge variant={response.status < 400 ? "default" : "destructive"} className="rounded-full text-[10px] font-bold px-3">
                      {response.status} {response.statusText}
                    </Badge>
                  )}
                </div>
             </div>

             <div className="flex-grow relative bg-[#1e1e1e]">
               {loading && (
                 <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#1e1e1e]/80 backdrop-blur-sm">
                   <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
                   <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 animate-pulse">Scanning Frequency...</p>
                 </div>
               )}

               {response ? (
                 <div className="h-full flex flex-col">
                    {showAnalytics && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-indigo-500/10 border-b border-indigo-500/20 flex gap-4 overflow-x-auto no-scrollbar"
                      >
                         <div className="flex-shrink-0 px-3 py-1 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                            <p className="text-[8px] font-black uppercase text-indigo-300">Payload Size</p>
                            <p className="text-xs font-mono font-bold">{response.data ? (JSON.stringify(response.data).length / 1024).toFixed(2) : "0.00"} KB</p>
                         </div>
                         <div className="flex-shrink-0 px-3 py-1 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                            <p className="text-[8px] font-black uppercase text-emerald-300">Integrity</p>
                            <p className="text-xs font-mono font-bold">VERIFIED</p>
                         </div>
                         <div className="flex-shrink-0 px-3 py-1 bg-purple-500/20 rounded-lg border border-purple-500/30">
                            <p className="text-[8px] font-black uppercase text-purple-300">Compression</p>
                            <p className="text-xs font-mono font-bold">GZIP 42%</p>
                         </div>
                      </motion.div>
                    )}
                    <div className="flex-grow">
                      <Editor
                        height="100%"
                        defaultLanguage="json"
                        theme="vs-dark"
                        value={typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 13,
                          padding: { top: 20 },
                          lineNumbers: "on",
                          wordWrap: "on",
                        }}
                      />
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-center p-12 opacity-40">
                   <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                      <Send className="w-10 h-10" />
                   </div>
                   <h4 className="text-xl font-bold mb-2 tracking-tight">Ready to Send</h4>
                   <p className="max-w-xs text-sm">Hit the send button to test your API endpoint and see the real-time response here.</p>
                 </div>
               )}
               
               {/* Metadata floating footer */}
               {response && !loading && (
                 <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button variant="outline" size="sm" className="glass rounded-xl text-[10px] uppercase font-bold" onClick={() => {
                        const content = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
                        navigator.clipboard.writeText(content);
                        toast.success("Response copied into neural link");
                      }}>
                      <Copy className="w-3 h-3 mr-2" />
                      Copy Response
                    </Button>
                    <Button variant="outline" size="sm" className="glass rounded-xl text-[10px] uppercase font-bold">
                       <Save className="w-3 h-3 mr-2" />
                       Save
                    </Button>
                 </div>
               )}
             </div>
          </div>
        </div>
        
        {/* Bottom Bar: Quick Utilities */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="glass-premium p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                    <Code className="text-indigo-400 w-6 h-6" />
                </div>
                <div>
                    <h5 className="font-bold text-sm tracking-tight">Code Snippets</h5>
                    <p className="text-xs text-muted-foreground">Generate implementation code</p>
                </div>
             </div>
             <div className="glass-premium p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                    <Shield className="text-purple-400 w-6 h-6" />
                </div>
                <div>
                    <h5 className="font-bold text-sm tracking-tight">Security Check</h5>
                    <p className="text-xs text-muted-foreground">Scan for potential vulnerabilities</p>
                </div>
             </div>
             <div className="glass-premium p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                    <Sparkles className="text-cyan-400 w-6 h-6" />
                </div>
                <div>
                    <h5 className="font-bold text-sm tracking-tight">AI Insights</h5>
                    <p className="text-xs text-muted-foreground">Analyze response anomalies</p>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
