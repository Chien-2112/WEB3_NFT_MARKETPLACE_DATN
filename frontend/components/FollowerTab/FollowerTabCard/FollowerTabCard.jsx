import React, {useState} from 'react';
import Image from "next/image";
import {
	MdVerified
} from "react-icons/md";
import { TiTick } from 'react-icons/ti';

// INTERNAL IMPORT
import Style from "./FollowerTabCard.module.css";
import images from "../../../public/img";

const FollowerTabCard = ({ i, el }) => {
	const [following, setFollowing] = useState(false);
	
	const followMe = () => {
		if(!following) {
			setFollowing(true);
		} else {
			setFollowing(false);
		}
	}
	
	return (
		<div className={Style.FollowerTabCard}>
			<div className={Style.FollowerTabCard_rank}>
				<p>
					#{i + 1} <span>🏅</span>
				</p>
			</div>

			<div className={Style.FollowerTabCard_box}>
				<div className={Style.FollowerTabCard_box_img}>
					<Image 
						className={Style.FollowerTabCard_box_img_img}
						src={el.background}
						alt="profile background"
						width={300}
						height={200}
						objectFit='cover'
					/>
				</div>

				<div className={Style.FollowerTabCard_box_profile}>
					<Image 
						className={Style.FollowerTabCard_box_profile_img}
						src={typeof el.user === "string" ? el.user : el.user?.src}
						alt="profile picture"
						width={50}
						height={50}
					/>
				</div>

				<div className={Style.FollowerTabCard_box_info}>
					<div className={Style.FollowerTabCard_box_info_name}>
						<h4>
							Giada Mann{""}{" "}
							<span>
								<MdVerified />
							</span>
						</h4>
						<p>12.321 ETH</p>
					</div>

					<div className={Style.FollowerTabCard_box_info_following}>
						{following ? (
							<a onClick={() => followMe()}>
								Follow{""}{" "}
								<span>
									<TiTick />
								</span>
							</a>
						) : (
							<a onClick={() => followMe()}>Following</a>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default FollowerTabCard;
