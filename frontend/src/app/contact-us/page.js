'use client';

import React from 'react';
import { 
	TiSocialFacebook, 
	TiSocialLinkedin, 
	TiSocialTwitter, 
	TiSocialYoutube,
	TiSocialInstagram,
} from "react-icons/ti";
import { HiOutlineMail } from "react-icons/hi";
import { MdEmail } from 'react-icons/md';
import { FaMapMarkerAlt, FaPhoneAlt, FaGlobe } from 'react-icons/fa';

// INTERNAL IMPORT.
import Style from "./contactUs.module.css";
import formStyle from "../../../accountPage/Form/Form.module.css";
import { Button } from '../../../components/componentsindex';

const contactUs = () => {
	return (
		<div className={Style.contactus}>
			<div className={Style.contactus_box}>
				<h1>Contact</h1>
				<div className={Style.contactus_box_box}>
					<div className={Style.contactus_box_box_left}>
						<div className={Style.contactus_box_box_left_item}>
							<h3>
								<FaMapMarkerAlt/> ADDRESS
							</h3>
							<p>
								Photo booth tattooed prism, portiand taiyaki hoodie neutra 
								typewriter
							</p>
						</div>
						<div className={Style.contactus_box_box_left_item}>
							<h3>
								<MdEmail/> EMAIL
							</h3>
							<p>tc.example@example.com</p>
						</div>
						<div className={Style.contactus_box_box_left_item}>
							<h3>
								<FaPhoneAlt/> PHONE
							</h3>
							<p>000-123-456-7890</p>
						</div>
						<div className={Style.contactus_box_box_left_item}>
							<h3>
								<FaGlobe/> SOCIAL
							</h3>
							<a href="#">
								<TiSocialFacebook/>
							</a>
							<a href="#">
								<TiSocialLinkedin/>
							</a>
							<a href="#">
								<TiSocialTwitter/>
							</a>
							<a href="#">
								<TiSocialInstagram/>
							</a>
						</div>
					</div>
					<div className={Style.contactus_box_box_right}>
						<form>
							<div className={formStyle.Form_box_input}>
								<label htmlFor="name">Full Name</label>
								<input 
									type="text" 
									placeholder="shoaib bhai"
									className={formStyle.Form_box_input_userName} 
								/>
							</div>

							<div className={formStyle.Form_box_input}>
								<label htmlFor="email">Email</label>
								<div className={formStyle.Form_box_input_box}>
									<div className={formStyle.Form_box_input_box_icon}>
										<HiOutlineMail />
									</div>
									<input type="text" placeholder="Email*" />
								</div>
							</div>
							<div className={formStyle.Form_box_input}>
								<label htmlFor="description">Message</label>
								<textarea 
									name="" 
									id="" 
									cols="30" 
									rows="6" 
									placeholder="something about yourself in few words"
								></textarea>
							</div>
							<Button 
								btnName="Send Message" 
								handleClick={() => {}}
								classStyle={Style.button}
							/>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default contactUs;
