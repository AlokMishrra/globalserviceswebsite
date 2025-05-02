import React from "react";
import HeroSection from "@/components/sections/HeroSection";
import WhatWeDoSection from "@/components/sections/WhatWeDoSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import IntegratedSolutionsSection from "@/components/sections/IntegratedSolutionsSection";
import OurWorkSection from "@/components/sections/OurWorkSection";
import StrategySection from "@/components/sections/StrategySection";
import TeamSection from "@/components/sections/TeamSection";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import CareersSection from "@/components/sections/CareersSection";
import { Helmet } from "react-helmet";

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Global Services - Digital Marketing Agency</title>
        <meta name="description" content="Global Services is a full-scale Digital Marketing Agency creating innovative solutions for clients across industries." />
      </Helmet>

      <HeroSection />
      <WhatWeDoSection />
      <AboutSection />
      <ServicesSection />
      <IntegratedSolutionsSection />
      <OurWorkSection />
      <StrategySection />
      <TeamSection />
      <BlogSection />
      <ContactSection />
      <CareersSection />
    </>
  );
};

export default HomePage;
