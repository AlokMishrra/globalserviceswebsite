import React, { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { portfolioItems } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const categories = [
  "All",
  ...Array.from(new Set(portfolioItems.map((item) => item.category))),
];

const WorkPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = activeCategory === "All"
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Our Work - Global Services</title>
        <meta name="description" content="Explore our portfolio of successful digital marketing campaigns, website designs, and growth strategies for clients across various industries." />
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
              Our <span className="text-primary">Work</span>
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-dark/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Check out some of our recent projects and see how we've helped businesses across various industries achieve their digital marketing goals.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Portfolio Filter Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-light hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((project, index) => (
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
                  <div className="bg-secondary text-dark text-sm font-medium px-3 py-1 rounded w-fit mb-2">
                    {project.category}
                  </div>
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
        </div>
      </section>

      {/* Our Process Section */}
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
              How We Deliver Success
            </h2>
            <p className="text-gray-700">
              Our proven methodology ensures every project we undertake delivers exceptional results for our clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "Research & Strategy",
                description: "We begin with thorough research and develop a customized strategy based on your goals and target audience."
              },
              {
                icon: "💡",
                title: "Creative Execution",
                description: "Our team of experts creates compelling content and designs that resonate with your audience and reflect your brand."
              },
              {
                icon: "📊",
                title: "Analysis & Optimization",
                description: "We continuously monitor performance, analyze data, and optimize campaigns to maximize results and ROI."
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
                <div className="text-4xl mb-6">{process.icon}</div>
                <h3 className="text-xl font-bold font-montserrat mb-4">{process.title}</h3>
                <p className="text-gray-700">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">CLIENT TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              What Our Clients Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Global Services transformed our online presence completely. Their strategic approach to social media marketing helped us increase engagement by over 200%.",
                name: "Sarah Johnson",
                position: "Marketing Director",
                company: "TechNova Inc."
              },
              {
                quote: "The SEO campaign delivered by Global Services exceeded our expectations. We've seen a significant increase in organic traffic and conversions.",
                name: "Michael Chen",
                position: "CEO",
                company: "Horizon Solutions"
              },
              {
                quote: "Working with Global Services has been a game-changer for our brand. Their creative content marketing strategy has helped us establish authority in our industry.",
                name: "Emily Rodriguez",
                position: "Brand Manager",
                company: "Green Earth Products"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-light p-8 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl text-primary mb-4">"</div>
                <p className="text-gray-700 mb-6 italic">{testimonial.quote}</p>
                <div>
                  <h4 className="font-bold font-montserrat">{testimonial.name}</h4>
                  <p className="text-gray-600">{testimonial.position}, {testimonial.company}</p>
                </div>
              </motion.div>
            ))}
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
            Ready to Start Your Project?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Let's work together to create a digital strategy that drives results for your business.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/contact">
              <a className="inline-block bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-md font-bold transition-all transform hover:scale-105">
                Contact Us
              </a>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default WorkPage;
