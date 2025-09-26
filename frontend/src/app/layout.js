import "./globals.css";

// INTERNAL IMPORT.
import { NavBar } from "../../components/componentsindex"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}