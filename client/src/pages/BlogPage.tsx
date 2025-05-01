import React, { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { blogPosts } from "@/lib/data";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = [
  "All",
  ...Array.from(new Set(blogPosts.map((post) => post.category))),
];

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts
    .filter(post => 
      activeCategory === "All" || post.category === activeCategory
    )
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
      <Helmet>
        <title>Blog - Global Services</title>
        <meta name="description" content="Stay updated with the latest trends, tips, and strategies in digital marketing through our blog posts." />
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
              Our <span className="text-primary">Blog</span>
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-dark/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Stay updated with the latest trends, tips, and strategies in the digital marketing world.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
              <motion.div 
                className="w-full md:w-1/2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-4 pr-10 py-2 w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
                  />
                </div>
              </motion.div>
              <motion.div 
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-light hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <motion.div 
                  key={post.id}
                  className="group bg-light rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="h-48 bg-dark relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4 bg-secondary text-dark text-sm font-medium px-3 py-1 rounded">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{format(new Date(post.publishDate), 'MMMM d, yyyy')}</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{post.readTime} min read</span>
                    </div>
                    <h3 className="text-xl font-bold font-montserrat mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {post.excerpt}
                    </p>
                    <Link href={`/blog/${post.slug}`}>
                      <a className="inline-flex items-center text-primary font-medium">
                        Read More
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </a>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                <h3 className="text-2xl font-bold font-montserrat mb-4">No posts found</h3>
                <p className="text-gray-700 mb-6">
                  We couldn't find any blog posts that match your search criteria.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 md:py-24 bg-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold font-montserrat mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Subscribe to Our Newsletter
            </motion.h2>
            <motion.p 
              className="text-lg mb-8 text-gray-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Stay updated with our latest insights, trends, and digital marketing tips delivered directly to your inbox.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-white/10 border-gray-700 text-white placeholder:text-gray-400 flex-grow"
              />
              <Button className="bg-secondary text-dark hover:bg-secondary/90 whitespace-nowrap">
                Subscribe
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 md:py-24 bg-light">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">POPULAR TOPICS</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              Explore Our Most Read Topics
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Social Media Strategy", count: 24 },
              { title: "Content Marketing", count: 18 },
              { title: "SEO Techniques", count: 16 },
              { title: "Email Marketing", count: 12 },
            ].map((topic, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-bold font-montserrat mb-2">{topic.title}</h3>
                <p className="text-primary mb-4">{topic.count} Articles</p>
                <Button variant="link" className="text-dark hover:text-primary">
                  View Articles
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;
