import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";

const AboutPage: React.FC = () => {
  // Fetch team members from API
  const { data: teamMembers, isLoading, error } = useQuery({
    queryKey: ['/api/team'],
    queryFn: async () => {
      const response = await fetch('/api/team');
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      return await response.json();
    }
  });
  return (
    <>
      <Helmet>
        <title>About Us - Global Services</title>
        <meta name="description" content="Learn about Global Services, our mission, values, and the team behind our digital marketing success." />
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
              About <span className="text-primary">Global Services</span>
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-dark/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              We are a team of digital marketing experts passionate about creating innovative strategies and solutions that drive results.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
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
              <img 
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Our team" 
                className="rounded-lg shadow-xl" 
              />
            </motion.div>
            <motion.div 
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-primary font-medium">OUR STORY</span>
              <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
                How We Got Started
              </h2>
              <p className="text-gray-700 mb-4">
                Founded in 2015, Global Services began with a simple mission: to provide businesses with digital marketing solutions that truly work. What started as a small team of passionate marketers has grown into a full-service digital marketing agency serving clients across industries.
              </p>
              <p className="text-gray-700">
                Our journey has been defined by continuous learning, adaptation to the ever-changing digital landscape, and a relentless focus on delivering results for our clients. Today, we pride ourselves on combining data-driven strategies with creative excellence to help businesses thrive online.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission and Values */}
      <section className="py-16 md:py-24 bg-light">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">MISSION & VALUES</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              What Drives Us Forward
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold font-montserrat mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To empower businesses with innovative digital solutions that drive growth, enhance brand visibility, and create meaningful connections with their audience. We are committed to delivering measurable results through strategic, data-driven approaches tailored to each client's unique needs.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold font-montserrat mb-4">Our Values</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-2">•</span>
                  <span><strong>Excellence:</strong> We strive for excellence in everything we do, from strategy development to execution.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-2">•</span>
                  <span><strong>Innovation:</strong> We embrace new technologies and approaches to stay ahead in the digital landscape.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-2">•</span>
                  <span><strong>Integrity:</strong> We build relationships based on trust, transparency, and honesty.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-2">•</span>
                  <span><strong>Collaboration:</strong> We work closely with our clients, treating their goals as our own.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">OUR TEAM</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              The People Behind Our Success
            </h2>
            <p className="text-gray-700">
              Meet our talented team of digital marketing professionals who bring their expertise and passion to every project.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Failed to load team members. Please try again later.</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-md">
                Retry
              </button>
            </div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member: any, index: number) => (
                <motion.div 
                  key={member.id}
                  className="bg-light rounded-lg overflow-hidden shadow-md"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.imageUrl || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                      alt={member.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-montserrat mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.position}</p>
                    <p className="text-gray-700">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No team members found. Please check back later.</p>
            </div>
          )}
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
            Ready to Work With Us?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Let's create digital experiences that drive results for your business.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/contact">
              <span className="inline-block bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-md font-bold transition-all transform hover:scale-105">
                Get in Touch
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
