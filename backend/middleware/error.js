import ErrorHandler from "../utils/errorhandler.js";

const errorMiddleware =  (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";


    //Wrong MongoDB ID Error CAST ERROR GAVE A LOT OF problem and might continue to give more so the comment is to how to handle it(for me)
    if(err.name == "CastError"){
        const message = `Resource not found. Invalid :${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //Mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }


    //Wrong JWT error
    if(err.name == "JsonWebTokenError"){
        const message = `Json web token is invalid , try again`;
        err = new ErrorHandler(message,400);
    }

    //JWT Expire error
    if(err.name == "TokenExpiredError"){
        const message = `Json web token is Expired, try again`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success : false,
        message: err.message, // change to .stack to see error location
    });
};

export default errorMiddleware;