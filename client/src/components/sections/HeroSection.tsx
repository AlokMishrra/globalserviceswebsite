import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useScrollToSection } from "@/hooks/use-scroll";

const HeroSection: React.FC = () => {
  const scrollToSection = useScrollToSection();

  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary transform skew-x-12 origin-top-right"></div>
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="w-full md:w-3/5 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <span className="inline-block w-16 h-1 bg-dark mb-2"></span>
              <h1 className="text-4xl md:text-6xl font-bold font-montserrat leading-tight mb-6">
                We create <span className="text-dark">super-rich</span> experiences online!
              </h1>
              <p className="text-lg md:text-xl mb-8 text-dark/80 max-w-xl">
                Strategy. Creativity. Results. We deliver digital marketing solutions that help your brand stand out and achieve measurable success.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-all transform hover:scale-105"
                  onClick={() => scrollToSection("services")}
                >
                  Our Services
                </Button>
                <Link href="/contact">
                  <a className="inline-flex items-center justify-center bg-dark hover:bg-dark/90 text-white px-6 py-3 rounded-md font-medium transition-all transform hover:scale-105">
                    Get Started
                  </a>
                </Link>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="w-full md:w-2/5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Digital marketing team working" 
              className="rounded-lg shadow-xl" 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
