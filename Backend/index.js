require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = new express();
const WebSocket = require("ws");
const router = require("./routes/routes");

app.use(express.json());
app.use(cors());
app.use("/api", router);

app.listen(process.env.PORT, () => {
  console.log("Server running at port:" + process.env.PORT);
});

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (message) => {
    console.log(`Received message: ${message}`);
    
    // Send a response back to the client
    server.clients.forEach((client)=>{
      if(client !== socket  && client.readyState===WebSocket.OPEN)
      {
        client.send("hi" +message);
      }
    })
  });

});

mongoose.connect(process.env.DB_URL, () => {
  console.log("Db connected");
});
