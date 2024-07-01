import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user?._id;

  const channelStats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: _id,
        foreignField: "video",
        as: "Likes",
      },
    },
    {
      $lookup: {
        from: "subcription",
        localField: "owner",
        foreignField: "channel",
        as: "Subscribers",
      },
    },
    {
      $group: {
        _id: null,
        totalVideo: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalSubscribers: { $first: { $size: "$Subscribers" } },
        totalLikes: { $first: { $size: "$Likes" } },
      },
    },
    {
      $project: {
        _id: 0,
        totalVideo: 1,
        totalViews: 1,
        totalSubscribers: 1,
        totalLikes: 1,
      },
    },
  ]);
  if (!channelStats) {
    throw new ApiError(500, "unable to fetch channel");
  }
  return res.staus(200).json(new ApiResponse(200,channelStats,"channel stats fetch successfully"))
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userId = reg.user?._id

  const videos = await Video.findById({owner:userId})

  if (!videos || videos.length ===0) {
    return res.staus(200).json(new ApiResponse(200,{},"No video uploaded by this channel"))

    
  }
  return res.staus(200).json(new ApiResponse(200,{videos}," All video uploaded by this channel fetch"))

  
});

export { getChannelStats, getChannelVideos };
