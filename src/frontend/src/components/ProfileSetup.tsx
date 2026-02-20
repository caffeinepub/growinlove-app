import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Heart, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useInitializeUserProfile } from '../hooks/useQueries';

interface ProfileSetupProps {
  onSuccess: () => void;
}

export function ProfileSetup({ onSuccess }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const initializeProfile = useInitializeUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      setError('');
      await initializeProfile.mutateAsync(name.trim());
      
      // Show success state briefly
      setIsSuccess(true);
      
      // Wait a moment for the backend to process and then trigger success callback
      setTimeout(() => {
        onSuccess();
      }, 800);
    } catch (err: any) {
      console.error('Failed to initialize profile:', err);
      setError(err.message || 'Failed to set up profile. Please try again.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8 bg-gradient-to-br from-background via-secondary/10 to-peach/10">
      <Card className="w-full max-w-md border-2 border-primary/20 shadow-xl gentle-entrance">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSuccess ? 'bg-green-500/20' : 'bg-primary/10 glow-pulse'
            }`}>
              {isSuccess ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : (
                <Heart className="w-8 h-8 text-primary fill-primary" />
              )}
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            {isSuccess ? 'Welcome!' : 'Welcome to GrowInLove'}
          </CardTitle>
          <CardDescription className="text-base">
            {isSuccess ? 'Setting up your profile...' : "Let's start by getting to know you"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  What's your name?
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  className="h-12 text-base rounded-xl focus:ring-2 focus:ring-primary/50"
                  required
                  autoFocus
                  disabled={initializeProfile.isPending}
                />
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-start gap-2 gentle-entrance">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold rounded-xl"
                disabled={!name.trim() || initializeProfile.isPending}
              >
                {initializeProfile.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Get Started'
                )}
              </Button>
            </form>
          ) : (
            <div className="flex justify-center py-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
