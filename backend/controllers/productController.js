import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ApiFeatures from "../utils/apifeatures.js";

// Create Product -- Admin
export const createProduct = catchAsyncErrors(async (req, res, next) => {

  req.body.user = req.user.id 

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//Get All Product
export const getAllProducts = catchAsyncErrors(async (req, res) => {


  const resultPerPage = 5;

  const productCount = await Product.countDocuments();
  const apifeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter().pagination(resultPerPage);
  const product = await apifeatures.query;

  res.status(200).json({
    success: true,
    product,
    productCount
  });
});

//Get Product Details

export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//Update Product --Admin

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//Delete One Product -- Admin

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  await product.deleteOne(); // .remove() was not working dont know why but the usable function to delete now is this one

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

//Create or update the review
export const createProductReview = catchAsyncErrors( async (req,res,next) => {

  const {rating,comment,productId} = req.body;
  const review = {
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = Product.reviews.find(rev => rev.user.toString() === req.user._id.toString());

  if(isReviewed){
    product.review.forEach((rev) => {
      if(rev.user.toString() === req.user._id.toString())
      (rev.rating = rating),
      (rev.comment = comment)
    }
    )

  }else{
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg=0;
  product.ratings = products.reviews.forEach(rev => {
    avg=avg+rev.rating
  })/product.reviews.length;

  await product.save({ validateBeforeSave : false});
  res.status(200).json({
    success:true,
  })
});

//Get All Reviews of a Product
export const getProductReviews = catchAsyncErrors(async (req,res,next) =>{
  const product = await Product.findById(req.query.id);

  if(!product) {
    return next(new ErrorHandler("Product not found",404));
  }

  res.status(200).json({
    success:true,
    reviews: product.reviews,
  });
});

//Delete Review

export const deleteReview = catchAsyncErrors( async (req,res,next) =>{
  const product = await Product.findById(req.query.productId);

  if(!product) {
    return next(new ErrorHandler("Product not found",404));
  }

  const review = product.reviews.filter( rev => rev._id.toString() !== req.query.id.toString());

  let avg=0;
  product.ratings = products.reviews.forEach(rev => {
    avg=avg+rev.rating
  });

  const ratings = avg/review.length;

  const numOfReviews = reviews.length;

  await product.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,
    numOfReviews,
  },{
    new:true,
    runValidators:true,
    useFindAndModify:false
  });


  res.status(200).json({
    success:true,
  });
})

