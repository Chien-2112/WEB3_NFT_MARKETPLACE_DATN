'use client';

import React from 'react';
import Image from "next/image";

// INTERNAL IMPORT.
import Style from "./Brand.module.css";
import images from "../../public/img";
import { Button } from '../../components/componentsindex';

const Brand = () => {
	return (
		<div className={Style.Brand}>
			<div className={Style.Brand_box}>
				<div className={Style.Branch_box_left}>
					<Image 
						src={images.logo}
						alt="brand logo"
						width={100}
						height={100}
					/>
					<h1>Earn free crypto with Ciscrypt</h1>
					<p>A creative agency that lead and inspire.</p>

					<div className={Style.Brand_box_left_btn}>
						<Button btnName="Create" handleClick={() => {}}></Button>
						<Button btnName="Discover" handleClick={() => {}}></Button>
					</div>
				</div>
				<div className={Style.Branch_box_right}>
					<Image 
						src={images.eran}
						alt="brand logo"
						width={800}
						height={600}
					/>
				</div>
			</div>
		</div>
	)
}

export default Brand;
