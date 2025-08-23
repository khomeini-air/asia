"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  if (!isAuthenticated) {
    // Render nothing or a loading spinner while redirecting
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="container flex items-center justify-between px-6 py-4 mx-auto">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <div>
            <a href="/admin/dashboard" className="px-4 text-gray-600 hover:text-blue-600">Dashboard</a>
            <button onClick={handleLogout} className="px-4 py-2 ml-4 font-bold text-white bg-red-500 rounded hover:bg-red-600">
                 Logout
            </button>
          </div>
        </nav>
      </header>
      <main className="container p-6 mx-auto">
        {children}
      </main>
    </div>
  );
}