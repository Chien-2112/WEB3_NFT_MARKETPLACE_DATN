'use client';

import React, {useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AiFillFire, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { MdVerified, MdTimer } from 'react-icons/md';
import { TbArrowBigLeftLines, TbArrowBigRightLines } from 'react-icons/tb';

// INTERNAL IMPORT.
import Style from "./BigNFTSlider.module.css";
import images from "../../public/img";
import Button from '../Button/Button';
import { initScriptLoader } from 'next/script';

const BigNFTSlider = () => {
	const [idNumber, setIdNumber] = useState(0);

	const sliderData = [
		{
			title: "Hello NFT",
			id: 1,
			name: "Chien dev",
			collection: "GYm",
			price: "000064 ETH",
			like: 243,
			image: images.user1,
			nftImage: images.nft_image_1,
			time: {
				days: 27,
				hours: 10,
				minutes: 11,
				seconds: 35
			}
		},
		{
			title: "Buddy NFT",
			id: 2,
			name: "Ctikcode",
			collection: "Home",
			price: "000032 ETH",
			like: 242,
			image: images.user2,
			nftImage: images.nft_image_2,
			time: {
				days: 21,
				hours: 40,
				minutes: 31,
				seconds: 55
			}
		},
		{
			title: "Gym NFT",
			id: 3,
			name: "Ttikcode_dev",
			collection: "Gym",
			price: "000068 ETH",
			like: 243,
			image: images.user3,
			nftImage: images.nft_image_3,
			time: {
				days: 19,
				hours: 11,
				minutes: 12,
				seconds: 45
			}
		}
	];

	// ---------INC
	const inc = useCallback(() => {
		if(idNumber + 1 < sliderData.length){
			setIdNumber(idNumber + 1);
		}
	}, [idNumber, sliderData.length]);

	// ---------DEC
	const dec = useCallback(() => {
		if(idNumber > 0){
			setIdNumber(idNumber - 1);
		}
	}, [idNumber]);

	// useEffect(() => {
	// 	inc();
	// }, []);

	return (
		<div className={Style.bigNFTSlider}>
			<div className={Style.bigNFTSlider_box}>
				<div className={Style.bigNFTSlider_box_left}>
					<h2>{sliderData[idNumber].title}</h2>
					<div className={Style.bigNFTSlider_box_left_creator}>
						<div className={Style.bigNFTSlider_box_left_creator_profile}>
							<Image
								className={Style.bigNFTSlider_box_left_creator_profile_img}
								src={sliderData[idNumber].image} 
								alt="profile image" 
								width={50} 
								height={50}
							/>
							<div className={Style.bigNFTSlider_box_left_creator_profile_info}>
								<p>Creator</p>
								<h4>
									{sliderData[idNumber].name}{" "} 
									<span>
										<MdVerified />
									</span>
								</h4>
							</div>
						</div>

						<div className={Style.bigNFTSlider_box_left_creator_collection}>
							<AiFillFire
								className={Style.bigNFTSlider_box_left_creator_collection_icon}	
							/>

							<div className={Style.bigNFTSlider_box_left_creator_collection_info}>
								<p>Collection</p>
								<h4>
									{sliderData[idNumber].collection}
								</h4>
							</div>
						</div>
					</div>

					<div className={Style.bigNFTSlider_box_left_bidding}>
						<div className={Style.bigNFTSlider_box_left_bidding_box}>
							<small>Current Bid</small>
							<p>
								{sliderData[idNumber].price} 
								<span>$221,21</span>
							</p>
						</div>

						<p className={Style.bigNFTSlider_box_left_bidding_box_auction}>
							<MdTimer 
								className={Style.bigNFTSlider_box_left_bidding_box_icon}
							/>
							<span>Auction ending in</span>
						</p>

						<div className={Style.bigNFTSlider_box_left_bidding_box_timer}>
							<div className={Style.bigNFTSlider_box_left_bidding_box_timer_item}>
								<p>{sliderData[idNumber].time.days}</p>
								<span>days</span>
							</div>

							<div className={Style.bigNFTSlider_box_left_bidding_box_timer_item}>
								<p>{sliderData[idNumber].time.hours}</p>
								<span>hours</span>
							</div>

							<div className={Style.bigNFTSlider_box_left_bidding_box_timer_item}>
								<p>{sliderData[idNumber].time.minutes}</p>
								<span>mins</span>
							</div>

							<div className={Style.bigNFTSlider_box_left_bidding_box_timer_item}>
								<p>{sliderData[idNumber].time.seconds}</p>
								<span>secs</span>
							</div>
						</div>

						<div className={Style.bigNFTSlider_box_left_button}>
							<Button btnName="Place" handleClick={() => {}}/>
							<Button btnName="View" handleClick={() => {}}/>
						</div>
					</div>

					<div className={Style.bigNFTSlider_box_left_sliderBtn}>
						<TbArrowBigLeftLines
							className={Style.bigNFTSlider_box_left_sliderBtn_icon}
							onClick={() => dec()}
						/>
						<TbArrowBigRightLines
							className={Style.bigNFTSlider_box_left_sliderBtn_icon}
							onClick={() => inc()}
						/>
					</div>
				</div>

				<div className={Style.bigNFTSlider_box_right}>
					<div className={Style.bigNFTSlider_box_right_box}>
						<Image 
							src={sliderData[idNumber].nftImage} 
							alt="NFT IMAGE"
							className={`${Style.bigNFTSlider_box_right_box_img} ${idNumber === 0 ? Style.firstImgFix : ""}`}
						/>
						
						<div className={Style.bigNFTSlider_box_right_box_like}>
							<AiFillHeart />
							<span>{sliderData[idNumber].like}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BigNFTSlider;
