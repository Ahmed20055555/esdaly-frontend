"use client";
import { useEffect, useState } from "react";
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiAlertCircle } from "react-icons/fi";
import { API_BASE_URL } from "../../lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats({
          totalRevenue: data.stats.totalRevenue,
          totalOrders: data.stats.totalOrders,
          totalProducts: data.stats.totalProducts,
          totalUsers: data.stats.totalUsers,
          pendingOrders: data.stats.pendingOrders,
          lowStockProducts: data.stats.lowStockProducts
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'إجمالي الإيرادات',
      value: `${stats.totalRevenue.toLocaleString()} جنيه`,
      icon: FiDollarSign,
      color: 'bg-green-500',
      change: '+12.5%'
    },
    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders.toLocaleString(),
      icon: FiShoppingBag,
      color: 'bg-blue-500',
      change: '+8.2%'
    },
    {
      title: 'المنتجات',
      value: stats.totalProducts.toLocaleString(),
      icon: FiPackage,
      color: 'bg-purple-500',
      change: '+5.1%'
    },
    {
      title: 'المستخدمين',
      value: stats.totalUsers.toLocaleString(),
      icon: FiUsers,
      color: 'bg-orange-500',
      change: '+15.3%'
    },
    {
      title: 'طلبات قيد الانتظار',
      value: stats.pendingOrders.toLocaleString(),
      icon: FiAlertCircle,
      color: 'bg-yellow-500',
      change: null
    },
    {
      title: 'منتجات قليلة المخزون',
      value: stats.lowStockProducts.toLocaleString(),
      icon: FiTrendingUp,
      color: 'bg-red-500',
      change: null
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-600 mt-2">نظرة عامة على المتجر</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <FiTrendingUp className="w-4 h-4" />
                      {stat.change}
                    </p>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">الطلبات الأخيرة</h2>
          <div className="space-y-4">
            {/* This would be populated from API */}
            <p className="text-gray-500 text-center py-8">لا توجد طلبات حديثة</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">أفضل المنتجات مبيعاً</h2>
          <div className="space-y-4">
            {/* This would be populated from API */}
            <p className="text-gray-500 text-center py-8">لا توجد بيانات</p>
          </div>
        </div>
      </div>
    </div>
  );
}
