import Image from "next/image";

// INTERNAL IMPORT.
import Style from "./index.module.css";
import { HeroSection } from "../../components/componentsindex";

export default function Home() {
  return (
    <div className={Style.homePage}>
      <HeroSection />
    </div>
  );
}
