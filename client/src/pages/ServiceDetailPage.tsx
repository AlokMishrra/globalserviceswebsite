import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useRoute } from "wouter";
import { Helmet } from "react-helmet";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import { services } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Service } from "@shared/schema";
import { Loader2 } from "lucide-react";

const ServiceDetailPage: React.FC = () => {
  const [_, params] = useRoute<{ slug: string }>("/services/:slug");
  const [__, setLocation] = useLocation();
  
  const { 
    data: service, 
    isLoading, 
    error 
  } = useQuery<Service>({
    queryKey: ['/api/services', params?.slug],
    queryFn: async () => {
      if (!params?.slug) throw new Error("No slug provided");
      try {
        const res = await apiRequest(`/api/services/${params.slug}`);
        if (!res.ok) {
          throw new Error("Failed to fetch service");
        }
        return res.json();
      } catch (error) {
        console.error("Error fetching service:", error);
        throw error;
      }
    },
    enabled: !!params?.slug,
  });

  // Fallback to static data if API fails
  const staticService = params?.slug ? services.find((s) => s.slug === params.slug) : null;
  const displayedService = service || staticService;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !displayedService) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
        <p className="text-gray-600 mb-6">
          The service you're looking for doesn't exist or has been removed.
        </p>
        <Button
          onClick={() => setLocation("/services")}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Button>
      </div>
    );
  }

  // Benefits for this specific service
  const benefits = [
    {
      title: "Increased Visibility",
      description: "Boost your online presence and reach a larger audience through targeted strategies."
    },
    {
      title: "Higher Conversion Rates",
      description: "Turn more visitors into customers with optimized marketing funnels and engaging content."
    },
    {
      title: "Better ROI",
      description: "Get more value from your marketing spend with data-driven campaigns and continuous optimization."
    },
    {
      title: "Expert Guidance",
      description: "Benefit from our team of specialists who stay up-to-date with the latest industry trends."
    }
  ];

  // Process steps for this service
  const processSteps = [
    {
      number: "01",
      title: "Discovery & Research",
      description: "We start by understanding your business goals, target audience, and current marketing efforts."
    },
    {
      number: "02",
      title: "Strategy Development",
      description: "Based on our findings, we create a customized strategy tailored to your specific needs and goals."
    },
    {
      number: "03",
      title: "Implementation",
      description: "Our team executes the strategy with precision, utilizing the latest tools and techniques."
    },
    {
      number: "04",
      title: "Monitoring & Optimization",
      description: "We continuously track performance and make data-driven adjustments to maximize results."
    }
  ];

  return (
    <>
      <Helmet>
        <title>{displayedService.title} - Global Services</title>
        <meta name="description" content={displayedService.description} />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="w-full md:w-1/2 order-2 md:order-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/services">
                <a className="inline-flex items-center text-dark/70 hover:text-primary mb-6 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Services
                </a>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">
                {displayedService.title}
              </h1>
              <p className="text-xl mb-8 text-dark/80">
                {displayedService.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-all transform hover:scale-105">
                    Get Started
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-dark/20 hover:border-primary hover:text-primary px-6 py-3 rounded-md font-medium transition-all transform hover:scale-105"
                  onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Our Process
                </Button>
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
                  src={'imageUrl' in displayedService ? displayedService.imageUrl : (displayedService.image || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")}
                  alt={displayedService.title}
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
              <span className="text-primary font-medium uppercase">Service Overview</span>
              <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-8">
                What Is {displayedService.title}?
              </h2>
              <div className="prose prose-lg max-w-none">
                <p>
                  In today's competitive digital landscape, {displayedService.title.toLowerCase()} has become essential for businesses looking to thrive online. Our comprehensive {displayedService.title.toLowerCase()} service is designed to help your business stand out from the competition and achieve sustainable growth.
                </p>
                <p>
                  We utilize a combination of cutting-edge tools, data-driven insights, and creative strategies to deliver exceptional results. Our team of experienced professionals stays up-to-date with the latest industry trends to ensure that your marketing efforts are always ahead of the curve.
                </p>
                <p>
                  Whether you're looking to increase brand awareness, drive more traffic to your website, generate qualified leads, or boost conversions, our {displayedService.title.toLowerCase()} service can help you reach your goals.
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
              <h3 className="text-xl font-bold font-montserrat mb-6">Key Features</h3>
              <ul className="space-y-4">
                {["Customized Strategies", "Data-Driven Approach", "Continuous Optimization", "Transparent Reporting", "Dedicated Support"].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium mb-3">Perfect For:</h4>
                <div className="flex flex-wrap gap-2">
                  {["Small Businesses", "E-commerce", "Startups", "B2B Companies", "Local Services"].map((item, index) => (
                    <span key={index} className="bg-white px-3 py-1 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-light">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium uppercase">Benefits</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              Why Choose Our {displayedService.title}?
            </h2>
            <p className="text-lg text-dark/80">
              Our service delivers tangible results that help your business grow and succeed in today's competitive market.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-bold font-montserrat mb-4">{benefit.title}</h3>
                <p className="text-dark/80">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium uppercase">Our Process</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              How We Deliver Results
            </h2>
            <p className="text-lg text-dark/80">
              Our systematic approach ensures consistent quality and exceptional results for your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-light p-8 rounded-lg relative group hover:bg-primary/5 transition-colors"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-primary/20 group-hover:text-primary/30 transition-colors mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold font-montserrat mb-3">{step.title}</h3>
                <p className="text-dark/80">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-primary/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 md:py-24 bg-light">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium uppercase">Case Studies</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              Our Success Stories
            </h2>
            <p className="text-lg text-dark/80">
              See how we've helped businesses like yours achieve remarkable results through our {displayedService.title.toLowerCase()} service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "E-commerce Revenue Growth",
                client: "Fashion Retailer",
                image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                result: "174% increase in online sales"
              },
              {
                title: "Lead Generation Campaign",
                client: "B2B Software Company",
                image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                result: "215% more qualified leads"
              },
              {
                title: "Brand Awareness Boost",
                client: "Food & Beverage Startup",
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                result: "320% increase in social engagement"
              }
            ].map((caseStudy, index) => (
              <motion.div
                key={index}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-primary font-medium mb-2">{caseStudy.client}</div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 group-hover:text-primary transition-colors">
                    {caseStudy.title}
                  </h3>
                  <div className="mb-4 text-dark font-medium">{caseStudy.result}</div>
                  <Link href="/portfolio">
                    <a className="inline-flex items-center text-primary font-medium">
                      View Case Study
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium uppercase">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-dark/80">
              Find answers to common questions about our {displayedService.title.toLowerCase()} service.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                question: `How long does it take to see results from ${displayedService.title}?`,
                answer: "While some initial results can be seen within a few weeks, significant results typically emerge after 2-3 months. Digital marketing is a long-term investment that builds momentum over time."
              },
              {
                question: "Do you offer customized packages?",
                answer: "Yes, we create tailored solutions based on your specific business needs, goals, and budget. We believe in personalized strategies rather than one-size-fits-all approaches."
              },
              {
                question: "How do you measure success?",
                answer: "We track key performance indicators (KPIs) aligned with your business goals. These may include website traffic, conversion rates, lead quality, social engagement, and ultimately, ROI on your marketing spend."
              },
              {
                question: "Do I need to sign a long-term contract?",
                answer: "While we recommend a minimum 3-month commitment to see meaningful results, we offer flexible contract terms. We're confident in our ability to deliver value, which is why we don't lock clients into lengthy contracts."
              },
              {
                question: "How much does your service cost?",
                answer: "Pricing varies based on the scope of work, your business needs, and competitive factors in your industry. We offer transparent pricing with different tiers to suit various budget levels."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="mb-6 bg-light p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-bold font-montserrat mb-3">{faq.question}</h3>
                <p className="text-dark/80">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-dark text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Ready to Transform Your Business with {displayedService.title}?
              </h2>
              <p className="text-xl text-white/80 mb-0 md:mb-4">
                Get in touch with our experts today for a free consultation and discover how we can help you achieve your business goals.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex justify-center md:justify-end">
              <Link href="/contact">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-md font-medium transition-all transform hover:scale-105 w-full md:w-auto text-center">
                  Contact Us Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 md:py-24 bg-light">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium uppercase">EXPLORE MORE</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              Related Services
            </h2>
            <p className="text-lg text-dark/80">
              Discover our other services that can complement your {displayedService.title.toLowerCase()} efforts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services
              .filter(s => s.title !== displayedService.title)
              .slice(0, 3)
              .map((service, index) => (
                <motion.div
                  key={service.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="p-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <div dangerouslySetInnerHTML={{ __html: service.icon }} />
                    </div>
                    <h3 className="text-xl font-bold font-montserrat mb-4">{service.title}</h3>
                    <p className="text-dark/80 mb-6 line-clamp-3">{service.description}</p>
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
    </>
  );
};

export default ServiceDetailPage;