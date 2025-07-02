import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Calculator, Plus, Trash2 } from "lucide-react";
import gsap from "gsap";

interface ConverterEntry {
  id: string;
  minutes: number;
  decimal: number;
  timeInput: string;
}

const DecimalConverter = () => {
  const [converters, setConverters] = useState<ConverterEntry[]>([
    { id: "1", minutes: 0, decimal: 0, timeInput: "" },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement }>({});
  const cardRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement }>({});
  const arrowRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animação inicial do container e header
    if (containerRef.current && headerRef.current) {
      gsap.from(headerRef.current, {
        duration: 0.6,
        y: -20,
        opacity: 0,
        ease: "power3.out",
      });

      gsap.from(containerRef.current, {
        duration: 0.6,
        y: 20,
        opacity: 0,
        ease: "power3.out",
        delay: 0.2,
      });
    }

    // Animação inicial dos cartões
    converters.forEach((converter, index) => {
      const card = cardRefs.current[converter.id];
      if (card) {
        gsap.from(card, {
          duration: 0.5,
          x: -20,
          opacity: 0,
          ease: "power2.out",
          delay: 0.1 * index,
        });

        const arrow = arrowRefs.current[converter.id];
        if (arrow) {
          gsap.from(arrow, {
            duration: 0.4,
            scale: 0,
            rotation: -180,
            ease: "back.out(1.7)",
            delay: 0.2 + index * 0.1,
          });
        }
      }
    });
  }, []);

  const minutesToDecimal = (mins: number): number => {
    return parseFloat((mins / 60).toFixed(4));
  };

  const decimalToMinutes = (dec: number): number => {
    return Math.round(dec * 60);
  };

  const parseTimeInput = (input: string): number => {
    // Remove todos os caracteres não numéricos
    const cleanInput = input.replace(/[^\d]/g, "");
    const numericValue = parseInt(cleanInput) || 0;

    // Se for um número pequeno (até 2 dígitos)
    if (cleanInput.length <= 2) {
      // Se for maior que 59, converte para horas
      if (numericValue > 59) {
        const hours = Math.floor(numericValue / 60);
        const minutes = numericValue % 60;
        return hours * 60 + minutes;
      }
      return numericValue;
    }

    // Para números maiores que 2 dígitos
    // Os últimos 2 dígitos são minutos, o resto é hora
    const minutes = parseInt(cleanInput.slice(-2));
    const hours = parseInt(cleanInput.slice(0, -2)) || 0;

    // Se os minutos são > 59, converte para a próxima hora
    if (minutes > 59) {
      const extraHours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return (hours + extraHours) * 60 + remainingMinutes;
    }

    return hours * 60 + minutes;
  };

  const formatTimeInput = (input: string): string => {
    // Remove todos os caracteres não numéricos
    const numbers = input.replace(/[^\d]/g, "");
    const numericValue = parseInt(numbers) || 0;

    // Se for um número pequeno (até 2 dígitos)
    if (numbers.length <= 2) {
      // Se for maior que 59, converte para horas
      if (numericValue > 59) {
        const hours = Math.floor(numericValue / 60);
        const minutes = numericValue % 60;
        return `${hours}h${minutes.toString().padStart(2, "0")}`;
      }
      return numbers;
    }

    // Para números maiores que 2 dígitos
    // Os últimos 2 dígitos são minutos, o resto é hora
    const minutes = parseInt(numbers.slice(-2));
    const hours = parseInt(numbers.slice(0, -2)) || 0;

    // Se os minutos são > 59, converte para a próxima hora
    if (minutes > 59) {
      const extraHours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours + extraHours}h${remainingMinutes
        .toString()
        .padStart(2, "0")}`;
    }

    return `${hours}h${minutes.toString().padStart(2, "0")}`;
  };

  const formatMinutesToTime = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0 && minutes > 0) {
      return `${hours}h${minutes.toString().padStart(2, "0")}`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}`;
    }
  };

  const handleTimeInputChange = (id: string, value: string) => {
    // Remove caracteres não numéricos
    const numbers = value.replace(/[^\d]/g, "");

    // Formata o número como horas durante a digitação
    let formattedValue = numbers;
    if (numbers.length > 2) {
      const minutes = numbers.slice(-2);
      const hours = numbers.slice(0, -2);
      formattedValue = `${hours}h${minutes}`;
    }

    setConverters((prev) =>
      prev.map((converter) => {
        if (converter.id === id) {
          return {
            ...converter,
            timeInput: formattedValue,
          };
        }
        return converter;
      })
    );
  };

  const convertTime = (id: string, value: string) => {
    const formattedValue = formatTimeInput(value);
    setConverters((prev) =>
      prev.map((converter) => {
        if (converter.id === id) {
          const totalMinutes = parseTimeInput(value);
          return {
            ...converter,
            timeInput: formattedValue,
            minutes: totalMinutes,
            decimal: parseFloat(minutesToDecimal(totalMinutes).toFixed(4)),
          };
        }
        return converter;
      })
    );
  };

  const handleBackspace = (id: string) => {
    const converter = converters.find((c) => c.id === id);
    if (converter) {
      const newValue = converter.timeInput.slice(0, -1);
      handleTimeInputChange(id, newValue);
    }
  };

  const handleDecimalChange = (id: string, value: string) => {
    const dec = Math.max(0, parseFloat(value) || 0);
    setConverters((prev) =>
      prev.map((converter) => {
        if (converter.id === id) {
          const totalMinutes = decimalToMinutes(dec);
          return {
            ...converter,
            decimal: dec,
            minutes: totalMinutes,
            timeInput: formatMinutesToTime(totalMinutes),
          };
        }
        return converter;
      })
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    // Trata tanto Enter quanto Tab da mesma forma
    if (e.key === "Enter" || (e.key === "Tab" && !e.shiftKey)) {
      const converter = converters.find((c) => c.id === id);
      if (converter) {
        convertTime(id, converter.timeInput);
      }

      // Se for Tab, não previne o comportamento padrão para manter a navegação normal
      if (e.key === "Enter") {
        e.preventDefault();
        // Apenas move o foco para o próximo campo se existir
        const currentIndex = converters.findIndex((c) => c.id === id);
        if (currentIndex < converters.length - 1) {
          const nextId = converters[currentIndex + 1].id;
          if (inputRefs.current[nextId]) {
            inputRefs.current[nextId].focus();
          }
        }
      }
    } else if (e.key === "Backspace") {
      handleBackspace(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    // Trata o Tab aqui para garantir que seja capturado antes do navegador
    if (e.key === "Tab" && !e.shiftKey) {
      const converter = converters.find((c) => c.id === id);
      if (converter) {
        convertTime(id, converter.timeInput);
      }
    }
  };

  const handleBlur = (id: string) => {
    const converter = converters.find((c) => c.id === id);
    if (converter && converter.timeInput) {
      convertTime(id, converter.timeInput);
    }
  };

  const addNewConverter = () => {
    const newId = Date.now().toString();
    setConverters((prev) => [
      ...prev,
      { id: newId, minutes: 0, decimal: 0, timeInput: "" },
    ]);

    // Animar o novo cartão e seus elementos
    setTimeout(() => {
      const card = cardRefs.current[newId];
      const button = buttonRefs.current[newId];
      const arrow = arrowRefs.current[newId];

      if (card) {
        gsap.from(card, {
          duration: 0.5,
          x: -20,
          opacity: 0,
          ease: "power2.out",
        });
      }

      if (button) {
        gsap.from(button, {
          duration: 0.4,
          scale: 0,
          ease: "back.out(1.7)",
          delay: 0.2,
        });
      }

      if (arrow) {
        gsap.from(arrow, {
          duration: 0.4,
          scale: 0,
          rotation: -180,
          ease: "back.out(1.7)",
          delay: 0.3,
        });
      }
    }, 0);

    return newId;
  };

  const removeConverter = (id: string) => {
    if (converters.length > 1) {
      const currentIndex = converters.findIndex((c) => c.id === id);
      const card = cardRefs.current[id];

      if (card) {
        gsap.to(card, {
          duration: 0.5,
          opacity: 0,
          x: -100,
          scale: 0.8,
          ease: "power3.inOut",
          onComplete: () => {
            setConverters((prev) => {
              const newConverters = prev.filter((c) => c.id !== id);
              // Após remover, foca no input anterior ou no próximo
              setTimeout(() => {
                const nextIndex = Math.min(
                  currentIndex,
                  newConverters.length - 1
                );
                if (nextIndex >= 0) {
                  const nextId = newConverters[nextIndex].id;
                  inputRefs.current[nextId]?.focus();
                }
              }, 0);
              return newConverters;
            });
          },
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div ref={headerRef}>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 mb-4">
          <CardHeader className="text-center pb-3 sm:pb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
              <Calculator className="h-5 sm:h-6 w-5 sm:w-6" />
              Conversor Decimal de Tempo
            </CardTitle>
            <p className="text-indigo-100 text-xs sm:text-sm">
              Digite no formato: 230 para 2h30
            </p>
          </CardHeader>
        </Card>
      </div>

      <div ref={containerRef} className="w-full">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {converters.map((converter, index) => (
                <div
                  key={converter.id}
                  ref={(el) => {
                    if (el) cardRefs.current[converter.id] = el;
                  }}
                  className="bg-white rounded-xl shadow-md border border-gray-100 p-3 sm:p-5 relative group"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center">
                    {/* Entrada de Tempo com Máscara */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 text-center">
                        Tempo (horas/minutos)
                      </label>
                      <Input
                        ref={(el) => {
                          if (el) inputRefs.current[converter.id] = el;
                        }}
                        type="text"
                        value={converter.timeInput}
                        onChange={(e) =>
                          handleTimeInputChange(converter.id, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, converter.id)}
                        onKeyPress={(e) => handleKeyPress(e, converter.id)}
                        onBlur={() => handleBlur(converter.id)}
                        className="text-center text-base sm:text-lg font-semibold border-indigo-200 focus:border-indigo-400 focus:ring-indigo-200"
                        placeholder="Ex: 230"
                      />
                    </div>

                    {/* Seta de Conversão */}
                    <div
                      ref={(el) => {
                        if (el) arrowRefs.current[converter.id] = el;
                      }}
                      className="flex items-center justify-center"
                    >
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-2 sm:p-3 transform hover:scale-110 transition-transform duration-200">
                        <ArrowLeftRight className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
                      </div>
                    </div>

                    {/* Entrada Decimal */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 text-center">
                        Decimal
                      </label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={converter.decimal || ""}
                        onChange={(e) =>
                          handleDecimalChange(converter.id, e.target.value)
                        }
                        className="text-center text-base sm:text-lg font-semibold border-indigo-200 focus:border-indigo-400 focus:ring-indigo-200"
                        placeholder="0.0000"
                      />
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      ref={(el) => {
                        if (el) buttonRefs.current[converter.id] = el;
                      }}
                      size="icon"
                      variant="outline"
                      className="rounded-full bg-white shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={() => removeConverter(converter.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {index === converters.length - 1 && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full bg-white shadow-lg hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                        onClick={addNewConverter}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DecimalConverter;
