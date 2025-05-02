import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useRoute } from "wouter";
import { Helmet } from "react-helmet";
import { ArrowLeft, ExternalLink, Check, ChevronRight } from "lucide-react";
import { portfolioItems } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PortfolioItem } from "@shared/schema";
import { Loader2 } from "lucide-react";

const PortfolioItemPage: React.FC = () => {
  const [_, params] = useRoute<{ slug: string }>("/work/:slug");
  const [__, setLocation] = useLocation();
  
  const { 
    data: portfolioItem, 
    isLoading, 
    error 
  } = useQuery<PortfolioItem>({
    queryKey: ['/api/portfolio', params?.slug],
    queryFn: async () => {
      if (!params?.slug) throw new Error("No slug provided");
      try {
        const res = await apiRequest(`/api/portfolio/${params.slug}`);
        if (!res.ok) {
          throw new Error("Failed to fetch portfolio item");
        }
        return res.json();
      } catch (error) {
        console.error("Error fetching portfolio item:", error);
        throw error;
      }
    },
    enabled: !!params?.slug,
  });

  // Fallback to static data if API fails
  const staticItem = params?.slug ? portfolioItems.find((item) => item.slug === params.slug) : null;
  const displayedItem = portfolioItem || staticItem;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !displayedItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <p className="text-gray-600 mb-6">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Button
          onClick={() => setLocation("/work")}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Portfolio
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{displayedItem.title} - Case Study | Global Services</title>
        <meta name="description" content={`Explore our case study on ${displayedItem.title} and learn how we achieved remarkable results.`} />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link href="/work">
              <a className="inline-flex items-center text-dark/70 hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Portfolio
              </a>
            </Link>
          </motion.div>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="w-full md:w-1/2 order-2 md:order-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {displayedItem.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">
                {displayedItem.title}
              </h1>
              <p className="text-xl mb-8 text-dark/80">
                {displayedItem.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-all transform hover:scale-105">
                    Start Your Project
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="w-full md:w-1/2 order-1 md:order-2 mb-8 md:mb-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={'imageUrl' in displayedItem ? displayedItem.imageUrl || '' : displayedItem.image}
                  alt={displayedItem.title}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent opacity-60"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-16">
            <motion.div
              className="w-full md:w-2/3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary font-medium uppercase">Project Overview</span>
              <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-8">
                The Challenge
              </h2>
              <div className="prose prose-lg max-w-none">
                <p>
                  Our client, a {displayedItem.category.toLowerCase()} company, faced significant challenges in their digital presence and marketing efforts. They were struggling with low online visibility, minimal website traffic, and poor conversion rates, which were hindering their growth and market competitiveness.
                </p>
                <p>
                  The client needed a comprehensive solution to address these challenges and establish a strong digital presence that would attract their target audience, engage potential customers, and drive conversions. They approached us to develop and implement a strategic digital marketing campaign that would help them achieve their business objectives.
                </p>
                <h3 className="text-2xl font-bold font-montserrat mt-8 mb-4">
                  Our Approach
                </h3>
                <p>
                  We began by conducting thorough research to understand the client's business, target audience, industry landscape, and competitors. Based on our findings, we developed a tailored strategy that addressed their specific challenges and aligned with their goals.
                </p>
                <p>
                  Our approach involved a multi-faceted digital marketing campaign that integrated various channels and tactics to maximize reach and impact. We focused on creating compelling content, optimizing the website for search engines, enhancing user experience, and implementing targeted advertising campaigns.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="w-full md:w-1/3 bg-light rounded-lg p-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold font-montserrat mb-6">Project Info</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm text-dark/60 uppercase mb-2">Client</h4>
                  <p className="font-medium">{"client" in displayedItem ? displayedItem.client : "Industry-Leading Business"}</p>
                </div>
                <div>
                  <h4 className="text-sm text-dark/60 uppercase mb-2">Industry</h4>
                  <p className="font-medium">{displayedItem.category}</p>
                </div>
                <div>
                  <h4 className="text-sm text-dark/60 uppercase mb-2">Services Provided</h4>
                  <ul className="space-y-2">
                    {[
                      "Digital Strategy",
                      "Content Marketing",
                      "Social Media Marketing",
                      "SEO Optimization",
                      "Conversion Rate Optimization"
                    ].map((service, index) => (
                      <li key={index} className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 md:py-24 bg-light">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium uppercase">Our Strategy</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              The Solution
            </h2>
            <p className="text-lg text-dark/80">
              We implemented a comprehensive approach to address the client's challenges and achieve their goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Strategic Planning",
                description: "We developed a detailed digital marketing plan based on thorough market research and competitor analysis."
              },
              {
                title: "Website Optimization",
                description: "We improved website performance, user experience, and conversion pathways to maximize results."
              },
              {
                title: "Content Development",
                description: "We created engaging, valuable content that resonated with the target audience and established the client as an industry leader."
              },
              {
                title: "Targeted Advertising",
                description: "We implemented precision advertising campaigns to reach the most relevant potential customers."
              }
            ].map((solution, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-bold font-montserrat mb-4">{solution.title}</h3>
                <p className="text-dark/80">{solution.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium uppercase">Results & Impact</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              The Outcome
            </h2>
            <p className="text-lg text-dark/80">
              Our strategy delivered exceptional results, exceeding the client's expectations and achieving significant improvements across key metrics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                stat: "185%",
                label: "Increase in Website Traffic"
              },
              {
                stat: "210%",
                label: "Growth in Conversion Rate"
              },
              {
                stat: "164%",
                label: "Increase in Revenue"
              }
            ].map((result, index) => (
              <motion.div
                key={index}
                className="bg-light p-8 rounded-lg text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{result.stat}</div>
                <p className="text-dark/80">{result.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="bg-light p-8 md:p-12 rounded-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-4xl text-primary mb-6">"</div>
            <p className="text-xl italic text-dark/80 mb-8">
              Global Services transformed our digital presence and exceeded all our expectations. Their strategic approach and dedicated team helped us achieve remarkable growth in a competitive market. We continue to work with them as our trusted digital marketing partner.
            </p>
            <div>
              <h4 className="font-bold font-montserrat">John Smith</h4>
              <p className="text-dark/60">Marketing Director, {"client" in displayedItem ? displayedItem.client : displayedItem.category + " Company"}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="py-16 md:py-24 bg-light">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium uppercase">Explore More</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              Related Projects
            </h2>
            <p className="text-lg text-dark/80">
              Check out some of our other case studies to see how we've helped businesses achieve their goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioItems
              .filter(item => item.id !== displayedItem.id)
              .slice(0, 3)
              .map((project, index) => (
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
                        <ChevronRight className="h-5 w-5 ml-2" />
                      </a>
                    </Link>
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
            Ready to Transform Your Business?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Let's create a customized strategy that drives results for your business.
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

export default PortfolioItemPage;