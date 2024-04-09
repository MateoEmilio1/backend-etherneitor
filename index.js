const express = require("express");
const app = express();
const port = 5001;
const Moralis = require("moralis").default;
const cors = require("cors");

require("dotenv").config({ path: ".env" });

app.use(cors());
app.use(express.json());

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const INFURA_API_KEY = process.env.INFURA_API_KEY;

/* GET ETH PRICE */
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


/* ADDRESS */
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

/* GET TRANSACTION BY HASH */


app.post("/getTransactionByHash", async (req, res) => {
  const { hash } = req.body; // El hash de la transacción se espera en el cuerpo de la solicitud
  
  const provider = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;

  const data = {
    jsonrpc: '2.0',
    method: 'eth_getTransactionByHash',
    params: [hash],
    id: 1,
  };

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(provider, requestOptions);
    const responseData = await response.json();
    res.status(200).json(responseData);
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error);
    res.status(500).json({ error: 'Something went wrong with the fetch operation' });
  }
});

app.listen(5001, () => {
  console.log(`Server running on port 5001`);
});
