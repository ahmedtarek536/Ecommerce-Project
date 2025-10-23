'use client';
import { useEffect, useState } from 'react';
import { analyticsService, DashboardStats } from '@/services/analyticsService';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await analyticsService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (error || !stats) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error || 'No data available'}</div>;
  }

  const metrics = [
    {
      name: "Total Revenue",
      value: `$${stats.totalSales.toLocaleString()}`,
      change: '+12%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
    },
    {
      name: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: '+8%',
      changeType: 'positive',
      icon: ShoppingBagIcon,
    },
    {
      name: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      change: '+15%',
      changeType: 'positive',
      icon: UserGroupIcon,
    },
    {
      name: "Average Order Value",
      value: `$${stats.averageOrderValue.toLocaleString()}`,
      change: '+5%',
      changeType: 'positive',
      icon: ChartBarIcon,
    },
  ];

  const topProducts = stats.topProducts.map((p) => ({
    name: p.product.name,
    sales: p.totalSold,
    revenue: `$${p.revenue.toLocaleString()}`,
    growth: '+0%', // Placeholder, real growth calculation can be added
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <div className="flex items-center gap-4">
          <select
            className="appearance-none pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 90 days</option>
            <option value="year">Last 365 days</option>
          </select>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Download Report
          </button>
        </div>
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <metric.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {metric.changeType === "positive" ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`ml-1 text-sm font-medium ${
                  metric.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                {metric.change}
              </span>
              <span className="ml-1 text-sm text-gray-500">vs last period</span>
            </div>
          </div>
        ))}
      </div>
      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h2>
        <div className="h-80">
          {/* You can add a chart here using stats.salesOverTime */}
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Chart visualization will be added here
          </div>
        </div>
      </div>
      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Top Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product) => (
                <tr key={product.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-green-600">{product.growth}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
