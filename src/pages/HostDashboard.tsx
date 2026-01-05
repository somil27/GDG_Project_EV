import { useEffect, useState } from 'react';
import { Plus, MapPin, Zap, TrendingUp, Users, Star, Settings } from 'lucide-react';
import { api, Station, Booking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function HostDashboard() {
  const { user } = useAuth();
  const [stations, setStations] = useState<Station[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStation, setShowAddStation] = useState(false);

  // Add Station Form State
  const [newStation, setNewStation] = useState({
    name: '',
    address: '',
    type: 'fast' as 'fast' | 'slow' | 'swap',
    slotsTotal: 4,
    pricePerKwh: 12,
    lat: 12.9716,
    lon: 77.5946
  });

  useEffect(() => {
    if (user) {
      loadHostData();
    }
  }, [user]);

  const loadHostData = async () => {
    if (!user) return;
    try {
      const [stationsData, bookingsData] = await Promise.all([
        api.getHostStations(user.id),
        api.getUserBookings(user.id) // In real app, this would be getHostBookings
      ]);
      setStations(stationsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Failed to load host data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStation = async () => {
    if (!user) return;
    try {
      await api.createStation({
        ...newStation,
        hostId: user.id,
        hostName: user.name
      });
      setShowAddStation(false);
      loadHostData();
      // Reset form
      setNewStation({
        name: '',
        address: '',
        type: 'fast',
        slotsTotal: 4,
        pricePerKwh: 12,
        lat: 12.9716,
        lon: 77.5946
      });
    } catch (error) {
      console.error('Failed to add station:', error);
    }
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const totalBookings = bookings.length;
  const averageRating = stations.reduce((sum, s) => sum + s.rating, 0) / (stations.length || 1);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-white mb-2">Host Dashboard</h1>
            <p className="text-slate-400">Manage your charging stations</p>
          </div>

          <Dialog open={showAddStation} onOpenChange={setShowAddStation}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="size-4 mr-2" />
                Add Station
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl text-white">Add New Charging Station</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-slate-300">Station Name</Label>
                  <Input
                    value={newStation.name}
                    onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
                    placeholder="My Home Charger"
                    className="mt-2 bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Address</Label>
                  <Input
                    value={newStation.address}
                    onChange={(e) => setNewStation({ ...newStation, address: e.target.value })}
                    placeholder="123 Main St, City - 560001"
                    className="mt-2 bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Station Type</Label>
                    <Select
                      value={newStation.type}
                      onValueChange={(value: 'fast' | 'slow' | 'swap') => setNewStation({ ...newStation, type: value })}
                    >
                      <SelectTrigger className="mt-2 bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast">Fast Charging</SelectItem>
                        <SelectItem value="slow">Slow Charging</SelectItem>
                        <SelectItem value="swap">Battery Swap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Total Slots</Label>
                    <Input
                      type="number"
                      value={newStation.slotsTotal}
                      onChange={(e) => setNewStation({ ...newStation, slotsTotal: parseInt(e.target.value) })}
                      min="1"
                      className="mt-2 bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Price per kWh (₹)</Label>
                  <Input
                    type="number"
                    value={newStation.pricePerKwh}
                    onChange={(e) => setNewStation({ ...newStation, pricePerKwh: parseInt(e.target.value) })}
                    min="1"
                    className="mt-2 bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Latitude</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={newStation.lat}
                      onChange={(e) => setNewStation({ ...newStation, lat: parseFloat(e.target.value) })}
                      className="mt-2 bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Longitude</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={newStation.lon}
                      onChange={(e) => setNewStation({ ...newStation, lon: parseFloat(e.target.value) })}
                      className="mt-2 bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddStation}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Add Station
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <MapPin className="size-4" />
                Stations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">{stations.length}</div>
              <div className="text-xs text-green-400 mt-1">
                {stations.filter(s => s.status === 'online').length} online
              </div>
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
              <div className="text-3xl text-white">₹{totalRevenue}</div>
              <div className="text-xs text-slate-500 mt-1">This month</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Users className="size-4" />
                Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">{totalBookings}</div>
              <div className="text-xs text-slate-500 mt-1">Total</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Star className="size-4" />
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">{averageRating.toFixed(1)}</div>
              <div className="text-xs text-yellow-400 mt-1">Average</div>
            </CardContent>
          </Card>
        </div>

        {/* Stations List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl text-white mb-6">Your Stations</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : stations.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="size-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No stations yet</p>
              <Button onClick={() => setShowAddStation(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="size-4 mr-2" />
                Add Your First Station
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {stations.map((station) => (
                <div
                  key={station.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white text-lg">{station.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          station.type === 'fast' ? 'bg-yellow-500/20 text-yellow-400' :
                          station.type === 'swap' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {station.type}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{station.address}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-slate-400">
                      <Settings className="size-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-slate-900 rounded-lg p-3">
                      <div className="text-slate-400 text-xs mb-1">Slots</div>
                      <div className="text-white">{station.slotsAvailable}/{station.slotsTotal}</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3">
                      <div className="text-slate-400 text-xs mb-1">Price</div>
                      <div className="text-green-400">₹{station.pricePerKwh}</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3">
                      <div className="text-slate-400 text-xs mb-1">Rating</div>
                      <div className="text-white flex items-center gap-1">
                        <Star className="size-3 fill-yellow-400 text-yellow-400" />
                        {station.rating}
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 text-sm ${
                    station.status === 'online' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <div className={`size-2 rounded-full ${
                      station.status === 'online' ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    {station.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl text-white mb-6">Recent Bookings</h2>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Users className="size-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Zap className="size-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-white">{booking.stationName}</div>
                      <div className="text-slate-400 text-sm">
                        {new Date(booking.startTime).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white">₹{booking.amount}</div>
                    <div className={`text-xs ${
                      booking.status === 'completed' ? 'text-blue-400' :
                      booking.status === 'confirmed' ? 'text-green-400' :
                      'text-yellow-400'
                    }`}>
                      {booking.status}
                    </div>
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
