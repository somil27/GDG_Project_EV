import { useEffect, useState } from 'react';
import { Users, MapPin, TrendingUp, Zap, Activity, Award } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeStations: 0,
    utilizationRate: 0,
    ecoPointsIssued: 0
  });
  const [bookingTrends, setBookingTrends] = useState<any[]>([]);
  const [revenueTrends, setRevenueTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [statsData, bookingData, revenueData] = await Promise.all([
        api.getAdminStats(),
        api.getBookingTrends(),
        api.getRevenueTrends()
      ]);
      setStats(statsData);
      setBookingTrends(bookingData);
      setRevenueTrends(revenueData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">System overview and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Users className="size-4" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-white">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">+12% this month</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Zap className="size-4" />
                Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-white">{stats.totalBookings.toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">+18% this month</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <TrendingUp className="size-4" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-white">₹{stats.totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">+25% this month</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <MapPin className="size-4" />
                Stations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-white">{stats.activeStations}</div>
              <div className="text-xs text-slate-500 mt-1">Active now</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Activity className="size-4" />
                Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-white">{stats.utilizationRate}%</div>
              <div className="text-xs text-slate-500 mt-1">Average</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Award className="size-4" />
                Eco-Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-white">{stats.ecoPointsIssued.toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">Issued</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Booking Trends */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Booking Trends</CardTitle>
              <p className="text-sm text-slate-400">Last 7 days</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bookingTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8' }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Trends */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Revenue Growth</CardTitle>
              <p className="text-sm text-slate-400">Last 7 months</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Performing Stations */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Top Performing Stations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Green Energy Hub - Koramangala', bookings: 145, revenue: 17400 },
                  { name: 'EcoCharge Hub - Electronic City', bookings: 132, revenue: 15840 },
                  { name: 'PowerCharge - MG Road', bookings: 118, revenue: 14160 }
                ].map((station, index) => (
                  <div key={index} className="flex items-center justify-between pb-3 border-b border-slate-800 last:border-0">
                    <div>
                      <div className="text-white text-sm mb-1">{station.name}</div>
                      <div className="text-slate-400 text-xs">{station.bookings} bookings</div>
                    </div>
                    <div className="text-green-400">₹{station.revenue}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">Server Uptime</span>
                    <span className="text-green-400">99.9%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">API Response Time</span>
                    <span className="text-green-400">145ms</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">Payment Success Rate</span>
                    <span className="text-green-400">98.5%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.5%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">User Satisfaction</span>
                    <span className="text-green-400">96.2%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '96.2%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'New user registered', time: '2 min ago', icon: Users },
                  { action: 'Booking completed', time: '5 min ago', icon: Zap },
                  { action: 'New station added', time: '12 min ago', icon: MapPin },
                  { action: 'Payment received', time: '18 min ago', icon: TrendingUp },
                  { action: 'Station went online', time: '25 min ago', icon: Activity }
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 pb-3 border-b border-slate-800 last:border-0">
                      <div className="size-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="size-4 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm">{activity.action}</div>
                        <div className="text-slate-400 text-xs">{activity.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
