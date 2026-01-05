import { useNavigate } from 'react-router-dom';
import { Zap, MapPin, Clock, Shield, Leaf, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="size-8 text-green-500" />
            <span className="text-2xl text-white">EVolve One</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')} className="text-white">
              Login
            </Button>
            <Button onClick={() => navigate('/register')} className="bg-green-600 hover:bg-green-700">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
            <span className="text-green-400">One App. Zero Range Anxiety.</span>
          </div>
          <h1 className="text-5xl md:text-7xl text-white mb-6 max-w-4xl mx-auto leading-tight">
            Your Complete EV Charging Solution
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Find charging stations, swap batteries, earn rewards, and join the sustainable mobility revolution.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="bg-green-600 hover:bg-green-700 text-lg px-8"
            >
              Start Charging
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/register')}
              className="border-slate-600 text-white hover:bg-slate-800 text-lg px-8"
            >
              Become a Host
            </Button>
          </div>

          {/* Hero Image */}
          <div className="mt-16 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1672542128826-5f0d578713d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaGFyZ2luZyUyMHN0YXRpb258ZW58MXx8fHwxNzY0Mzk5NzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="EV Charging Station" 
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <h2 className="text-4xl text-white text-center mb-16">
            Everything You Need to Stay Charged
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-green-500/50 transition-colors">
              <MapPin className="size-12 text-green-500 mb-4" />
              <h3 className="text-2xl text-white mb-3">Find Stations</h3>
              <p className="text-slate-400">
                Discover charging and battery swap stations near you with real-time availability and pricing.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-green-500/50 transition-colors">
              <Clock className="size-12 text-green-500 mb-4" />
              <h3 className="text-2xl text-white mb-3">Smart Booking</h3>
              <p className="text-slate-400">
                Reserve your slot in advance with AI-powered wait time predictions. No more queues.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-green-500/50 transition-colors">
              <Leaf className="size-12 text-green-500 mb-4" />
              <h3 className="text-2xl text-white mb-3">Earn Rewards</h3>
              <p className="text-slate-400">
                Get eco-points for every charge. Redeem for discounts and contribute to a greener future.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-green-500/50 transition-colors">
              <Shield className="size-12 text-green-500 mb-4" />
              <h3 className="text-2xl text-white mb-3">Secure Payments</h3>
              <p className="text-slate-400">
                Pay seamlessly with multiple payment options. All transactions are secure and transparent.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-green-500/50 transition-colors">
              <Users className="size-12 text-green-500 mb-4" />
              <h3 className="text-2xl text-white mb-3">P2P Network</h3>
              <p className="text-slate-400">
                Share your charger and earn money. Join our peer-to-peer charging marketplace.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-green-500/50 transition-colors">
              <Zap className="size-12 text-green-500 mb-4" />
              <h3 className="text-2xl text-white mb-3">Battery Swaps</h3>
              <p className="text-slate-400">
                Quick battery swaps in under 5 minutes. Get back on the road instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl text-green-500 mb-2">1,200+</div>
              <div className="text-slate-400">Charging Stations</div>
            </div>
            <div>
              <div className="text-5xl text-green-500 mb-2">50K+</div>
              <div className="text-slate-400">Happy Users</div>
            </div>
            <div>
              <div className="text-5xl text-green-500 mb-2">2M+</div>
              <div className="text-slate-400">Charges Completed</div>
            </div>
            <div>
              <div className="text-5xl text-green-500 mb-2">98%</div>
              <div className="text-slate-400">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl text-white mb-6">
            Ready to Join the EV Revolution?
          </h2>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            Sign up today and get 100 free eco-points to start your sustainable journey.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/register')}
            className="bg-white text-green-600 hover:bg-slate-100 text-lg px-8"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto text-center text-slate-500">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="size-6 text-green-500" />
            <span className="text-xl text-white">EVolve One</span>
          </div>
          <p>© 2025 EVolve One. Powering sustainable mobility.</p>
        </div>
      </footer>
    </div>
  );
}
