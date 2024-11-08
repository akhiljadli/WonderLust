const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsyc.js");
const expressError = require("../utils/expressError.js");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new expressError(400, errMsg);
    }
    else {
      next();
    }
  }
  
//review route
//post route
//create revirw route
router.post("/",validateReview,wrapAsync(async(req,res)=>{ //post req. ayi from new.ejs
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
  
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);  //show route pe redirect ho jayega..
  }));
  
  //delete review route
  
  router.delete("/:reviewId", wrapAsync(async(req,res)=>{
  
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  }))
  
  module.exports = router;