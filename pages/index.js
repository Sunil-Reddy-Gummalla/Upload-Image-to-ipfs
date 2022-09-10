import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import { useMoralis } from "react-moralis";
import { Button } from "web3uikit";
import { useEffect } from "react";
const { Moralis } = require('moralis-v1');

const serverUrl = "https://egs00egygkwk.usemoralis.com:2053/server";
const appId = "LuiXZF1VMTJMBgUKgZMySbFCssO5ew5lUrKhe6u8";
const masterKey = "dL3gUW2SNxGiex8g0JnCu0N4Vi7Kivzn0QhhS6c3";
const supportedChains = ["80001", "4"];

export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis();
  Moralis.start({ serverUrl, appId, masterKey });

  //constants for metadata
  let imageHash;

  // @ts-check
  const handleUpload = async (e) => {
    console.log("Handling the Upload")
    let file;
    if (e.target.files) {
      file = e.target.files[0]
    }
    const imageFile = new Moralis.File(file.name, file);
    await imageFile.saveIPFS({ useMasterKey: true }); //issue
    console.log("Image Saved");
    const imageIPFSLink = imageFile.ipfs();
    imageHash = imageFile.hash();
    console.log(`Image URL is ${imageIPFSLink}`);
    console.log(`Image Hash is ${imageHash}`);
  }

  const ClaimLand = async () => {
    console.log("Claim Land is Working");
    let metadata = {
      name: "Sunil Reddy",
      description: "Lets Try to upload this metadata",
      price: 9,
      imageURI: imageHash
    }
    console.log(metadata);
    console.log(metadata);
    const jsonFile = new Moralis.File("metadata.json", { base64: btoa(JSON.stringify(metadata)) });
    await jsonFile.saveIPFS();

    let metadataHash = jsonFile.hash();
    console.log(jsonFile.ipfs());
    console.log(metadataHash);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {isWeb3Enabled ? (
        <div>
          {supportedChains.includes(parseInt(chainId).toString()) ? (
            <div className="flex flex-row">
              <br />
              You are Successfully Connected
              <br />
              <br />
              <div> Lets Upload the NFT Image Here</div>
              <br />
              <br />

              <div className="flex min-h-screen flex-col items-center justify-center py-2">
                <input
                  type="file"
                  accept="image/*"
                  className="block w-auto text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="file_input"
                  onChange={(e) => { handleUpload(e) }}
                />
              </div>
              <div> <input type="number" text="Price" /></div>
              <br />
              <br />

              <Button
                onClick={() => { ClaimLand() }}
                type="button"
                text="Claim Land" />

            </div>
          ) : (
            <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
          )}
        </div>
      ) : (

        <div><br /><br />Please connect to a Wallet</div>
      )}
    </div>
  );
}