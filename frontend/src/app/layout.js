import "./globals.css";

// INTERNAL IMPORT.
import { NavBar, Footer } from "../../components/componentsindex"
import { NFTMarketplaceProvider } from "../../Context/NFTMarketplaceContext";

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