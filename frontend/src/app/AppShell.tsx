'use client';

import { usePathname } from 'next/navigation';
import TopBanner from '@/components/sections/top-banner';
import HeaderDesktop from '@/components/sections/header-desktop';
import HeaderMobile from '@/components/sections/header-mobile';
import Footer from '@/components/sections/footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide marketing header/footer on admin routes, login, and register pages
  if (pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register') {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <TopBanner />
      <HeaderDesktop />
      <HeaderMobile />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}


