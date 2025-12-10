interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="px-6 pt-12 pb-6 flex justify-between items-end bg-background sticky top-0 z-30">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}