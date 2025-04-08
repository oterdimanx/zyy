import './styles/globals.css'
import './styles/learn-more.css'
import './styles/footer.css'
import { Providers } from '@/Store/Provider'
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'Zyy App',
  description: 'Official Zyy products Seller',
  authors: [{ name: "Terdiman Olivier", url: 'https://www.zyysk8club.com' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) { 
  return (
    <html lang="fr">
      <body className="zyy">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
