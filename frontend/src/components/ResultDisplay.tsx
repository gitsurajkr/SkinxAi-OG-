
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {  CheckCircle, HelpCircle, Info, Shield, Sparkles, AlertTriangle, Crosshair } from "lucide-react";
import axios from "axios";
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
  imageFile?: File | string | null;
  results?: {
    condition: string;
    confidence: number;
    gemini_advice: {
      sections: {
        key: string;
        title: string;
        content: string;
      }[];
    };
  };
}

const ResultsDisplay = ({ isLoading = false, hasResults = false, imageFile }: ResultsDisplayProps) => {
  console.log("🚀 Props Received:", { isLoading, hasResults, imageFile });


  const [results, setResults] = useState<ResultsDisplayProps["results"] | null>(null);
  const [loading, setLoading] = useState(isLoading);

  const fetchPrediction = async (imageFile: File) => {
    console.log("📤 Sending image to backend for prediction...");

    const formData = new FormData();
    formData.append("image", imageFile);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/predict", formData);
      console.log("✅ Backend response:", response.data);

      console.log("API result:", response.data);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageFile instanceof File) {
      console.log("🖼️ New image uploaded, fetching prediction...");

      fetchPrediction(imageFile);
    }else {
      console.log("⚠️ imageFile is not a valid File. Skipping fetch.");
    }
  }, [imageFile]);

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

  // const renderDetectionBoxes = () => {
  //   if (!image) return null;
    
  //   return (
  //     <div className="relative w-full">
  //       <img src={image} alt="Analyzed skin" className="w-full rounded-lg" />
  //       {mockResults.detections.map((box) => (
  //         <div
  //           key={box.id}
  //           className="absolute border-2 border-skinx-teal pointer-events-none"
  //           style={{
  //             left: `${box.x}%`,
  //             top: `${box.y}%`,
  //             width: `${box.width}%`,
  //             height: `${box.height}%`,
  //           }}
  //         >
  //           <div className="absolute -top-7 left-0 bg-skinx-teal px-2 py-0.5 text-xs rounded text-white whitespace-nowrap">
  //             {box.label} ({Math.round(box.confidence * 100)}%)
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  const renderResults = () =>{
    console.log("🧪 Current Results:", results);
    if (!results) {
      console.log("⚠️ No results to render.");
      return null;
    }
  
    const { condition, confidence, gemini_advice } = results;
    console.log("🧪 Rendering results for:", { condition, confidence, gemini_advice });;
    return (
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
        
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-6 bg-muted/50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r from-skinx-teal/80 to-skinx-teal-light/80 data-[state=active]:text-white">Overview</TabsTrigger>
          
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
              {gemini_advice?.sections.map((section, index) => (
  <div key={section.key} className="mb-6">
    <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-white font-heading">
      {/* Optional icons if you want to cycle or assign dynamically */}
      <Info size={18} className="text-skinx-teal" />
      {section.title}
    </h3>
    <p className="text-gray-300 whitespace-pre-line">{section.content}</p>
  </div>
))}

            </motion.div>
          </TabsContent>
          
         
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}

if (isLoading || loading) return renderLoading();

if (!results) {
  console.log("🕳️ No results found yet — showing empty state.");
  return renderEmptyState();
}

return renderResults();
};

export default ResultsDisplay;