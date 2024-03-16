const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const Moralis = require("moralis").default;
const cors = require("cors");
const axios = require("axios");
const Web3 = require("web3");

require("dotenv").config({ path: ".env" });

app.use(cors());
app.use(express.json());

// NOVES

const NOVES_API_KEY = process.env.NOVES_API_KEY;

//GET CHAINS

// Crea una nueva ruta en tu aplicación Express para manejar las solicitudes a /evm/chains
app.get('/evm/chains', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://foresight.noves.fi/evm/chains',
      headers: { accept: 'application/json', apiKey: NOVES_API_KEY },
    };

    // Realiza la solicitud a la API de NOVES
    const response = await axios.request(options);
    const data = response.data; // Obtiene la data de la respuesta

    return res.status(200).json(data); // Devuelve la data obtenida como respuesta
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Something went wrong' });
  }
});

// GET DESCRIPTION

// Ruta GET para obtener la descripción de una transacción
app.get('/evm/:chain/describeTx/:txHash', async (req, res) => {
  try {
    const { txHash, chain } = req.params;

    const options = {
      method: 'GET',
      url: `https://translate.noves.fi/evm/${chain}/describeTx/${txHash}`,
      headers: { accept: 'application/json', apiKey: NOVES_API_KEY },
    };

    // Realiza la solicitud a la API de NOVES
    const response = await axios.request(options);
    const data = response.data; // Obtiene la data de la respuesta

    return res.status(200).json(data); // Devuelve la data obtenida como respuesta
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Something went wrong' });
  }
});

//MORALIS

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

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
