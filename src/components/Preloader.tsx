/**
 * Preloader: o próprio relógio da logo se desenha e os ponteiros giram até as 3 horas.
 * As animações ficam em index.css e são desligadas para quem prefere menos movimento.
 */
const Preloader = () => (
  <div
    role="status"
    aria-live="polite"
    className="preloader fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-background"
  >
    <svg viewBox="0 0 512 512" className="h-24 w-24" aria-hidden="true">
      <rect
        className="pl-tile"
        width="512"
        height="512"
        rx="120"
        fill="hsl(var(--theme-base))"
      />
      <circle
        className="pl-ring"
        cx="256"
        cy="256"
        r="124"
        fill="none"
        stroke="#fff"
        strokeWidth="36"
        strokeDasharray="780"
        transform="rotate(-90 256 256)"
      />
      <path
        className="pl-min"
        d="M256 256 V168"
        stroke="#fff"
        strokeWidth="36"
        strokeLinecap="round"
      />
      <path
        className="pl-hour"
        d="M256 256 H322"
        stroke="#fff"
        strokeWidth="36"
        strokeLinecap="round"
      />
    </svg>
    <p className="pl-word text-2xl font-extrabold tracking-tight text-foreground">
      Calculadorinha
    </p>
    <span className="sr-only">Carregando</span>
  </div>
);

export default Preloader;
