import { Outlet } from '@tanstack/react-router';
import { Header } from '@/components/layouts/Header';

export const RootLayout = () => (
  <div className="min-h-dvh bg-sheet">
    <Header />
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
      <Outlet />
    </main>
  </div>
);
