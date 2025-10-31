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
      icon: "�",
      title: "Email and SMS passwordless",
      description: "Passwordless that feels obvious: one-time codes via email or SMS.",
      visual: (
        <div className="relative h-32 bg-gradient-to-br from-purple-900/20 to-purple-700/20 rounded-lg p-4 flex items-center justify-center">
          <div className="bg-gray-800/80 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-xs text-gray-400 mb-2">Enter verification code</div>
            <div className="flex space-x-2">
              {[3, 1, 4, 1, 5, 9].map((num, i) => (
                <div key={i} className="w-8 h-8 bg-gray-700 rounded border flex items-center justify-center text-white text-sm">
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      icon: "�",
      title: "Social sign-in",
      description: "Social sign-in done. Google, Apple, Discord, and more.",
      visual: (
        <div className="relative h-32 bg-gradient-to-br from-blue-900/20 to-indigo-700/20 rounded-lg p-4">
          <div className="bg-gray-800/80 rounded-lg p-3 backdrop-blur-sm mb-2">
            <div className="flex items-center justify-center space-x-2 py-2">
              <div className="w-5 h-5 bg-white rounded-full"></div>
              <span className="text-sm text-white">Continue with Google</span>
            </div>
          </div>
          <div className="flex justify-center space-x-3">
            {['G', 'f', '⚡', '📱', '🐙', '💬'].map((icon, i) => (
              <div key={i} className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                {icon}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      icon: "�",
      title: "Password authentication",
      description: "Still the default. Still what users expect.",
      visual: (
        <div className="relative h-32 bg-gradient-to-br from-gray-900/20 to-gray-700/20 rounded-lg p-4 flex items-center justify-center">
          <div className="bg-gray-800/80 rounded-lg p-4 backdrop-blur-sm w-full">
            <div className="text-xs text-gray-400 mb-2">Password</div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
                ))}
              </div>
              <div className="w-5 h-5 bg-gray-600 rounded flex items-center justify-center">
                <span className="text-xs">👁</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">At least 8 types of characters are required.</div>
          </div>
        </div>
      )
    },
    {
      icon: "🚀",
      title: "Multi-app omni sign-in experience",
      description: "One sign-in flow. Every app. Looks native. Works everywhere. Zero friction.",
      visual: (
        <div className="relative h-32 bg-gradient-to-br from-teal-900/20 to-cyan-700/20 rounded-lg p-4">
          <div className="flex space-x-2">
            <div className="bg-teal-800/60 rounded-lg p-2 backdrop-blur-sm flex-1">
              <div className="text-xs text-teal-300 mb-1">📱 Mobile App</div>
              <div className="text-xs text-gray-300">Sign in to your account</div>
            </div>
            <div className="bg-blue-800/60 rounded-lg p-2 backdrop-blur-sm flex-1">
              <div className="text-xs text-blue-300 mb-1">💻 Web App</div>
              <div className="text-xs text-gray-300">Access your data</div>
            </div>
          </div>
          <div className="mt-2 bg-gray-800/60 rounded p-2 backdrop-blur-sm">
            <div className="text-xs text-green-400">✅ Single Sign-On Active</div>
          </div>
        </div>
      )
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
            
            <Link 
              href="#features"
              className="px-8 py-4 border border-gray-600 rounded-lg text-lg hover:border-gray-400 transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-white rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-white rounded-full opacity-10 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-white rounded-full opacity-15 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Protocols Section */}
      <div className="relative z-10 py-16 px-4 bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl mb-3">🔗</div>
              <h3 className="text-lg font-semibold mb-2">Protocols that work</h3>
              <p className="text-sm text-gray-400">OAuth 2.1, OIDC, SAML Auth, SSO, RBAC.</p>
            </div>
            <div>
              <div className="text-2xl mb-3">📱</div>
              <h3 className="text-lg font-semibold mb-2">Any app, anywhere</h3>
              <p className="text-sm text-gray-400">From local to cloud. From web to mobile. From one app to many.</p>
            </div>
            <div>
              <div className="text-2xl mb-3">💰</div>
              <h3 className="text-lg font-semibold mb-2">No billing surprises</h3>
              <p className="text-sm text-gray-400">50K MAUs free. Token-based. Pay-as-you-go.</p>
            </div>
            <div>
              <div className="text-2xl mb-3">🛠️</div>
              <h3 className="text-lg font-semibold mb-2">Built for devs</h3>
              <p className="text-sm text-gray-400">Open-source. Fast integration. Developer-first support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Millions of identities. Proven reliability.
          </h2>
          <p className="text-xl text-gray-400 mb-16">
            Trusted by public companies, fast-growing startups, and government agencies.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-60">
            {['BOSS', 'LandingAI', 'INK', 'Cheqd', 'Stockarea', 'VZSuper', 'Nexar', 'Mail'].map((company, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="text-gray-500 font-semibold text-lg hover:text-gray-300 transition-colors duration-300">
                  {company}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-8 ${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
            Authentication Solutions
          </h2>
          <p className={`text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto ${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
            Trusted by developers worldwide. Fast integration. Enterprise-ready security.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`glass p-8 rounded-2xl hover:bg-gray-900/20 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] group border border-gray-800/50 hover:border-gray-700/50 ${
                  isLoaded ? 'animate-fadeInUp' : 'opacity-0'
                }`}
                style={{animationDelay: `${index * 0.15}s`}}
              >
                {/* Visual Component */}
                <div className="mb-6 group-hover:scale-[1.02] transition-transform duration-500">
                  {feature.visual}
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-white transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
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
