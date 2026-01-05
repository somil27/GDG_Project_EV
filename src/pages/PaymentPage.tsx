import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, QrCode, Shield, ChevronLeft } from 'lucide-react';
import { api, Booking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { updateEcoPoints } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');

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

  const handlePayment = async () => {
    if (!booking) return;

    setProcessing(true);

    try {
      // Simulate payment processing
      const transaction = await api.processPayment(booking.id, booking.amount + 10);

      if (transaction.status === 'success') {
        // Update eco points
        updateEcoPoints(booking.ecoPointsEarned);
        
        // Navigate to success page
        navigate(`/booking-success/${booking.id}`);
      }
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessing(false);
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/book/${booking.stationId}`)}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ChevronLeft className="size-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h1 className="text-2xl text-white mb-6">Complete Payment</h1>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <Label className="text-slate-300 mb-3 block">Select Payment Method</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-green-600 border-green-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <CreditCard className="size-6 mx-auto mb-2" />
                    <div className="text-sm">Card</div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-xl border transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-green-600 border-green-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <QrCode className="size-6 mx-auto mb-2" />
                    <div className="text-sm">UPI</div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-4 rounded-xl border transition-all ${
                      paymentMethod === 'wallet'
                        ? 'bg-green-600 border-green-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <Wallet className="size-6 mx-auto mb-2" />
                    <div className="text-sm">Wallet</div>
                  </button>
                </div>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300 mb-2 block">Card Number</Label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300 mb-2 block">Expiry Date</Label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 mb-2 block">CVV</Label>
                      <Input
                        type="text"
                        placeholder="123"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300 mb-2 block">Cardholder Name</Label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300 mb-2 block">UPI ID</Label>
                    <Input
                      type="text"
                      placeholder="yourname@upi"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="bg-slate-800 rounded-xl p-6 text-center">
                    <div className="bg-white p-4 rounded-lg inline-block mb-3">
                      <QrCode className="size-32 text-slate-900" />
                    </div>
                    <p className="text-slate-400 text-sm">Scan QR code to pay</p>
                  </div>
                </div>
              )}

              {/* Wallet Payment Form */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-4">
                  <div className="bg-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-300">EVolve Wallet Balance</span>
                      <span className="text-2xl text-white">₹2,450</span>
                    </div>
                    <p className="text-green-400 text-sm">Sufficient balance available</p>
                  </div>
                </div>
              )}

              {/* Security Badge */}
              <div className="mt-6 flex items-center gap-2 text-slate-400 text-sm">
                <Shield className="size-4 text-green-500" />
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl text-white mb-4">Booking Summary</h2>

              <div className="bg-slate-800 rounded-xl p-4 mb-4">
                <div className="text-slate-400 text-sm mb-1">Station</div>
                <div className="text-white">{booking.stationName}</div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Booking ID</span>
                  <span className="text-white">{booking.id}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Slot Number</span>
                  <span className="text-white">#{booking.slotNo}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Date & Time</span>
                  <span className="text-white">{new Date(booking.startTime).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 mb-6">
                <div className="flex justify-between text-slate-400 mb-2">
                  <span>Charging Cost</span>
                  <span className="text-white">₹{booking.amount}</span>
                </div>
                <div className="flex justify-between text-slate-400 mb-2">
                  <span>Platform Fee</span>
                  <span className="text-white">₹10</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-slate-800">
                  <span className="text-white">Total</span>
                  <span className="text-green-400">₹{booking.amount + 10}</span>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                <div className="text-green-400 mb-1">You'll Earn</div>
                <div className="text-2xl text-green-400">+{booking.ecoPointsEarned} points</div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {processing ? 'Processing...' : `Pay ₹${booking.amount + 10}`}
              </Button>

              <div className="mt-4 text-xs text-slate-500 text-center">
                By proceeding, you agree to our Terms & Conditions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
