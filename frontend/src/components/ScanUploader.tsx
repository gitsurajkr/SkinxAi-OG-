
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Image, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ScanUploaderProps {
  onImageSelect: (file: File) => void;
  onAnalyze: () => void;
}

const ScanUploader = ({ onImageSelect, onAnalyze }: ScanUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
      toast.success("Image uploaded successfully");
    } else {
      toast.error("Please upload an image file");
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  const takePhoto = () => {
    if (webcamRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = webcamRef.current.videoWidth;
      canvas.height = webcamRef.current.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(webcamRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
            handleFileChange(file);
            stopCamera();
          }
        }, "image/jpeg");
      }
    }
  };

  const stopCamera = () => {
    if (webcamRef.current && webcamRef.current.srcObject) {
      const tracks = (webcamRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      webcamRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const clearImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Create random dots for background decoration
  const renderDecorationDots = () => {
    const dots = [];
    for (let i = 0; i < 10; i++) {
      dots.push(
        <div 
          key={i}
          className="absolute w-1 h-1 rounded-full bg-skinx-teal/50"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `pulse 3s infinite ${Math.random() * 2}s`
          }}
        />
      );
    }
    return dots;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!previewImage && !showCamera ? (
          <motion.div
            className={`upload-area flex flex-col items-center relative ${dragActive ? "bg-skinx-teal-light/10 border-skinx-teal" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileChange(e.target.files[0]);
                }
              }} 
            />
            
            {/* Decorative elements */}
            {renderDecorationDots()}
            
            <motion.div 
              className="w-20 h-20 rounded-full bg-gradient-to-br from-skinx-teal/20 to-skinx-teal-light/20 flex items-center justify-center mb-4 overflow-hidden"
              animate={{ 
                boxShadow: ['0 0 0 0 rgba(10, 239, 255, 0.2)', '0 0 15px 3px rgba(10, 239, 255, 0.4)', '0 0 0 0 rgba(10, 239, 255, 0.2)']
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Upload className="h-10 w-10 text-skinx-teal" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer" />
            </motion.div>
            
            <h3 className="text-xl font-semibold mb-2 font-heading ">Upload a skin image</h3>
            <p className="text-gray-400 mb-8 text-center max-w-md">
              Drag and drop your image here, or choose one of the options below
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="btn-gradient text-black px-6 py-5 h-auto"
                  onClick={openFileDialog}
                >
                  <Image className="mr-2 h-4 w-4 text-black" /> Browse Files
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="border-skinx-teal text-skinx-teal px-6 py-5 h-auto hover:bg-skinx-teal/10"
                  onClick={startCamera}
                >
                  <Camera className="mr-2 h-4 w-4" /> Take Photo
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : showCamera ? (
          <motion.div 
            className="fancy-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fancy-border-content">
              <video 
                ref={webcamRef}
                autoPlay 
                className="w-full h-full rounded-xl"
              />
              
              <div className="p-4 flex justify-center gap-4 mt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="btn-gradient text-white px-6"
                    onClick={takePhoto}
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> Take Photo
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                    onClick={stopCamera}
                  >
                    Cancel
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="relative rounded-xl overflow-hidden fancy-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fancy-border-content">
              <img 
                src={previewImage || ""} 
                alt="Uploaded skin image" 
                className="w-full h-auto rounded-xl" 
              />
              
              <Button 
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4"
                onClick={clearImage}
              >
                <X size={20} />
              </Button>
              
              <div className="mt-6 text-center">
                <p className="text-skinx-teal-light mb-3">Image ready for analysis</p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={onAnalyze}  className="btn-gradient text-white px-6 py-2.5">
                    <Sparkles className="mr-2 h-4 w-4" /> Analyze Image
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScanUploader;