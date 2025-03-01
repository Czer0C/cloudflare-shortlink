import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';
import { LinkIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
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

              <Component {...pageProps} />
              <footer className="border-t mt-auto">
                <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} URL Shortener. All rights
                  reserved.
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}
