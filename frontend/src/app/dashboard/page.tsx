/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, Package, Activity } from 'lucide-react'
import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'

type StatCard = {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
};

const LoadingState = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="shadow-lg border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 bg-gray-200 rounded w-2/4 animate-pulse"></div>
                </CardHeader>
                <CardContent>
                    <div className="h-10 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </CardContent>
            </Card>
        ))}
    </div>
);


const DashboardHomePage = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchDashboardData = useCallback(async () => {
    if (!token) {
      return;
    }
    setLoading(true);
    try {
      const headers = { 'Authorization': `Token ${token}` };

      const [appointmentsRes, usersRes, materialsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/appointment/list_all_appointments/`, { headers }),
        axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/`, { headers }),
        axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/materials/`, { headers })
      ]);

      const appointmentsCount = Array.isArray(appointmentsRes.data) ? appointmentsRes.data.length : 0;
      const usersCount = Array.isArray(usersRes.data) ? usersRes.data.length : 0;
      const materialsCount = materialsRes.data.count ? materialsRes.data.count : 0;

      const loadedStats: StatCard[] = [
        {
          title: "Total Appointments",
          count: appointmentsCount,
          icon: Calendar,
          color: "text-sky-500",
          bgColor: "bg-sky-50",
        },
        {
          title: "Registered Users",
          count: usersCount,
          icon: Users,
          color: "text-emerald-500",
          bgColor: "bg-emerald-50",
        },
        {
          title: "Available Materials",
          count: materialsCount,
          icon: Package,
          color: "text-amber-500",
          bgColor: "bg-amber-50",
        },
      ];

      setStats(loadedStats);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Activity className="w-8 h-8 text-mainColor" />
            Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">A quick summary of your clinic's activity.</p>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold text-gray-900">
                    {stat.count}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DashboardHomePage;

