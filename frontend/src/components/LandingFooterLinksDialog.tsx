import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CONTACT_EMAIL } from '@/content/contact';

interface LandingFooterLinksDialogProps {
  content: 'about' | 'contact' | 'terms' | 'privacy' | 'investor' | null;
  onClose: () => void;
}

export function LandingFooterLinksDialog({ content, onClose }: LandingFooterLinksDialogProps) {
  const getDialogContent = () => {
    switch (content) {
      case 'about':
        return {
          title: 'About GrowInLove',
          description: (
            <div className="space-y-3 text-muted-foreground">
              <p>
                GrowInLove is a private, couples-only app designed to help you deepen your connection through daily rituals, 
                love language insights, and shared memories.
              </p>
              <p>
                Built by a couple, for couples — we understand the importance of intentional connection in relationships.
              </p>
            </div>
          ),
        };
      case 'contact':
        return {
          title: 'Contact Us',
          description: (
            <div className="space-y-3 text-muted-foreground">
              <p>We'd love to hear from you!</p>
              <p>
                Email us at:{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-romantic-primary hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          ),
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          description: (
            <div className="space-y-3 text-muted-foreground text-sm max-h-[60vh] overflow-y-auto">
              <p className="font-semibold text-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
              <p>
                By using GrowInLove, you agree to these terms. GrowInLove is provided "as is" for personal, 
                non-commercial use by couples.
              </p>
              <p className="font-semibold text-foreground">User Responsibilities</p>
              <p>
                You are responsible for maintaining the confidentiality of your account and for all activities 
                that occur under your account. You agree to use the service only for lawful purposes.
              </p>
              <p className="font-semibold text-foreground">Privacy</p>
              <p>
                Your data is stored securely on the Internet Computer blockchain. We do not sell or share your 
                personal information with third parties.
              </p>
              <p className="font-semibold text-foreground">Limitation of Liability</p>
              <p>
                GrowInLove is provided without warranties of any kind. We are not liable for any damages arising 
                from your use of the service.
              </p>
            </div>
          ),
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          description: (
            <div className="space-y-3 text-muted-foreground text-sm max-h-[60vh] overflow-y-auto">
              <p className="font-semibold text-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
              <p>
                GrowInLove is committed to protecting your privacy. This policy explains how we collect, use, 
                and protect your information.
              </p>
              <p className="font-semibold text-foreground">Data Collection</p>
              <p>
                We collect only the information necessary to provide the service: your name, ritual responses, 
                photos you upload, and quiz results. We use Internet Identity for authentication, which provides 
                privacy-preserving login.
              </p>
              <p className="font-semibold text-foreground">Data Storage</p>
              <p>
                All data is stored on the Internet Computer blockchain, a decentralized network. Your data is 
                encrypted and accessible only to you and your partner.
              </p>
              <p className="font-semibold text-foreground">Data Sharing</p>
              <p>
                We never sell or share your personal information with third parties. Your data is visible only 
                to you and your paired partner.
              </p>
              <p className="font-semibold text-foreground">Your Rights</p>
              <p>
                You have the right to access, modify, or delete your data at any time through the app.
              </p>
            </div>
          ),
        };
      case 'investor':
        return {
          title: 'Investor Information',
          description: (
            <div className="space-y-3 text-muted-foreground">
              <p>
                GrowInLove is currently in early development. We're focused on building a product that truly 
                helps couples grow closer.
              </p>
              <p>
                For investment inquiries, please contact us at:{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-romantic-primary hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          ),
        };
      default:
        return null;
    }
  };

  const dialogContent = getDialogContent();

  return (
    <Dialog open={!!content} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        {dialogContent && (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground">{dialogContent.title}</DialogTitle>
            </DialogHeader>
            <DialogDescription asChild>
              <div>{dialogContent.description}</div>
            </DialogDescription>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
