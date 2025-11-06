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
  Filter,
  NFTCard,
  Collection,
  FollowerTab,
  AudioLive,
  Slider,
  Brand,
  Video
} from "../../components/componentsindex";
import { useContext } from "react";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

export default function Home() {
  const {} = useContext(NFTMarketplaceContext);

  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />
      <BigNFTSlider />
      <Title
        heading="Audio Collection"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <AudioLive />
      <FollowerTab />
      <Slider />
      <Collection />
      <Title 
        heading="Featured NFTs" 
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <Filter />
      <NFTCard />
      <Title 
        heading="Browse by category" 
        paragraph="Explore the NFTs in the most features categories."
      />
      <Category />
      <Subscribe />
      <Brand />
      <Video />
    </div>
  );
};
