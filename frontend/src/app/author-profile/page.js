'use client';

import React, { useState, useEffect } from 'react';

// INTERNAL IMPORT.
import Style from "./author.module.css";
import { Banner, NFTCardTwo } from '../../../collectionPage/collectionIndex';
import { Brand, Title } from '../../../components/componentsindex';
import FollowerTabCard from '../../../components/FollowerTab/FollowerTabCard/FollowerTabCard';
import images from "../../../public/img";
import { AuthorProfileCard, AuthorTaps, TabCard } from '../../../authorPage/authorIndex';

const authorProfile = () => {
	const popularArray = [
		images.user1,
		images.user2,
		images.user3,
		images.user4,
		images.user5,
		images.user6,
		images.user7,
	];
	const [collectiables, setCollectiables] = useState(true);
	const [created, setCreated] = useState(false);
	const [like, setLike] = useState(false);
	const [follower, setFollower] = useState(false);
	const [following, setFollowing] = useState(false);

	return (
		<div className={Style.banner}>
			<Banner bannerImage={images.creatorbackground2} />
			<AuthorProfileCard />
			<AuthorTaps 
				collectiables={setCollectiables} 
				created={setCreated} 
				like={setLike}
				follower={setFollower}
				following={setFollowing}
			/>
			<Title 
				heading="Popular Creators" 
				paragraph="Click on music icon and enjoy NFT music or audio" 
			/>
			{/* {popularArray.map((el, i) => (
				<FollowerTabCard key={i + 1} i={i} el={el} />
			))} */}
			<Brand />
		</div>
	)
}

export default authorProfile;
