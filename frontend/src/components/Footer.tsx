
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 pt-16 pb-8 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-skinx-teal to-skinx-teal-light flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-skinx-teal to-skinx-purple bg-clip-text text-transparent">
                SkinX
              </span>
            </Link>
            <p className="text-gray-600 mb-4">
              Advanced AI-powered skin analysis for accurate and instant health insights.
            </p>
            <div className="flex gap-4">
              <span className="text-gray-500 hover:text-skinx-teal transition-colors cursor-pointer">
                <Facebook size={20} />
              </span>
              <span className="text-gray-500 hover:text-skinx-teal transition-colors cursor-pointer">
                <Twitter size={20} />
              </span>
              <span className="text-gray-500 hover:text-skinx-teal transition-colors cursor-pointer">
                <Instagram size={20} />
              </span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-skinx-teal transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-gray-600 hover:text-skinx-teal transition-colors cursor-pointer">
                  About Us
                </span>
              </li>
              <li>
                <span className="text-gray-600 hover:text-skinx-teal transition-colors cursor-pointer">
                  Features
                </span>
              </li>
              <li>
                <span className="text-gray-600 hover:text-skinx-teal transition-colors cursor-pointer">
                  Contact
                </span>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/scan" className="text-gray-600 hover:text-skinx-teal transition-colors">
                  Skin Analysis
                </Link>
              </li>
              <li>
                <span className="text-gray-600 hover:text-skinx-teal transition-colors cursor-pointer">
                  Doctor Consultation
                </span>
              </li>
              <li>
                <span className="text-gray-600 hover:text-skinx-teal transition-colors cursor-pointer">
                  Health Reports
                </span>
              </li>
              <li>
                <span className="text-gray-600 hover:text-skinx-teal transition-colors cursor-pointer">
                  Treatment Plans
                </span>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-600 space-y-2">
              <p>123 Health Street</p>
              <p>Medical District, MD 12345</p>
              <p className="mt-2">support@skinx.ai</p>
              <p>+1 (555) 123-4567</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} SkinX. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <span className="hover:text-skinx-teal transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-skinx-teal transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-skinx-teal transition-colors cursor-pointer">
              Cookie Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;