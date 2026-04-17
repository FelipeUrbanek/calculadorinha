import { useState } from "react";
import { chatWithGroq, SYSTEM_PROMPTS } from "@/lib/groq";
import { Search, Send, Bot, Loader2, Info, Gavel, MessageSquarePlus, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AILawAssistant() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const result = await chatWithGroq([
        { role: "system", content: SYSTEM_PROMPTS.LAW_ASSISTANT },
        { role: "user", content: query }
      ]);
      setResponse(result);
    } catch (error) {
      toast.error("Erro ao consultar assistente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-slate-900 hover:bg-black text-white shadow-2xl z-[100] flex items-center justify-center transition-all hover:scale-110 active:scale-90 border-2 border-theme-base/20"
        >
          <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-theme-base" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-transparent dark:border-slate-800">
        <div className="relative">
          {/* Header */}
          <div className="bg-slate-900 px-8 py-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="bg-theme-base/10 p-2.5 rounded-xl border border-theme-base/20">
                <Gavel className="h-5 w-5 text-theme-base" />
              </div>
              <div>
                <DialogTitle className="text-white font-bold text-lg leading-none mb-1">Base Legal IA</DialogTitle>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Especialista CLT Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-gradient-start/20 to-theme-gradient-end/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Qual sua dúvida sobre leis trabalhistas?"
                  className="w-full pl-12 pr-14 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-all text-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-theme-base transition-colors" />
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 dark:bg-theme-base hover:bg-black dark:hover:bg-theme-base/80 disabled:bg-slate-200 dark:disabled:bg-slate-700/50 text-white disabled:text-slate-400 dark:disabled:text-slate-500 p-2.5 rounded-xl transition-all shadow-md active:scale-90"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>

            {/* Results */}
            <div className="min-h-[100px] max-h-[350px] overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-theme-base rounded-full animate-spin"></div>
                    <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consultando CLT...</p>
                  </motion.div>
                ) : response ? (
                  <motion.div
                    key="response"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{response}</p>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <Info className="h-4 w-4 text-amber-500 shrink-0" />
                      <p className="text-[10px] text-amber-800 font-medium">Informativo. Consulte um profissional para decisões oficiais.</p>
                    </div>
                    <button
                      onClick={() => { setResponse(null); setQuery(""); }}
                      className="text-[10px] font-bold text-theme-base uppercase tracking-widest block mx-auto py-2"
                    >
                      Nova Pergunta
                    </button>
                  </motion.div>
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <div className="bg-slate-50 dark:bg-slate-800/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-slate-100 dark:border-slate-700/50">
                      <Bot className="h-6 w-6 text-slate-200" />
                    </div>
                    <p className="text-slate-400 text-xs max-w-[200px] mx-auto leading-relaxed">
                      Olá! Sou seu assistente jurídico. Como posso ajudar com suas horas hoje?
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Links (Pix and Feedback replacement) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button 
                 onClick={() => toast.info("Funcionalidade de sugestões em manutenção.")}
                 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-tight"
              >
                <MessageSquarePlus className="h-3.5 w-3.5" />
                Sugestões
              </button>
              <button 
                 onClick={() => toast.info("Use a calculadora e se gostar, apoie o projeto.")}
                 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-tight"
              >
                <QrCode className="h-3.5 w-3.5" />
                Apoiar (Pix)
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
