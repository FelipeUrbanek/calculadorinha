import { Palette, Check, Sun, Moon } from "lucide-react";
import { useTheme, ColorTheme } from "./theme-provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const THEMES: { id: ColorTheme; name: string; classes: string }[] = [
  { id: "ruby", name: "Padrão", classes: "bg-gradient-to-br from-red-500 to-pink-500" },
  { id: "ocean", name: "Ocean", classes: "bg-gradient-to-br from-blue-500 to-teal-500" },
  { id: "nature", name: "Nature", classes: "bg-gradient-to-br from-green-500 to-emerald-500" },
  { id: "royal", name: "Royal", classes: "bg-gradient-to-br from-purple-500 to-indigo-500" },
  { id: "sunset", name: "Sunset", classes: "bg-gradient-to-br from-orange-500 to-yellow-500" },
];

export function ThemePicker() {
  const { colorTheme, setColorTheme, theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100]">
      <Popover>
        <PopoverTrigger asChild>
          <button className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-slate-900 border-2 border-theme-base/20 hover:bg-black text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 group relative cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-gradient-start/20 to-theme-gradient-end/20 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-theme-base relative z-10" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          className="w-auto p-3 mb-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl"
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 px-1 mb-1">
              Esquema de Cores
            </p>
            <div className="flex gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setColorTheme(t.id)}
                  title={t.name}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-sm ${
                    t.classes
                  } ${
                    colorTheme === t.id
                      ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-slate-400 dark:ring-slate-500 scale-110"
                      : ""
                  }`}
                >
                  {colorTheme === t.id && (
                    <Check className="h-5 w-5 text-white drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>
            
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 px-1 mb-1 mt-2">
              Modo de Exibição
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm ${
                  theme === "light"
                    ? "bg-slate-200 text-slate-900 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-slate-400 dark:ring-slate-500"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Sun className="h-4 w-4" /> Claro
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm ${
                  theme === "dark"
                    ? "bg-slate-800 text-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-slate-400 dark:ring-slate-500"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Moon className="h-4 w-4" /> Escuro
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
