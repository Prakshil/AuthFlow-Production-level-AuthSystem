"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('/api/users/forgotpass', { email });
            toast.success("Password reset email sent! Please check your inbox.");
            setSubmitted(true);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-linear-to-br from-black via-gray-900 to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                </div>

                <div className="relative z-10 w-full max-w-md animate-fadeInUp">
                    <div className="glass p-8 rounded-2xl text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">📧</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Email Sent!</h1>
                        <p className="text-gray-400 mb-6">
                            We've sent a password reset link to{" "}
                            <span className="text-white font-medium">{email}</span>.
                            Please check your email and follow the instructions to reset your password.
                        </p>
                        <Link 
                            href="/login" 
                            className="inline-block bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="fixed inset-0 bg-linear-to-br from-black via-gray-900 to-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            </div>

            <div className={`relative z-10 w-full max-w-md ${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
                <div className="glass p-8 rounded-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔐</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
                        <p className="text-gray-400">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>
                    
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="group">
                            <input
                                className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-white focus:outline-none transition-all duration-300 placeholder-gray-500 group-hover:border-gray-600"
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                            disabled={loading || !email}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Sending...
                                </div>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center space-y-4">
                        <Link 
                            href="/login" 
                            className="text-gray-400 hover:text-white transition-colors duration-300"
                        >
                            Back to Login
                        </Link>
                        
                        <div className="pt-2">
                            <Link 
                                href="/" 
                                className="text-gray-500 hover:text-gray-300 transition-colors duration-300 text-sm"
                            >
                                ← Back to home
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full animate-float"></div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-white/5 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
            </div>
        </div>
    );
}