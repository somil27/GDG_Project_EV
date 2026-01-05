import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Zap, Clock, Battery, Wifi, Coffee, User, ChevronLeft } from 'lucide-react';
import { api, Station } from '../services/api';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function StationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStation();
  }, [id]);

  const loadStation = async () => {
    if (!id) return;
    try {
      const data = await api.getStationById(id);
      setStation(data || null);
    } catch (error) {
      console.error('Failed to load station:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-slate-400">Station not found</p>
          <Button onClick={() => navigate('/map')} className="mt-4">
            Back to Map
          </Button>
        </div>
      </div>
    );
  }

  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Cafe': Coffee,
    'Restroom': User,
    'Waiting Area': User,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/map')}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ChevronLeft className="size-4 mr-2" />
          Back to Map
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Station Image */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1672542128826-5f0d578713d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaGFyZ2luZyUyMHN0YXRpb258ZW58MXx8fHwxNzY0Mzk5NzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt={station.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Station Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl text-white">{station.name}</h1>
                    <span className={`px-3 py-1 rounded ${
                      station.type === 'fast' ? 'bg-yellow-500/20 text-yellow-400' :
                      station.type === 'swap' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {station.type === 'fast' ? 'Fast Charging' : 
                       station.type === 'swap' ? 'Battery Swap' : 'Slow Charging'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-yellow-400 mb-2">
                    <Star className="size-5 fill-current" />
                    <span className="text-lg">{station.rating}</span>
                    <span className="text-slate-500 ml-2">(124 reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="size-4" />
                    <span>{station.address}</span>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-lg ${
                  station.status === 'online' ? 'bg-green-500/20 text-green-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {station.status}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Available Slots</div>
                  <div className="text-2xl text-white">{station.slotsAvailable}/{station.slotsTotal}</div>
                </div>

                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Price per kWh</div>
                  <div className="text-2xl text-green-400">₹{station.pricePerKwh}</div>
                </div>

                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1 flex items-center gap-1">
                    <Clock className="size-3" />
                    Predicted Wait
                  </div>
                  <div className="text-2xl text-white">{station.predictedWaitTime}m</div>
                </div>

                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Host Rating</div>
                  <div className="text-2xl text-white">{station.rating}</div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {station.amenities.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl text-white mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {station.amenities.map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || User;
                    return (
                      <div key={index} className="flex items-center gap-3 bg-slate-800 rounded-lg p-3">
                        <Icon className="size-5 text-green-500" />
                        <span className="text-slate-300">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* About Host */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl text-white mb-4">About the Host</h2>
              <div className="flex items-center gap-4">
                <div className="size-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="size-8 text-white" />
                </div>
                <div>
                  <div className="text-white text-lg">{station.hostName}</div>
                  <div className="text-slate-400">Verified Host</div>
                  <div className="flex items-center gap-1 text-yellow-400 mt-1">
                    <Star className="size-4 fill-current" />
                    <span>{station.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl text-white mb-4">Book Your Slot</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-slate-400 text-sm mb-2">Estimated Charge</div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="text-2xl text-white mb-1">₹{station.pricePerKwh * 20}</div>
                    <div className="text-slate-400 text-sm">for 20 kWh (~80% charge)</div>
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 text-sm mb-2">You'll Earn</div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="text-2xl text-green-400 mb-1">+{station.pricePerKwh * 2}</div>
                    <div className="text-green-300 text-sm">eco-points</div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate(`/book/${station.id}`)}
                className="w-full bg-green-600 hover:bg-green-700 mb-3"
                size="lg"
                disabled={station.slotsAvailable === 0}
              >
                {station.type === 'swap' ? (
                  <>
                    <Battery className="size-5 mr-2" />
                    Book Battery Swap
                  </>
                ) : (
                  <>
                    <Zap className="size-5 mr-2" />
                    Book Charging Slot
                  </>
                )}
              </Button>

              {station.slotsAvailable === 0 && (
                <p className="text-red-400 text-sm text-center">
                  No slots available at this time
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="text-sm text-slate-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Cancellation</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time</span>
                    <span className="text-white">Instant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
