import { useState, useEffect } from "react";
import TimeCalculator, { TimeEntry } from "@/components/TimeCalculator";
import TimeResults from "@/components/TimeResults";
import DecimalConverter from "@/components/DecimalConverter";
import { Clock } from "lucide-react";
import AILawAssistant from "@/components/AILawAssistant";
import { ModeToggle } from "@/components/ModeToggle";

// Chaves para o localStorage
const STORAGE_KEYS = {
  TIME_ENTRIES: "hora-certa-entries",
  SHOW_DECIMAL: "hora-certa-show-decimal",
};

export default function Index() {
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    const lastVisit = localStorage.getItem("last-visit-date");
    const today = new Date().toDateString();
    return lastVisit !== today;
  });

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    // Recupera os dados do localStorage na inicialização
    const savedEntries = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
    return savedEntries
      ? JSON.parse(savedEntries)
      : [{ id: "1", hours: 0, minutes: 0, operation: "add" }];
  });

  const [showDecimal, setShowDecimal] = useState<boolean>(() => {
    // Recupera a preferência de exibição decimal
    const savedPreference = localStorage.getItem(STORAGE_KEYS.SHOW_DECIMAL);
    return savedPreference ? JSON.parse(savedPreference) : false;
  });

  // Handle preloader
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem("last-visit-date", new Date().toDateString());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Salva as entradas no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.TIME_ENTRIES,
      JSON.stringify(timeEntries)
    );
  }, [timeEntries]);

  // Salva a preferência de exibição decimal
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.SHOW_DECIMAL,
      JSON.stringify(showDecimal)
    );
  }, [showDecimal]);

  const calculateTotalMinutes = (entries: TimeEntry[]): number => {
    return entries.reduce((total, entry) => {
      const entryMinutes = entry.hours * 60 + entry.minutes;
      return entry.operation === "add"
        ? total + entryMinutes
        : total - entryMinutes;
    }, 0);
  };

  const getAdditionEntries = () =>
    timeEntries.filter((entry) => entry.operation === "add");
  const getSubtractionEntries = () =>
    timeEntries.filter((entry) => entry.operation === "subtract");

  const minutesToTime = (totalMinutes: number) => {
    const isNegative = totalMinutes < 0;
    const absMinutes = Math.abs(totalMinutes);
    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;
    return { hours, minutes, isNegative };
  };
  const minutesToDecimal = (totalMinutes: number): number => {
    // Arredonda para cima e mantém 2 casas decimais
    const decimal = totalMinutes / 60;
    return Math.ceil(decimal * 100) / 100;
  };

  const totalMinutes = calculateTotalMinutes(timeEntries);
  const additionTotal = getAdditionEntries().reduce(
    (total, entry) => total + entry.hours * 60 + entry.minutes,
    0
  );
  const subtractionTotal = getSubtractionEntries().reduce(
    (total, entry) => total + entry.hours * 60 + entry.minutes,
    0
  );

  const finalResult = minutesToTime(totalMinutes);
  const additionResult = minutesToTime(additionTotal);
  const subtractionResult = minutesToTime(subtractionTotal);



  // Preloader
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-slate-950 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Calculadorinha
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm">Preparando tudo para você...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="page-scroll" className="min-h-screen bg-gray-50 dark:bg-slate-950 fixed inset-0 w-full overflow-y-auto transition-colors duration-300">
      <div className="container mx-auto py-4 sm:py-8 px-4 max-w-7xl">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 shadow-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 mb-4 sm:mb-8 border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-red-500 to-pink-500 p-2 sm:p-2.5 rounded-xl shadow-md shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent truncate pb-0.5">
                  Calculadorinha
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">Calcule suas horas facilmente</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowDecimal(!showDecimal)}
                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
              >
                <div className={`w-8 sm:w-10 h-5 sm:h-6 rounded-full transition-all relative shrink-0 ${showDecimal ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <div className={`absolute top-1 sm:top-1 w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${showDecimal ? 'translate-x-4 sm:translate-x-5' : 'translate-x-1'}`} />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">Mostrar decimais</span>
              </button>
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-12">
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Time Entries */}
            <div className="lg:col-span-2 space-y-6">
              <TimeCalculator 
                timeEntries={timeEntries} 
                setTimeEntries={setTimeEntries} 
                showDecimal={showDecimal}
              />
            </div>

            {/* Right Column: Results, Converter & AI Auditor */}
            <div className="space-y-8">
              <TimeResults
                finalResult={finalResult}
                additionResult={additionResult}
                subtractionResult={subtractionResult}
                showDecimal={showDecimal}
                finalDecimal={minutesToDecimal(totalMinutes)}
                additionDecimal={minutesToDecimal(additionTotal)}
                subtractionDecimal={minutesToDecimal(subtractionTotal)}
              />
              <DecimalConverter />
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-16 pb-8 border-t border-slate-200/60 dark:border-slate-800 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 p-1.5 rounded-lg shadow-sm">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">Calculadorinha</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm text-center md:text-left">
                Ferramenta simples e eficiente para organizar sua jornada de trabalho e conversões de horas.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end text-xs text-slate-500 dark:text-slate-400 gap-1 mt-4 md:mt-0">
              <p>
                Desenvolvido com <span className="text-red-500">♥</span> por{" "}
                <a
                  href="https://felipeurbanek.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-slate-800 dark:text-slate-200 hover:text-red-500 dark:hover:text-red-500 transition-colors underline decoration-slate-300 dark:decoration-slate-700 hover:decoration-red-500 underline-offset-4"
                >
                  Felipe Urbanek
                </a>
              </p>
              <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Botão flutuante unificado da IA */}
      <AILawAssistant />
    </div>
  );
}
