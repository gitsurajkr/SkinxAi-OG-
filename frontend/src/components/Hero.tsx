
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Scan } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0tMjAgMEMxNiAzNS4xIDE1LjEgMzYgMTQgMzZzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem00MCAwYzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Hero Content */}
          <motion.div 
            className="w-full md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-gradient">
                AI-Powered
              </span>{" "}
              Skin Analysis
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Get instant analysis of skin conditions with our advanced AI technology. 
              Professional-grade diagnosis, right from your device.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="btn-gradient text-white text-lg py-6 px-8 rounded-full w-full sm:w-auto animate-pulse-glow"
                  asChild
                >
                  <Link to="/scan" className="text-black flex items-center gap-2">
                    <Scan size={20} />
                    Start Scan
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className="border-skinx-teal text-skinx-teal hover:bg-skinx-teal-light/10 text-lg py-6 px-8 rounded-full w-full sm:w-auto"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    Talk to Doctor
                  </span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Hero Image */}
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -z-10 w-full h-full bg-gradient-to-r from-skinx-purple-light/30 to-skinx-teal-light/30 rounded-full blur-3xl" />
              <div className="glass-card rounded-2xl shadow-xl overflow-hidden border border-white/10">
                <div className="relative">
                  <img 
                    src="/placeholder.svg" 
                    alt="AI Skin Analysis" 
                    className="w-full h-auto rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <motion.div 
                className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-r from-skinx-teal-light to-skinx-teal/70 rounded-full"
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4,
                  ease: "easeInOut" 
                }}
              />
              <motion.div 
                className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-r from-skinx-purple-light to-skinx-purple rounded-full"
                animate={{ 
                  y: [0, 10, 0],
                  opacity: [0.6, 0.9, 0.6]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;