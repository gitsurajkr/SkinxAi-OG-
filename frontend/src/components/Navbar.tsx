import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaListUl } from "react-icons/fa6";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: "Home", path: "/" },
    // { name: "About", path: "/about" },
    // { name: "Features", path: "/features" },
    // { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      className="py-4 px-6 md:px-12 lg:px-24 sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-md border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-skinx-teal to-skinx-teal-light flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-skinx-teal to-skinx-purple bg-clip-text text-transparent">
            SkinX
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-foreground hover:text-skinx-teal transition-colors duration-300"
            >
              {item.name}
            </Link>
          ))}
          <Button className="bg-skinx-teal hover:bg-skinx-teal-dark text-white" asChild>
            <Link to="/scan">Start Scan</Link>
          </Button>
        </div>

        {/* Mobile menu toggle button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu overlay and drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />

            {/* Slide-in panel */}
            {/* Slide-in panel */}
            <motion.div
              className="fixed top-0 right-0 w-4/5 sm:w-1/2 h-full bg-background z-50 px-6 pt-24 shadow-lg"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center gap-3 text-lg text-foreground hover:text-skinx-teal border-b border-border pb-3"
                    onClick={toggleMenu}
                  >
                    <FaListUl className="text-skinx-teal" />
                    {item.name}
                  </Link>
                ))}
                <Button
                  className="bg-skinx-teal hover:bg-skinx-teal-dark text-white w-full mt-6"
                  onClick={toggleMenu}
                  asChild
                >
                  <Link to="/scan">Start Scan</Link>
                </Button>
              </div>
            </motion.div>

          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
