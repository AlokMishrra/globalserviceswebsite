import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const WhatWeDoSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:space-x-12">
          <motion.div 
            className="w-full md:w-1/3 mb-10 md:mb-0"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold font-montserrat mb-4">
              What <br />we <br />do<span className="text-primary">?</span>
            </h2>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/3 mb-10 md:mb-0"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold font-montserrat mb-3">Digital.</h3>
            <div className="w-12 h-1 bg-accent mb-6"></div>
            
            <p className="text-lg italic mb-4">We create super-rich experiences online!</p>
            
            <p className="mb-6">
              Global Services is a full-scale Digital Marketing Agency creating solutions for our clients which are not only performance-driven, but also creative. We run exceptional digital campaigns, even as you read this!
            </p>
            
            <Link href="/about">
              <a className="inline-flex items-center text-dark font-medium hover:text-primary transition-colors">
                ABOUT US
                <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </Link>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/3"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold font-montserrat mb-3">And More Digital.</h3>
            <div className="w-12 h-1 bg-accent mb-6"></div>
            
            <p className="mb-4">
              Marketing brands with care. What is marketing if it is not performance driven?
            </p>
            
            <p className="mb-6">
              We create digital experiences which stick with audiences and also reach the end objective. Trust us with making your brand visible and desired, with highly focused performance marketing.
            </p>
            
            <Link href="/services">
              <a className="inline-flex items-center text-dark font-medium hover:text-primary transition-colors">
                OUR SERVICES
                <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
