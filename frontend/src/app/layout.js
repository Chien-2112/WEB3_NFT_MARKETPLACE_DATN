import "./globals.css";

// INTERNAL IMPORT.
import { NavBar, Footer } from "../../components/componentsindex"
import { NFTMarketplaceProvider } from "../../Context/NFTMarketplaceContext";
import dynamic from 'next/dynamic';

const NFTMarketplaceProvider = dynamic(
  () => import('@/Context/NFTMarketplaceContext').then((mod) => mod.NFTMarketplaceProvider),
  { ssr: false }
);

export default function RootLayout({ children }) {
  const titleData = "Discover, collect, and sell NFTs";
  return (
    <html lang="en">
      <body>
        <NFTMarketplaceProvider>
          <NavBar />
            {children}
          <Footer />
        </NFTMarketplaceProvider>
      </body>
    </html>
  );
}