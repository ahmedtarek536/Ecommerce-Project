"use client";
import React from "react";

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const mockStats = {
  totalSales: 24500,
  totalOrders: 1234,
  totalCustomers: 3456,
  averageOrderValue: 85,
  salesByCategory: [
    { category: "Clothing", total: 12000 },
    { category: "Shoes", total: 8000 },
    { category: "Accessories", total: 4500 },
  ],
  salesOverTime: [
    { date: "2024-05-01", total: 1000 },
    { date: "2024-05-02", total: 1200 },
    { date: "2024-05-03", total: 1500 },
    { date: "2024-05-04", total: 2000 },
    { date: "2024-05-05", total: 1800 },
  ],
  topProducts: [
    {
      productId: 1,
      product: { name: "T-Shirt", color: "Red" },
      totalSold: 120,
      revenue: 2400,
    },
    {
      productId: 2,
      product: { name: "Sneakers", color: "White" },
      totalSold: 90,
      revenue: 4500,
    },
    {
      productId: 3,
      product: { name: "Hat", color: "Black" },
      totalSold: 60,
      revenue: 900,
    },
  ],
  recentOrders: [
    {
      id: 101,
      customerName: "John Doe",
      totalAmount: 120,
      status: "Completed",
      date: "2024-05-05",
    },
    {
      id: 102,
      customerName: "Jane Smith",
      totalAmount: 85,
      status: "Pending",
      date: "2024-05-04",
    },
    {
      id: 103,
      customerName: "Alice Brown",
      totalAmount: 200,
      status: "Completed",
      date: "2024-05-03",
    },
  ],
};

function formatCurrency(amount) {
  return `$${amount.toLocaleString()}`;
}

export default function DashboardPage() {
  const stats = mockStats;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.totalSales)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Order Value</p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.averageOrderValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">Top Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Color</th>
                <th className="text-right py-3 px-4">Units Sold</th>
                <th className="text-right py-3 px-4">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((product) => (
                <tr key={product.productId} className="border-b">
                  <td className="py-3 px-4">{product.product.name}</td>
                  <td className="py-3 px-4">{product.product.color}</td>
                  <td className="py-3 px-4 text-right">{product.totalSold}</td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-3 px-4">#{order.id}</td>
                  <td className="py-3 px-4">{order.customerName}</td>
                  <td className="py-3 px-4">{order.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(order.totalAmount)}
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
