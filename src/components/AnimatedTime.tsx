import { motion, AnimatePresence } from "framer-motion";

export const AnimatedTime = ({ value, className = "" }: { value: string; className?: string }) => {
  return (
    <div className={`flex justify-center items-center overflow-hidden tabular-nums ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {value.split("").map((char, i) => {
          // Usar índice reverso garante que os minutos e horas mantenham suas posições 
          // caso a string acrescente um sinal de menos (-) no início
          const reverseIndex = value.length - i;
          return (
            <motion.span
              key={`${reverseIndex}-${char}`}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="inline-block"
            >
              {char}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
