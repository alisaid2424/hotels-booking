import * as motion from "motion/react-client";
import { ReactNode } from "react";

type MotionProps = {
  children: ReactNode;
  index?: number;
  className?: string;
  fade?: boolean;
};

const Motion = ({ children, className, index, fade = true }: MotionProps) => {
  return (
    <motion.div
      initial={fade ? { opacity: 0, y: 30 } : { y: 30 }}
      whileInView={fade ? { opacity: 1, y: 0 } : { y: 0 }}
      transition={{ duration: 0.6, delay: index ? index * 0.1 : 0 }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Motion;
