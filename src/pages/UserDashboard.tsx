import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Zap, Leaf, TrendingUp, MapPin, Clock, Award } from 'lucide-react';
import { api, Booking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;
    try {
      const data = await api.getUserBookings(user.id);
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCharges = bookings.filter(b => b.status === 'completed').length;
  const totalSpent = bookings.reduce((sum, b) => b.status === 'completed' ? sum + b.amount : sum, 0);
  const totalEcoPoints = bookings.reduce((sum, b) => b.status === 'completed' ? sum + b.ecoPointsEarned : sum, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-500/20';
      case 'completed': return 'text-blue-400 bg-blue-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl text-white mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-slate-400">Here's your EV charging activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Zap className="size-4" />
                Total Charges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">{totalCharges}</div>
              <div className="text-xs text-green-400 mt-1">+{bookings.filter(b => b.status === 'confirmed').length} upcoming</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <TrendingUp className="size-4" />
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">₹{totalSpent}</div>
              <div className="text-xs text-slate-500 mt-1">All time</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Leaf className="size-4" />
                Eco-Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-green-400">{user?.ecoPoints}</div>
              <div className="text-xs text-green-300 mt-1">+{totalEcoPoints} earned</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Award className="size-4" />
                Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">
                {user && user.ecoPoints >= 1000 ? 'Gold' : user && user.ecoPoints >= 500 ? 'Silver' : 'Bronze'}
              </div>
              <div className="text-xs text-slate-500 mt-1">Member</div>
            </CardContent>
          </Card>
        </div>

        {/* Eco-Points Card */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl text-white mb-2">Your Eco-Points Balance</h2>
              <p className="text-green-50 mb-4">Redeem points for discounts and rewards</p>
              <div className="text-4xl text-white mb-4">{user?.ecoPoints} points</div>
              <Button className="bg-white text-green-600 hover:bg-green-50">
                Redeem Points
              </Button>
            </div>
            <Leaf className="size-32 text-green-400 opacity-20" />
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-white">Your Bookings</h2>
            <Button onClick={() => navigate('/map')} className="bg-green-600 hover:bg-green-700">
              <Zap className="size-4 mr-2" />
              Book New Slot
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <p className="text-slate-400 mt-2">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="size-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No bookings yet</p>
              <Button onClick={() => navigate('/map')} className="bg-green-600 hover:bg-green-700">
                Find a Charging Station
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white text-lg">{booking.stationName}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-slate-400 text-sm mb-2">Booking ID: {booking.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl text-white mb-1">₹{booking.amount}</div>
                      <div className="text-green-400 text-sm">+{booking.ecoPointsEarned} pts</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="size-4" />
                      <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="size-4" />
                      <span>{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="size-4" />
                      <span>Slot #{booking.slotNo}</span>
                    </div>
                  </div>

                  {booking.status === 'confirmed' && (
                    <div className="mt-4 pt-4 border-t border-slate-700 flex gap-3">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/booking-success/${booking.id}`)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        View Pass
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
