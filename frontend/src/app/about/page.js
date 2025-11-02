import React from 'react';
import Image from "next/image";
import { FaUserTie, FaRocket } from "react-icons/fa";
import { AiOutlineTeam } from "react-icons/ai";

// INTERNAL IMPORT.
import Style from "./aboutUs.module.css";
import { Brand } from '../../../components/componentsindex';
import images from "../../../public/img";

const aboutUs = () => {
	const founderArray = [
		{
			name: "Niamh O'Shea",
			position: "Co-founder",
			image: images.founder1
		},
		{
			name: "Danien Jame",
			position: "CTO",
			image: images.founder2
		},
		{
			name: "Orla Dwyer",
			position: "Tech-Lead",
			image: images.founder3
		},
		{
			name: "Nicolas Tesla",
			position: "Marketing",
			image: images.founder4
		},
	];

	const factsArray = [
		{
			title: "10 million",
			info: "Articles have been public around the world(as of Sept, 30, 2025)"
		},
		{
			title: "100,000",
			info: "Registered users account(as of Sept, 30, 2025)"
		},
		{
			title: "220+",
			info: "Countries and regions have our presence (as of Sept. 30, 2025)"
		},
	];

	return (
		<div className={Style.aboutus}>
			<div className={Style.aboutus_box}>
				<div className={Style.aboutus_box_hero}>
					<div className={Style.aboutus_box_hero_left}>
						<h1>👋 About Us.</h1>
						<p>
							We’re impartial and independent, and every day we create 
							distinctive, world-class programmes and content which inform, 
							educate and entertain millions of people around the world.
						</p>
					</div>
					<div className={Style.aboutus_box_hero_right}>
						<Image 
							src={images.hero2}
						/>
					</div>
				</div>

				<div className={Style.aboutus_box_title}>
					<h2>⛱ Founder</h2>
					<p>
						We’re impartial and independent, and every day we create 
						distinctive, world-class programmes and content
					</p>
				</div>

				<div className={Style.aboutus_box_founder}>
					<div className={Style.aboutus_box_founder_box}>
						{founderArray.map((el, i) => (
							<div className={Style.aboutus_box_founder_box_img}>
								<Image 
									src={el.image}
									alt={el.name}
									width={250}
									height={210}
									className={Style.aboutus_box_founder_box_img_img}
								/>
								<h3>{el.name}</h3>
								<p>{el.position}</p>
							</div>	
						))}
					</div>
				</div>

				<div className={Style.aboutus_box_title}>
					<h2>🚀 Fast Facts</h2>
					<p>
						We’re impartial and independent, and every day we create 
						distinctive, world-class programmes and content
					</p>
				</div>

				<div className={Style.aboutus_box_facts}>
					<div className={Style.aboutus_box_facts_box}>
						{factsArray.map((el, i) => (
							<div className={Style.aboutus_box_facts_box_info} key={i+1}>
								<h3>{el.title}</h3>
								<p>{el.info}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<Brand />
		</div>
	)
}

export default aboutUs;