
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {  CheckCircle, HelpCircle, Info, Shield, Sparkles, AlertTriangle, Crosshair } from "lucide-react";

interface DetectionBox {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

interface ResultsDisplayProps {
  isLoading?: boolean;
  hasResults?: boolean;
  image?: string;
}

const ResultsDisplay = ({ isLoading = false, hasResults = false, image }: ResultsDisplayProps) => {
  // For demo purposes, we'll show mock results
  const [mockResults] = useState({
    condition: "Mild Acne",
    confidence: 92,
    severity: "Mild",
    recommendations: [
      "Use gentle non-comedogenic cleansers",
      "Consider products with salicylic acid or benzoyl peroxide",
      "Avoid touching your face frequently",
      "Keep hair clean and away from face"
    ],
    differential: [
      { name: "Rosacea", probability: 18 },
      { name: "Contact Dermatitis", probability: 12 },
      { name: "Normal Skin", probability: 8 }
    ],
    // Mock detection boxes for pimples
    detections: [
      { id: 1, x: 30, y: 20, width: 15, height: 15, label: "Papule", confidence: 0.89 },
      { id: 2, x: 60, y: 40, width: 12, height: 12, label: "Pustule", confidence: 0.92 },
      { id: 3, x: 45, y: 70, width: 18, height: 18, label: "Whitehead", confidence: 0.85 },
      { id: 4, x: 75, y: 60, width: 10, height: 10, label: "Blackhead", confidence: 0.78 },
    ] as DetectionBox[]
  });

  const renderLoading = () => (
    <motion.div 
      className="py-12 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-skinx-teal blur-md opacity-30 animate-pulse" />
        <div className="w-20 h-20 rounded-full border-4 border-t-skinx-teal-light border-skinx-teal/30 animate-spin flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-r-skinx-purple-light border-skinx-purple/30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2 mt-6 font-heading">Analyzing your image</h3>
      <p className="text-gray-400 text-center max-w-md">
        Our AI is examining the image for skin conditions and imperfections.
        This usually takes 10-20 seconds.
      </p>
      
      <motion.div
        className="w-full max-w-xs mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Progress value={45} className="h-1.5 bg-muted" />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Processing...</span>
          <span>Please wait</span>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderEmptyState = () => (
    <motion.div 
      className="py-12 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6 relative overflow-hidden"
        animate={{ 
          boxShadow: ['0 0 0 0 rgba(155, 135, 245, 0.2)', '0 0 20px 5px rgba(155, 135, 245, 0.3)', '0 0 0 0 rgba(155, 135, 245, 0.2)']
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <HelpCircle className="h-12 w-12 text-gray-400" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer" />
      </motion.div>
      
      <h3 className="text-xl font-semibold mb-2 font-heading">No Results Yet</h3>
      <p className="text-gray-400 text-center max-w-md">
        Upload an image of your skin to receive an AI-powered analysis
      </p>
      
      <motion.div 
        className="mt-8 px-6 py-3 rounded-lg border border-dashed border-skinx-teal/30 bg-skinx-teal/5 flex items-center gap-3"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Sparkles className="text-skinx-teal h-5 w-5" />
        <p className="text-skinx-teal-light text-sm">
          Our AI can detect various skin conditions with high accuracy
        </p>
      </motion.div>
    </motion.div>
  );

  const renderDetectionBoxes = () => {
    if (!image) return null;
    
    return (
      <div className="relative w-full">
        <img src={image} alt="Analyzed skin" className="w-full rounded-lg" />
        {mockResults.detections.map((box) => (
          <div
            key={box.id}
            className="absolute border-2 border-skinx-teal pointer-events-none"
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }}
          >
            <div className="absolute -top-7 left-0 bg-skinx-teal px-2 py-0.5 text-xs rounded text-white whitespace-nowrap">
              {box.label} ({Math.round(box.confidence * 100)}%)
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderResults = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 text-center">
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/30 text-green-400 mb-4 border border-green-700/50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <CheckCircle size={16} />
          <span>Analysis Complete</span>
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-1 font-heading text-gradient">
          {mockResults.condition}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <div className="fancy-border px-2.5 py-1 text-sm">
            <span className="text-skinx-teal mr-1">Confidence:</span> 
            <span className="font-medium text-white">{mockResults.confidence}%</span>
          </div>
          <div className="fancy-border px-2.5 py-1 text-sm">
            <span className="text-skinx-purple mr-1">Severity:</span> 
            <span className="font-medium text-white">{mockResults.severity}</span>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-6 bg-muted/50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r from-skinx-teal/80 to-skinx-teal-light/80 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="detection" className="data-[state=active]:bg-gradient-to-r from-skinx-teal/80 to-skinx-teal-light/80 data-[state=active]:text-white">Detection</TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-gradient-to-r from-skinx-teal/80 to-skinx-teal-light/80 data-[state=active]:text-white">Recommendations</TabsTrigger>
          <TabsTrigger value="differential" className="data-[state=active]:bg-gradient-to-r from-skinx-teal/80 to-skinx-teal-light/80 data-[state=active]:text-white">Differential</TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <TabsContent value="overview">
            <motion.div 
              className="bg-gradient-card rounded-xl p-6 shadow-md border border-white/5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-white font-heading">
                  <Info size={18} className="text-skinx-teal" />
                  About This Condition
                </h3>
                <p className="text-gray-300">
                  Acne is a skin condition that occurs when your hair follicles become plugged with oil and dead skin cells. It causes whiteheads, blackheads or pimples. Acne is most common among teenagers, though it affects people of all ages.
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-white font-heading">
                  <AlertTriangle size={18} className="text-skinx-purple" />
                  Key Symptoms
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
                  {["Whiteheads (closed plugged pores)", "Blackheads (open plugged pores)", "Small red, tender bumps (papules)", "Pimples (pustules)", "Large, solid, painful lumps under the skin (nodules)"].map((symptom, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-center gap-2 pl-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-skinx-teal"/>
                      {symptom}
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-white font-heading">
                  <Shield size={18} className="text-skinx-teal" />
                  Next Steps
                </h3>
                <p className="text-gray-300 mb-4">
                  While this analysis is powered by advanced AI, it's always recommended to consult with a healthcare professional for proper diagnosis and treatment.
                </p>
                <button className="text-skinx-teal hover:text-skinx-teal-light font-medium flex items-center gap-1 group">
                  Talk to a dermatologist
                  <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="detection">
            <motion.div 
              className="bg-gradient-card rounded-xl p-6 shadow-md border border-white/5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-white font-heading">
                  <Crosshair size={18} className="text-skinx-purple" />
                  Pimple Detection
                </h3>
                <p className="text-gray-300 mb-4">
                  Our AI has detected several pimples and acne-related spots on your skin. These are highlighted below.
                </p>
                
                {renderDetectionBoxes()}
                
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {mockResults.detections.map((detection) => (
                    <div key={detection.id} className="fancy-border p-px">
                      <div className="fancy-border-content p-3 rounded-[calc(var(--radius)-1px)]">
                        <h4 className="font-medium text-skinx-teal-light mb-1">{detection.label}</h4>
                        <p className="text-xs text-gray-400">Confidence: {Math.round(detection.confidence * 100)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <h3 className="text-lg font-medium mb-3 text-white font-heading">
                  Understanding Detection Results
                </h3>
                <p className="text-gray-300 mb-2">
                  Our AI identifies different types of acne lesions:
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-skinx-teal mt-1.5"/>
                    <div>
                      <span className="font-medium text-white">Papules:</span> Small red bumps that can be tender to touch
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-skinx-teal mt-1.5"/>
                    <div>
                      <span className="font-medium text-white">Pustules:</span> Papules with white or yellow centers (what most people call pimples)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-skinx-teal mt-1.5"/>
                    <div>
                      <span className="font-medium text-white">Whiteheads:</span> Closed comedones that remain under the skin
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-skinx-teal mt-1.5"/>
                    <div>
                      <span className="font-medium text-white">Blackheads:</span> Open comedones that appear as small black dots on the skin
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <motion.div 
              className="bg-gradient-card rounded-xl p-6 shadow-md border border-white/5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="space-y-5">
                {mockResults.recommendations.map((rec, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start gap-3 relative fancy-border p-px"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-3 p-3 w-full bg-card/95 rounded-[calc(var(--radius)-1px)]">
                      <div className="mt-1 w-7 h-7 rounded-full bg-gradient-to-br from-skinx-teal to-skinx-purple flex items-center justify-center text-white font-medium text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-200">{rec}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-lg font-medium mb-4 font-heading text-gradient">Additional Resources</h3>
                <div className="space-y-3">
                  {["Understanding Different Types of Acne", "Daily Skincare Routine for Acne-Prone Skin", "When to See a Dermatologist"].map((resource, index) => (
                    <motion.a 
                      key={index}
                      href="#" 
                      className="block text-skinx-teal hover:text-skinx-teal-light hover:translate-x-1 transition-all duration-300 flex items-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="w-1 h-1 rounded-full bg-skinx-teal"/>
                      {resource}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="differential">
            <motion.div 
              className="bg-gradient-card rounded-xl p-6 shadow-md border border-white/5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-300 mb-6">
                Other potential conditions that may present similar symptoms:
              </p>
              
              <div className="space-y-5">
                {mockResults.differential.map((diagnosis, index) => (
                  <motion.div 
                    key={index} 
                    className="fancy-border p-px"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <div className="bg-card/95 p-4 rounded-[calc(var(--radius)-1px)]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-white">{diagnosis.name}</span>
                        <span className="text-sm text-skinx-teal bg-skinx-teal/10 px-2 py-0.5 rounded-full">
                          {diagnosis.probability}%
                        </span>
                      </div>
                      <Progress 
                        value={diagnosis.probability} 
                        className="h-2 bg-muted/50 bg-gradient-to-r from-skinx-teal to-skinx-purple" 
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-8 bg-amber-950/40 border border-amber-700/30 rounded-lg p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-start gap-3">
                  <Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="font-medium text-amber-400 mb-1">Important Note</h4>
                    <p className="text-amber-300/80 text-sm">
                      This differential diagnosis is provided for informational purposes only. Always consult with a qualified healthcare professional for an accurate diagnosis.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );

  if (isLoading) return renderLoading();
  if (!hasResults) return renderEmptyState();
  return renderResults();
};

export default ResultsDisplay;