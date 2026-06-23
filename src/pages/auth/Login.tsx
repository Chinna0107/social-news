import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, GraduationCap, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

type LoginType = 'admin' | 'student' | 'user';

interface LoginFormData {
  email: string;
  password: string;
  loginType: LoginType;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    loginType: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loginTypes = [
    { type: 'student' as LoginType, label: 'Student', icon: GraduationCap, description: 'Access student dashboard' },
    { type: 'user' as LoginType, label: 'User', icon: User, description: 'General user access' },
    { type: 'admin' as LoginType, label: 'Admin', icon: Shield, description: 'Admin panel access' },
  ];

  const handleLoginTypeChange = (type: LoginType) => {
    setFormData({ ...formData, loginType: type, email: '', password: '' });
    setError('');
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = formData.loginType === 'admin'
        ? '/auth/admin-login'
        : '/auth/login';

      const response = await fetch(`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api')}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });

      const data = await response.json();

      if (response.ok) {
        const userData = formData.loginType === 'admin' ? data.admin : data.user;
        login(data.token, userData);
        if (formData.loginType === 'admin') {
          navigate('/admin/dashboard');
        } else if (formData.loginType === 'user') {
          navigate('/user/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please check if the server is running.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const fillDemoCredentials = () => {
  //   const defaultCreds = getDefaultCredentials(formData.loginType);
  //   setFormData({
  //     ...formData,
  //     email: defaultCreds.email,
  //     password: defaultCreds.password
  //   });
  // };

  return (
    <div className="min-h-screen flex w-full font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#011638] text-white flex-col justify-between p-12 lg:p-24 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
             transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-destructive/30 rounded-full blur-[120px]"
           />
           <motion.div 
             animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }} 
             transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
             className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-blue-600/30 rounded-full blur-[150px]"
           />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <Link to="/" className="inline-block">
            <img src="/logo.png" alt="SOCIAL NEWS" className="h-10 w-auto object-contain" />
          </Link>
          <div className="w-8 h-1 bg-destructive mt-4 rounded-full"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-lg mt-24 mb-auto"
        >
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.1] tracking-tight">
            Where information meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8B8B] to-destructive">impact.</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-md font-light">
            Join a global network of civic leaders. Access real-time campaign data, verify impact stories, and drive social change through informed action.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10 flex items-center gap-4 mt-12"
        >
          <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
             <img src="https://i.pravatar.cc/150?u=a" alt="User" className="w-10 h-10 rounded-full border-2 border-[#011638] shadow-md transition-transform hover:scale-110" />
             <img src="https://i.pravatar.cc/150?u=b" alt="User" className="w-10 h-10 rounded-full border-2 border-[#011638] shadow-md transition-transform hover:scale-110" />
             <img src="https://i.pravatar.cc/150?u=c" alt="User" className="w-10 h-10 rounded-full border-2 border-[#011638] shadow-md transition-transform hover:scale-110" />
          </div>
          <span className="text-sm font-bold tracking-widest uppercase text-white/90">Join 12,000+ Leaders</span>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 bg-slate-50 flex flex-col p-8 lg:p-24 relative overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md mx-auto flex flex-col h-full"
        >
          
          <Link to="/" className="lg:hidden flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors mb-8 -mt-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex bg-slate-100/80 backdrop-blur-md p-1 rounded-lg mb-16 shadow-sm border">
            <Link to="/login" className="flex-1 text-center py-2.5 bg-white shadow-md rounded-md text-sm font-semibold text-secondary">
              Log In
            </Link>
            <Link to="/register" className="flex-1 text-center py-2.5 text-sm font-medium text-foreground hover:text-secondary transition-colors">
              Register
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-secondary mb-3 tracking-tight">Welcome Back</h2>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Choose your login type and access your portal.
            </p>
          </div>

          {/* Login Type Selection */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-secondary mb-3 uppercase tracking-wider">Login As</label>
            <div className="grid grid-cols-3 gap-2">
              {loginTypes.map(({ type, label, icon: Icon }) => (
                <motion.button
                  key={type}
                  type="button"
                  onClick={() => handleLoginTypeChange(type)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                    formData.loginType === type
                      ? 'bg-secondary text-white border-secondary shadow-md'
                      : 'bg-white border-border hover:border-secondary/50 text-secondary'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Demo Credentials Helper */}
          {/* <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Demo Credentials</p>
                <p className="text-xs text-blue-600 mt-1">
                  {formData.loginType === 'admin'   && 'Full admin panel access'}
                  {formData.loginType === 'student' && 'Student dashboard access'}
                  {formData.loginType === 'user'    && 'General user access'}
                </p>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded font-semibold hover:bg-blue-700 transition-colors"
              >
                Use Demo
              </button>
            </div>
          </div> */}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all shadow-sm"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Password</label>
                <a href="#" className="text-[10px] font-bold text-destructive hover:underline uppercase tracking-wider">Forgot password?</a>
              </div>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 pb-4">
              <input type="checkbox" id="keepLogged" className="w-4 h-4 rounded border-border text-secondary focus:ring-secondary/20 transition-all cursor-pointer" />
              <label htmlFor="keepLogged" className="text-sm text-foreground cursor-pointer select-none">Keep me logged in for 30 days</label>
            </div>

            <motion.button 
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit" 
              disabled={isLoading}
              className={`w-full font-bold py-3.5 rounded-lg transition-all shadow-lg relative overflow-hidden group ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-secondary text-white hover:shadow-secondary/30'
              }`}
            >
              {!isLoading && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              )}
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>Access {formData.loginType === 'admin' ? 'Admin Panel' : 'Dashboard'}</>
                )}
              </span>
            </motion.button>
          </form>

          {/* <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-50 px-4 font-bold text-foreground/50 uppercase tracking-widest backdrop-blur-sm">Or continue with</span>
            </div>
          </div> */}

          {/* <div className="grid grid-cols-2 gap-4">
            <motion.button whileHover={{ y: -2 }} className="flex items-center justify-center gap-2 bg-white border border-border py-2.5 rounded-lg text-sm font-semibold text-secondary hover:bg-slate-50 transition-all shadow-sm hover:shadow-md">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
              Google
            </motion.button>
            <motion.button whileHover={{ y: -2 }} className="flex items-center justify-center gap-2 bg-white border border-border py-2.5 rounded-lg text-sm font-semibold text-secondary hover:bg-slate-50 transition-all shadow-sm hover:shadow-md">
              <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              SSO
            </motion.button>
          </div> */}

          <div className="mt-auto pt-12 text-center">
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-3">Secured by Enterprise Protocol 4.0</p>
            <div className="flex justify-center gap-4 text-[11px] font-medium text-foreground/60">
              <Link to="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-secondary transition-colors">Terms of Information</Link>
              <Link to="#" className="hover:text-secondary transition-colors">Help Center</Link>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
