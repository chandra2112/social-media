import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import { json } from "express";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { userId } = req.user?._id;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Tweet content is required");
  }

  const createtweet = await Tweet.create({
    content,
    owner: userId,
  });
  if (!createtweet) {
    throw new ApiError(400, "Something wrong while creating tweet");
  }
  return res.status(200).json(new ApiResponse(200, "created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "Invaild userId");
  }
  const user = User.findById(userId);

  if (!user) {
    throw new ApiError(400, "user not found!");
  }
  const usertweet = await Tweet.find({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, { usertweet }, "Tweet fetech successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  const content = req.body;
  const { tweetId } = req.params;

  if (!content) {
    throw new ApiError(400, "Tweet content is required");
  }

  if (!tweetId) {
    throw new ApiError(400, "TweetId is required");
  }

  const updateTweet = Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );
  if (!updateTweet) {
    throw new ApiError(400,"something went wrong while updating")
    
  }
  return res
  .status(200)
  .json(new ApiResponse(200,{updateTweet},"Tweet updated successfully"))
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  if (!tweetId) {
    throw new ApiError(400, "TweetId is required");
    
  }
  const deleteTweet = await Tweet.findByIdAndDelete(tweetId)

  if (!deleteTweet) {
    throw new ApiError(400, "something wrong while deleting Tweet");
    
  }
  return res
  .status(200)
  .json(new ApiResponse(200,{},"Tweet deleted successfully"))
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
