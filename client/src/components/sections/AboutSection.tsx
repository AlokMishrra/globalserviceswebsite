import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Lightbulb, 
  TrendingUp, 
  Users
} from "lucide-react";

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: <Lightbulb className="text-dark text-2xl" />,
      title: "Innovative Thinking",
      description: "We think outside the box to develop unique strategies that help your brand stand out in a crowded digital landscape."
    },
    {
      icon: <TrendingUp className="text-dark text-2xl" />,
      title: "Data-Driven Approach",
      description: "We use analytics and insights to guide our strategies, ensuring measurable results for every campaign."
    },
    {
      icon: <Users className="text-dark text-2xl" />,
      title: "Client-Focused",
      description: "We tailor our services to meet your specific needs, ensuring that your business goals are always our priority."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-light">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-medium">WHO WE ARE</span>
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mt-3 mb-6">
            We're Digital Marketing Experts
          </h2>
          <p className="text-lg text-gray-700">
            With years of experience and knowledge, we create solutions for our clients that are not only performance-driven but also creative and innovative.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-montserrat mb-4">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
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
          <Link 
            href="/about"
            className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-md font-medium transition-all transform hover:scale-105"
          >
            Learn More About Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
