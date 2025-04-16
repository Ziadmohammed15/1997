import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
  Filler
} from 'chart.js';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Star, DollarSign } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ServiceAnalyticsProps {
  serviceId: string;
}

const ServiceAnalytics: React.FC<ServiceAnalyticsProps> = ({ serviceId }) => {
  // Mock data - in a real app, this would come from your backend
  const viewsData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'عدد المشاهدات',
        data: [150, 220, 180, 350, 280, 450],
        fill: true,
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        tension: 0.4
      }
    ]
  };

  const bookingsData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'عدد الحجوزات',
        data: [10, 15, 12, 25, 20, 30],
        backgroundColor: '#14b8a6',
        borderRadius: 8
      }
    ]
  };

  const stats = [
    {
      icon: TrendingUp,
      label: 'إجمالي المشاهدات',
      value: '1.5K',
      change: '+12%',
      positive: true
    },
    {
      icon: Users,
      label: 'عدد الحجوزات',
      value: '112',
      change: '+8%',
      positive: true
    },
    {
      icon: Star,
      label: 'متوسط التقييم',
      value: '4.8',
      change: '+0.2',
      positive: true
    },
    {
      icon: DollarSign,
      label: 'إجمالي الإيرادات',
      value: '5.2K',
      change: '+15%',
      positive: true
    }
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-glass p-4"
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center ml-2">
                <stat.icon className="w-4 h-4 text-primary-500" />
              </div>
              <span className="text-sm text-secondary-600 dark:text-secondary-300">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold dark:text-white">{stat.value}</span>
              <span className={`text-sm ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Views Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-glass p-4"
      >
        <h3 className="font-bold mb-4 dark:text-white">المشاهدات</h3>
        <Line data={viewsData} options={options} />
      </motion.div>

      {/* Bookings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-glass p-4"
      >
        <h3 className="font-bold mb-4 dark:text-white">الحجوزات</h3>
        <Bar data={bookingsData} options={options} />
      </motion.div>
    </div>
  );
};

export default ServiceAnalytics;