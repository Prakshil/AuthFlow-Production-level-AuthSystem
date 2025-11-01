"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Stats {
    total: number;
    verified: number;
    unverified: number;
    admins: number;
    regular: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentUserEmail, setCurrentUserEmail] = useState("");

    useEffect(() => {
        fetchUsers();
        getCurrentUser();
    }, []);

    const getCurrentUser = async () => {
        try {
            const response = await axios.get('/api/users/me');
            setCurrentUserEmail(response.data.data.email);
        } catch (error) {
            console.error("Error fetching current user:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users');
            setUsers(response.data.users);
            setStats(response.data.stats);
            setLoading(false);
        } catch (error: any) {
            console.error("Error fetching users:", error);
            if (error.response?.status === 403) {
                toast.error("Access denied. Admin only.");
                router.push('/profile');
            } else {
                toast.error("Failed to load users");
            }
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const confirmMessage = `Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`;
        
        if (!confirm(confirmMessage)) return;
        
        try {
            const response = await axios.post('/api/admin/update-role', {
                userId,
                newRole
            });
            
            toast.success(response.data.message);
            fetchUsers(); // Refresh the list
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update role");
        }
    };

    const isMainAdmin = currentUserEmail === "prakshilmpatel@gmail.com";

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        const matchesStatus = filterStatus === "all" || 
                             (filterStatus === "verified" && user.isVerified) ||
                             (filterStatus === "unverified" && !user.isVerified);
        return matchesSearch && matchesRole && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Background */}
            <div className="fixed inset-0 bg-linear-to-br from-black via-gray-900 to-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-400">Manage all users in the system</p>
                    </div>
                    <Link 
                        href="/profile"
                        className="px-6 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300"
                    >
                        ← Back to Profile
                    </Link>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                        <div className="glass p-6 rounded-xl">
                            <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
                            <div className="text-gray-400 text-sm mt-1">Total Users</div>
                        </div>
                        <div className="glass p-6 rounded-xl">
                            <div className="text-3xl font-bold text-green-400">{stats.verified}</div>
                            <div className="text-gray-400 text-sm mt-1">Verified</div>
                        </div>
                        <div className="glass p-6 rounded-xl">
                            <div className="text-3xl font-bold text-yellow-400">{stats.unverified}</div>
                            <div className="text-gray-400 text-sm mt-1">Unverified</div>
                        </div>
                        <div className="glass p-6 rounded-xl">
                            <div className="text-3xl font-bold text-purple-400">{stats.admins}</div>
                            <div className="text-gray-400 text-sm mt-1">Admins</div>
                        </div>
                        <div className="glass p-6 rounded-xl">
                            <div className="text-3xl font-bold text-gray-400">{stats.regular}</div>
                            <div className="text-gray-400 text-sm mt-1">Regular Users</div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="glass p-6 rounded-xl mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Search</label>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-white placeholder-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Role</label>
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-white cursor-pointer appearance-none"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundSize: '1.25rem'
                                }}
                            >
                                <option value="all" className="bg-gray-900 text-white py-2">All Roles</option>
                                <option value="admin" className="bg-gray-900 text-white py-2">Admin</option>
                                <option value="user" className="bg-gray-900 text-white py-2">User</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-white cursor-pointer appearance-none"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundSize: '1.25rem'
                                }}
                            >
                                <option value="all" className="bg-gray-900 text-white py-2">All Status</option>
                                <option value="verified" className="bg-gray-900 text-white py-2">Verified</option>
                                <option value="unverified" className="bg-gray-900 text-white py-2">Unverified</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="glass rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                                    {isMainAdmin && (
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-900/30 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="font-medium">{user.username}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    user.role === 'admin' 
                                                        ? 'bg-purple-500/20 text-purple-400' 
                                                        : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    user.isVerified 
                                                        ? 'bg-green-500/20 text-green-400' 
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                    {user.isVerified ? '✓ Verified' : '⏳ Unverified'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            {isMainAdmin && (
                                                <td className="px-6 py-4">
                                                    {user.email !== currentUserEmail ? (
                                                        <button
                                                            onClick={() => handleRoleChange(user._id, user.role)}
                                                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium"
                                                        >
                                                            {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">You</span>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isMainAdmin ? 6 : 5} className="px-6 py-12 text-center text-gray-400">
                                            No users found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-center text-gray-400 text-sm">
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            </div>
        </div>
    );
}
