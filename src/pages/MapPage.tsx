import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Battery, Zap, Clock, Navigation } from 'lucide-react';
import { api, Station } from '../services/api';
import Navigation_Component from '../components/Navigation';
import StationCard from '../components/StationCard';
import MapView from '../components/MapView';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function MapPage() {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'fast' | 'slow' | 'swap'>('all');

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const data = await api.getStations();
      setStations(data);
    } catch (error) {
      console.error('Failed to load stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          station.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || station.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
  };

  const handleViewDetails = (stationId: string) => {
    navigate(`/station/${stationId}`);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <Navigation_Component />

      <div className="flex-1 flex overflow-hidden">
        {/* Map Section */}
        <div className="flex-1 relative">
          <MapView 
            stations={filteredStations}
            selectedStation={selectedStation}
            onStationClick={handleStationClick}
          />

          {/* Search & Filter Overlay */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-xl p-4 shadow-xl">
              <div className="flex gap-3 mb-3">
                <Input
                  type="text"
                  placeholder="Search stations or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-slate-800 border-slate-700 text-white"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Navigation className="size-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  className={filterType === 'all' ? 'bg-green-600' : 'border-slate-700 text-slate-300'}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filterType === 'fast' ? 'default' : 'outline'}
                  onClick={() => setFilterType('fast')}
                  className={filterType === 'fast' ? 'bg-green-600' : 'border-slate-700 text-slate-300'}
                >
                  <Zap className="size-3 mr-1" />
                  Fast
                </Button>
                <Button
                  size="sm"
                  variant={filterType === 'slow' ? 'default' : 'outline'}
                  onClick={() => setFilterType('slow')}
                  className={filterType === 'slow' ? 'bg-green-600' : 'border-slate-700 text-slate-300'}
                >
                  <Clock className="size-3 mr-1" />
                  Slow
                </Button>
                <Button
                  size="sm"
                  variant={filterType === 'swap' ? 'default' : 'outline'}
                  onClick={() => setFilterType('swap')}
                  className={filterType === 'swap' ? 'bg-green-600' : 'border-slate-700 text-slate-300'}
                >
                  <Battery className="size-3 mr-1" />
                  Swap
                </Button>
              </div>
            </div>
          </div>

          {/* Station Count */}
          <div className="absolute top-40 left-4 z-10">
            <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-lg px-4 py-2">
              <p className="text-slate-300 text-sm">
                <span className="text-green-500">{filteredStations.length}</span> stations found
              </p>
            </div>
          </div>

          {/* Selected Station Details */}
          {selectedStation && (
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <StationCard
                station={selectedStation}
                onViewDetails={() => handleViewDetails(selectedStation.id)}
                onClose={() => setSelectedStation(null)}
              />
            </div>
          )}
        </div>

        {/* Stations List Sidebar */}
        <div className="w-96 bg-slate-900 border-l border-slate-800 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xl text-white mb-4">Nearby Stations</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <p className="text-slate-400 mt-2">Loading stations...</p>
              </div>
            ) : filteredStations.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="size-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No stations found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredStations.map((station) => (
                  <div
                    key={station.id}
                    onClick={() => handleStationClick(station)}
                    className={`bg-slate-800 border rounded-xl p-4 cursor-pointer transition-all ${
                      selectedStation?.id === station.id
                        ? 'border-green-500 shadow-lg shadow-green-500/20'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white">{station.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        station.type === 'fast' ? 'bg-yellow-500/20 text-yellow-400' :
                        station.type === 'swap' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {station.type}
                      </span>
                    </div>

                    <p className="text-sm text-slate-400 mb-3">{station.address}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">
                          {station.slotsAvailable}/{station.slotsTotal} available
                        </span>
                        <span className="text-green-400">₹{station.pricePerKwh}/kWh</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="size-3" />
                        <span>{station.predictedWaitTime}m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
