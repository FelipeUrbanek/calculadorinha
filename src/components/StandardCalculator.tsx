import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { X, History, Trash2, Calculator, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface StandardCalculatorProps {
  id?: number;
  onClose?: () => void;
  isPip?: boolean;
  title?: string;
  onTitleChange?: (newTitle: string) => void;
}

const StandardCalculator: React.FC<StandardCalculatorProps> = (props) => {
  const { 
    id,
    onClose, 
    title = "Calculadora",
    onTitleChange = () => {}
  } = props;

  const [display, setDisplay] = useState<string>(() => {
    return id ? (localStorage.getItem(`calc-value-${id}`) || '0') : '0';
  });
  const [equation, setEquation] = useState<string>(() => {
    return id ? (localStorage.getItem(`calc-eq-${id}`) || '') : '';
  });
  const [memorial, setMemorial] = useState<string[]>(() => {
    const saved = id ? localStorage.getItem(`calc-history-${id}`) : null;
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showMemorial, setShowMemorial] = useState(false);
  const [titleInput, setTitleInput] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Persistence
  useEffect(() => {
    if (id) localStorage.setItem(`calc-value-${id}`, display);
  }, [display, id]);

  useEffect(() => {
    if (id) localStorage.setItem(`calc-eq-${id}`, equation);
  }, [equation, id]);

  useEffect(() => {
    if (id) localStorage.setItem(`calc-history-${id}`, JSON.stringify(memorial));
  }, [memorial, id]);

  useEffect(() => {
    if (showMemorial && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [showMemorial, memorial]);

  const handleNumber = (num: string) => {
    if (shouldReset) {
      setDisplay(num === '.' ? '0.' : num);
      setShouldReset(false);
    } else {
      if (display === '0' && num !== '.') {
        setDisplay(num);
      } else {
        if (num === '.' && display.includes('.')) return;
        if (display.length >= 12) return;
        setDisplay(display + num);
      }
    }
  };

  const handleOperator = (op: string) => {
    if (equation && !shouldReset) {
      const result = performCalculation();
      const fullExpr = equation + display;
      const formattedResult = String(result);
      
      // Save intermediate result to history
      setMemorial(prev => [...prev, `${fullExpr} = ${formattedResult}`]);
      
      // Start next part of the chain from the result
      setEquation(formattedResult + ' ' + op + ' ');
      setDisplay(formattedResult);
    } else {
      setEquation(display + ' ' + op + ' ');
    }
    setShouldReset(true);
  };

  const performCalculation = () => {
    try {
      const expr = (equation + display).replace(/×/g, '*').replace(/÷/g, '/');
      const result = Function(`"use strict"; return (${expr})`)();
      return Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
    } catch (e) {
      return parseFloat(display);
    }
  };

  const calculate = () => {
    if (!equation || shouldReset) return;
    const result = performCalculation();
    const fullExpr = equation + display;
    const formattedResult = String(result);

    setMemorial(prev => [...prev, `${fullExpr} = ${formattedResult}`]);
    setDisplay(formattedResult);
    setEquation('');
    setShouldReset(true);
  };

  const handlePercent = () => {
    const current = parseFloat(display);
    setDisplay(String(current / 100));
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setShouldReset(false);
  };

  const handleClearHistory = () => {
    setMemorial([]);
    if (id) localStorage.removeItem(`calc-history-${id}`);
    setShowConfirmClear(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  return (
    <Card className="relative w-full h-[310px] flex flex-col bg-background text-foreground border-none overflow-hidden shadow-none rounded-[2rem] ring-1 ring-border/50 transition-colors duration-300">
      
      {/* Memorial Overlay */}
      {showMemorial && (
        <div className="absolute inset-0 z-[100] bg-background flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-secondary/50">
            <span className="text-[9px] font-black uppercase tracking-widest text-theme-base">Histórico</span>
            <button onClick={() => setShowMemorial(false)} className="p-1 hover:bg-theme-base/10 rounded-full transition-all text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-pip-scrollbar bg-secondary/30">
            {memorial.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-30 gap-2">
                <History className="w-8 h-8 text-muted-foreground" />
                <div className="text-[9px] font-black tracking-widest uppercase text-muted-foreground">Sem registros</div>
              </div>
            ) : (
              memorial.map((item, i) => {
                const [expr, res] = item.split(' = ');
                return (
                  <div key={i} className="group relative flex flex-col items-end py-2 border-b border-border/50 last:border-0">
                    <div className="text-[8px] font-bold font-mono text-muted-foreground mb-0.5 break-all text-right">{expr} =</div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => copyToClipboard(res)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-theme-base/10 rounded-md transition-all text-theme-base"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => { setDisplay(res); setEquation(''); setShouldReset(true); setShowMemorial(false); }}
                        className="text-xl font-black font-mono text-foreground hover:text-theme-base transition-colors"
                      >
                        {res}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="p-3 border-t border-border flex justify-end bg-secondary/50">
            {showConfirmClear ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowConfirmClear(false)} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-[9px] font-bold">Não</button>
                <button onClick={handleClearHistory} className="px-3 py-1.5 bg-destructive text-destructive-foreground rounded-lg text-[9px] font-bold">Zerar</button>
              </div>
            ) : memorial.length > 0 && (
              <button onClick={() => setShowConfirmClear(true)} className="p-2 hover:bg-destructive/10 rounded-lg transition-all text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between bg-background/50 border-b border-border">
        <div className="flex items-center gap-2 overflow-hidden flex-1 mr-4">
          <Calculator className="w-3 h-3 text-theme-base flex-shrink-0" />
          {isEditingTitle ? (
            <input
              autoFocus
              className="bg-transparent border-none outline-none text-[10px] font-black text-theme-base w-full uppercase tracking-tighter"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={() => { setIsEditingTitle(false); onTitleChange(titleInput); }}
              onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget as any).blur()}
            />
          ) : (
            <span 
              className="text-[10px] font-black text-theme-base cursor-pointer truncate uppercase tracking-tighter hover:opacity-70"
              onClick={() => setIsEditingTitle(true)}
            >
              {title || "Calculator"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowMemorial(!showMemorial)}
            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-secondary transition-all text-muted-foreground"
          >
            <History className="w-3 h-3" />
          </button>
          <button 
            onClick={onClose}
            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Result Display */}
      <div className="flex flex-col justify-end px-5 pt-1.5 pb-1.5 bg-secondary/50 flex-shrink-0 h-[65px]">
        <div className="text-theme-base/40 text-right text-[7px] h-2 font-black truncate mb-0.5 uppercase tracking-tight">{equation}</div>
        <div key={display} className="text-xl font-black text-right truncate font-mono tracking-tighter text-foreground drop-shadow-[0_0_30px_rgba(var(--theme-base-rgb),0.1)] animate-in fade-in zoom-in-95 duration-200">{display}</div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-[1px] p-[1px] bg-border/50 flex-1">
        <Button variant="ghost" className="h-full py-1.5 rounded-none text-[8px] font-black text-destructive hover:bg-destructive/10 active:scale-95 transition-all bg-background/50" onClick={clear}>AC</Button>
        <Button variant="ghost" className="h-full py-1.5 rounded-none text-[8px] font-black text-muted-foreground hover:bg-theme-base/5 active:scale-95 transition-all bg-background/50" onClick={toggleSign}>+/-</Button>
        <Button variant="ghost" className="h-full py-1.5 rounded-none text-[8px] font-black text-muted-foreground hover:bg-theme-base/5 active:scale-95 transition-all bg-background/50" onClick={handlePercent}>%</Button>
        <Button variant="ghost" className="h-full py-1.5 rounded-none text-base font-bold text-theme-base hover:bg-theme-base/10 active:scale-95 transition-all bg-secondary/50" onClick={() => handleOperator('÷')}>÷</Button>

        {[7, 8, 9].map(n => (
          <Button key={n} variant="ghost" className="h-full py-1.5 rounded-none text-base font-bold text-foreground hover:bg-theme-base/5 active:scale-95 transition-all bg-background/50" onClick={() => handleNumber(String(n))}>{n}</Button>
        ))}
        <Button variant="ghost" className="h-full py-1.5 rounded-none text-base font-bold text-theme-base hover:bg-theme-base/10 active:scale-95 transition-all bg-secondary/50" onClick={() => handleOperator('×')}>×</Button>

        {[4, 5, 6].map(n => (
          <Button key={n} variant="ghost" className="h-full py-1.5 rounded-none text-base font-bold text-foreground hover:bg-theme-base/5 active:scale-95 transition-all bg-background/50" onClick={() => handleNumber(String(n))}>{n}</Button>
        ))}
        <Button variant="ghost" className="h-full py-1.5 rounded-none text-base font-bold text-theme-base hover:bg-theme-base/10 active:scale-95 transition-all bg-secondary/50" onClick={() => handleOperator('-')}>-</Button>

        {[1, 2, 3].map(n => (
          <Button key={n} variant="ghost" className="h-full py-1.5 rounded-none text-base font-bold text-foreground hover:bg-theme-base/5 active:scale-95 transition-all bg-background/50" onClick={() => handleNumber(String(n))}>{n}</Button>
        ))}
        <Button variant="ghost" className="h-full py-1.5 rounded-none text-base font-bold text-theme-base hover:bg-theme-base/10 active:scale-95 transition-all bg-secondary/50" onClick={() => handleOperator('+')}>+</Button>

        <Button variant="ghost" className="h-full py-1.5 rounded-none text-base font-bold text-foreground hover:bg-theme-base/5 active:scale-95 transition-all bg-background/50 col-span-2" onClick={() => handleNumber('0')}>0</Button>
        <Button variant="ghost" className="h-full py-1.5 rounded-none text-base font-bold text-foreground hover:bg-theme-base/5 active:scale-95 transition-all bg-background/50" onClick={() => handleNumber('.')}>.</Button>
        <Button variant="ghost" className="h-full py-1.5 rounded-none text-base font-black bg-theme-base hover:bg-theme-base/90 text-primary-foreground transition-all active:scale-95" onClick={calculate}>=</Button>
      </div>

      <style>{`
        .no-scrollbar-ugly::-webkit-scrollbar { width: 4px; }
        .no-scrollbar-ugly::-webkit-scrollbar-track { background: transparent; }
        .no-scrollbar-ugly::-webkit-scrollbar-thumb { background: rgba(var(--theme-base-rgb), 0.2); border-radius: 10px; }
      `}</style>
    </Card>
  );
};

export default StandardCalculator;
