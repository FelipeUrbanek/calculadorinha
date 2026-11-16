import { Palette, Check, Sun, Moon } from "lucide-react";
import { useTheme, ColorTheme } from "./theme-provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const THEMES: { id: ColorTheme; name: string; color: string }[] = [
  { id: "indigo", name: "Índigo", color: "#3B33E8" },
  { id: "ruby", name: "Ruby", color: "#D61F4C" },
  { id: "ocean", name: "Ocean", color: "#1D5FD6" },
  { id: "nature", name: "Nature", color: "#047857" },
  { id: "royal", name: "Royal", color: "#7C3AED" },
  { id: "sunset", name: "Sunset", color: "#D9480F" },
];

export function ThemePicker() {
  const { colorTheme, setColorTheme, theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Tema e cores"
          title="Tema e cores"
          className="h-11 w-11 shrink-0 rounded-full bg-card text-foreground hover:bg-theme-base hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <Palette className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        className="w-auto p-4 rounded-3xl bg-popover border border-border shadow-xl"
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-muted-foreground px-1">
            Cor da marca
          </p>
          <div className="flex gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setColorTheme(t.id)}
                title={t.name}
                aria-label={`Cor ${t.name}`}
                aria-pressed={colorTheme === t.id}
                style={{ backgroundColor: t.color }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-90 ${
                  colorTheme === t.id
                    ? "ring-2 ring-offset-2 ring-offset-popover ring-foreground"
                    : ""
                }`}
              >
                {colorTheme === t.id && <Check className="h-5 w-5 text-white" />}
              </button>
            ))}
          </div>

          <p className="text-sm font-semibold text-muted-foreground px-1 mt-2">
            Modo de exibição
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                theme === "light"
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="h-4 w-4" /> Claro
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                theme === "dark"
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="h-4 w-4" /> Escuro
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
