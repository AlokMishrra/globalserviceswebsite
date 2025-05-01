import React from "react";
import { motion } from "framer-motion";
import { Target, Lightbulb, TrendingUp } from "lucide-react";

const StrategySection: React.FC = () => {
  const strategies = [
    {
      icon: <Target className="text-dark" />,
      name: "Strategic Planning"
    },
    {
      icon: <Lightbulb className="text-dark" />,
      name: "Creative Execution"
    },
    {
      icon: <TrendingUp className="text-dark" />,
      name: "Results Optimization"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="w-full lg:w-1/2 mb-10 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Strategic approach" 
              className="rounded-lg shadow-xl" 
            />
          </motion.div>
          
          <motion.div 
            className="w-full lg:w-1/2 lg:pl-12"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-6">
              Strategy, <br />Creativity & <br />Results!
            </h2>
            <div className="w-12 h-1 bg-accent mb-6"></div>
            
            <p className="text-lg mb-6">
              Our approach is backed by strategy, creativity and optimised for results.
            </p>
            
            <p className="mb-6 text-gray-700">
              We understand that each client and each project we undertake is different and so we have developed a repeatable process that we know works. Our methodology puts the user at the heart of the experience from the start. By working iteratively through a pre-defined set of stages, we create beautiful and usable solutions that deliver meaningful results.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-8">
              {strategies.map((strategy, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    {strategy.icon}
                  </div>
                  <span className="font-medium">{strategy.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StrategySection;
