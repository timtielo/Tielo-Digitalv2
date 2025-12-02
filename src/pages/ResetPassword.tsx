import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase/client';
import { AuroraBackground } from '../components/ui/aurora-bento-grid';

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm transition-colors focus-within:border-blue-400/70 focus-within:bg-blue-500/10">
    {children}
  </div>
);

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const checkAndExchangeToken = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      if (accessToken && type === 'recovery') {
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hashParams.get('refresh_token') || '',
        });

        if (sessionError || !data.session) {
          setError('Deze link is niet geldig of is verlopen. Vraag een nieuwe reset link aan.');
        } else {
          setIsValidToken(true);
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsValidToken(true);
        } else {
          setError('Deze link is niet geldig of is verlopen. Vraag een nieuwe reset link aan.');
        }
      }
    };

    checkAndExchangeToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Vul alle velden in.');
      return;
    }

    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens zijn.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError('Er is een fout opgetreden. Probeer het opnieuw.');
      } else {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
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
              Nieuw <span className="font-light">Wachtwoord</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300 text-center"
            >
              {success
                ? 'Je wachtwoord is succesvol gewijzigd'
                : 'Voer je nieuwe wachtwoord in'}
            </motion.p>

            {!success ? (
              isValidToken ? (
                <form className="space-y-5 mt-4" onSubmit={handleSubmit}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="text-sm font-medium text-gray-300 block mb-2">
                      Nieuw Wachtwoord
                    </label>
                    <GlassInputWrapper>
                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Minimaal 6 tekens"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="text-sm font-medium text-gray-300 block mb-2">
                      Bevestig Wachtwoord
                    </label>
                    <GlassInputWrapper>
                      <div className="relative">
                        <input
                          name="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Herhaal je wachtwoord"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={loading}
                          required
                          className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-3 flex items-center"
                        >
                          {showConfirmPassword ? (
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
                    {loading ? 'Bezig met opslaan...' : 'Wachtwoord wijzigen'}
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    type="button"
                    onClick={() => window.location.href = '/login'}
                    className="w-full text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Terug naar inloggen
                  </motion.button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-5 mt-4"
                >
                  <div className="text-red-300 text-center bg-red-500/20 backdrop-blur-sm border border-red-500/30 p-6 rounded-2xl">
                    <p className="text-sm">{error}</p>
                  </div>

                  <button
                    onClick={() => window.location.href = '/login'}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 py-4 font-medium text-white hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-blue-500/50"
                  >
                    Terug naar inloggen
                  </button>
                </motion.div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-5 mt-4"
              >
                <div className="text-green-300 text-center bg-green-500/20 backdrop-blur-sm border border-green-500/30 p-6 rounded-2xl">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                  <p className="text-base font-medium mb-2">Wachtwoord gewijzigd!</p>
                  <p className="text-sm">
                    Je wordt doorgestuurd naar de inlogpagina...
                  </p>
                </div>

                <button
                  onClick={() => window.location.href = '/login'}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 py-4 font-medium text-white hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-blue-500/50"
                >
                  Nu inloggen
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
