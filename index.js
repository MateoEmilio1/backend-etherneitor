const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const Moralis = require("moralis").default;
const cors = require("cors");
const axios = require("axios");

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

//INFURA

/* GET TRANSACTION BY HASH */
app.post("/getTransactionByHash", async (req, res) => {
  try {
    const { jsonrpc, method, params, id } = req.body;

    const options = {
      method: 'POST',
      url: 'https://mainnet.infura.io/v3/' + INFURA_API_KEY,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ jsonrpc, method, params, id }),
    };

    const response = await axios.request(options);
    const data = response.data;

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Something went wrong' });
  }
});

/* GET LAST BLOCK NUMBER */
app.post('/getEthLastBlockNumber', async (req, res) => {
  try {
    const { jsonrpc, method, params, id } = req.body;

    const url = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;

    const data = {
      jsonrpc: jsonrpc || '2.0',
      method: method || 'eth_blockNumber',
      params: params || [],
      id: id || 1
    };

    const options = {
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(data),
    };

    const response = await axios.request(options);
    const responseData = response.data;

    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Something went wrong' });
  }
});

/* GET ETH GAS PRICE */

app.post('/getEthGasPrice', async (req, res) => {
  try {
    const { jsonrpc, method, params, id } = req.body;

    const url = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;
    const data = {
      jsonrpc: jsonrpc || '2.0',
      method: method || 'eth_gasPrice',
      params: params || [],
      id: id || 1
    };

    const options = {
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(data),
    };

    const response = await axios.request(options);
    const responseData = response.data;

    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Something went wrong' });
  }
});



// ETHERSCAN

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;


app.get('/getTotalNodesCount', async (req, res) => {
  try {
    const url = `https://api.etherscan.io/api?module=stats&action=nodecount&apikey=${ETHERSCAN_API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.status === '1') {
      const totalNodesCount = data.result;
      res.status(200).json({ totalNodesCount });
    } else {
      res.status(400).json({ error: data.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching data from Etherscan API' });
  }
});
