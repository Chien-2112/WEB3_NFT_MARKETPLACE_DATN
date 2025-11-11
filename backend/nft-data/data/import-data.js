import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { NFT } from "../../models/nftsModel.js";
import instanceDB from "../../database/connectDB.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nfts = JSON.parse(
  fs.readFileSync(`${__dirname}/nft-simple.json`, "utf-8")
);

//IMPORT DATA
const importDate = async () => {
  try {
    await NFT.create(nfts);
    console.log("DATA successfully Loaded");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

//DELETE DATA
const deleteData = async () => {
  try {
    await NFT.deleteMany();
    console.log("DATA successfully Deleted");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import") {
  importDate();
} else if (process.argv[2] === "--delete") {
  deleteData();
}