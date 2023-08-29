import express from "express";
import product from "./routes/productRoute.js";
import user from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.js";
//Cigratte k nashe m mai chur rehta hu
//Aur teri jaisi randi se m dur rehta hu

const app = express();

//Route imports

app.use(express.json()); //Used it For Just console log when json req.body was undefined (can be removed)
app.use(express.urlencoded({ extended: true })); //same as above but it is for form(can be removed)
app.use(cookieParser());
app.use("/api/v1", product);
app.use("/api/v1",user);

//Middleware for Errors

app.use(errorMiddleware);

export default app;
