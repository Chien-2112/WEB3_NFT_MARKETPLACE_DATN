'use client';

import React, { useState, useEffect } from 'react';

// INTERNAL IMPORT.
import Style from "./author.module.css";
import { Banner, NFTCardTwo } from '../../../collectionPage/collectionIndex';
import { Brand, Title } from '../../../components/componentsindex';
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
			<Banner bannerImage={images.creatorbackground1} />
			<AuthorProfileCard />
		</div>
	)
}

export default authorProfile;
