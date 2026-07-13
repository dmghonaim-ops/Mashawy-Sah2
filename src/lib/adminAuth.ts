import { supabase } from './supabase/client';

export interface Admin {
  id: string;
  username: string;
  full_name: string;
  email: string | null;
}

export interface AdminSession {
  success: boolean;
  token: string;
  admin: Admin;
}

// Login admin
export async function adminLogin(username: string, password: string) {
  const { data, error } = await supabase.rpc('admin_login', {
    p_username: username,
    p_password: password,
  });

  if (error) throw error;
  if (!data.success) throw new Error(data.error);

  // Store session in localStorage
  localStorage.setItem('admin_session', JSON.stringify(data));
  
  return data as AdminSession;
}

// Get current admin session
export function getAdminSession(): AdminSession | null {
  const session = localStorage.getItem('admin_session');
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
}

// Logout admin
export function adminLogout() {
  localStorage.removeItem('admin_session');
}

// Check if admin is logged in
export function isAdminLoggedIn(): boolean {
  return getAdminSession() !== null;
}

// Get current admin data
export function getCurrentAdmin(): Admin | null {
  const session = getAdminSession();
  return session?.admin || null;
}