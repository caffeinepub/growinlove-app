import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

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
              <p className="text-muted-foreground">
                For general inquiries, please contact us through our social channels or send us a message 
                via the Internet Computer community forums.
              </p>
            </div>
          ),
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          description: 'Terms and conditions for using GrowInLove',
          body: (
            <div className="space-y-4 text-muted-foreground">
              <p>
                By using GrowInLove, you agree to use the service responsibly and in accordance with all 
                applicable laws and regulations.
              </p>
              <p>
                GrowInLove is provided "as is" without warranties of any kind. We reserve the right to 
                modify or discontinue the service at any time.
              </p>
              <p>
                Your use of the service is at your own risk. We are not liable for any damages arising 
                from your use of GrowInLove.
              </p>
              <p className="text-sm italic">
                Full terms of service are being finalized and will be available soon.
              </p>
            </div>
          ),
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          description: 'How we protect your data',
          body: (
            <div className="space-y-4 text-muted-foreground">
              <p>
                Your privacy is our top priority. GrowInLove is built on the Internet Computer, 
                a decentralized blockchain platform that ensures your data remains secure and private.
              </p>
              <p>
                We do not sell, share, or monetize your personal information. Your ritual responses, 
                photos, and quiz results are stored securely and are only accessible to you and your partner.
              </p>
              <p>
                We do not use tracking cookies, analytics, or third-party advertising networks. 
                Your relationship data stays between you and your partner.
              </p>
              <p className="text-sm italic">
                A comprehensive privacy policy is being finalized and will be available soon.
              </p>
            </div>
          ),
        };
      case 'investor':
        return {
          title: 'Interested in Supporting Our Growth?',
          description: 'Partner with us to help couples grow closer',
          body: (
            <div className="space-y-4 text-muted-foreground">
              <p>
                GrowInLove started as a passion project built by a couple who wanted to strengthen 
                their own relationship. Now, we're sharing it with the world.
              </p>
              <p>
                We're exploring opportunities to grow the platform while staying true to our core values: 
                privacy, authenticity, and meaningful connection.
              </p>
              <p>
                If you're interested in supporting our mission or learning more about partnership opportunities, 
                we'd love to hear from you.
              </p>
              <p className="font-semibold text-foreground">
                Please reach out through the Internet Computer community forums or connect with us 
                via our social channels.
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
    <Dialog open={content !== null} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        {dialogContent && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{dialogContent.title}</DialogTitle>
              <DialogDescription>{dialogContent.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">{dialogContent.body}</div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
