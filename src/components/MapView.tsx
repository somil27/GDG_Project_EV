import { useEffect, useRef } from 'react';
import { Station } from '../services/api';
import { Zap, Battery } from 'lucide-react';

interface MapViewProps {
  stations: Station[];
  selectedStation: Station | null;
  onStationClick: (station: Station) => void;
}

export default function MapView({ stations, selectedStation, onStationClick }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock map - in production, integrate Mapbox or Google Maps
  useEffect(() => {
    // This would initialize the actual map library
  }, []);

  return (
    <div ref={mapRef} className="w-full h-full bg-slate-800 relative">
      {/* Mock Map Background */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-600" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Map Center Label */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-700 text-center pointer-events-none">
        <p className="text-2xl mb-2">Bangalore, India</p>
        <p className="text-sm">12.9716° N, 77.5946° E</p>
      </div>

      {/* Station Markers */}
      <div className="absolute inset-0 p-8">
        {stations.map((station, index) => {
          // Mock positioning - in production, use real lat/lon conversion
          const position = {
            top: `${20 + (index * 12) % 60}%`,
            left: `${15 + (index * 15) % 70}%`
          };

          const isSelected = selectedStation?.id === station.id;

          return (
            <button
              key={station.id}
              onClick={() => onStationClick(station)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                isSelected ? 'scale-125 z-20' : 'scale-100 z-10 hover:scale-110'
              }`}
              style={position}
            >
              <div className="relative">
                {/* Marker Icon */}
                <div className={`rounded-full p-3 shadow-lg transition-colors ${
                  isSelected 
                    ? 'bg-green-500 ring-4 ring-green-500/30' 
                    : station.slotsAvailable > 0
                    ? 'bg-green-600 hover:bg-green-500'
                    : 'bg-red-600'
                }`}>
                  {station.type === 'swap' ? (
                    <Battery className="size-5 text-white" />
                  ) : (
                    <Zap className="size-5 text-white" />
                  )}
                </div>

                {/* Pulse Animation for Selected */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
                )}

                {/* Available Slots Badge */}
                {station.slotsAvailable > 0 && (
                  <div className="absolute -top-1 -right-1 bg-white text-green-600 rounded-full size-5 flex items-center justify-center text-xs shadow-md">
                    {station.slotsAvailable}
                  </div>
                )}
              </div>

              {/* Station Name Label */}
              {isSelected && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-xl border border-slate-700">
                  {station.name}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-2">
        <button className="bg-slate-900 border border-slate-700 text-white rounded-lg p-3 hover:bg-slate-800 shadow-lg">
          +
        </button>
        <button className="bg-slate-900 border border-slate-700 text-white rounded-lg p-3 hover:bg-slate-800 shadow-lg">
          -
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-8 bg-slate-900/95 border border-slate-800 rounded-lg p-4 backdrop-blur-sm">
        <h4 className="text-white mb-2 text-sm">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 rounded-full p-1.5">
              <Zap className="size-3 text-white" />
            </div>
            <span className="text-slate-300">Charging Station</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-green-600 rounded-full p-1.5">
              <Battery className="size-3 text-white" />
            </div>
            <span className="text-slate-300">Battery Swap</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-red-600 rounded-full size-6" />
            <span className="text-slate-300">No Slots Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
