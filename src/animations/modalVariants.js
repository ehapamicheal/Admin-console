export const modalVariants = {
  hidden: { opacity: 0, y: -40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.9,
    transition: { duration: 0.35, ease: "easeInOut" },
  },
};