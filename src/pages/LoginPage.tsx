import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Zap } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/map');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="size-10 text-green-500" />
            <span className="text-3xl text-white">EVolve One</span>
          </div>
          <p className="text-slate-400">Welcome back! Sign in to continue.</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="mt-2 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-2 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-500 hover:text-green-400">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-slate-500 text-sm mb-3">Demo accounts:</p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="bg-slate-800/50 rounded p-2">
                <strong className="text-slate-300">User:</strong> user@evolve.com / password
              </div>
              <div className="bg-slate-800/50 rounded p-2">
                <strong className="text-slate-300">Host:</strong> host@evolve.com / password
              </div>
              <div className="bg-slate-800/50 rounded p-2">
                <strong className="text-slate-300">Admin:</strong> admin@evolve.com / password
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-slate-400 hover:text-slate-300">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
