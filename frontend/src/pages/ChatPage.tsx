
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Bot, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { toast } from "sonner";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Hi there! I'm your AI skincare assistant. Ask me anything about skincare!" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = message;
    setChatHistory([...chatHistory, { role: "user", content: userMessage }]);
    setMessage("");
    
    // Simulate AI response
    setIsLoading(true);
    
    // In a real app, you would make an API call to your backend here
    setTimeout(() => {
      const mockResponses = [
        "To get glowing skin, focus on hydration, gentle exfoliation, and using vitamin C serums. Also, don't forget your SPF daily!",
        "For acne-prone skin, I recommend a cleanser with salicylic acid, non-comedogenic moisturizer, and spot treatments with benzoyl peroxide.",
        "The best anti-aging ingredients include retinoids, peptides, antioxidants, and hydrating agents like hyaluronic acid.",
        "Everyone's skin is different! The perfect routine depends on your skin type, concerns, and goals. Let's start by identifying your skin type."
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setChatHistory(prev => [...prev, { role: "assistant", content: randomResponse }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-gradient">
          Chat with Your AI Skincare Assistant
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Ask questions about skincare routines, products, or specific concerns. Our AI assistant is here to help!
        </p>
      </motion.div>
      
      <Card className="bg-gradient-card min-h-[60vh] flex flex-col rounded-xl overflow-hidden">
        <div className="flex-grow p-4 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {chatHistory.map((chat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    chat.role === "user"
                      ? "bg-skinx-teal text-white"
                      : "fancy-border p-px"
                  }`}
                >
                  {chat.role === "user" ? (
                    <div className="flex items-start gap-2">
                      <User className="h-5 w-5 mt-1 shrink-0" />
                      <p>{chat.content}</p>
                    </div>
                  ) : (
                    <div className="fancy-border-content rounded-[calc(var(--radius)-1px)]">
                      <div className="flex items-start gap-2">
                        <Bot className="h-5 w-5 mt-1 text-skinx-purple shrink-0" />
                        <p className="text-gray-200">{chat.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="fancy-border p-px max-w-[80%] rounded-2xl">
                  <div className="fancy-border-content rounded-[calc(var(--radius)-1px)] p-4">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-skinx-purple" />
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-skinx-teal animate-bounce" style={{ animationDelay: "0s" }} />
                        <div className="h-2 w-2 rounded-full bg-skinx-teal animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <div className="h-2 w-2 rounded-full bg-skinx-teal animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-border">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about skincare..."
                className="bg-muted border-muted pr-10"
                disabled={isLoading}
              />
              {message.length > 0 && (
                <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-skinx-teal-light opacity-70" />
              )}
            </div>
            <Button 
              type="submit" 
              className="btn-gradient"
              disabled={isLoading || !message.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </Card>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Note: This is currently showing mock responses. In the final app, responses will be powered by a real AI model.
        </p>
      </div>
    </div>
  );
};

export default ChatPage;