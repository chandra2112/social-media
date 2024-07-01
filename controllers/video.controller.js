import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  if (!userId) {
    throw new ApiError(400, "please provide user id");
  }
  const video = await Video.find({ owner: userId });
  if (!video) {
    throw new ApiError(400, "something went wrong");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "video fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "title and description required");
  }
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  const videolLocalPath = req.files?.videoFile[0]?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file required");
  }
  if (!videolLocalPath) {
    throw new ApiError(400, "Video file required");
  }
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  const video = await uploadOnCloudinary(videolLocalPath);

  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail file required");
  }
  if (!video) {
    throw new ApiError(400, "Video file required");
  }

  const uploadVideo = await Video.create({
    videoFile: video?.url,
    thumbnail: thumbnail?.url,
    title,
    description,
    duration: video?.duration,
    owner: req.user?._id,
  });

  if (!uploadVideo) {
    throw new ApiError(400, "something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { uploadVideo }, "uploaded successfully "));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!videoId) {
    throw new ApiError(400, "please provide video id");
  }
  const videoDetalis = await Video.findById(videoId);
  if (!videoDetalis) {
    throw new ApiError(400, "video not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoDetalis, " video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  //TODO: update video details like title, description, thumbnail
  if (!videoId) {
    throw new ApiError(400, "Invalid videoID");
  }

  if (!title || !description) {
    throw new ApiError(400, "title and description is required");
  }
  const thumbnail = req.file?.path;
  if (!thumbnail) {
    throw new ApiError(400, "Video file is missing");
  }
  const upload = await uploadOnCloudinary(thumbnail);

  if (!upload.url) {
    throw new ApiError(400, "Error while uploading  ");
  }
  const oldThumbnail = req.user?.thumbnail;
  await deleteOnCloudinary(oldThumbnail);

  const updateVideoDetails = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.url,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(200, { updateVideoDetails }, "video details update successfully");
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Invalid videoID");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  if (video.videoFile) {
    await deleteOnCloudinary(video.videoFile.key);
  }
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Invalid videoID");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found");
  }
  video.isPublished = !video.isPublished;
  await video.save();

  return res.status(200).json(200, {}, "video status change successfully");
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
