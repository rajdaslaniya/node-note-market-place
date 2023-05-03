require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT_NO || 3001;
const cors = require("cors");

app.use(express.json());
app.use(cors());

//Routes
const authRouter = require("./src/router/authRouter");
const countryRouter = require("./src/router/manageCountryRouter");
const categoryRouter = require("./src/router/manageCategoryRouter");
const noteTypesRouter = require("./src/router/manageNoteTypesRouter");
const noteRouter = require("./src/router/noteRouter");

app.use("/v1/auth", authRouter);
app.use("/v1/admin/country", countryRouter);
app.use("/v1/admin/category", categoryRouter);
app.use("/v1/admin/types", noteTypesRouter);
app.use("/v1/note", noteRouter);

app.listen(port, () => console.log(`Server is listening on port ${port}...`));
