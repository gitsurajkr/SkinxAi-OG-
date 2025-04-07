
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ScanPage from "./pages/ScanPage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import "./App.css";

// Add animated background elements
// const StarField = () => {
//   const stars = Array.from({ length: 50 }, (_, i) => ({
//     id: i,
//     size: Math.random() * 2 + 1,
//     top: `${Math.random() * 100}%`,
//     left: `${Math.random() * 100}%`,
//     animationDelay: `${Math.random() * 4}s`,
//   }));

//   return (
//     <div className="star-field">
//       {stars.map((star) => (
//         <div
//           key={star.id}
//           className="star"
//           style={{
//             width: `${star.size}px`,
//             height: `${star.size}px`,
//             top: star.top,
//             left: star.left,
//             animationDelay: star.animationDelay,
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// const FloatingOrbs = () => {
//   const orbs = [
//     { color: "from-skinx-teal/30", size: "w-64 h-64", top: "10%", left: "5%", delay: "0s" },
//     { color: "from-skinx-purple/20", size: "w-80 h-80", top: "60%", left: "80%", delay: "2s" },
//     { color: "from-skinx-teal-light/20", size: "w-96 h-96", top: "80%", left: "20%", delay: "1s" },
//   ];

//   return (
//     <>
//       {orbs.map((orb, index) => (
//         <div
//           key={index}
//           className={`orb ${orb.size} bg-gradient-to-br ${orb.color} to-transparent`}
//           style={{
//             top: orb.top,
//             left: orb.left,
//             animationDelay: orb.delay,
//           }}
//         />
//       ))}
//     </>
//   );
// };

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
  <Router>
    <Toaster />
    <Sonner />
    {/* <StarField /> */}
    {/* <FloatingOrbs /> */}

      <Navbar />

      <motion.main
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>

      <Footer />
  </Router>
</TooltipProvider>

  </QueryClientProvider>
);

export default App;