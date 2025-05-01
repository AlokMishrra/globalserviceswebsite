import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { jobOpenings } from "@/lib/data";
import { ArrowRight, CheckCircle, Rocket, GraduationCap, Users, Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CareersPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Careers - Global Services</title>
        <meta name="description" content="Join our team of digital marketing experts at Global Services. View current job openings and learn about our company culture." />
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
              Work With <span className="text-primary">Us</span>
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-dark/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join our team of passionate digital marketing professionals and help businesses achieve their online goals.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">WHY WORK WITH US</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              Benefits of Joining Our Team
            </h2>
            <p className="text-gray-700">
              At Global Services, we value our team members and provide an environment where you can grow, learn, and thrive.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Rocket className="text-dark" />,
                title: "Exciting Projects",
                description: "Work on diverse and challenging projects for clients across various industries."
              },
              {
                icon: <GraduationCap className="text-dark" />,
                title: "Learning & Growth",
                description: "Access to training, workshops, and resources to help you grow professionally."
              },
              {
                icon: <Users className="text-dark" />,
                title: "Collaborative Culture",
                description: "Join a team of passionate professionals who work together to achieve great results."
              },
              {
                icon: <Heart className="text-dark" />,
                title: "Work-Life Balance",
                description: "Flexible working arrangements and policies that support your personal well-being."
              }
            ].map((benefit, index) => (
              <motion.div 
                key={index}
                className="bg-light p-8 rounded-lg shadow-md text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold font-montserrat mb-4">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Culture Section */}
      <section className="py-16 md:py-24 bg-light">
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
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Our team culture" 
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
              <span className="text-primary font-medium">OUR CULTURE</span>
              <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
                What It's Like to Work Here
              </h2>
              <p className="text-gray-700 mb-6">
                At Global Services, we foster a culture of innovation, collaboration, and continuous learning. We believe that happy employees lead to happy clients, which is why we strive to create a positive and supportive work environment.
              </p>
              
              <div className="space-y-4">
                {[
                  "Open communication and transparency across all levels",
                  "Recognition and appreciation of individual contributions",
                  "Opportunities to pitch ideas and lead projects",
                  "Regular team building activities and events",
                  "Commitment to diversity, equity, and inclusion"
                ].map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Current Openings Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">JOIN OUR TEAM</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              Current Job Openings
            </h2>
            <p className="text-gray-700">
              We're always looking for talented individuals who are passionate about digital marketing to join our growing team.
            </p>
          </motion.div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {jobOpenings.map((job, index) => (
              <motion.div 
                key={job.id}
                className="bg-light p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold font-montserrat">{job.title}</h3>
                      <span className={`${job.jobType === 'Freelance' ? 'bg-accent text-white' : 'bg-secondary text-dark'} text-sm font-medium px-3 py-1 rounded-full`}>
                        {job.jobType}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{job.description}</p>
                  </div>
                  <Link href={`/careers/${job.slug}`}>
                    <a className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-all whitespace-nowrap">
                      Apply Now
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </a>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-lg mb-6">Don't see a position that matches your skills? We're always interested in talented individuals.</p>
            <Link href="/contact">
              <a className="inline-block bg-dark hover:bg-dark/90 text-white px-8 py-4 rounded-md font-medium transition-all transform hover:scale-105">
                Send Us Your Resume
              </a>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Employee Testimonials */}
      <section className="py-16 md:py-24 bg-light">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">EMPLOYEE TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              What Our Team Says
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Joining Global Services was one of the best career decisions I've made. The collaborative environment and growth opportunities have helped me develop both professionally and personally.",
                name: "Rahul Sharma",
                position: "Senior SEO Specialist",
                tenure: "3 years"
              },
              {
                quote: "I love the diversity of projects we work on. Every day brings new challenges and learning opportunities, which keeps the work exciting and fulfilling.",
                name: "Priya Patel",
                position: "Content Marketing Manager",
                tenure: "2 years"
              },
              {
                quote: "The leadership team truly values employee input and creates an environment where everyone's ideas are heard. It's refreshing to work for a company that cares about its employees as much as its clients.",
                name: "Aditya Kumar",
                position: "Social Media Strategist",
                tenure: "1.5 years"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl text-primary mb-4">"</div>
                <p className="text-gray-700 mb-6 italic">{testimonial.quote}</p>
                <div>
                  <h4 className="font-bold font-montserrat">{testimonial.name}</h4>
                  <p className="text-gray-600">{testimonial.position}</p>
                  <p className="text-primary text-sm">With us for {testimonial.tenure}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">APPLICATION PROCESS</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              How to Join Our Team
            </h2>
            <p className="text-gray-700">
              Our recruitment process is designed to be transparent and efficient, helping us find the right talent while giving you a glimpse into our company culture.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Application Review",
                description: "We review your application and resume to assess your skills and experience."
              },
              {
                step: "02",
                title: "Initial Interview",
                description: "A phone or video call to discuss your background and interest in the role."
              },
              {
                step: "03",
                title: "Skills Assessment",
                description: "Depending on the role, you may be asked to complete a skills test or assignment."
              },
              {
                step: "04",
                title: "Final Interview",
                description: "Meet with the team and discuss the role, company culture, and your career goals."
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-dark font-bold">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold font-montserrat mb-4">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
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
            Ready to Start Your Career With Us?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore our current openings and join our team of digital marketing experts.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button className="bg-secondary text-dark hover:bg-secondary/90 px-8 py-4 rounded-md font-bold">
              View Job Openings
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CareersPage;
