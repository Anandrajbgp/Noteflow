import { Settings } from "lucide-react";
import { Link } from "wouter";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="px-6 py-6 flex justify-between items-center bg-background sticky top-0 z-30">
      <h1 className="text-4xl font-normal font-sans tracking-tight text-foreground">{title}</h1>
      <div className="flex items-center gap-4">
        <Link href="/settings">
          <Settings className="h-6 w-6 text-foreground stroke-[1.5px] cursor-pointer hover:opacity-70 transition-opacity" />
        </Link>
      </div>
    </header>
  );
}