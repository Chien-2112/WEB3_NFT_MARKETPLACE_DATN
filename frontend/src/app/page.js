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
  AudioLive
} from "../../components/componentsindex";

export default function Home() {
  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />
      <BigNFTSlider />
      <Title 
        heading="Latest Audio Collection" 
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <AudioLive />
      <Title 
        heading="New Collection" 
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <FollowerTab />
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
    </div>
  );
};
