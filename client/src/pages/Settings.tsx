import { Header } from "@/components/Header";
import { Moon, Sun, Monitor, Bell, Shield, HelpCircle, ChevronRight, LogOut, LogIn, User, Cloud, CloudOff, Wifi, WifiOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function Settings() {
  const { user, loading, isConfigured, signIn, logOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'Auto', icon: Monitor },
  ] as const;

  return (
    <div className="pb-24 min-h-screen bg-background">
      <Header title="Settings" />

      <main className="px-6 space-y-8">
        {/* Connection Status */}
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl",
          isOnline ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
        )}>
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">Online - Data will sync automatically</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">Offline - Changes saved locally</span>
            </>
          )}
        </div>

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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Sign in to sync</p>
                    <p className="text-sm text-muted-foreground">Backup & sync across devices</p>
                  </div>
                </div>
                <Button onClick={signIn} size="sm" data-testid="button-sign-in">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Theme */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 pl-2">Theme</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden p-4">
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl transition-all",
                    theme === value 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                  data-testid={`button-theme-${value}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{label}</span>
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
