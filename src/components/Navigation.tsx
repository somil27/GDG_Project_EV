import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Zap, Map, LayoutDashboard, LogOut, User } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/map" className="flex items-center gap-2">
            <Zap className="size-6 text-green-500" />
            <span className="text-xl text-white">EVolve One</span>
          </Link>

          <div className="flex gap-2">
            <Link to="/map">
              <Button
                variant={location.pathname === '/map' ? 'default' : 'ghost'}
                size="sm"
                className={location.pathname === '/map' ? 'bg-green-600' : 'text-slate-300'}
              >
                <Map className="size-4 mr-2" />
                Map
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button
                variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
                size="sm"
                className={location.pathname === '/dashboard' ? 'bg-green-600' : 'text-slate-300'}
              >
                <LayoutDashboard className="size-4 mr-2" />
                Dashboard
              </Button>
            </Link>

            {user?.role === 'host' && (
              <Link to="/host">
                <Button
                  variant={location.pathname === '/host' ? 'default' : 'ghost'}
                  size="sm"
                  className={location.pathname === '/host' ? 'bg-green-600' : 'text-slate-300'}
                >
                  <User className="size-4 mr-2" />
                  Host Portal
                </Button>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin">
                <Button
                  variant={location.pathname === '/admin' ? 'default' : 'ghost'}
                  size="sm"
                  className={location.pathname === '/admin' ? 'bg-green-600' : 'text-slate-300'}
                >
                  <User className="size-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-white text-sm">{user?.name}</p>
            <p className="text-green-400 text-xs">{user?.ecoPoints} eco-points</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-slate-400 hover:text-white"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
