import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const userId = req.user._id;

  if (!videoId) {
    throw new ApiError(400, "Invalid video ID");
  }

  const existingLike = await Like.findOne({ videoId, userId });

  if (existingLike) {
    await existingLike.remove();
    return res
      .status(200)
      .json(new ApiResponse(200, "Like removed successfully"));
  } else {
    const newLike = new Like({ videoId, userId });
    await newLike.save();
    return res
      .status(201)
      .json(new ApiResponse(201, "Like added successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  const userId = req.user._id;

  if (!commentId) {
    throw new ApiError(400, "Invaild comment ID");
  }
  const existingLike = await Like.findOne({ commentId, userId });

  if (existingLike) {
    await existingLike.remove();
    return res
      .status(200)
      .json(new ApiResponse(200, "Like removed successfully"));
  } else {
    const newLike = new Like({ commentId, userId });
    await newLike.save();
    return res
      .status(201)
      .json(new ApiResponse(201, "Like added successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  const userId = req.user._id;

  if (!tweetId) {
    throw new ApiError(400, "Invaild tweet ID");
  }
  const existingLike = await Like.findOne({ tweetId, userId });

  if (existingLike) {
    await existingLike.remove();
    return res
      .status(200)
      .json(new ApiResponse(200, "Like removed successfully"));
  } else {
    const newLike = new Like({ tweetId, userId });
    await newLike.save();
    return res
      .status(201)
      .json(new ApiResponse(201, "Like added successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user._id;

  const likes = await Like.find({ userId }).populate("videoId");

  const likedVideos = likes.map((like) => like.videoId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Liked videos retrieved successfully", likedVideos)
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
