import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

const BlogSection: React.FC = () => {
  // Fetch blog posts from API
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['/api/blog-posts'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/blog-posts');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        return await response.json();
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        return [];
      }
    }
  });
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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load blog posts. Please try again later.</p>
          </div>
        ) : blogPosts && blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post: any, index: number) => (
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
                    src={post.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-secondary text-dark text-sm font-medium px-3 py-1 rounded">
                    {post.category || "Blog"}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <span>{format(new Date(post.publishedAt || post.createdAt), 'MMMM d, yyyy')}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readingTime || '5'} min read</span>
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {post.excerpt || post.content?.substring(0, 120) + '...'}
                  </p>
                  <Link href={`/blog/${post.slug}`}>
                    <span className="inline-flex items-center text-primary font-medium">
                      Read More
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts found. Please check back later.</p>
          </div>
        )}
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/blog">
            <span className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-md font-medium transition-all transform hover:scale-105">
              View All Posts
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
