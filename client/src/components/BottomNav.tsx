import { Link, useLocation } from "wouter";
import { NotebookPen, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const items = [
    { href: "/notes", icon: NotebookPen, label: "Notes" },
    { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background pb-safe pt-1 px-6 z-50 h-16">
      <div className="flex justify-around items-center max-w-md mx-auto h-full">
        {items.map(({ href, icon: Icon, label }) => {
          const isActive = location === href || (location === "/" && href === "/notes");
          return (
            <Link key={href} href={href}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-20 h-full transition-colors cursor-pointer",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                )}
              >
                <Icon className={cn("h-6 w-6 transition-all", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                <span className={cn("text-[11px] font-medium", isActive ? "font-semibold" : "font-normal")}>{label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}