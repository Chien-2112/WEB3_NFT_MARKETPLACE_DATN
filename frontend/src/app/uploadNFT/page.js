import React from 'react';

// INTERN IMPORT.
import Style from "./uploadNft.module.css";
import { UploadNFT } from "../../../uploadNFT/uploadNFTIndex";

const uploadNFT = () => {
	return (
		<div className={Style.uploadNFT}>
			<div className={Style.uploadNFT_box}>
				<div className={Style.uploadNFT_box_heading}>
					<h1>Create New NFT</h1>
					<p>
						You can set preferred display name, create your profile NFT and
						manage other personal settings
					</p>
				</div>

				<div className={Style.uploadNFT_box_title}>
					<h2>Image, Video, Audio, or 3D Model</h2>
					<p>
						File types supported: JPG, PNG, GIF, SVG, MP4. WEBM,
						GLB, GLTF. Max size: 100MB
					</p>
				</div>

				<div className={Style.uploadNFT_box_form}>
					<UploadNFT />
				</div>
			</div>
		</div>
	)
}

export default uploadNFT;
