import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const ServicesSection: React.FC = () => {
  // Fetch services from API
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['/api/services'],
    queryFn: async () => {
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      return await response.json();
    }
  });
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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load services. Please try again later.</p>
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: any, index: number) => (
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
                    src={service.imageUrl || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
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
                    <span className="inline-flex items-center text-primary font-medium">
                      Learn More
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No services found. Please check back later.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
