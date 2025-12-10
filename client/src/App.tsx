import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/BottomNav";
import Home from "@/pages/Home";
import Notes from "@/pages/Notes";
import Tasks from "@/pages/Tasks";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/notes" component={Notes} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground font-sans">
        {/* Mobile Container wrapper to simulate phone on desktop, full width on mobile */}
        <div className="max-w-md mx-auto min-h-screen bg-background relative shadow-2xl overflow-hidden">
          <Router />
          <BottomNav />
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;