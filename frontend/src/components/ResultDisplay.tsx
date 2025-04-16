
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, HelpCircle, Info, Shield, Sparkles, AlertTriangle, Crosshair } from "lucide-react";
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

interface DetectionTabProps {
  imageSrc: string;
  boxes: DetectionBox[] | undefined;
}

interface GeminiAdviceSection {
  key: string;
  title: string;
  content: string;
}

interface ResultsData {
  condition: string;
  confidence: number;
  gemini_advice: {
    sections: GeminiAdviceSection[];
  };
  detections?: DetectionBox[];
}

interface ResultsDisplayProps {
  isLoading?: boolean;
  hasResults?: boolean;
  imageFile?: File | string | null;
  results?: ResultsData;
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
    } else {
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

  const DetectionTab = ({ imageSrc, boxes }: DetectionTabProps) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const [imageSize, setImageSize] = useState({ width: 1, height: 1 });

    useEffect(() => {
      const img = imageRef.current;
      if (img) {
        setImageSize({ width: img.offsetWidth, height: img.offsetHeight });
      }
    }, [imageSrc]);


    const safeBoxes = boxes ?? [];
    return (
      <div className="relative w-full max-w-[500px] mx-auto">
        <img src={imageSrc} alt="Detection" className="w-full rounded-lg shadow" />

        {safeBoxes.map((box, index) => (
          <div
            key={index}
            className="absolute border-2 border-red-500 z-10"
            style={{
              left: `${(box.x / 416) * imageSize.width}px`,
              top: `${(box.y / 416) * imageSize.height}px`,
              width: `${(box.width / 416) * imageSize.width}px`,
              height: `${(box.height / 416) * imageSize.height}px`,
            }}
          >
            <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {box.label}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderResults = () => {
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
            <TabsTrigger value="detection" className="data-[state=active]:bg-gradient-to-r from-skinx-teal/80 to-skinx-teal-light/80 data-[state=active]:text-white">Detection</TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-gradient-to-r from-skinx-teal/80 to-skinx-teal-light/80 data-[state=active]:text-white">Recommendations</TabsTrigger>
            {/* <TabsTrigger value="differential" className="data-[state=active]:bg-gradient-to-r from-skinx-teal/80 to-skinx-teal-light/80 data-[state=active]:text-white">Differential</TabsTrigger> */}

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
                {gemini_advice?.sections.map((section) => (
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

                  <DetectionTab
                    imageSrc={typeof imageFile === "string" ? imageFile : imageFile ? URL.createObjectURL(imageFile) : ""}
                    boxes={results.detections}
                  />
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {results.detections && results.detections.length > 0 ? (
                      results.detections.map((detection) => (
                        <div key={detection.id} className="fancy-border p-px">
                          <div className="fancy-border-content p-3 rounded-[calc(var(--radius)-1px)]">
                            <h4 className="font-medium text-skinx-teal-light mb-1">{detection.label}</h4>
                            <p className="text-xs text-gray-400">
                              Confidence: {Math.round(detection.confidence * 100)}%
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No detections available.</p> // Optional: Add a message if there are no detections
                    )}
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
                      <div className="w-1.5 h-1.5 rounded-full bg-skinx-teal mt-1.5" />
                      <div>
                        <span className="font-medium text-white">Papules:</span> Small red bumps that can be tender to touch
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-skinx-teal mt-1.5" />
                      <div>
                        <span className="font-medium text-white">Pustules:</span> Papules with white or yellow centers (what most people call pimples)
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-skinx-teal mt-1.5" />
                      <div>
                        <span className="font-medium text-white">Whiteheads:</span> Closed comedones that remain under the skin
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-skinx-teal mt-1.5" />
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
                  {results?.gemini_advice?.sections
                    ?.filter(section =>
                      [
                        "treatment_options",
                        "recommended_products",
                        "habits_to_avoid",
                        "prevention_tips",
                        "lifestyle_adjustments",
                        "natural_remedies",
                      ].includes(section.key)
                    )
                    .map((rec, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3 relative fancy-border p-px"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start gap-3 p-3 w-full bg-card/95 rounded-[calc(var(--radius)-1px)]">
                          {/* <div className="mt-1 w-8 h-8 rounded-full bg-gradient-to-br from-skinx-teal to-skinx-purple flex items-center justify-center text-white font-semibold text-sm shadow-md">
                            {index + 1}
                          </div> */}
                          <div>
                            <h4 className="text-white font-medium mb-1 flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-skinx-teal"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                                />
                              </svg>
                              {rec.title}
                            </h4>
                            <p className="text-gray-200">{rec.content}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-medium mb-4 font-heading text-gradient">Additional Resources</h3>
                  <div className="space-y-3">
                    {[
                      "Understanding Different Types of Acne",
                      "Daily Skincare Routine for Acne-Prone Skin",
                      "When to See a Dermatologist",
                    ].map((resource, index) => (
                      <motion.a
                        key={index}
                        href="#"
                        className="block text-skinx-teal hover:text-skinx-teal-light hover:translate-x-1 transition-all duration-300 flex items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-skinx-teal" />
                        {resource}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>


          
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

function useRef<T>(initialValue: T | null): { current: T | null } {
  return { current: initialValue };
}
