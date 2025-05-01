import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, GraduationCap, Users, TrendingUp } from "lucide-react";
import { jobOpenings } from "@/lib/data";

const CareersSection: React.FC = () => {
  const benefits = [
    {
      icon: <Rocket className="text-dark" />,
      title: "Exciting Projects",
      description: "Work on diverse and challenging projects for clients across various industries."
    },
    {
      icon: <GraduationCap className="text-dark" />,
      title: "Continuous Learning",
      description: "Access to training, workshops, and resources to help you grow professionally."
    },
    {
      icon: <Users className="text-dark" />,
      title: "Collaborative Culture",
      description: "Join a team of passionate professionals who work together to achieve great results."
    },
    {
      icon: <TrendingUp className="text-dark" />,
      title: "Growth Opportunities",
      description: "Clear career paths and opportunities for advancement within the company."
    }
  ];

  return (
    <section id="careers" className="py-16 md:py-24 bg-light">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-medium">WORK WITH US</span>
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mt-3 mb-6">Join Our Team</h2>
          <p className="text-lg text-gray-700">
            We're always looking for talented individuals who are passionate about digital marketing to join our growing team.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            className="bg-white rounded-lg shadow-md p-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold font-montserrat mb-6">Why Work With Us?</h3>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{benefit.title}</h4>
                    <p className="text-gray-700">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-md p-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold font-montserrat mb-6">Current Openings</h3>
            
            <div className="space-y-6">
              {jobOpenings.map((job, index) => (
                <motion.div 
                  key={job.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.8 + (index * 0.1) }}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg">{job.title}</h4>
                    <span className={`${job.jobType === 'Freelance' ? 'bg-accent text-white' : 'bg-secondary text-dark'} text-sm font-medium px-3 py-1 rounded`}>
                      {job.jobType}
                    </span>
                  </div>
                  <p className="mt-2 mb-4 text-gray-700">
                    {job.description}
                  </p>
                  <Link href={`/careers/${job.slug}`}>
                    <a className="inline-flex items-center text-primary font-medium">
                      View Job Details
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </a>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-lg mb-6">Don't see a position that matches your skills? We're always interested in talented individuals.</p>
          <Link href="/contact">
            <a className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-md font-medium transition-all transform hover:scale-105">
              Send Us Your Resume
            </a>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CareersSection;
