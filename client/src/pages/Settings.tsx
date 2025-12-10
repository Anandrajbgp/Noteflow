import { Header } from "@/components/Header";
import { Moon, Bell, Shield, HelpCircle, ChevronRight, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="pb-24 min-h-screen bg-background">
      <Header title="Settings" />

      <main className="px-6 space-y-8">
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 pl-2">Preferences</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Moon className="h-4 w-4" />
                </div>
                <span className="font-medium">Dark Mode</span>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Bell className="h-4 w-4" />
                </div>
                <span className="font-medium">Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 pl-2">Support</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 border-b border-border/50 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="font-medium">Privacy Policy</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <span className="font-medium">Help & Feedback</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </section>

        <button className="w-full p-4 rounded-2xl border border-destructive/20 text-destructive bg-destructive/5 font-medium flex items-center justify-center gap-2 hover:bg-destructive/10 transition-colors">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </main>
    </div>
  );
}