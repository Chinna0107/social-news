import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, GraduationCap, Upload, Camera, Check } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth, API_BASE_URL } from "../../contexts/AuthContext";

type RegisterType = 'student' | 'user';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: RegisterType;
  age?: string;
  gender?: string;
  college?: string;
  address?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState<number>(1);
  const [otp, setOtp] = useState<string>('');
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student',
    age: '',
    gender: '',
    college: '',
    address: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { type: 'student' as RegisterType, label: 'Student', icon: GraduationCap, description: 'Learning and development' },
    { type: 'user' as RegisterType, label: 'User', icon: User, description: 'Community participation' },
  ];

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (step === 1) {
        // Role is already selected by default (Student). Just proceed to Email.
        setStep(2);
      } else if (step === 2) {
        // Send OTP
        const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        const data = await response.json();
        if (response.ok) {
          setStep(3);
        } else {
          setError(data.error || 'Failed to send OTP');
        }
      } else if (step === 3) {
        // Verify OTP
        const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, otp })
        });
        const data = await response.json();
        if (response.ok) {
          setStep(4);
        } else {
          setError(data.error || 'Invalid OTP');
        }
      } else if (step === 4) {
        // Register
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (response.ok) {
          login(data.token, data.user);
          setStep(5);
        } else {
          setError(data.error || 'Registration failed');
        }
      } else if (step === 5) {
        // Upload Avatar
        if (avatarFile) {
          const formDataObj = new FormData();
          formDataObj.append('file', avatarFile);
          
          const token = localStorage.getItem('token');
          const uploadRes = await fetch(`${API_BASE_URL}/media/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formDataObj
          });
          
          const uploadData = await uploadRes.json();
          if (uploadRes.ok && uploadData.url) {
             const profileRes = await fetch(`${API_BASE_URL}/auth/profile`, {
               method: 'PUT',
               headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
               },
               body: JSON.stringify({ name: formData.name, phone: formData.phone, avatar: uploadData.url })
             });
             const profileData = await profileRes.json();
             
             if (profileRes.ok) {
               login(token as string, profileData);
             }
          }
        }
        
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8B8B] to-destructive">movement.</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-md font-light">
            Become part of a global network driving social change. Access educational resources, participate in campaigns, and make a real impact.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10 flex items-center gap-4 mt-12"
        >
          <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
             <img src="https://i.pravatar.cc/150?u=d" alt="User" className="w-10 h-10 rounded-full border-2 border-[#011638] shadow-md transition-transform hover:scale-110" />
             <img src="https://i.pravatar.cc/150?u=e" alt="User" className="w-10 h-10 rounded-full border-2 border-[#011638] shadow-md transition-transform hover:scale-110" />
             <img src="https://i.pravatar.cc/150?u=f" alt="User" className="w-10 h-10 rounded-full border-2 border-[#011638] shadow-md transition-transform hover:scale-110" />
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

          <div className="flex bg-slate-100/80 backdrop-blur-md p-1 rounded-lg mb-12 shadow-sm border">
            <Link to="/login" className="flex-1 text-center py-2.5 text-sm font-medium text-foreground hover:text-secondary transition-colors">
              Log In
            </Link>
            <div className="flex-1 text-center py-2.5 bg-white shadow-md rounded-md text-sm font-semibold text-secondary">
              Register
            </div>
          </div>

          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-extrabold text-secondary mb-3 tracking-tight">Create Account</h2>
              <p className="text-foreground/70 text-sm leading-relaxed">
                Step {step} of 5: {step === 1 ? 'Select Role' : step === 2 ? 'Verify Email' : step === 3 ? 'Enter OTP' : step === 4 ? 'Basic Details' : 'Profile Picture'}
              </p>
            </div>
            {step > 1 && step < 5 && (
              <button type="button" onClick={() => setStep(step === 4 ? 2 : step - 1)} className="text-xs font-bold text-secondary/70 hover:text-secondary">
                Go Back
              </button>
            )}
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

          <form onSubmit={handleNextStep} className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">I am a</label>
                    <div className="grid grid-cols-2 gap-2">
                      {roles.map(({ type, label, icon: Icon }) => (
                        <motion.button
                          key={type}
                          type="button"
                          onClick={() => handleInputChange('role', type)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                            formData.role === type
                              ? 'bg-secondary text-white border-secondary shadow-md'
                              : 'bg-white border-border hover:border-secondary/50 text-secondary'
                          }`}
                        >
                          <Icon className="w-4 h-4 mb-1" />
                          <span className="text-xs font-semibold text-center">{label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
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
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="bg-success/10 border border-success/20 p-3 rounded-lg text-sm text-success mb-4 flex gap-2">
                    <Check className="w-5 h-5 shrink-0" />
                    <p>An OTP has been sent to <strong>{formData.email}</strong>. Please check your inbox.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">One-Time Password</label>
                    <input 
                      type="text" 
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value); setError(''); }}
                      placeholder="Enter 6-digit OTP"
                      required
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all shadow-sm text-center text-2xl tracking-widest font-mono"
                    />
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">Phone (Optional)</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">Age</label>
                      <input 
                        type="number" 
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="Age"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">Gender</label>
                      <select 
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all shadow-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">College</label>
                    <input 
                      type="text" 
                      value={formData.college}
                      onChange={(e) => handleInputChange('college', e.target.value)}
                      placeholder="Enter your college name"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">Address</label>
                    <textarea 
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your full address"
                      rows={2}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all shadow-sm resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">Password</label>
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a secure password"
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all shadow-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2 pb-4">
                    <input type="checkbox" id="terms" required className="w-4 h-4 rounded border-border text-secondary focus:ring-secondary/20 transition-all cursor-pointer" />
                    <label htmlFor="terms" className="text-sm text-foreground cursor-pointer select-none">
                      I agree to the <Link to="/terms" className="text-secondary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-secondary hover:underline">Privacy Policy</Link>
                    </label>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 py-4">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 border-4 border-white shadow-xl relative overflow-hidden mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <User className="w-16 h-16" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-secondary text-lg">Add a Profile Photo</h3>
                    <p className="text-sm text-muted-foreground mt-1">This will be used for your official ID Card</p>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 px-4 py-2 border border-border bg-white rounded-lg text-sm font-bold text-secondary hover:bg-slate-50 transition-colors inline-flex items-center gap-2 shadow-sm">
                      <Upload className="w-4 h-4" /> Choose File
                    </button>
                  </div>
                  
                  <p className="text-xs text-center text-foreground/50">You can also skip this and upload it later from your dashboard.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit" 
              disabled={isLoading}
              className={`w-full font-bold py-3.5 rounded-lg transition-all shadow-lg relative overflow-hidden group mt-4 ${
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
                    Processing...
                  </>
                ) : step === 1 ? (
                  'Continue'
                ) : step === 2 ? (
                  'Send OTP'
                ) : step === 3 ? (
                  'Verify OTP'
                ) : step === 4 ? (
                  'Complete Registration'
                ) : (
                  avatarFile ? 'Upload & Finish' : 'Skip & Finish'
                )}
              </span>
            </motion.button>
          </form>

          {step <= 2 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-foreground/60">
                Already have an account?{' '}
                <Link to="/login" className="text-secondary font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          )}

          <div className="mt-auto pt-8 text-center">
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-3">Secured by Enterprise Protocol 4.0</p>
            <div className="flex justify-center gap-4 text-[11px] font-medium text-foreground/60">
              <Link to="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-secondary transition-colors">Help Center</Link>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}