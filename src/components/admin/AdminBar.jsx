'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconPlus, IconLogout, IconGauge } from '@tabler/icons-react';

export default function AdminBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('wdk_admin_token') : null;
    setIsLoggedIn(!!token);
  }, [pathname]);

  if (!isLoggedIn || pathname?.startsWith('/admin')) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('wdk_admin_token');
    setIsLoggedIn(false);
    router.refresh();
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-8 bg-slate-950 text-slate-100 flex items-center justify-between px-4 md:px-8 text-[11px] font-semibold tracking-wider z-[9999] border-b border-slate-900 shadow-md font-inter select-none">
        <div className="flex items-center gap-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 hover:text-[#17C653] transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-[#17C653] animate-pulse"></span>
            <IconGauge size={13} stroke={2} />
            WDK ADMIN PANEL
          </Link>
          <Link
            href="/admin/dashboard/blogs/new"
            className="flex items-center gap-1 hover:text-[#17C653] transition-colors"
          >
            <IconPlus size={13} stroke={2.5} />
            NEW POST
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-400 font-normal hidden sm:inline">Administrative Mode</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer"
          >
            <IconLogout size={13} stroke={2.5} />
            LOGOUT
          </button>
        </div>
      </div>

      {/* Inject custom margin offsets to slide the public site down securely */}
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          padding-top: 32px !important;
        }
        /* Offset floating navbar when admin bar is visible */
        nav.fixed {
          top: 3rem !important;
        }
      ` }} />
    </>
  );
}
