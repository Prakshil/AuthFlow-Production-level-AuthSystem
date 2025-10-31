"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface UserData {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    useEffect(() => {
        if (id) {
            fetchUserData();
            checkIfOwnProfile();
        }
    }, [id]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            // For now, we'll use the /me endpoint if it's the user's own profile
            // In a real app, you'd have a separate endpoint to fetch user by ID
            const resp = await axios.get('/api/users/me');
            if (resp.data.data._id === id) {
                setUserData(resp.data.data);
                setIsOwnProfile(true);
            } else {
                toast.error("Cannot view other user's profile");
                router.push('/profile');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load profile");
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const checkIfOwnProfile = async () => {
        try {
            const resp = await axios.get('/api/users/me');
            setIsOwnProfile(resp.data.data._id === id);
        } catch (error) {
            setIsOwnProfile(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                <p className="mt-4">Loading profile...</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Profile Not Found</h1>
                <Link href="/profile" className="text-blue-500 hover:underline">
                    Back to Profile
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-4">
            <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">
                        {isOwnProfile ? 'Your Profile' : `${userData.username}'s Profile`}
                    </h1>
                    <Link href="/profile" className="text-blue-500 hover:underline">
                        ← Back
                    </Link>
                </div>

                <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-600 mb-1">User ID</h3>
                            <p className="font-mono text-sm break-all">{userData._id}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Name</h3>
                            <p className="text-lg font-semibold">{userData.username}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Email</h3>
                            <p className="font-semibold">{userData.email}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Role</h3>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                userData.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                                {userData.role}
                            </span>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Email Status</h3>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                userData.isVerified 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {userData.isVerified ? 'Verified' : 'Not Verified'}
                            </span>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Member Since</h3>
                            <p className="font-semibold">
                                {new Date(userData.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    {!userData.isVerified && isOwnProfile && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h3 className="text-yellow-800 font-medium mb-2">Email Not Verified</h3>
                            <p className="text-yellow-700 text-sm">
                                Please check your email and click the verification link to verify your account.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}