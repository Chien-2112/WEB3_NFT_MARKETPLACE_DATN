import React from "react";

// INTERNAL IMPORT.
import Style from "./Footer.module.css";

const Footer = () => {
	return (
		<div className={Style.footer}>
		<p>Copyright © 2024 NFT Marketplace</p>
		<p>All rights reserved</p>
		</div>
	);
}

export default Footer;