import Image from "next/image";

// INTERNAL IMPORT.
import Style from "./index.module.css";
import { 
  HeroSection, 
  Service,
  BigNFTSlider ,
  Subscribe,
  Title,
  Category,
} from "../../components/componentsindex";

export default function Home() {
  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />
      <BigNFTSlider />
      <Title 
        heading="Browse by category" 
        paragraph="Explore the NFTs in the most features categories."
      />
      <Category />
      <Subscribe />
    </div>
  );
};
