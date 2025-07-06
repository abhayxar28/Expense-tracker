import Aurora from "@/components/ui/aurora";
import {
  Brain,
  Wallet,
  BarChart3,
  Sparkles,
  ClipboardList,
  LineChart,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { ReactNode } from "react";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    if (token && userId) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="relative bg-[#f5efe9] scroll-smooth overflow-x-hidden">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={1.5}
          amplitude={1.3}
          speed={0}
        />
      </div>

      <div className="relative z-10 px-4 py-6 font-sans">
        <nav className="flex justify-between items-center mb-12">
          <h1 className="text-xl font-bold">FinFlow</h1>
          <ul className="hidden md:flex space-x-6 text-gray-700">
            <li>
              <button
                onClick={() =>
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                }
                className="hover:text-pinkAccent hover:underline cursor-pointer"
              >
                Features
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  document.getElementById("howitworks")?.scrollIntoView({ behavior: "smooth" })
                }
                className="hover:text-pinkAccent hover:underline cursor-pointer"
              >
                How it Works
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  document.getElementById("review")?.scrollIntoView({ behavior: "smooth" })
                }
                className="hover:text-pinkAccent hover:underline cursor-pointer"
              >
                Reviews
              </button>
            </li>
          </ul>
          <Link to={"/signup"}>
            <button className="bg-pinkAccent cursor-pointer text-white px-4 py-2 rounded-full">
              Try Free
            </button>
          </Link>
        </nav>
      </div>

      <section className="relative z-10 overflow-hidden py-20 px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight"
        >
          Take control of your <br />
          <span className="relative inline-block">
            money flow
            <span className="absolute -bottom-1 left-0 w-full h-2 bg-pinkAccent opacity-50 rounded-full blur-sm z-[-1]"></span>
          </span>
          <br />
          with ease
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg text-[#A8A9AD] max-w-xl mx-auto mt-4"
        >
          Track your income and expenses visually. Stay organized, save smart,
          and achieve your financial goals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link to={"/signin"}>
            <button className="mt-6 cursor-pointer bg-[#101829] text-white px-6 py-3 rounded-full">
              GET STARTED
            </button>
          </Link>
        </motion.div>
      </section>

      <motion.section
        id="features"
        className="scroll-mt-24 max-w-4xl mx-auto px-4 mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h3
          variants={fadeUpVariant(0)}
          className="text-3xl font-bold text-gray-900 text-center mb-12"
        >
          Powerful Features
        </motion.h3>
        <div className="space-y-10">
          <Feature
            icon={<Brain />}
            title="AI Assistant"
            text="Get smart, personalized insights and suggestions powered by AI to help you manage finances better."
            delay={0.1}
          />
          <Feature
            icon={<Wallet />}
            title="Expense Tracker"
            text="Record and categorize your expenses with ease. Understand where your money goes and optimize spending."
            delay={0.2}
          />
          <Feature
            icon={<BarChart3 />}
            title="Income & Charts"
            text="Visualize your income, trends, and savings progress with dynamic charts and dashboards."
            delay={0.3}
          />
        </div>
      </motion.section>

      <section id="howitworks" className="max-w-4xl mx-auto px-4 mb-24">
        <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
          How It Works
        </h3>
        <div className="space-y-8">
          <Feature
            icon={<Sparkles />}
            title="1. Sign Up"
            text="Create a free account in seconds and personalize your dashboard."
            delay={0.1}
          />
          <Feature
            icon={<ClipboardList />}
            title="2. Add Data"
            text="Log your income and expenses."
            delay={0.2}
          />
          <Feature
            icon={<LineChart />}
            title="3. Analyze & Grow"
            text="Use insights and visuals to track your progress and hit your goals."
            delay={0.3}
          />
        </div>
      </section>

      <motion.section
        id="review"
        className="max-w-5xl mx-auto px-4 mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h3
          variants={fadeUpVariant(0)}
          className="text-3xl font-bold text-gray-900 text-center mb-12"
        >
          What Users Say
        </motion.h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              variants={fadeUpVariant(0.2 + i * 0.2)}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <p className="text-gray-600 italic mb-4">
                “FinFlow has completely changed the way I handle money. The
                visuals are amazing and it's super easy to use!”
              </p>
              <p className="font-semibold text-gray-800">— Alex, Freelancer</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

interface FeatureProps {
  icon: ReactNode;
  title: string;
  text: string;
  delay?: number;
}

function Feature({ icon, title, text, delay = 0 }: FeatureProps) {
  return (
    <motion.div
      className="flex items-start gap-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUpVariant(delay)}
    >
      <div className="p-3 bg-pinkAccent/10 rounded-full text-pinkAccent">{icon}</div>
      <div>
        <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
        <p className="text-gray-600">{text}</p>
      </div>
    </motion.div>
  );
}

function fadeUpVariant(delay: number = 0): Variants {
  return {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1],
      },
    },
  };
}
