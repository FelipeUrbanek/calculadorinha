import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";
export type ColorTheme = "indigo" | "ruby" | "ocean" | "nature" | "royal" | "sunset";

export const THEME_COLORS: Record<ColorTheme, { hsl: string; rgb: string }> = {
  indigo: {
    hsl: "243 80% 55%",
    rgb: "59, 51, 232",
  },
  ruby: {
    hsl: "345 75% 48%",
    rgb: "214, 31, 76",
  },
  ocean: {
    hsl: "219 76% 48%",
    rgb: "29, 95, 214",
  },
  nature: {
    hsl: "163 93% 24%",
    rgb: "4, 120, 87",
  },
  royal: {
    hsl: "262 83% 58%",
    rgb: "124, 58, 237",
  },
  sunset: {
    hsl: "17 87% 46%",
    rgb: "217, 72, 15",
  },
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorTheme?: ColorTheme;
  storageKey?: string;
  colorStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (colorTheme: ColorTheme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  colorTheme: "indigo",
  setColorTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorTheme = "indigo",
  storageKey = "vite-ui-theme",
  colorStorageKey = "vite-ui-color-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  const [colorTheme, setColorTheme] = useState<ColorTheme>(
    () =>
      (localStorage.getItem(colorStorageKey) as ColorTheme) ||
      defaultColorTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Handle color theme
  useEffect(() => {
    const root = window.document.documentElement;
    // Remove past color themes
    root.classList.remove(
      "theme-indigo",
      "theme-ruby",
      "theme-ocean",
      "theme-nature",
      "theme-royal",
      "theme-sunset",
    );
    root.classList.add(`theme-${colorTheme}`);
  }, [colorTheme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    colorTheme,
    setColorTheme: (theme: ColorTheme) => {
      localStorage.setItem(colorStorageKey, theme);
      setColorTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
