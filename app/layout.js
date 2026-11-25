import './globals.css';
<<<<<<< HEAD
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  title: 'Heard in Class, Lost After',
  description: 'A centralized faculty-student communication platform'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
=======
export const metadata={title:'Heard in Class, Lost After',description:'A centralized faculty-student communication platform'};
export default function RootLayout({children}){return <html lang="en"><body>{children}</body></html>}
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
