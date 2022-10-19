require('dotenv').config();
const PORT = process.env.PORT;
/*Install library express for create web server*/
const express = require("express");
const socketIO = require("socket.io");
const axios = require('axios');

const app = express();
/*Define type of comunication (JSON) between Fronted and Backend*/
app.use(express.json());

/*Create server listening on port 3000*/
const server = app.listen(PORT, () => {

    console.log(`Listining to ${PORT}`);
});

/*Create the conection by WEbSocket */
const socketHandler = socketIO(server);

socketHandler.on("connection", (socket) => {
    socket.on('connect_error', () => {
        console.log("Client disconnected");

    });
    socket.on('disconnect', () => {
        console.log("Client disconnected");

    });

    console.log("Client connected");
    /*Send a message every 3 seconds to the client */
    socketHandler.emit('crypto', 'Hola Crypto colegas');

});

/*call API from  coingecko*/
const getPrices = async () => {
    //let priceList = new Map([]);
    await axios
        .get(process.env.LIST_URL)
        .then((response) => {
            const priceList = response.data.map((item) => {
                return {
                    // "id": item.id,
                    // "current_price": item.current_price,
                    id: item.id,
                    name: item.name,
                    current_price: item.current_price,
                    image: item.image,
                    symbol: item.symbol,
                    price_change_percentage_24h: item.price_change_percentage_24h,
                }
            })
            //console.log(priceList);
            /*Send a message  to the client */
            socketHandler.emit('crypto', priceList);
            //console.log(priceList);
        })
        .catch((err) => {
            console.log(err);
            socketHandler.emit("crypto", {
                error: true,
                message: "Erro Fetching Prices Data From API BE_Latin"
            });
        })
}

setTimeout(() => {
    getPrices();
}, 2000);
setInterval(() => {
    getPrices();
}, 4000)



// /*Create API for only one type of crypto. Example request : http://localhost:3000/cryptos/profile/035/ */
// app.get('/cryptos/profile/:id', (req, res) => {
//     const cryptoId = req.params.id;
//     axios
//         .get(`${process.env.BASE_URL_V2}/${cryptoId}/profile`, {
//             headers: {
//                 'x-messari-api-key': process.env.API_KEY
//             },
//         })
//         .then((responseData) => {
//             res.json(responseData.data.data);
//         })
//         .catch((err) => {
//             //console.log(err);
//             res.json({
//                 error: true,
//                 message: "Error Fetching Prices Data From my API, profile",
//                 errorDetails: err,
//             });
//         });
// });
// /*Control error */
// app.get('/cryptos/profile', (req, res) => {
//     res.json({
//         error: true,
//         message: 'Missing Crypto Id in the API URL, profile'
//     });
// });

// /*Create API for Alls market of crypto*/
// app.get('/cryptos/market-data/:id', (req, res) => {
//     const cryptoId = req.params.id;
//     axios
//         .get(`${process.env.BASE_URL_V1}/${cryptoId}/metrics/market-data`, {
//             headers: {
//                 'x-messari-api-key': process.env.API_KEY
//             },
//         })
//         .then((responseData) => {
//             res.json(responseData.data.data);
//         })
//         .catch((err) => {
//             console.log(err);
//             res.json({
//                 error: true,
//                 message: "Error Fetching Prices Data From my API, market-data",
//                 errorDetails: err,
//             });
//         });
// });
// /*Control error */
// app.get('/cryptos/market-data', (req, res) => {
//     res.json({
//         error: true,
//         message: 'Missing Crypto Id in the API URL-market-data'
//     });
// });