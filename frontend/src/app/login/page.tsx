'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response: any = await authApi.login(email, password);

      if (response.success && (response.user || response.data?.user)) {
        const user = response.user || response.data.user;
        const token = response.token || response.data?.token;

        if (token && typeof window !== 'undefined') {
          document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
        }

        toast.success('Login successful!');

        setTimeout(() => {
          if (user.role === 'admin') {
            router.push('/admin');
            router.refresh();
          } else {
            const redirect = searchParams.get('redirect');
            if (redirect) {
              router.push(redirect);
            } else {
              router.push('/');
            }
          }
        }, 200);
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left panel */}
        <div className="bg-[#0d4d3d] text-white flex flex-col justify-between p-8 md:p-12">
          <div>
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/30 flex items-center justify-center mb-8">
              <span className="text-2xl font-bold">OM</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-sm md:text-base text-white/80 max-w-xs">
              To stay connected with us please login with your personal info.
            </p>
          </div>
          <div className="mt-8">
            <p className="text-xs md:text-sm text-white/80 mb-3">
              New here?
            </p>
            <Link href="/register">
              <Button
                variant="outline"
                className="w-full md:w-auto border-white text-white hover:bg-white hover:text-[#0d4d3d] rounded-full px-10"
              >
                SIGN UP
              </Button>
            </Link>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-[#0d4d3d] mb-2">welcome</h1>
            <p className="text-sm text-gray-500">
              Login in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 rounded-full bg-[#e7f4ef] border-transparent focus-visible:ring-2 focus-visible:ring-[#0d4d3d]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 rounded-full bg-[#e7f4ef] border-transparent focus-visible:ring-2 focus-visible:ring-[#0d4d3d]"
                  required
                />
              </div>
            </div>

            <div className="text-right text-xs text-gray-500">
              <span>Forgot your password?</span>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-[#0d4d3d] hover:bg-[#0b3f31]"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'LOG IN'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#0d4d3d] font-semibold">
              sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
