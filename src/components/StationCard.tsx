import { Star, MapPin, Zap, Clock, X } from 'lucide-react';
import { Station } from '../services/api';
import { Button } from './ui/button';

interface StationCardProps {
  station: Station;
  onViewDetails: () => void;
  onClose: () => void;
}

export default function StationCard({ station, onViewDetails, onClose }: StationCardProps) {
  return (
    <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl text-white">{station.name}</h3>
            <span className={`px-2 py-1 rounded text-xs ${
              station.type === 'fast' ? 'bg-yellow-500/20 text-yellow-400' :
              station.type === 'swap' ? 'bg-blue-500/20 text-blue-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {station.type}
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-slate-400 mb-1">
            <MapPin className="size-4" />
            <span>{station.address}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-yellow-400">
            <Star className="size-4 fill-current" />
            <span>{station.rating}</span>
            <span className="text-slate-500 ml-1">by {station.hostName}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400 text-xs mb-1">Available</div>
          <div className="text-white">
            {station.slotsAvailable}/{station.slotsTotal}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400 text-xs mb-1">Price</div>
          <div className="text-green-400">
            ₹{station.pricePerKwh}/kWh
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400 text-xs mb-1 flex items-center gap-1">
            <Clock className="size-3" />
            Wait
          </div>
          <div className="text-white">
            {station.predictedWaitTime}m
          </div>
        </div>
      </div>

      {station.amenities.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {station.amenities.map((amenity, index) => (
              <span key={index} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={onViewDetails}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Zap className="size-4 mr-2" />
          Book Slot
        </Button>
        <Button
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Get Directions
        </Button>
      </div>
    </div>
  );
}
