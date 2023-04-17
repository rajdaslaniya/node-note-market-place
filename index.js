require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT_NO || 3001;
const cors = require("cors");

app.use(express.json());
app.use(cors());

//Routes
const authRouter = require("./src/router/authRouter");
app.use("/v1/auth", authRouter);

app.listen(port, () => console.log(`Server is listening on port ${port}...`));
