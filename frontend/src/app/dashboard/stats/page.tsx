'use client';

import { useEffect, useState } from 'react';
import { statsApi } from '@/lib/api';
import {
  FiUsers,
  FiMessageSquare,
  FiTrendingUp,
  FiAward,
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopUser {
  id: number;
  telegramId: string;
  username: string;
  firstName: string;
  totalRequests: number;
  textRequests: number;
  voiceRequests: number;
  imageRequests: number;
}

interface RecentRequest {
  id: number;
  telegramId: string;
  type: string;
  originalText: string;
  correctedText: string;
  errorsCount: number;
  processingTime: number;
  createdAt: string;
}

export default function StatsPage() {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [topRes, recentRes, dailyRes] = await Promise.all([
        statsApi.getTopUsers(10),
        statsApi.getRecentRequests(20),
        statsApi.getDaily(14),
      ]);
      // statsApi allaqachon res.data qaytaradi
      setTopUsers(topRes || []);
      setRecentRequests(recentRes || []);
      setDailyStats(dailyRes || []);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const barChartData = {
    labels: dailyStats.map((d) => d.date),
    datasets: [
      {
        label: "So'rovlar",
        data: dailyStats.map((d) => d.requests),
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Statistika</h1>
        <p className="text-gray-500 mt-1">Batafsil statistik ma'lumotlar</p>
      </div>

      {/* Daily Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Kunlik so'rovlar (14 kun)
        </h3>
        <div className="h-72">
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-yellow-100 text-yellow-600">
              <FiAward className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Top foydalanuvchilar
            </h3>
          </div>

          {topUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Ma'lumot yo'q</p>
          ) : (
            <div className="space-y-3">
              {topUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : index === 1
                        ? 'bg-gray-100 text-gray-700'
                        : index === 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {user.firstName || user.username || `User ${user.telegramId}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{user.username || 'unknown'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {user.totalRequests}
                    </p>
                    <p className="text-xs text-gray-500">so'rov</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <FiMessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              So'nggi so'rovlar
            </h3>
          </div>

          {recentRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Ma'lumot yo'q</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentRequests.slice(0, 10).map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        req.type === 'text'
                          ? 'bg-blue-100 text-blue-700'
                          : req.type === 'voice'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {req.type === 'text'
                        ? 'Matn'
                        : req.type === 'voice'
                        ? 'Ovoz'
                        : 'Rasm'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(req.createdAt).toLocaleString('uz-UZ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {req.originalText}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>🔴 {req.errorsCount} xato</span>
                    <span>⏱️ {req.processingTime}ms</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
