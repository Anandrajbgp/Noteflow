import { ArrowLeft, Mail, MessageCircle, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HelpFeedback() {
  const supportEmail = "teamoblivent@gmail.com";
  const whatsappNumber = "919835742586";

  const handleEmailClick = () => {
    window.open(`mailto:${supportEmail}?subject=Noteflow Support Request`, '_blank');
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Hi, I need help with Noteflow app.`, '_blank');
  };

  return (
    <div className="pb-24 min-h-screen bg-background">
      <header className="px-6 py-6 flex items-center gap-4 bg-background sticky top-0 z-30">
        <Link href="/settings">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">Help & Feedback</h1>
      </header>

      <main className="px-6 space-y-6">
        {/* Contact Section */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 pl-2">Contact Us</h3>
          <div className="space-y-3">
            <Card 
              className="p-4 cursor-pointer transition-colors hover:bg-secondary/50"
              onClick={handleEmailClick}
              data-testid="button-email-support"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email Support</p>
                    <p className="text-sm text-muted-foreground">{supportEmail}</p>
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>

            <Card 
              className="p-4 cursor-pointer transition-colors hover:bg-secondary/50"
              onClick={handleWhatsAppClick}
              data-testid="button-whatsapp-support"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">WhatsApp Support</p>
                    <p className="text-sm text-muted-foreground">+91 9835742586</p>
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 pl-2">Frequently Asked Questions</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            <div className="p-4">
              <p className="font-medium text-foreground">How do I sync my notes across devices?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Sign in with your Google account in Settings to enable automatic sync across all your devices.
              </p>
            </div>
            <div className="p-4">
              <p className="font-medium text-foreground">Can I use the app offline?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Yes! All your notes and tasks are saved locally. When you go online, they will sync automatically.
              </p>
            </div>
            <div className="p-4">
              <p className="font-medium text-foreground">How do I enable notifications?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Go to Settings and enable Notifications. Make sure to allow notifications in your device settings as well.
              </p>
            </div>
            <div className="p-4">
              <p className="font-medium text-foreground">How do I delete my account?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Contact us via email or WhatsApp and we will help you delete your account and all associated data.
              </p>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 pl-2">Send Feedback</h3>
          <Card className="p-4">
            <p className="text-muted-foreground">
              We love hearing from you! Whether you have suggestions, found a bug, or just want to share your experience, 
              feel free to reach out via email or WhatsApp. Your feedback helps us make Noteflow better.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Button onClick={handleEmailClick} variant="outline" data-testid="button-send-feedback-email">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button onClick={handleWhatsAppClick} className="bg-green-600 hover:bg-green-700 text-white" data-testid="button-send-feedback-whatsapp">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </Card>
        </section>

        {/* App Info */}
        <section className="pt-4">
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>Noteflow v1.0.0</p>
            <p>Made with care by Team Oblivent</p>
          </div>
        </section>
      </main>
    </div>
  );
}
