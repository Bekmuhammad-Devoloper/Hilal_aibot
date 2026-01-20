'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';

function TelegramLoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (!code) {
      setStatus('error');
      setError('Login kodi topilmadi');
      return;
    }

    // Telegram code bilan login qilish
    const loginWithCode = async () => {
      try {
        const response = await api.post('/api/auth/telegram-login', { code });
        const data = response.data;
        
        if (data.access_token) {
          setAuth(data.access_token, data.user);
          setStatus('success');
          
          // Dashboard'ga yo'naltirish
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          throw new Error('Token olinmadi');
        }
      } catch (err: any) {
        console.error('Telegram login error:', err);
        setStatus('error');
        setError(err.response?.data?.message || 'Login xatoligi yuz berdi');
      }
    };

    loginWithCode();
  }, [searchParams, router, setAuth]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center">
      <div className="mb-6">
        <img 
          src="/Hilal Edu - logo-2.png" 
          alt="Hilal Edu Logo" 
          className="w-20 h-20 mx-auto rounded-full object-cover"
        />
      </div>

      {status === 'loading' && (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Telegram orqali kirish...</h2>
          <p className="text-gray-600">Iltimos kuting</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Muvaffaqiyatli!</h2>
          <p className="text-gray-600">Admin panelga yo'naltirilmoqdasiz...</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="text-red-500 text-6xl mb-4">✕</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Xatolik</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 text-sm">
            Telegram botda /admin buyrug'ini qayta yuboring.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Login sahifasiga qaytish
          </button>
        </>
      )}
    </div>
  );
}

export default function TelegramLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <Suspense fallback={
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      }>
        <TelegramLoginContent />
      </Suspense>
    </div>
  );
}
