import Image from "next/image";

// INTERNAL IMPORT.
import Style from "./index.module.css";
import { 
  HeroSection, 
  Service,
  BigNFTSlider 
} from "../../components/componentsindex";

export default function Home() {
  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />
      <BigNFTSlider />
    </div>
  );
}
