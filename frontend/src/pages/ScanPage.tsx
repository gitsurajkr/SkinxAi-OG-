
import { useState } from "react";
import { motion } from "framer-motion";
import ScanUploader from "@/components/ScanUploader";
import ResultsDisplay from "@/components/ResultDisplay";
import { toast } from "sonner";
import axios from "axios";

const ScanPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    condition: string;
    confidence: number;
    gemini_advice: { sections: { key: string; title: string; content: string }[] };
  } | undefined>(undefined); // Initializing as undefined instead of null
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  // const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImageFile(file);
    // setSelectedImagePreview(URL.createObjectURL(file));
    setResults(undefined);
  };

  const handleAnalyze = async () => {
    if (!selectedImageFile) {
      toast.error("Please upload an image first.");
      return;
    }

    try {
      setIsLoading(true);
      toast.message("Analyzing your skin...");

      const formData = new FormData();
      formData.append("image", selectedImageFile);

      const response = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResults(response.data);
      console.log("Analysis results:", response.data);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Error analyzing image");
      console.error("Analyze error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("Results being passed to ResultsDisplay:", results);



  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-gradient">
          AI Skin Analysis
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Upload a clear selfie to analyze your skin condition. Our AI will detect issues like acne, eczema, and other common skin conditions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="fancy-border p-px rounded-xl mb-6">
            <div className="fancy-border-content p-6 rounded-[calc(var(--radius)-1px)]">
              <h2 className="text-xl font-semibold mb-4 font-heading text-gradient">Upload Your Skin Image</h2>
              <ScanUploader onImageSelect={handleImageSelect}
                onAnalyze={handleAnalyze} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="fancy-border p-px rounded-xl">
              <div className="fancy-border-content p-4 rounded-[calc(var(--radius)-1px)]">
                <h3 className="text-lg font-medium mb-2 font-heading flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-skinx-teal/20 text-skinx-teal text-sm">1</span>
                  Take a Clear Photo
                </h3>
                <p className="text-gray-400 text-sm">
                  Ensure good lighting and a neutral background. Remove makeup for best results.
                </p>
              </div>
            </div>

            <div className="fancy-border p-px rounded-xl">
              <div className="fancy-border-content p-4 rounded-[calc(var(--radius)-1px)]">
                <h3 className="text-lg font-medium mb-2 font-heading flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-skinx-teal/20 text-skinx-teal text-sm">2</span>
                  Upload Your Image
                </h3>
                <p className="text-gray-400 text-sm">
                  Select a file from your device or take a photo directly using your camera.
                </p>
              </div>
            </div>

            <div className="fancy-border p-px rounded-xl">
              <div className="fancy-border-content p-4 rounded-[calc(var(--radius)-1px)]">
                <h3 className="text-lg font-medium mb-2 font-heading flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-skinx-teal/20 text-skinx-teal text-sm">3</span>
                  Get AI Analysis
                </h3>
                <p className="text-gray-400 text-sm">
                  Our AI will analyze your skin and provide detailed results and recommendations.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="fancy-border p-px rounded-xl"
        >
          <div className="fancy-border-content h-full p-6 rounded-[calc(var(--radius)-1px)]">
            <h2 className="text-xl font-semibold mb-4 font-heading">Results</h2>
            <ResultsDisplay
              hasResults={!!results}
              isLoading={isLoading}
              imageFile={selectedImageFile}
              results={results}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScanPage;