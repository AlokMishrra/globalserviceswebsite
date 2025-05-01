import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/data";
import { format } from "date-fns";

const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-medium">OUR BLOG</span>
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mt-3 mb-6">
            Latest Insights
          </h2>
          <p className="text-lg text-gray-700">
            Stay updated with the latest trends, tips, and strategies in the digital marketing world.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
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
                  <span>{format(new Date(post.publishDate), 'MMMM d, yyyy')}</span>
                  <span className="mx-2">•</span>
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
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/blog">
            <a className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-md font-medium transition-all transform hover:scale-105">
              View All Posts
            </a>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
