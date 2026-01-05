import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, Share2, QrCode, MapPin, Calendar } from 'lucide-react';
import { api, Booking } from '../services/api';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui/button';

export default function BookingSuccess() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    if (!bookingId) return;
    try {
      const data = await api.getBookingById(bookingId);
      setBooking(data || null);
    } catch (error) {
      console.error('Failed to load booking:', error);
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

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-slate-400">Booking not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-24 bg-green-500/20 rounded-full mb-6 animate-pulse">
            <CheckCircle2 className="size-16 text-green-500" />
          </div>
          <h1 className="text-4xl text-white mb-3">Booking Confirmed!</h1>
          <p className="text-xl text-slate-400">
            Your charging slot has been successfully reserved
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6">
          {/* QR Code */}
          <div className="bg-white rounded-xl p-8 mb-6 text-center">
            <div className="inline-block bg-slate-900 p-6 rounded-lg mb-3">
              <QrCode className="size-32 text-white" />
            </div>
            <p className="text-slate-900">Scan this at the charging station</p>
            <p className="text-slate-600 text-sm mt-1">Booking ID: {booking.id}</p>
          </div>

          {/* Station Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-slate-800 rounded-xl p-4">
              <MapPin className="size-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <div className="text-white mb-1">{booking.stationName}</div>
                <div className="text-slate-400 text-sm">Slot #{booking.slotNo}</div>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-slate-800 rounded-xl p-4">
              <Calendar className="size-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <div className="text-white mb-1">
                  {new Date(booking.startTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-slate-400 text-sm">
                  {new Date(booking.startTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - {new Date(booking.endTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex justify-between text-slate-400 mb-2">
              <span>Amount Paid</span>
              <span className="text-white">₹{booking.amount + 10}</span>
            </div>
            <div className="flex justify-between text-green-400">
              <span>Eco-Points Earned</span>
              <span>+{booking.ecoPointsEarned}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Download className="size-4 mr-2" />
              Download Pass
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Share2 className="size-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
          <h3 className="text-white mb-3">Important Information</h3>
          <ul className="text-blue-300 text-sm space-y-2">
            <li>• Please arrive 5 minutes before your scheduled time</li>
            <li>• Show this QR code at the charging station</li>
            <li>• Free cancellation available up to 1 hour before booking</li>
            <li>• Contact station host for any assistance</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            View All Bookings
          </Button>
          <Button
            onClick={() => navigate('/map')}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Find More Stations
          </Button>
        </div>
      </div>
    </div>
  );
}
