import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CONTACT_EMAIL } from '@/content/contact';

interface LandingFooterLinksDialogProps {
  content: 'about' | 'contact' | 'terms' | 'privacy' | 'investor' | null;
  onClose: () => void;
}

export function LandingFooterLinksDialog({ content, onClose }: LandingFooterLinksDialogProps) {
  const getDialogContent = () => {
    switch (content) {
      case 'contact':
        return {
          title: 'Contact Us',
          description: 'Get in touch with the GrowInLove team',
          body: (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, 
                feel free to reach out.
              </p>
              <div className="bg-romantic-light/20 dark:bg-romantic-primary/10 rounded-lg p-4 border border-romantic-primary/20">
                <p className="text-sm font-medium text-foreground mb-2">Email us at:</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-romantic-primary hover:text-romantic-primary/80 font-semibold text-lg"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                We typically respond within 24-48 hours.
              </p>
            </div>
          ),
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          description: 'Terms and conditions for using GrowInLove',
          body: (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                By using GrowInLove, you agree to use the service responsibly and respectfully. 
                This app is designed for couples to strengthen their relationship through daily rituals 
                and shared experiences.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account and for all 
                activities that occur under your account.
              </p>
              <p>
                We reserve the right to modify or discontinue the service at any time. For detailed 
                terms, please contact us at {CONTACT_EMAIL}.
              </p>
            </div>
          ),
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          description: 'How we protect your data',
          body: (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Your privacy is our top priority. GrowInLove is built on the Internet Computer, 
                a decentralized blockchain platform that ensures your data is secure and private.
              </p>
              <p>
                We never sell, share, or monetize your personal information. Your ritual responses, 
                photos, and quiz results are stored securely and are only accessible to you and your partner.
              </p>
              <p>
                We do not use tracking cookies, analytics, or advertising. Your relationship data 
                belongs to you and you alone.
              </p>
              <p>
                For more information, contact us at {CONTACT_EMAIL}.
              </p>
            </div>
          ),
        };
      case 'investor':
        return {
          title: 'Interested in supporting our growth?',
          description: 'Investment and partnership opportunities',
          body: (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                GrowInLove started as a passion project built by a couple for couples. We're exploring 
                opportunities to grow and reach more people who want to strengthen their relationships.
              </p>
              <p>
                If you're interested in supporting our mission through investment, partnership, or 
                collaboration, we'd love to hear from you.
              </p>
              <div className="bg-romantic-light/20 dark:bg-romantic-primary/10 rounded-lg p-4 border border-romantic-primary/20">
                <p className="text-sm font-medium text-foreground mb-2">Reach out to:</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Investment Inquiry`}
                  className="text-romantic-primary hover:text-romantic-primary/80 font-semibold"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          ),
        };
      default:
        return null;
    }
  };

  const dialogContent = getDialogContent();

  if (!dialogContent) return null;

  return (
    <Dialog open={!!content} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogContent.title}</DialogTitle>
          <DialogDescription>{dialogContent.description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">{dialogContent.body}</div>
      </DialogContent>
    </Dialog>
  );
}
