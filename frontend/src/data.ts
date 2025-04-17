const { FileText, Shield, AlertTriangle, Pill, ShoppingCart, ThumbsDown, Stethoscope, HeartHandshake, HelpCircle, BookHeart, Leaf, Info } = require("lucide-react");

export const overviewSections = [
    {
        key: "condition",
        title: "About This Condition",
        icon: <FileText size={18} className="text-skinx-purple" />, 
    },
    {
      key: "advice",
      title: "Supportive Advice",
      icon: <Shield size={18} className="text-skinx-purple" />,
    },
    {
      key: "seriousness",
      title: "How Serious Is It?",
      icon: <AlertTriangle size={18} className="text-yellow-400" />,
    },
    {
      key: "treatment_options",
      title: "Treatment Options",
      icon: <Pill size={18} className="text-skinx-teal" />,
    },
    {
      key: "recommended_products",
      title: "Recommended Products",
      icon: <ShoppingCart size={18} className="text-skinx-purple" />,
    },
    {
      key: "habits_to_avoid",
      title: "Habits to Avoid",
      icon: <ThumbsDown size={18} className="text-red-500" />,
    },
    {
      key: "prevention_tips",
      title: "Prevention Tips",
      icon: <Shield size={18} className="text-skinx-teal" />,
    },
    {
      key: "when_to_see_a_doctor",
      title: "When to See a Doctor",
      icon: <Stethoscope size={18} className="text-skinx-purple" />,
    },
    {
      key: "emotional_support",
      title: "Emotional Support",
      icon: <HeartHandshake size={18} className="text-skinx-teal" />,
    },
    {
      key: "common_misconceptions",
      title: "Common Misconceptions",
      icon: <HelpCircle size={18} className="text-skinx-purple" />,
    },
    {
      key: "lifestyle_adjustments",
      title: "Lifestyle Adjustments",
      icon: <BookHeart size={18} className="text-skinx-teal" />,
    },
    {
      key: "natural_remedies",
      title: "Natural Remedies",
      icon: <Leaf size={18} className="text-green-500" />,
    },
    {
        key: "summary",                // key to fetch data from backend (e.g., "summary")
        title: "Summary", // section title
        icon: <Info size={18} className="text-skinx-teal" />,  // icon for the section
      },
  ];
  