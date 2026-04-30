'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('role');

    if (token) {
      // User is logged in, redirect to appropriate dashboard
      if (userRole === 'admin') {
        router.replace('/Admin/dashboard');
      } else {
        router.replace('/employee1/dashboard');
      }
    } else {
      // User is not logged in, redirect to login
      router.replace('/login');
    }
  }, [router]);

  return null;
}