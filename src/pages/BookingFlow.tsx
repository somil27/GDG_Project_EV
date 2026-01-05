import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Zap, ChevronLeft } from 'lucide-react';
import { api, Station } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';

export default function BookingFlow() {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('1');

  useEffect(() => {
    loadStation();
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, [stationId]);

  const loadStation = async () => {
    if (!stationId) return;
    try {
      const data = await api.getStationById(stationId);
      setStation(data || null);
    } catch (error) {
      console.error('Failed to load station:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!stationId || !user) return;

    try {
      const startDateTime = `${selectedDate}T${selectedTime}:00`;
      const endDateTime = new Date(new Date(startDateTime).getTime() + parseInt(duration) * 60 * 60 * 1000).toISOString();

      const booking = await api.createBooking({
        userId: user.id,
        stationId,
        startTime: startDateTime,
        endTime: endDateTime
      });

      navigate(`/payment/${booking.id}`);
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

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
        </div>
      </div>
    );
  }

  const estimatedCost = station.pricePerKwh * 20;
  const ecoPoints = station.pricePerKwh * 2;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/station/${stationId}`)}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ChevronLeft className="size-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h1 className="text-2xl text-white mb-6">Book Your Charging Slot</h1>

              {/* Station Summary */}
              <div className="bg-slate-800 rounded-xl p-4 mb-6">
                <h3 className="text-white mb-2">{station.name}</h3>
                <p className="text-slate-400 text-sm">{station.address}</p>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <Label className="text-slate-300 mb-2 block">
                  <Calendar className="size-4 inline mr-2" />
                  Select Date
                </Label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3"
                />
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <Label className="text-slate-300 mb-3 block">
                  <Clock className="size-4 inline mr-2" />
                  Select Time Slot
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-lg border transition-colors ${
                        selectedTime === time
                          ? 'bg-green-600 border-green-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Selection */}
              <div className="mb-6">
                <Label className="text-slate-300 mb-3 block">
                  <Zap className="size-4 inline mr-2" />
                  Charging Duration
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {['1', '2', '3', '4'].map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setDuration(hours)}
                      className={`py-3 px-4 rounded-lg border transition-colors ${
                        duration === hours
                          ? 'bg-green-600 border-green-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Options */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h4 className="text-white mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Date & Time</span>
                    <span className="text-white">
                      {selectedDate && selectedTime ? `${selectedDate} at ${selectedTime}` : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Duration</span>
                    <span className="text-white">{duration} hour(s)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Slot Number</span>
                    <span className="text-white">Auto-assigned</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl text-white mb-4">Payment Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-400">
                  <span>Base Rate</span>
                  <span className="text-white">₹{station.pricePerKwh}/kWh</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Usage</span>
                  <span className="text-white">20 kWh</span>
                </div>
                <div className="border-t border-slate-800 pt-4">
                  <div className="flex justify-between text-slate-400 mb-2">
                    <span>Subtotal</span>
                    <span className="text-white">₹{estimatedCost}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 mb-2">
                    <span>Platform Fee</span>
                    <span className="text-white">₹10</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t border-slate-800">
                    <span className="text-white">Total</span>
                    <span className="text-green-400">₹{estimatedCost + 10}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                <div className="text-green-400 mb-1">You'll Earn</div>
                <div className="text-2xl text-green-400">+{ecoPoints} points</div>
              </div>

              <Button
                onClick={handleProceedToPayment}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Proceed to Payment
              </Button>

              <div className="mt-4 text-xs text-slate-500 text-center">
                Free cancellation up to 1 hour before booking
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
