const express = require("express");
const app = express();
const port = 5001;
const Moralis = require("moralis").default;
const cors = require("cors");

require("dotenv").config({ path: ".env" });

app.use(cors());
app.use(express.json());

const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImY0ZjM4ZmE3LWMwMDAtNDJmMy1hNDk4LWUyMWRjZTQ5YjllZSIsIm9yZ0lkIjoiMzc1MjA0IiwidXNlcklkIjoiMzg1NTc2IiwidHlwZUlkIjoiZDcxZDdhMGItMTZjMS00ODI3LWE3NDMtMjY0YzM1YjZlNzk0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDY3NDcyMTgsImV4cCI6NDg2MjUwNzIxOH0.oJDlOrRc4qvTX6Dlam1lkCK50sHfKLjLWYMXNeVRLJo";

app.get("/getethprice", async (req, res) => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      chain: "0x1",
    });

    return res.status(200).json(response);
  } catch (e) {
    console.log(`Somthing went wrong ${e}`);
    return res.status(400).json();
  }
});

app.get("/address", async (req, res) => {
  try {
    const { query } = req;
    const chain = "0x1";

    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
      address: query.address,
      chain,
    });

    return res.status(200).json(response);
  } catch (e) {
    console.log(`Something went wrong ${e}`);
    return res.status(400).json();
  }
});

Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});