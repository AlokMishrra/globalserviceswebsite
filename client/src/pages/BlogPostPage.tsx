import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useRoute } from "wouter";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Facebook, 
  Linkedin, 
  Twitter, 
  User 
} from "lucide-react";
import { blogPosts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BlogPost } from "@shared/schema";
import { Loader2 } from "lucide-react";

const BlogPostPage: React.FC = () => {
  const [_, params] = useRoute<{ slug: string }>("/blog/:slug");
  const [__, setLocation] = useLocation();
  
  const { 
    data: post, 
    isLoading, 
    error 
  } = useQuery<BlogPost>({
    queryKey: ['/api/blog', params?.slug],
    queryFn: async () => {
      if (!params?.slug) throw new Error("No slug provided");
      try {
        const res = await apiRequest(`/api/blog/${params.slug}`);
        if (!res.ok) {
          throw new Error("Failed to fetch blog post");
        }
        return res.json();
      } catch (error) {
        console.error("Error fetching blog post:", error);
        throw error;
      }
    },
    enabled: !!params?.slug,
  });

  // Fallback to static data if API fails
  const staticPost = params?.slug ? blogPosts.find((p) => p.slug === params.slug) : null;
  const displayedPost = post || staticPost;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !displayedPost) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-6">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Button
          onClick={() => setLocation("/blog")}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{displayedPost.title} - Global Services</title>
        <meta name="description" content={displayedPost.excerpt} />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-12 md:pt-20 pb-16 md:pb-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <motion.div
              className="w-full max-w-5xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/blog">
                <a className="inline-flex items-center text-dark/70 hover:text-primary mb-6 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </a>
              </Link>
              
              <div className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded mb-4">
                {displayedPost.category}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold font-montserrat leading-tight mb-6">
                {displayedPost.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-dark/70">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{displayedPost.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(displayedPost.publishDate), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{displayedPost.readTime} min read</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="relative -mt-8 md:-mt-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src={'imageUrl' in displayedPost ? displayedPost.imageUrl : displayedPost.image}
              alt={displayedPost.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <motion.div
              className="w-full lg:w-2/3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: displayedPost.content }} />
              </div>

              {/* Tags and Share */}
              <div className="flex flex-wrap justify-between items-center mt-12 pt-8 border-t">
                <div className="mb-4 lg:mb-0">
                  <span className="text-dark font-medium mr-3">Tags:</span>
                  <div className="inline-flex flex-wrap gap-2">
                    {["digital marketing", "social media", "content strategy"].map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-light hover:bg-light/80 px-3 py-1 rounded text-sm cursor-pointer transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-dark font-medium mr-3">Share:</span>
                  <div className="flex gap-2">
                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-light hover:bg-primary hover:text-white transition-colors">
                      <Facebook className="h-4 w-4" />
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-light hover:bg-primary hover:text-white transition-colors">
                      <Twitter className="h-4 w-4" />
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-light hover:bg-primary hover:text-white transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-8 bg-light rounded-lg">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
                      alt={displayedPost.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold font-montserrat mb-2">{displayedPost.author}</h3>
                    <p className="text-gray-700 mb-3">
                      John is a digital marketing expert with over 10 years of experience in the industry.
                      He specializes in content marketing, SEO, and social media strategy.
                    </p>
                    <div className="flex justify-center md:justify-start gap-2">
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-primary hover:text-white transition-colors">
                        <Twitter className="h-4 w-4" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-primary hover:text-white transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="w-full lg:w-1/3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              {/* Recent Posts */}
              <div className="bg-light p-8 rounded-lg mb-8">
                <h3 className="text-xl font-bold font-montserrat mb-6">Recent Posts</h3>
                <div className="space-y-6">
                  {blogPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex gap-4">
                      <div className="flex-shrink-0 w-20 h-20 rounded overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium font-montserrat mb-1 line-clamp-2">
                          <Link href={`/blog/${post.slug}`}>
                            <a className="hover:text-primary transition-colors">
                              {post.title}
                            </a>
                          </Link>
                        </h4>
                        <div className="text-sm text-gray-600">
                          {format(new Date(post.publishDate), 'MMMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link href="/blog">
                    <a className="inline-flex items-center text-primary hover:text-primary/80">
                      View All Posts
                      <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                    </a>
                  </Link>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-light p-8 rounded-lg mb-8">
                <h3 className="text-xl font-bold font-montserrat mb-6">Categories</h3>
                <div className="space-y-2">
                  {Array.from(new Set(blogPosts.map((post) => post.category))).map((category, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <span className="hover:text-primary cursor-pointer transition-colors">
                        {category}
                      </span>
                      <span className="bg-white text-xs px-2 py-1 rounded">
                        {blogPosts.filter((post) => post.category === category).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-dark text-white p-8 rounded-lg">
                <h3 className="text-xl font-bold font-montserrat mb-4">Newsletter</h3>
                <p className="mb-6">
                  Subscribe to our newsletter to receive the latest updates and insights.
                </p>
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button className="bg-primary hover:bg-primary/90 text-white w-full">
                    Subscribe
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 md:py-24 bg-light">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">MORE TO EXPLORE</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              Related Articles
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts
              .filter((p) => p.category === displayedPost.category && p.id !== displayedPost.id)
              .slice(0, 3)
              .map((post, index) => (
                <motion.div
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{format(new Date(post.publishDate), 'MMMM d, yyyy')}</span>
                    </div>
                    <h3 className="text-xl font-bold font-montserrat mb-3 hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        <a>{post.title}</a>
                      </Link>
                    </h3>
                    <p className="text-gray-700 mb-4 line-clamp-2">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`}>
                      <a className="inline-flex items-center text-primary font-medium">
                        Read More
                        <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
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

export default BlogPostPage;