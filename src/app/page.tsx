"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: "🔐",
      title: "Secure Authentication",
      description: "JWT-based authentication with secure HTTP-only cookies"
    },
    {
      icon: "📧",
      title: "Email Verification",
      description: "Complete email verification system with beautiful templates"
    },
    {
      icon: "🔄",
      title: "Password Reset",
      description: "Secure password reset functionality with token-based verification"
    },
    {
      icon: "🛡️",
      title: "Route Protection",
      description: "Middleware-based route protection for authenticated users"
    },
    {
      icon: "🎨",
      title: "Modern UI",
      description: "Dark theme with glass morphism and smooth animations"
    },
    {
      icon: "⚡",
      title: "Fast & Secure",
      description: "Built with Next.js 14, TypeScript, and MongoDB for optimal performance"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      {/* Navbar */}
      <nav className={`relative z-10 p-6 ${isLoaded ? 'animate-fadeInDown' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AuthFlow
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="#features" className="hover:text-gray-300 transition-colors duration-300">Features</Link>
            <Link href="#about" className="hover:text-gray-300 transition-colors duration-300">About</Link>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/login" 
              className="px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-400 transition-all duration-300 hover:scale-105"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200 transition-all duration-300 hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className={`text-center max-w-4xl mx-auto ${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent animate-pulse-slow">
            AuthFlow
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Complete authentication system with{" "}
            <span className="text-white font-semibold">email verification</span>, 
            <span className="text-white font-semibold"> password reset</span>, and 
            <span className="text-white font-semibold"> secure JWT authentication</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/signup"
              className="group px-8 py-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Get Started
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
            </Link>
            
            {/* <Link 
              href="#features"
              className="px-8 py-4 border border-gray-600 rounded-lg text-lg hover:border-gray-400 transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Link> */}
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-white rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-white rounded-full opacity-10 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-white rounded-full opacity-15 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-16 ${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
            Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`glass p-8 rounded-2xl hover:bg-gray-900/20 transition-all duration-500 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] group ${
                  isLoaded ? 'animate-fadeInUp' : 'opacity-0'
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-gray-200 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Built with Modern Technology
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-12">
            This authentication system is built using Next.js 14, TypeScript, MongoDB, and JWT. 
            It features a complete email verification system, secure password reset functionality, 
            and beautiful dark UI with glass morphism effects.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {['Next.js 14', 'TypeScript', 'MongoDB', 'JWT', 'Tailwind CSS', 'Nodemailer', 'bcrypt'].map((tech, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-gray-800 rounded-full border border-gray-700 hover:border-gray-500 transition-colors duration-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 AuthFlow. Built with ❤️ and Next.js By Prakshil Patell</p>
          <p>All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
