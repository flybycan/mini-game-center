import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="text-center mb-12">
      {/* <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-sm uppercase tracking-wider mb-4 inline-block"
      >
        Welcome
      </motion.span> */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-5xl md:text-7xl font-bold mb-6"
      >
        Mini Game Center 
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-lg text-muted-foreground max-w-lg mx-auto mb-8"
      >
        Play Free Mini Games Online - Instant Fun!
      </motion.p>
    </div>
  );
};

export default Hero;