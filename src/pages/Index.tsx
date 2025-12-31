import { useState, useEffect } from "react";
import TimeCalculator, { TimeEntry } from "@/components/TimeCalculator";
import TimeResults from "@/components/TimeResults";
import DecimalConverter from "@/components/DecimalConverter";
import { FeedbackForm } from "@/components/ui/feedback-form";
import { PixPayment } from "@/components/ui/pix-payment";
import { Clock } from "lucide-react";

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
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Calculadorinha
          </h1>
          <p className="text-slate-400 text-sm">Preparando tudo para você...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="page-scroll" className="min-h-screen bg-gray-50 fixed inset-0 w-full overflow-y-auto">
      <div className="container mx-auto py-4 sm:py-8 px-4 max-w-7xl">
        {/* Header */}
        <header className="bg-white shadow-sm rounded-xl px-6 py-4 mb-8 border border-slate-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-pink-500 p-2.5 rounded-xl shadow-md">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  Calculadorinha
                </h1>
                <p className="text-xs text-slate-500">Calcule suas horas facilmente</p>
              </div>
            </div>
            <button
              onClick={() => setShowDecimal(!showDecimal)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all hover:scale-105 active:scale-95"
            >
              <div className={`w-10 h-6 rounded-full transition-all relative ${showDecimal ? 'bg-purple-600' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${showDecimal ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-medium text-slate-700">Mostrar decimais</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Time Entries */}
          <div className="lg:col-span-2">
            <TimeCalculator 
              timeEntries={timeEntries} 
              setTimeEntries={setTimeEntries} 
              showDecimal={showDecimal}
            />
          </div>

          {/* Right Column: Results & Converter */}
          <div className="space-y-6">
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

        {/* Footer */}
        <footer className="mt-12 pb-8">
          <div className="bg-slate-800 rounded-xl shadow-lg px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {/* About */}
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-red-400" />
                  Sobre
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Calculadorinha é uma ferramenta simples e eficiente para calcular suas horas de trabalho, 
                  com suporte para conversão decimal.
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-bold text-white mb-3">Recursos</h3>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Cálculo rápido de horas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Conversão para decimal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Salva automaticamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Interface intuitiva</span>
                  </li>
                </ul>
              </div>

              {/* Developer */}
              <div>
                <h3 className="font-bold text-white mb-3">Desenvolvedor</h3>
                <p className="text-sm text-slate-300 mb-2">
                  Desenvolvido com ❤️ por{" "}
                  <a
                    href="https://felipeurbanek.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:text-red-300 font-medium transition-colors underline"
                  >
                    Felipe Urbanek
                  </a>
                </p>
                <p className="text-xs text-slate-400">
                  © {new Date().getFullYear()} Todos os direitos reservados
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Botão PIX Flutuante */}
      <PixPayment />
      <FeedbackForm />
    </div>
  );
}
