import { Suspense } from "react";
import { Link as LinkIcon } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import LinksClient from "./links-client";

export default  function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-6 w-6" />
            <h1 className="text-xl font-bold">URL Shortener</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Manage Your Links</h2>
          <p className="text-muted-foreground mt-2">
            Create, view, update, and delete your shortened URLs.
          </p>
        </div>
        
        <Suspense fallback={<div>Loading...</div>}>
          <LinksClient />

        </Suspense>
      </main>
      
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} URL Shortener. All rights reserved.
        </div>
      </footer>
    </div>
  );
}