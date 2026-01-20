'use client';

import { useEffect, useState } from 'react';
import { statsApi } from '@/lib/api';
import {
  FiUsers,
  FiMessageSquare,
  FiMic,
  FiImage,
  FiTrendingUp,
  FiClock,
  FiAlertCircle,
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Stats {
  users: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  requests: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  types: {
    text: number;
    voice: number;
    image: number;
  };
  averages: {
    errorsPerRequest: string;
    processingTimeMs: string;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, dailyRes] = await Promise.all([
        statsApi.getDashboard(),
        statsApi.getDaily(7),
      ]);
      console.log('Dashboard stats:', statsRes);
      console.log('Daily stats:', dailyRes);
      // statsApi allaqachon res.data qaytaradi
      setStats(statsRes);
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

  const lineChartData = {
    labels: dailyStats.map((d) => d.date),
    datasets: [
      {
        label: "So'rovlar",
        data: dailyStats.map((d) => d.requests),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ['Matn', 'Ovoz', 'Rasm'],
    datasets: [
      {
        data: [
          stats?.types.text || 0,
          stats?.types.voice || 0,
          stats?.types.image || 0,
        ],
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const statCards = [
    {
      title: 'Jami foydalanuvchilar',
      value: stats?.users.total || 0,
      change: `+${stats?.users.today || 0} bugun`,
      icon: FiUsers,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: "Jami so'rovlar",
      value: stats?.requests.total || 0,
      change: `+${stats?.requests.today || 0} bugun`,
      icon: FiMessageSquare,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: "O'rtacha xatolar",
      value: stats?.averages.errorsPerRequest || '0',
      change: "har bir so'rovda",
      icon: FiAlertCircle,
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: "O'rtacha vaqt",
      value: `${stats?.averages.processingTimeMs || 0}ms`,
      change: 'ishlash vaqti',
      icon: FiClock,
      color: 'from-green-500 to-green-600',
    },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bot statistikasini kuzating</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm card-hover"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {card.value}
                </p>
                <p className="text-sm text-gray-400 mt-1">{card.change}</p>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white`}
              >
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Haftalik so'rovlar
          </h3>
          <div className="h-72">
            <Line
              data={lineChartData}
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

        {/* Doughnut Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            So'rov turlari
          </h3>
          <div className="h-72 flex items-center justify-center">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
                cutout: '70%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <FiMessageSquare className="h-8 w-8" />
            <span className="text-lg font-medium">Matn tekshiruvi</span>
          </div>
          <p className="text-4xl font-bold">{stats?.types.text || 0}</p>
          <p className="text-white/70 mt-1">ta so'rov</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <FiMic className="h-8 w-8" />
            <span className="text-lg font-medium">Ovozli xabarlar</span>
          </div>
          <p className="text-4xl font-bold">{stats?.types.voice || 0}</p>
          <p className="text-white/70 mt-1">ta so'rov</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <FiImage className="h-8 w-8" />
            <span className="text-lg font-medium">Rasmlar</span>
          </div>
          <p className="text-4xl font-bold">{stats?.types.image || 0}</p>
          <p className="text-white/70 mt-1">ta so'rov</p>
        </div>
      </div>
    </div>
  );
}
