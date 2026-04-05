import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIRTABLE_BASE = 'appppVhjjG2Wl1fWN';
const AIRTABLE_TABLE = 'tblcRhTIcKyu1h5l3';
const FIELD_ACCESS_CODE = 'fldhRIQAfbm5sItXI';
const FIELD_REDIRECT_URL = 'fldSf20ks1sp4O7oH';
const FIELD_STATUS = 'fldSAkBEbhVoSGgFz';
const FIELD_SCANNED_AT = 'fldKd6WLaKNWpFmmI';

const API_KEY = import.meta.env.VITE_AIRTABLE_KEY;

interface AirtableRecord {
  id: string;
  fields: {
    [key: string]: string | boolean | undefined;
  };
}

async function lookupCode(code: string): Promise<AirtableRecord | null> {
  const formula = encodeURIComponent(`{accessCode}="${code.toUpperCase()}"`);
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}?filterByFormula=${formula}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!res.ok) throw new Error('Airtable request failed');
  const data = await res.json();
  return data.records?.[0] ?? null;
}

async function patchRecord(recordId: string, fields: Record<string, string>) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}/${recordId}`;
  await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
}

export function QrToegang() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('c');
    if (c) setCode(c.toUpperCase());

    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      const record = await lookupCode(code.trim());

      if (!record) {
        setError('Code niet herkend. Controleer de code op je kaartje.');
        setLoading(false);
        return;
      }

      const redirectUrl = record.fields[FIELD_REDIRECT_URL] as string;

      await patchRecord(record.id, {
        [FIELD_STATUS]: 'gescand',
        [FIELD_SCANNED_AT]: new Date().toISOString(),
      });

      window.location.href = redirectUrl;
    } catch {
      setError('Er is een fout opgetreden. Probeer het opnieuw.');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap');

        .qr-page * {
          font-family: 'Rubik', sans-serif;
          box-sizing: border-box;
        }

        .qr-page {
          min-height: 100vh;
          background-color: #0b181d;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 16px 48px;
        }

        .qr-header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 48px;
          margin-top: 8px;
        }

        .qr-logo-img {
          height: 32px;
          width: auto;
          display: block;
        }

        .qr-card {
          width: 100%;
          max-width: 420px;
          background-color: #0f2028;
          border: 1px solid #1e2f37;
          border-radius: 16px;
          padding: 36px 32px 40px;
        }

        @media (max-width: 480px) {
          .qr-card {
            padding: 28px 20px 32px;
          }
        }

        .qr-label {
          font-size: 11px;
          font-weight: 700;
          color: #e1491a;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .qr-title {
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          line-height: 1.25;
          margin-bottom: 8px;
        }

        .qr-subtitle {
          font-size: 14px;
          color: #8a9ba3;
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .qr-input {
          width: 100%;
          background-color: #0b181d;
          border: 1.5px solid #1e2f37;
          border-radius: 10px;
          padding: 16px 20px;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 4px;
          text-transform: uppercase;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 16px;
          caret-color: #e1491a;
        }

        .qr-input::placeholder {
          color: #2e4554;
          letter-spacing: 3px;
          font-weight: 600;
        }

        .qr-input:focus {
          border-color: #e1491a;
          box-shadow: 0 0 0 3px rgba(225, 73, 26, 0.15);
        }

        .qr-button {
          width: 100%;
          background-color: #e1491a;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          padding: 16px 24px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: background-color 0.2s, transform 0.1s, opacity 0.2s;
          position: relative;
          overflow: hidden;
        }

        .qr-button:hover:not(:disabled) {
          background-color: #cc3e12;
        }

        .qr-button:active:not(:disabled) {
          transform: scale(0.99);
        }

        .qr-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .qr-error {
          margin-top: 16px;
          background-color: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.25);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #f87171;
          line-height: 1.5;
        }

        .qr-footer {
          margin-top: 32px;
          font-size: 12px;
          color: #2e4554;
          text-align: center;
        }
      `}</style>

      <div className="qr-page">
        <header className="qr-header">
          <img src="/logo/tdwebwhite.svg" alt="Tielo Digital" className="qr-logo-img" />
        </header>

        <motion.div
          className="qr-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <p className="qr-label">Jouw website</p>
          <h1 className="qr-title">Vul je toegangscode in</h1>
          <p className="qr-subtitle">Staat op het kaartje dat je hebt ontvangen.</p>

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="qr-input"
              type="text"
              placeholder="360"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={12}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              disabled={loading}
            />

            <button
              type="submit"
              className="qr-button"
              disabled={loading || !code.trim()}
            >
              {loading ? 'Laden...' : 'Bekijk mijn website \u2192'}
            </button>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="qr-error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        <p className="qr-footer">tielo-digital.nl</p>
      </div>
    </>
  );
}
