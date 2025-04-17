
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Camera,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  PieChart,
  Cpu
} from "lucide-react";
import Hero from "@/components/Hero";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <Hero />

      <motion.section
        className="text-center my-16 px-4" // Keep minimal base padding
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="fancy-border max-w-5xl mx-auto rounded-2xl">
          <div className="fancy-border-content w-full py-16 px-6 sm:px-8 md:px-12 rounded-[calc(var(--radius)-1px)]">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 font-heading text-skinx-teal"
              variants={fadeIn}
            >
              Start Your Skincare Journey Today
            </motion.h2>

            <motion.p
              className=" max-w-2xl mx-auto mb-8"
              variants={fadeIn}
            >
              Upload a selfie or start chatting with our AI assistant to get personalized skincare recommendations tailored to your needs.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              variants={fadeIn}
            >
              <Button asChild variant="outline" className="border-skinx-purple text-skinx-purple hover:bg-skinx-purple/10 hover:text-skinx-teal-light  px-6 py-4 h-auto text-base sm:text-lg font-medium">
                <Link to="/scan">
                  <Camera className="mr-2 h-5 w-5" />
                  Analyze My Skin
                </Link>
              </Button>

              <Button asChild variant="outline" className="border-skinx-purple text-skinx-purple hover:bg-skinx-purple/10 hover:text-skinx-teal-light px-6 py-4 h-auto text-base sm:text-lg font-medium">
                <Link to="/chat">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Chat with AI
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>


      {/* Main Features */}
      <motion.section
        className="my-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 font-heading text-gradient"
          variants={fadeIn}
        >
          Powered by Advanced AI
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Camera className="text-skinx-teal h-8 w-8" />,
              title: "Skin Analysis",
              description: "Upload a selfie and our AI will analyze your skin for conditions like acne, eczema, and more.",
              link: "/scan"
            },
            {
              icon: <Cpu className="text-skinx-purple h-8 w-8" />,
              title: "Pimple Detection",
              description: "Our advanced computer vision can pinpoint and highlight problem areas on your skin.",
              link: "/scan"
            },
            {
              icon: <MessageSquare className="text-skinx-teal-light h-8 w-8" />,
              title: "AI Skincare Assistant",
              description: "Chat with our AI assistant to get personalized skincare advice and recommendations.",
              link: "/chat"
            },
            {
              icon: <ShieldCheck className="text-skinx-purple-light h-8 w-8" />,
              title: "Privacy First",
              description: "Your images are processed securely and never stored without your permission.",
              link: "/scan"
            },
            {
              icon: <PieChart className="text-skinx-teal h-8 w-8" />,
              title: "Detailed Reports",
              description: "Get comprehensive skin analysis with visual breakdowns and metrics.",
              link: "/scan"
            },
            {
              icon: <Sparkles className="text-skinx-purple h-8 w-8" />,
              title: "Personalized Advice",
              description: "Receive tailored skincare recommendations based on your unique skin profile.",
              link: "/chat"
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="enhanced-card fancy-border p-px"
              variants={fadeIn}
            >
              <div className="fancy-border-content h-full flex flex-col">
                <div className="mb-4 relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-card/40 to-card border border-white/5 flex items-center justify-center relative overflow-hidden">
                    {feature.icon}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 font-heading">{feature.title}</h3>
                <p className="text-gray-400 mb-6 flex-grow">{feature.description}</p>

                <Link to={feature.link} className="group inline-flex items-center text-skinx-teal hover:text-skinx-teal-light">
                  Learn more
                  <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
      {/* Call to Action */}
      
    </div>
  );
};

export default HomePage;