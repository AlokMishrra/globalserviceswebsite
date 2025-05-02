import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const IntegratedSolutionsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="w-full lg:w-1/2 mb-10 lg:mb-0 pr-0 lg:pr-12"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-6">
              Integrated <br />Digital <br />Solutions
            </h2>
            <div className="w-12 h-1 bg-accent mb-6"></div>
            
            <p className="text-lg font-medium italic mb-4">
              Insights, Metrics and Analytics - Everything is connected!
            </p>
            
            <p className="mb-6 text-gray-700">
              In a digital world where everything's connected, we believe that the approach to digital communications has to be joined-up too. Our approach combines creativity & technology and blends a diverse range of digital marketing disciplines — from mobile and responsive web design to search and social media campaigns — all under one roof.
            </p>
            
            <Link href="/contact">
              <span className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-all transform hover:scale-105 mt-4">
                Get Started Today
              </span>
            </Link>
          </motion.div>
          
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gray-200 rounded-lg overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1550063873-ab792950096b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Connected Digital Solutions" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-secondary/90 px-8 py-6 rounded-lg">
                  <h3 className="text-2xl md:text-3xl font-bold font-montserrat text-primary">
                    Everything <br />is connected
                  </h3>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IntegratedSolutionsSection;
