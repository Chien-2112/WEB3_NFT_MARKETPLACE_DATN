import "./globals.css";

// INTERNAL IMPORT.
import { NavBar, Footer } from "../../components/componentsindex";
import dynamic from "next/dynamic";

const NFTMarketplaceProvider = dynamic(
  () =>
    import("@/Context/NFTMarketplaceContext").then(
      (mod) => mod.NFTMarketplaceProvider
    ),
  { ssr: false }
);

export default function RootLayout({ children }) {
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