import { motion } from "framer-motion";

type Props = {
  onSelect: (screen: "cervical" | "breast") => void;
};

export function StartScreen({ onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <div className="flex flex-col gap-4">
        <button
          onClick={() => onSelect("cervical")}
          className={`
            px-4 py-4 rounded-2xl border transition-all text-base md:text-lg
            break-words text-center whitespace-normal
            bg-[#f3f6f8] border-transparent text-black
            hover:border-blue-400 hover:shadow-md
          `}
        >
          Скрининг на рак шейки матки
        </button>

        <button
          onClick={() => onSelect("breast")}
          className={`
            px-4 py-4 rounded-2xl border transition-all text-base md:text-lg
            break-words text-center whitespace-normal
            bg-[#f3f6f8] border-transparent text-black
            hover:border-blue-400 hover:shadow-md
          `}
        >
          Скрининг на рак молочной железы
        </button>
      </div>
    </motion.div>
  );
}
