import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

interface LoginButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  label?: string;
}

export function LoginButton({ variant, size = 'sm', label }: LoginButtonProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      // Clear all cached queries including profile data
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const buttonVariant = variant || (isAuthenticated ? 'outline' : 'default');
  const buttonText = label || (loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login');

  return (
    <Button
      onClick={handleAuth}
      disabled={disabled}
      variant={buttonVariant}
      size={size}
      className="rounded-full gap-2"
    >
      {loginStatus === 'logging-in' ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{buttonText}</span>
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="w-4 h-4" />
          <span>{buttonText}</span>
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4" />
          <span>{buttonText}</span>
        </>
      )}
    </Button>
  );
}
