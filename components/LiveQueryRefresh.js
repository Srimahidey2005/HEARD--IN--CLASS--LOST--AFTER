"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function LiveQueryRefresh() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== '/student/queries') return;
    const refresh = () => router.refresh();
    const timer = setInterval(refresh, 10000);
    window.addEventListener('focus', refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, [pathname, router]);

  return null;
}
