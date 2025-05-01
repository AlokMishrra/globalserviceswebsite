import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { services } from "@/lib/data";

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-medium">OUR SERVICES</span>
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mt-3 mb-6">
            What We Can Do For You
          </h2>
          <p className="text-lg text-gray-700">
            We offer a comprehensive range of digital marketing services to help your business grow and succeed online.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              className="group bg-light rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-48 bg-dark relative overflow-hidden">
                <img 
                  src={service.image}
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent flex items-end">
                  <h3 className="text-xl font-bold font-montserrat text-white p-6">{service.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  {service.description}
                </p>
                <Link href={`/services/${service.slug}`}>
                  <a className="inline-flex items-center text-primary font-medium">
                    Learn More
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </a>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
