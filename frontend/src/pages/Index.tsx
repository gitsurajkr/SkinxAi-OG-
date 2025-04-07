
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import { 
  Brain, 
  ShieldCheck, 
  Clock, 
  Users,
  Microscope,
  HeartPulse,
  Share2,
  Lock,
  LineChart
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Detection",
      description: "Advanced machine learning algorithms identify skin conditions with high accuracy."
    },
    {
      icon: Users,
      title: "Expert Consultation",
      description: "Connect with certified dermatologists for professional advice and treatment."
    },
    {
      icon: ShieldCheck,
      title: "Privacy First",
      description: "Your data is encrypted and securely stored with strict privacy protocols."
    },
    {
      icon: Clock,
      title: "Real-Time Analysis",
      description: "Get instant results and insights about your skin condition within seconds."
    }
  ];
  
  const additionalFeatures = [
    {
      icon: Microscope,
      title: "Precise Diagnostics",
      description: "Our AI has been trained on millions of clinical images for accurate identification."
    },
    {
      icon: HeartPulse,
      title: "Health Tracking",
      description: "Monitor your skin's health over time and track improvements from treatments."
    },
    {
      icon: Share2,
      title: "Share Results",
      description: "Easily share your analysis with healthcare providers for better care."
    },
    {
      icon: LineChart,
      title: "Condition Insights",
      description: "Access detailed information about identified conditions and treatment options."
    },
    {
      icon: Lock,
      title: "Trusted Platform",
      description: "Used by healthcare professionals worldwide with HIPAA-compliant security."
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background orbs for decoration */}
      <div className="orb w-[300px] h-[300px] bg-skinx-teal/20 top-20 -left-32 animate-float"></div>
      <div className="orb w-[400px] h-[400px] bg-skinx-purple/20 bottom-40 -right-64 animate-float" style={{ animationDelay: '-2s' }}></div>
      <div className="orb w-[200px] h-[200px] bg-skinx-teal-light/20 bottom-20 left-20 animate-float" style={{ animationDelay: '-4s' }}></div>
      
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        
        {/* Features Section */}
        <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-gradient-dark">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                Powered by Advanced Technology
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the next generation of skin analysis with features
                designed for accuracy, privacy, and convenience.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24 relative">
          <div className="orb w-[500px] h-[500px] bg-skinx-purple/10 -top-64 left-1/2 -translate-x-1/2 animate-float" style={{ animationDelay: '-3s' }}></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                How SkinX Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Three simple steps to get professional skin analysis from the comfort of your home.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Upload Photo",
                  description: "Take a clear photo of your skin concern or upload an existing image."
                },
                {
                  step: "02",
                  title: "AI Analysis",
                  description: "Our advanced AI analyzes your image and identifies potential conditions."
                },
                {
                  step: "03",
                  title: "Get Results",
                  description: "Review detailed insights and recommendations for your skin condition."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="text-8xl font-bold text-skinx-teal/20 absolute -top-10 left-0">
                    {item.step}
                  </div>
                  <div className="relative bg-gradient-card rounded-xl p-8 shadow-lg z-10 glow">
                    <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-20">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#06C4CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* More Features Section */}
        <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-gradient-dark relative">
          <div className="orb w-[300px] h-[300px] bg-skinx-teal/15 top-20 right-20 animate-float" style={{ animationDelay: '-1s' }}></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                Everything You Need for Skin Health
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive features designed for both patients and healthcare professionals.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-skinx-teal to-skinx-purple/70 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0tMjAgMEMxNiAzNS4xIDE1LjEgMzYgMTQgMzZzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem00MCAwYzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Take the first step towards better skin health with advanced AI-powered analysis.
              </p>
              
              <motion.div 
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="/scan" 
                  className="bg-white text-skinx-teal font-medium px-8 py-3 rounded-full inline-block shadow-lg hover:bg-gray-100 transition-colors"
                >
                  Start Your Skin Scan Now
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;