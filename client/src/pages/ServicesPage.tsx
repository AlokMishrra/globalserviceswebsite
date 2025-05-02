import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { services } from "@/lib/data";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const ServicesPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Our Services - Global Services</title>
        <meta name="description" content="Explore our comprehensive range of digital marketing services including SEO, social media marketing, content creation, and more." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold font-montserrat mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Our <span className="text-primary">Services</span>
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-dark/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Comprehensive digital marketing solutions tailored to help your business grow and succeed online.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">WHAT WE OFFER</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              Our Digital Marketing Services
            </h2>
            <p className="text-gray-700">
              We provide a wide range of digital marketing services to help businesses establish a strong online presence, engage with their audience, and drive measurable results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                id={service.slug}
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
                    <Button variant="link" className="p-0 text-primary font-medium">
                      Learn More <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 md:py-24 bg-light">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">OUR PROCESS</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              How We Work
            </h2>
            <p className="text-gray-700">
              Our systematic approach ensures that every project we undertake delivers exceptional results for our clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discovery",
                description: "We learn about your business, goals, target audience, and competitors to understand your unique needs."
              },
              {
                step: "02",
                title: "Strategy",
                description: "We develop a customized digital marketing strategy aligned with your business objectives."
              },
              {
                step: "03",
                title: "Implementation",
                description: "Our team executes the strategy with precision, creativity, and attention to detail."
              },
              {
                step: "04",
                title: "Optimization",
                description: "We continuously monitor, analyze, and optimize the campaign to maximize results."
              }
            ].map((process, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-6">
                  <span className="text-dark font-bold">{process.step}</span>
                </div>
                <h3 className="text-xl font-bold font-montserrat mb-4">{process.title}</h3>
                <p className="text-gray-700">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary font-medium">WHY CHOOSE US</span>
              <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
                What Sets Us Apart
              </h2>
              <div className="space-y-4">
                {[
                  "Expert team with specialized knowledge in various digital marketing disciplines",
                  "Data-driven approach that focuses on measurable results",
                  "Customized strategies tailored to your unique business needs",
                  "Transparent reporting and communication throughout the process",
                  "Continuous optimization to maximize return on investment",
                  "Cutting-edge tools and technologies for efficient campaign management"
                ].map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Digital marketing team" 
                className="rounded-lg shadow-xl" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-montserrat mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Elevate Your Digital Presence?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Contact us today to discuss how our digital marketing services can help your business grow.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/contact">
              <a className="inline-block bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-md font-bold transition-all transform hover:scale-105">
                Get Started
              </a>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
