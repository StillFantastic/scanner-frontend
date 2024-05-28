'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Component() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    logout();
    router.push('/');
  };

  return (
    <>
      <header className="flex justify-between items-center bg-white dark:bg-gray-950 px-6 py-5 shadow">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <CodeIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          <span className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Code Inspector
          </span>
        </div>
        <nav className="flex items-center space-x-6">
          <Link
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            href="/"
          >
            Home
          </Link>
          <Link
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            href="#"
          >
            About
          </Link>
          {isAuthenticated && (
            <Link
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              href="/"
              onClick={handleLogout}
            >
              Logout
            </Link>
          )}
        </nav>
      </header>
    </>
  );
}

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
