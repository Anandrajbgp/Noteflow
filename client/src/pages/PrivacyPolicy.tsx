import { Header } from "@/components/Header";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="pb-24 min-h-screen bg-background">
      <header className="px-6 py-6 flex items-center gap-4 bg-background sticky top-0 z-30">
        <Link href="/settings">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">Privacy Policy</h1>
      </header>

      <main className="px-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to Noteflow. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you use our 
                application and tell you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Information We Collect</h2>
              <p className="text-muted-foreground">We may collect and process the following data about you:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li>Account information (email address, name) when you sign in with Google</li>
                <li>Notes and tasks you create within the application</li>
                <li>Device information for app functionality</li>
                <li>Usage data to improve our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">How We Use Your Information</h2>
              <p className="text-muted-foreground">We use your information to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li>Provide and maintain our services</li>
                <li>Sync your data across devices</li>
                <li>Send notifications for your tasks and reminders</li>
                <li>Improve and personalize your experience</li>
                <li>Respond to your inquiries and support requests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Data Storage and Security</h2>
              <p className="text-muted-foreground">
                Your data is securely stored on our servers. We implement appropriate security measures to 
                protect your personal information against unauthorized access, alteration, disclosure, or 
                destruction. When offline, data is stored locally on your device.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Third-Party Services</h2>
              <p className="text-muted-foreground">
                We use Google Sign-In for authentication. When you sign in with Google, their privacy policy 
                applies to the information they collect. We only receive basic profile information necessary 
                for account creation.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Your Rights</h2>
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li>Access your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request deletion of your account and data</li>
                <li>Export your notes and tasks</li>
                <li>Opt out of notifications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our application is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any changes by 
                posting the new privacy policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this privacy policy or our data practices, please contact us at:
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-foreground">
                  <span className="font-medium">Email:</span> teamoblivent@gmail.com
                </p>
                <p className="text-foreground">
                  <span className="font-medium">WhatsApp:</span> +91 9835742586
                </p>
              </div>
            </section>

            <section className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Last Updated: December 2024
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
