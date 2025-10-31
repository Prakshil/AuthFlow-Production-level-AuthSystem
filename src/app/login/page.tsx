"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function LoginPage() {
    const [loading, setLoading] = React.useState(false);
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [user, setUser] = React.useState({ email: "", password: "" });
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const resp = await axios.post('/api/users/login', user);
            toast.success("Login Successful");
            router.push('/profile');
        } catch (error:any) {
            toast.error(error.response?.data?.message || error.message);
        }finally {
            setLoading(false);
        }
    }

    useEffect(()=> {
            if(user.email.length >0 && user.password.length>0){
                setButtonDisabled(false);
            }
            else {
                setButtonDisabled(true);
            }

    }, [user])

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="fixed inset-0 bg-linear-to-br from-black via-gray-900 to-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            </div>

            <div className={`relative z-10 w-full max-w-md ${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
                {/* Glass card */}
                <div className="glass p-8 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400">Sign in to your account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={onLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="group">
                                <input
                                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-white focus:outline-none transition-all duration-300 placeholder-gray-500 group-hover:border-gray-600"
                                    type="email"
                                    placeholder="Email address"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="group">
                                <input
                                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-white focus:outline-none transition-all duration-300 placeholder-gray-500 group-hover:border-gray-600"
                                    type="password"
                                    placeholder="Password"
                                    value={user.password}
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={buttonDisabled || loading}
                            className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center space-y-4">
                        <Link 
                            href="/forgotpassword" 
                            className="block text-gray-400 hover:text-white transition-colors duration-300"
                        >
                            Forgot your password?
                        </Link>
                        

                        <div className="border-t border-gray-700 pt-4">
                            <p className="text-gray-400">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-white hover:text-gray-300 transition-colors duration-300 font-medium">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                        
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
    )
}