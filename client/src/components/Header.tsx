import { Settings, Moon, Sun } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
  };

  return (
    <header className="px-6 py-6 flex justify-between items-center bg-background sticky top-0 z-30">
      <h1 className="text-4xl font-normal font-sans tracking-tight text-foreground">{title}</h1>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="text-foreground hover:opacity-70 transition-opacity">
          {theme === "light" ? <Moon className="h-6 w-6 stroke-[1.5px]" /> : <Sun className="h-6 w-6 stroke-[1.5px]" />}
        </button>
        <Link href="/settings">
          <Settings className="h-6 w-6 text-foreground stroke-[1.5px] cursor-pointer hover:opacity-70 transition-opacity" />
        </Link>
      </div>
    </header>
  );
}