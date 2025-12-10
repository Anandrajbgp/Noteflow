import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface FABProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FABProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-[#FFB74D] text-white shadow-lg shadow-orange-500/20 flex items-center justify-center z-40"
    >
      <Plus className="h-8 w-8" />
    </motion.button>
  );
}