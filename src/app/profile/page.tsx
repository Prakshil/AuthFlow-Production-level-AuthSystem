"use client";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface UserData {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    role: string;
    createdAt: string;
}

export default function UserProfile() {
    const router = useRouter();
    const [data, setData] = React.useState<UserData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
        getUserData();
        setIsLoaded(true);
    }, []);

    const handleLogout = async () => {
        try {
            const resp = await axios.get('/api/users/logout');
            toast.success("Logout Successful");
            router.push('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const getUserData = async () => {
        try {
            setLoading(true);
            const resp = await axios.get('/api/users/me');
            setData(resp.data.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Animated background */}
            <div className="fixed inset-0 bg-linear-to-br from-black via-gray-900 to-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            </div>

            {/* Navbar */}
            <nav className={`relative z-10 p-6 border-b border-gray-800 ${isLoaded ? 'animate-fadeInDown' : 'opacity-0'}`}>
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        AuthFlow
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 border border-gray-600 rounded-lg hover:border-gray-400 hover:bg-gray-900 transition-all duration-300"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="relative z-10 max-w-4xl mx-auto p-6">
                <div className={`${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Your Profile
                        </h1>
                        <p className="text-gray-400">Manage your account information</p>
                    </div>

                    {data && (
                        <div className="space-y-6">
                            {/* Main Profile Card */}
                            <div className="glass p-8 rounded-2xl">
                                <div className="flex items-center space-x-6 mb-6">
                                    <div className="w-20 h-20 bg-linear-to-br from-white to-gray-400 rounded-full flex items-center justify-center">
                                        <span className="text-2xl font-bold text-black">
                                            {data.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{data.username}</h2>
                                        <p className="text-gray-400">{data.email}</p>
                                        <div className="flex items-center mt-2">
                                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                                data.isVerified ? 'bg-green-500' : 'bg-red-500'
                                            }`}></span>
                                            <span className={data.isVerified ? 'text-green-400' : 'text-red-400'}>
                                                {data.isVerified ? 'Verified' : 'Not Verified'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {!data.isVerified && (
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-6">
                                        <h3 className="text-yellow-400 font-medium mb-2">Email Not Verified</h3>
                                        <p className="text-yellow-300/80 text-sm">
                                            Please check your email and click the verification link to verify your account.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Profile Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass p-6 rounded-xl hover:bg-gray-900/20 transition-all duration-300 group">
                                    <h3 className="text-lg font-semibold mb-3 group-hover:text-gray-200 transition-colors">User ID</h3>
                                    <p className="text-gray-400 font-mono text-sm break-all group-hover:text-gray-300 transition-colors">
                                        {data._id}
                                    </p>
                                </div>

                                <div className="glass p-6 rounded-xl hover:bg-gray-900/20 transition-all duration-300 group">
                                    <h3 className="text-lg font-semibold mb-3 group-hover:text-gray-200 transition-colors">Role</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                        data.role === 'admin' 
                                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    }`}>
                                        {data.role}
                                    </span>
                                </div>

                                <div className="glass p-6 rounded-xl hover:bg-gray-900/20 transition-all duration-300 group">
                                    <h3 className="text-lg font-semibold mb-3 group-hover:text-gray-200 transition-colors">Member Since</h3>
                                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                        {new Date(data.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="glass p-6 rounded-xl hover:bg-gray-900/20 transition-all duration-300 group">
                                    <h3 className="text-lg font-semibold mb-3 group-hover:text-gray-200 transition-colors">Account Status</h3>
                                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Floating elements */}
                <div className="absolute top-10 right-10 w-4 h-4 bg-white/10 rounded-full animate-float"></div>
                <div className="absolute bottom-20 left-10 w-6 h-6 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
            </div>
        </div>
    );
}
