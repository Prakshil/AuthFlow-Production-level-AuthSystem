"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ResetPasswordPage() {
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoaded(true);
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
        }
    }, [searchParams]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token) {
            toast.error("Invalid reset link");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('/api/users/resetpassword', {
                token,
                newPassword: passwords.newPassword
            });
            
            toast.success("Password reset successfully!");
            router.push('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-linear-to-br from-black via-gray-900 to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                </div>

                <div className="relative z-10 w-full max-w-md animate-fadeInUp">
                    <div className="glass p-8 rounded-2xl text-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">❌</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-4 text-red-400">Invalid Reset Link</h1>
                        <p className="text-gray-400 mb-6">
                            This password reset link is invalid or has expired.
                        </p>
                        <Link 
                            href="/forgotpassword" 
                            className="inline-block bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300"
                        >
                            Request New Reset Link
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
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            </div>

            <div className={`relative z-10 w-full max-w-md ${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
                <div className="glass p-8 rounded-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔒</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                        <p className="text-gray-400">
                            Enter your new password below.
                        </p>
                    </div>
                    
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="group">
                                <input
                                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-white focus:outline-none transition-all duration-300 placeholder-gray-500 group-hover:border-gray-600"
                                    type="password"
                                    placeholder="New Password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                    disabled={loading}
                                    required
                                    minLength={6}
                                />
                            </div>
                            
                            <div className="group">
                                <input
                                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-white focus:outline-none transition-all duration-300 placeholder-gray-500 group-hover:border-gray-600"
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                    disabled={loading}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                            disabled={loading || !passwords.newPassword || !passwords.confirmPassword}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Resetting...
                                </div>
                            ) : (
                                "Reset Password"
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
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/10 rounded-full animate-float"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
            </div>
        </div>
    );
}