interface LogoProps {
  className?: string;
}

/**
 * Logo da Calculadorinha: um relógio minimalista marcando 3 horas.
 * O fundo usa a cor de marca do tema atual.
 */
const Logo = ({ className = "h-11 w-11" }: LogoProps) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    role="img"
    aria-label="Calculadorinha"
  >
    <rect width="512" height="512" rx="120" fill="hsl(var(--theme-base))" />
    <circle cx="256" cy="256" r="124" fill="none" stroke="#fff" strokeWidth="36" />
    <path
      d="M256 168 V256 H322"
      fill="none"
      stroke="#fff"
      strokeWidth="36"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Logo;
