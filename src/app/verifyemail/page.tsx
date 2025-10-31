"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios';

function VerifyEmailContent() {
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
    const [token, setToken] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoaded(true);
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
            verifyEmail(urlToken);
        } else {
            setVerifying(false);
            setError("No verification token found");
        }
    }, [searchParams]);

    const verifyEmail = async (verificationToken: string) => {
        try {
            const response = await axios.post('/api/users/verification', {
                token: verificationToken
            });
            
            setVerified(true);
            toast.success("Email verified successfully!");
        } catch (error: any) {
            setError(error.response?.data?.error || "Verification failed");
            toast.error("Email verification failed!");
        } finally {
            setVerifying(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-linear-to-br from-black via-gray-900 to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                </div>

                <div className="relative z-10 w-full max-w-md animate-fadeInUp">
                    <div className="glass p-8 rounded-2xl text-center">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h1 className="text-3xl font-bold mb-4">Verifying your email...</h1>
                        <p className="text-gray-400">Please wait while we verify your email address.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (verified) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-linear-to-br from-black via-gray-900 to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                </div>

                <div className={`relative z-10 w-full max-w-md ${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
                    <div className="glass p-8 rounded-2xl text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                            <span className="text-3xl">✓</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-4 text-green-400">Email Verified!</h1>
                        <p className="text-gray-400 mb-6">
                            Your email has been successfully verified. You can now log in to your account.
                        </p>
                        <Link 
                            href="/login" 
                            className="inline-block bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                        >
                            Go to Login
                        </Link>
                    </div>

                    {/* Floating elements */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-500/20 rounded-full animate-float"></div>
                    <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-green-500/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-linear-to-br from-black via-gray-900 to-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            </div>

            <div className={`relative z-10 w-full max-w-md ${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
                <div className="glass p-8 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">✗</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-red-400">Verification Failed</h1>
                    <p className="text-gray-400 mb-6">
                        {error || "The verification link is invalid or has expired."}
                    </p>
                    <div className="space-y-4">
                        <Link 
                            href="/signup" 
                            className="block bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300"
                        >
                            Sign Up Again
                        </Link>
                        <Link 
                            href="/login" 
                            className="block text-gray-400 hover:text-white transition-colors duration-300"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500/20 rounded-full animate-float"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-red-500/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading...</p>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <VerifyEmailContent />
        </Suspense>
    );
}