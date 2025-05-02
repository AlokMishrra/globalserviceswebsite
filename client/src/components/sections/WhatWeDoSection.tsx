import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FadeIn, Stagger } from "@/components/ui/animations";

const WhatWeDoSection: React.FC = () => {
  const headingChars = ["W", "h", "a", "t", " ", "w", "e", " ", "d", "o", "?"];

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:space-x-12">
          <FadeIn 
            className="w-full md:w-1/3 mb-10 md:mb-0"
            delay={0.2}
            direction="up"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-montserrat mb-4 flex flex-wrap">
              {headingChars.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.5 + (index * 0.05),
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  className={char === "?" ? "text-primary" : ""}
                >
                  {char}
                </motion.span>
              ))}
            </h2>
          </FadeIn>
          
          <motion.div 
            className="w-full md:w-1/3 mb-10 md:mb-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.h3 
              className="text-2xl font-bold font-montserrat mb-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Digital.
            </motion.h3>
            
            <motion.div 
              className="w-12 h-1 bg-accent mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            ></motion.div>
            
            <motion.p 
              className="text-lg italic mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              We create super-rich experiences online!
            </motion.p>
            
            <motion.p 
              className="mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Global Services is a full-scale Digital Marketing Agency creating solutions for our clients which are not only performance-driven, but also creative. We run exceptional digital campaigns, even as you read this!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link 
                href="/about"
                className="inline-flex items-center text-dark font-medium hover:text-primary transition-colors group"
              >
                ABOUT US
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:text-primary" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.h3 
              className="text-2xl font-bold font-montserrat mb-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              And More Digital.
            </motion.h3>
            
            <motion.div 
              className="w-12 h-1 bg-accent mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            ></motion.div>
            
            <motion.p 
              className="mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Marketing brands with care. What is marketing if it is not performance driven?
            </motion.p>
            
            <motion.p 
              className="mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              We create digital experiences which stick with audiences and also reach the end objective. Trust us with making your brand visible and desired, with highly focused performance marketing.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link 
                href="/services"
                className="inline-flex items-center text-dark font-medium hover:text-primary transition-colors group"
              >
                OUR SERVICES
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:text-primary" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;