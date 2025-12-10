import { Link, useLocation } from "wouter";
import { Home, NotebookPen, Repeat, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const items = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/notes", icon: NotebookPen, label: "Notes" },
    { href: "/tasks", icon: Repeat, label: "Tasks" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-lg pb-safe pt-2 px-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto h-16">
        {items.map(({ href, icon: Icon, label }) => {
          const isActive = location === href;
          return (
            <Link key={href} href={href}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors cursor-pointer",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-6 w-6 transition-transform", isActive && "scale-110")} />
                <span className="text-[10px] font-medium">{label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}