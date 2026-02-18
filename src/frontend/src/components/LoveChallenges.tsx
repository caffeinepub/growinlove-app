import { useState, useRef } from 'react';
import { Heart, CheckCircle2, Loader2, Camera, Image as ImageIcon, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetWeeklyChallenge, useCompleteWeeklyChallenge } from '../hooks/useQueries';
import { LoadingState, ErrorState, InlineEmpty } from './DataStates';
import { CompletionAnimation } from './CompletionAnimation';
import { ExternalBlob } from '../backend';

export function LoveChallenges() {
  const { data: challenge, isLoading, error, refetch } = useGetWeeklyChallenge();
  const completeChallenge = useCompleteWeeklyChallenge();
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleComplete = async (withProof: boolean) => {
    try {
      setIsUploading(true);
      
      let blob: ExternalBlob | undefined;
      
      if (withProof && selectedPhoto) {
        // Convert File to Uint8Array
        const arrayBuffer = await selectedPhoto.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        blob = ExternalBlob.fromBytes(uint8Array);
      }
      
      await completeChallenge.mutateAsync({ blob });
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2000);
      
      // Clear photo after successful completion
      handleRemovePhoto();
    } catch (err) {
      console.error('Failed to complete challenge:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const hasProof = challenge?.proof?.blob;
  const proofUrl = hasProof ? challenge.proof!.blob!.getDirectURL() : null;

  return (
    <Card className="border-2 border-primary/20 shadow-lg gentle-entrance relative overflow-hidden">
      {showAnimation && <CompletionAnimation />}
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-primary">
          <Heart className="w-6 h-6" fill="currentColor" />
          💞 Weekly Challenge
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading && (
          <LoadingState message="Loading your weekly challenge..." size="sm" />
        )}

        {error && (
          <ErrorState
            title="Unable to load challenge"
            message="We couldn't fetch your weekly challenge. Please try again."
            details={error instanceof Error ? error.message : 'Unknown error'}
            onRetry={() => refetch()}
            retryLabel="Retry"
          />
        )}

        {!isLoading && !error && !challenge && (
          <InlineEmpty
            message="No weekly challenge available right now. Check back soon!"
            icon={<Heart className="w-10 h-10 text-primary/30 fill-primary/30" />}
          />
        )}

        {!isLoading && !error && challenge && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {challenge.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {challenge.description}
              </p>
            </div>

            {challenge.isCompleted ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-primary">
                    Challenge completed! 🎉
                  </span>
                </div>
                
                {/* Show proof if available */}
                {proofUrl && (
                  <div className="rounded-lg overflow-hidden border-2 border-primary/20">
                    <img 
                      src={proofUrl} 
                      alt="Challenge proof" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-2 bg-primary/5 text-xs text-center text-muted-foreground">
                      Your proof photo
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Photo proof section */}
                <div className="p-4 rounded-lg bg-muted/30 border border-muted space-y-3">
                  <div className="flex items-start gap-2">
                    <Camera className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        Add a photo (optional but encouraged!)
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Capture the moment to help you both remember and celebrate this special time together. Photos make your journey more memorable! 💕
                      </p>
                    </div>
                  </div>

                  {/* Photo preview or upload button */}
                  {photoPreview ? (
                    <div className="relative rounded-lg overflow-hidden border-2 border-primary/20">
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={handleRemovePhoto}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/90 hover:bg-destructive text-white transition-colors"
                        aria-label="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => fileInputRef.current?.click()}
                          asChild
                        >
                          <span>
                            <ImageIcon className="w-4 h-4" />
                            Choose photo
                          </span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>

                {/* Completion buttons */}
                <div className="flex flex-col gap-2">
                  {selectedPhoto ? (
                    <Button
                      onClick={() => handleComplete(true)}
                      disabled={isUploading || completeChallenge.isPending}
                      className="w-full rounded-2xl gap-2"
                    >
                      {isUploading || completeChallenge.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Completing with photo...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Complete with photo
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleComplete(false)}
                      disabled={isUploading || completeChallenge.isPending}
                      className="w-full rounded-2xl gap-2"
                    >
                      {isUploading || completeChallenge.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Marking as done...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Mark as done
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
