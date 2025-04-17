 {/* <TabsContent value="detection">
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
          </TabsContent> */}

          {/* <TabsTrigger value="detection" className="data-[state=active]:bg-gradient-to-r from-skinx-teal/80 to-skinx-teal-light/80 data-[state=active]:text-white">Detection</TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-gradient-to-r from-skinx-teal/80 to-skinx-teal-light/80 data-[state=active]:text-white">Recommendations</TabsTrigger>
          <TabsTrigger value="differential" className="data-[state=active]:bg-gradient-to-r from-skinx-teal/80 to-skinx-teal-light/80 data-[state=active]:text-white">Differential</TabsTrigger> */}

          // For demo purposes, we'll show mock results
  // const [mockResults] = useState({
  //   condition: "Mild Acne",
  //   confidence: 92,
  //   severity: "Mild",
  //   recommendations: [
  //     "Use gentle non-comedogenic cleansers",
  //     "Consider products with salicylic acid or benzoyl peroxide",
  //     "Avoid touching your face frequently",
  //     "Keep hair clean and away from face"
  //   ],
  //   differential: [
  //     { name: "Rosacea", probability: 18 },
  //     { name: "Contact Dermatitis", probability: 12 },
  //     { name: "Normal Skin", probability: 8 }
  //   ],
  //   // Mock detection boxes for pimples
  //   detections: [
  //     { id: 1, x: 30, y: 20, width: 15, height: 15, label: "Papule", confidence: 0.89 },
  //     { id: 2, x: 60, y: 40, width: 12, height: 12, label: "Pustule", confidence: 0.92 },
  //     { id: 3, x: 45, y: 70, width: 18, height: 18, label: "Whitehead", confidence: 0.85 },
  //     { id: 4, x: 75, y: 60, width: 10, height: 10, label: "Blackhead", confidence: 0.78 },
  //   ] as DetectionBox[]
  // });


  {/* <h2 className="text-2xl md:text-3xl font-bold mb-1 font-heading text-gradient">
          {mockResults.condition}
        </h2> */}
        {/* <div className="flex flex-wrap justify-center gap-4 items-center">
          <div className="fancy-border px-2.5 py-1 text-sm">
            <span className="text-skinx-teal mr-1">Confidence:</span> 
            <span className="font-medium text-white">{mockResults.confidence}%</span>
          </div>
          <div className="fancy-border px-2.5 py-1 text-sm">
            <span className="text-skinx-purple mr-1">Severity:</span> 
            <span className="font-medium text-white">{mockResults.severity}</span>
          </div>
        </div> */}

        // interface DetectionBox {
            //   id: number;
            //   x: number;
            //   y: number;
            //   width: number;
            //   height: number;
            //   label: string;
            //   confidence: number;
            // }

            // const { condition, confidence, gemini_advice } = results;
