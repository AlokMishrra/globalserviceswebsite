import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { portfolioItems } from "@/lib/data";

const OurWorkSection: React.FC = () => {
  return (
    <section id="work" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-medium">OUR PORTFOLIO</span>
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mt-3 mb-6">
            Recent Projects
          </h2>
          <p className="text-lg text-gray-700">
            Check out some of our recent work to see how we've helped businesses across various industries achieve their goals.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((project, index) => (
            <motion.div 
              key={project.id}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold font-montserrat text-white mb-2">{project.title}</h3>
                <p className="text-gray-200 mb-4">{project.description}</p>
                <Link href={`/work/${project.slug}`}>
                  <a className="inline-flex items-center text-secondary font-medium">
                    View Case Study
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </a>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/contact">
            <a className="inline-block bg-dark hover:bg-dark/90 text-white px-8 py-4 rounded-md font-medium transition-all transform hover:scale-105">
              Start Your Project
            </a>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default OurWorkSection;
