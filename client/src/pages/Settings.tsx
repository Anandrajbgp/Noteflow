import { Header } from "@/components/Header";
import { Moon, Sun, Monitor, Bell, Shield, HelpCircle, ChevronRight, LogOut, User, Cloud, CloudOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export default function Settings() {
  const { user, loading, isConfigured, signIn, logOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'Auto', icon: Monitor },
  ] as const;

  return (
    <div className="pb-24 min-h-screen bg-background">
      <Header title="Settings" />

      <main className="px-6 space-y-8">
        {/* User Profile */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 pl-2">Account</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden p-4">
            {loading ? (
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url} alt={user.name || user.email} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name || 'User'}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <Cloud className="h-4 w-4" />
                  <span className="text-xs">Synced</span>
                </div>
              </div>
            ) : !isConfigured ? (
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <CloudOff className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Offline Mode</p>
                  <p className="text-sm text-muted-foreground">Data saved locally on this device</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Sign in to sync</p>
                    <p className="text-sm text-muted-foreground">Backup & sync across devices</p>
                  </div>
                </div>
                <Button 
                  onClick={signIn} 
                  className="w-full bg-white dark:bg-zinc-800 text-foreground border border-border hover:bg-secondary"
                  data-testid="button-google-sign-in"
                >
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Theme */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 pl-2">Theme</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden p-3">
            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all text-sm font-medium",
                    theme === value 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid={`button-theme-${value}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 pl-2">Preferences</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Bell className="h-4 w-4" />
                </div>
                <span className="font-medium">Notifications</span>
              </div>
              <Switch defaultChecked data-testid="switch-notifications-setting" />
            </div>
          </div>
        </section>

        {/* Support */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 pl-2">Support</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <Link href="/privacy-policy">
              <button 
                className="w-full flex items-center justify-between p-4 border-b border-border/50 hover:bg-secondary/50 transition-colors"
                data-testid="button-privacy"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Shield className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Privacy Policy</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </Link>
            <Link href="/help-feedback">
              <button 
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                data-testid="button-help"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Help & Feedback</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </Link>
          </div>
        </section>

        {/* App Info */}
        <section>
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>Noteflow v1.0.0</p>
            <p>Your notes & tasks, always with you</p>
          </div>
        </section>

        {/* Sign Out */}
        {user && (
          <button 
            onClick={logOut}
            className="w-full p-4 rounded-2xl border border-destructive/20 text-destructive bg-destructive/5 font-medium flex items-center justify-center gap-2 hover:bg-destructive/10 transition-colors"
            data-testid="button-sign-out"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        )}
      </main>
    </div>
  );
}
