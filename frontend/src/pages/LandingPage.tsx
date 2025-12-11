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

const heroContainer: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
      staggerChildren: 0.12,
    },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
  },
};

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    if (token && userId) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-[#f5efe9] scroll-smooth overflow-x-hidden m-0 p-0">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={1.5}
          amplitude={1.3}
          speed={0}
        />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-white/60 bg-[#f5efe9]/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between font-sans">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 cursor-pointer">
            FinFlow
          </h1>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-pinkAccent hover:underline cursor-pointer transition-colors"
            >
              Features
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("howitworks")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-pinkAccent hover:underline cursor-pointer transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("review")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-pinkAccent hover:underline cursor-pointer transition-colors"
            >
              Reviews
            </button>
          </nav>
          <Link to={"/signup"} className="cursor-pointer">
            <motion.button
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.97, y: 0 }}
              className="bg-pinkAccent cursor-pointer text-black px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-pinkAccent/40 transition-transform border border-white"
            >
              Try Free
            </motion.button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 font-sans">
        {/* Hero */}
        <section className="py-24 md:py-32 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate="visible"
              className="backdrop-blur-2xl bg-white/45 border border-white/70 rounded-3xl shadow-[0_24px_80px_rgba(15,23,42,0.18)] px-6 py-8 md:px-10 md:py-10 text-center"
            >
              <motion.div
                variants={heroItem}
                className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/70 text-[11px] font-medium text-gray-700 border border-white/80 shadow-sm cursor-default"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Smart money management, simplified</span>
              </motion.div>

              <motion.h2
                variants={heroItem}
                className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
              >
                Take control of your{" "}
                <span className="relative inline-block">
                  money flow
                  <span className="absolute -bottom-1 left-0 w-full h-2 bg-pinkAccent/70 opacity-70 rounded-full blur-sm -z-10" />
                </span>{" "}
                with ease
              </motion.h2>

              <motion.p
                variants={heroItem}
                className="text-base md:text-lg text-gray-600 max-w-xl mx-auto mt-4"
              >
                Track income and expenses visually, stay organized, and reach
                your financial goals with clarity.
              </motion.p>

              <motion.div
                variants={heroItem}
                className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <Link to={"/signin"} className="cursor-pointer">
                  <motion.button
                    whileHover={{ scale: 1.07, y: -2, boxShadow: "0 20px 60px rgba(15,23,42,0.35)" }}
                    whileTap={{ scale: 0.96, y: 0 }}
                    className="inline-flex items-center justify-center rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/30 cursor-pointer transition-shadow"
                  >
                    Get started
                  </motion.button>
                </Link>
                <button
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-sm font-medium text-gray-800 hover:text-pinkAccent transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  See how it works
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <motion.section
          id="features"
          className="scroll-mt-24 max-w-6xl mx-auto px-4 py-16 md:py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.h3
            variants={fadeUpVariant(0)}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10"
          >
            Powerful features
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              icon={<Brain className="w-5 h-5" />}
              title="AI Assistant"
              text="Get personalized insights and suggestions powered by AI to keep your money working for you."
              delay={0.05}
            />
            <Feature
              icon={<Wallet className="w-5 h-5" />}
              title="Expense tracker"
              text="Log and categorize every transaction in seconds to see exactly where your cash goes."
              delay={0.1}
            />
            <Feature
              icon={<BarChart3 className="w-5 h-5" />}
              title="Income & charts"
              text="Visual dashboards turn raw numbers into clear trends, patterns, and goals."
              delay={0.15}
            />
          </div>
        </motion.section>

        {/* How it works */}
        <section
          id="howitworks"
          className="max-w-5xl mx-auto px-4 py-16 md:py-20"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
            How it works
          </h3>
          <div className="space-y-7">
            <Feature
              icon={<Sparkles className="w-5 h-5" />}
              title="1. Sign up"
              text="Create a free account in seconds and customize your dashboard to match your flow."
              delay={0.05}
            />
            <Feature
              icon={<ClipboardList className="w-5 h-5" />}
              title="2. Add data"
              text="Log your income and expenses or import from your existing tools."
              delay={0.1}
            />
            <Feature
              icon={<LineChart className="w-5 h-5" />}
              title="3. Analyze & grow"
              text="Use insights and visuals to track your progress and stay on top of your goals."
              delay={0.15}
            />
          </div>
        </section>

        {/* Reviews */}
        <motion.section
          id="review"
          className="max-w-6xl mx-auto px-4 py-16 md:py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.h3
            variants={fadeUpVariant(0)}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10"
          >
            What users say
          </motion.h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                variants={fadeUpVariant(0.15 + i * 0.1)}
                className="bg-white/80 border border-white/70 rounded-2xl p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)] cursor-default"
                whileHover={{ y: -4, boxShadow: "0 26px 72px rgba(15,23,42,0.2)" }}
              >
                <p className="text-gray-600 italic mb-4">
                  “FinFlow changed how I handle money. It is simple to use and
                  the visuals keep me on track.”
                </p>
                <p className="font-semibold text-gray-800">— Alex, Freelancer</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
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
      className="group flex md:block items-start gap-4 p-5 rounded-2xl bg-white/80 border border-white/70 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-all duration-100 cursor-pointer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.9 }}
      variants={fadeUpVariant(delay)}
      whileHover={{ y: -10 }}
    >
      <div className="p-3 bg-pinkAccent/10 rounded-2xl text-pinkAccent shadow-pinkAccent/20 mb-2 transition-transform duration-300 ">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-1">
          {title}
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {text}
        </p>
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
