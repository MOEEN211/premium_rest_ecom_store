import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const ADMIN_PASSWORD = 'elitebed2024';

export default function AdminGuard({ children }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [authed, setAuthed] = useState(() => {
    return sessionStorage.getItem('admin_auth') === '1';
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1');
      setAuthed(true);
    } else {
      setError('Incorrect password. Please try again.');
      setInput('');
    }
  };

  if (authed) return children;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm w-full max-w-sm p-10 text-center">
        <div className="w-14 h-14 bg-[#0a1128] rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-serif text-slate-900 mb-2">Admin Access</h1>
        <p className="text-sm text-gray-500 mb-8">Enter your password to access the store dashboard.</p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              placeholder="Admin Password"
              className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-slate-900 pr-10"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPw(p => !p)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-slate-900"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#0a1128] hover:bg-black text-white font-semibold py-3 rounded-sm text-sm transition"
          >
            Login to Dashboard
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6">Elitebed.uk Store Admin — Authorized Access Only</p>
      </div>
    </div>
  );
}
