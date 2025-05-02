import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useScrollToSection } from "@/hooks/use-scroll";
import { FadeIn, Pulse, SlideIn } from "@/components/ui/animations";

const HeroSection: React.FC = () => {
  const scrollToSection = useScrollToSection();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-secondary">
      {/* Background elements */}
      <motion.div 
        className="absolute top-0 right-0 w-1/3 h-full bg-primary transform skew-x-12 origin-top-right"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      ></motion.div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="w-full md:w-3/5 mb-10 md:mb-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              <motion.span 
                className="inline-block w-16 h-1 bg-dark mb-2"
                variants={itemVariants}
              ></motion.span>
              
              <motion.h1 
                className="text-4xl md:text-6xl font-bold font-montserrat leading-tight mb-6"
                variants={itemVariants}
              >
                We create <Pulse><span className="text-primary inline-block">super-rich</span></Pulse> experiences online!
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl mb-8 text-dark/80 max-w-xl"
                variants={itemVariants}
              >
                Strategy. Creativity. Results. We deliver digital marketing solutions that help your brand stand out and achieve measurable success.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={itemVariants}
              >
                <Link href="/services">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-all transform hover:scale-105"
                  >
                    Our Services
                  </Button>
                </Link>
                <Link 
                  href="/contact"
                  className="inline-flex items-center justify-center bg-dark hover:bg-dark/90 text-white px-6 py-3 rounded-md font-medium transition-all transform hover:scale-105"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          <SlideIn 
            className="w-full md:w-2/5"
            direction="right"
            delay={0.4}
            distance={60}
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Digital marketing team working" 
                className="w-full h-auto transform hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-70"></div>
            </div>
          </SlideIn>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center hidden md:flex"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 1.2,
          repeat: Infinity,
          repeatType: "reverse", 
        }}
      >
        <div className="text-dark/70 mb-2 text-sm font-medium">Scroll Down</div>
        <div className="w-0.5 h-6 bg-dark/40 rounded"></div>
      </motion.div>
    </section>
  );
};

export default HeroSection;