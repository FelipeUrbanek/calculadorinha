import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";
export type ColorTheme = "ruby" | "ocean" | "nature" | "royal" | "sunset";

export const THEME_COLORS: Record<ColorTheme, { hsl: string; rgb: string }> = {
  ruby: {
    hsl: "0 84.2% 60.2%",
    rgb: "244, 63, 94",
  },
  ocean: {
    hsl: "221.2 83.2% 53.3%",
    rgb: "59, 130, 246",
  },
  nature: {
    hsl: "142.1 70.6% 45.3%",
    rgb: "34, 197, 94",
  },
  royal: {
    hsl: "270.7 91% 65.1%",
    rgb: "168, 85, 247",
  },
  sunset: {
    hsl: "24.6 95% 53.1%",
    rgb: "249, 115, 22",
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
  colorTheme: "ruby",
  setColorTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorTheme = "ruby",
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
