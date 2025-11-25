import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Zap, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuroraBackground } from '../components/ui/aurora-bento-grid';

interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    avatarSrc: "https://www.tgildegevelwerken.nl/tgildegevelwerkenlogo-transparant.svg",
    name: "Job 't Gilde",
    handle: "'t Gilde Gevelwerken",
    text: "Fijn platform voor het beheren van mijn reviews en portfolio!"
  },
  {
    avatarSrc: "https://www.herhorizon.nl/images/HerHorizontrans.svg",
    name: "Iris Achtereekte",
    handle: "Her Horizon",
    text: "Fijn om hier inzicht te krijgen in de leads, mijn eigen reviews en informatie over de bezoekers."
  },
];

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm transition-colors focus-within:border-blue-400/70 focus-within:bg-blue-500/10">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: delay * 0.1, duration: 0.5 }}
    className="flex items-start gap-3 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 w-72"
  >
    <img
      src={testimonial.avatarSrc}
      className="h-10 w-10 object-cover rounded-2xl flex-shrink-0"
      alt="avatar"
    />
    <div className="text-sm leading-snug">
      <p className="font-medium text-white">{testimonial.name}</p>
      <p className="text-gray-300 text-xs">{testimonial.handle}</p>
      <p className="mt-1 text-gray-200">{testimonial.text}</p>
    </div>
  </motion.div>
);

export function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const impersonateEmail = urlParams.get('impersonate');

    if (impersonateEmail) {
      setCredentials(prev => ({ ...prev, email: decodeURIComponent(impersonateEmail) }));
    }
  }, []);

  useEffect(() => {
    if (user) {
      window.history.pushState({}, '', '/dashboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(credentials.email, credentials.password);

      if (signInError) {
        setError('Ongeldige inloggegevens. Controleer je email en wachtwoord.');
      } else {
        window.history.pushState({}, '', '/dashboard');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } catch (err) {
      setError('Er is een fout opgetreden. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 relative overflow-hidden">
      <AuroraBackground />

      <div className="relative z-10 min-h-screen flex flex-col md:flex-row">
        <section className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Lock className="h-8 w-8 text-white" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-white text-center leading-tight"
              >
                Welkom <span className="font-light">Terug</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-300 text-center"
              >
                Meld aan met je account om je dashboard te bekijken
              </motion.p>

              <form className="space-y-5 mt-4" onSubmit={handleSubmit}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Email Adres
                  </label>
                  <GlassInputWrapper>
                    <input
                      name="email"
                      type="email"
                      placeholder="je@email.nl"
                      value={credentials.email}
                      onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                      disabled={loading}
                      required
                      className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder-gray-400"
                    />
                  </GlassInputWrapper>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Wachtwoord
                  </label>
                  <GlassInputWrapper>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Voer je wachtwoord in"
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        disabled={loading}
                        required
                        className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                        )}
                      </button>
                    </div>
                  </GlassInputWrapper>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-red-300 text-sm text-center bg-red-500/20 backdrop-blur-sm border border-red-500/30 p-3 rounded-2xl"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 py-4 font-medium text-white hover:from-blue-600 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50"
                >
                  {loading ? 'Bezig met inloggen...' : 'Inloggen'}
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-3 mt-6"
              >
                <div className="flex-1 flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <Shield className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className="text-xs text-gray-300">Beveiligde verbinding</span>
                </div>
                <div className="flex-1 flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <Zap className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs text-gray-300">Supersnel dashboard</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="hidden lg:flex flex-1 relative p-8 items-end justify-center">
          <div className="absolute inset-8 rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=1200&h=1600&fit=crop&q=80"
              alt="Construction site"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent"></div>
          </div>

          <div className="relative z-10 flex flex-col gap-4 w-full max-w-2xl pb-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                delay={10 + index}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
