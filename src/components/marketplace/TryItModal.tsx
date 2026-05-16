import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Key, Terminal, Code, Check } from "lucide-react";
import { API } from "@/types";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";

interface TryItModalProps {
  api: API | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TryItModal({ api, isOpen, onClose }: TryItModalProps) {
  const [activeTab, setActiveTab] = useState("request");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  if (!api) return null;

  const handleTest = () => {
    setIsLoading(true);
    setActiveTab("response");
    setTimeout(() => {
      setResponse(api.endpoints?.[0]?.responses?.[0]?.example || '{\n  "success": true,\n  "data": "Mocked response from APIVerse"\n}');
      setIsLoading(false);
      toast.success("API Request Successful");
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setTimeout(() => {
          setResponse(null);
          setActiveTab("request");
        }, 300);
      }
    }}>
      <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-xl border-border/50 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl">
        <DialogHeader className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
              <Play className="w-6 h-6 text-indigo-500 fill-indigo-500" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">Test Protocol</DialogTitle>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">
                {api.name} • {api.endpoints?.[0]?.path || "/v1/data"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-foreground/5 h-12 rounded-xl p-1 mb-6">
            <TabsTrigger value="request" className="rounded-lg text-xs uppercase font-black tracking-widest data-[state=active]:bg-background">
              <Terminal className="w-3 h-3 mr-2" /> Request
            </TabsTrigger>
            <TabsTrigger value="auth" className="rounded-lg text-xs uppercase font-black tracking-widest data-[state=active]:bg-background">
              <Key className="w-3 h-3 mr-2" /> Auth
            </TabsTrigger>
            <TabsTrigger value="response" className="rounded-lg text-xs uppercase font-black tracking-widest data-[state=active]:bg-background">
              <Code className="w-3 h-3 mr-2" /> Response
            </TabsTrigger>
          </TabsList>

          <TabsContent value="request" className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-border bg-black/50 h-[250px]">
              <Editor
                height="100%"
                language="json"
                theme="vs-dark"
                value={'{\n  "query": "test payload",\n  "limit": 10\n}'}
                options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 16 } }}
              />
            </div>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            <div className="p-6 rounded-2xl bg-foreground/5 border border-border h-[250px] flex flex-col justify-center">
              <p className="text-sm font-bold mb-2">Bearer Token Authentication</p>
              <p className="text-xs text-muted-foreground mb-4">You need an active API key to authenticate requests in production.</p>
              <div className="flex gap-2">
                <input type="text" disabled value="sk_test_mockedToken123456789" className="flex-1 bg-background border border-border rounded-xl px-4 text-xs font-mono text-muted-foreground" />
                <Button disabled variant="outline" className="rounded-xl"><Check className="w-4 h-4 mr-2"/> Validated</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="response" className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-border bg-black/50 h-[250px] flex items-center justify-center relative">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4 text-indigo-500">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                  <p className="text-[10px] uppercase font-black tracking-widest">Executing Request...</p>
                </div>
              ) : response ? (
                <div className="absolute inset-0">
                  <Editor
                    height="100%"
                    language="json"
                    theme="vs-dark"
                    value={response}
                    options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 16 }, readOnly: true }}
                  />
                  <div className="absolute bottom-4 right-4 bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/50 z-10">
                    200 OK • {api.latency}ms
                  </div>
                </div>
              ) : (
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">No response yet. Run a test.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleTest} disabled={isLoading} className="rounded-xl h-12 px-8 bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px]">
            {isLoading ? "Executing..." : "Send Request"} <Play className="w-3 h-3 ml-2 fill-white" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
