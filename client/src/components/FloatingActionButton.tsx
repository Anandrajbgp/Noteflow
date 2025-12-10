import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface FABProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FABProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center z-40"
    >
      <Plus className="h-7 w-7" />
    </motion.button>
  );
}