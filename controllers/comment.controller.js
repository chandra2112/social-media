import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  const userId = req.user?._id;

  if (!content) {
    throw new ApiError(400, "Comment content is Required");
  }
  if (!videoId) {
    throw new ApiError(400, "Invalid videoId");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found!");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(201, { comment }, "commnet added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user?._id;

  if (!content) {
    throw new ApiError(400, "Comment content is Required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "comment id not found");
  }
  if (comment.owner.toString() !== userId) {
    throw new ApiError(
      403,
      "you do not have permission to update this comment"
    );
  }

  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );
  if (!updateComment) {
    throw new ApiError(400, "something went wrong while updating commnet");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { updateComment }, "commnet update successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "comment id not found");
  }
  if (comment.owner.toString() !== userId) {
    throw new ApiError(
      403,
      "you do not have permission to delete this comment"
    );
  }
  const deleteComment = await Comment.findByIdAndDelete(commentId);
  if (!deleteComment) {
    throw new ApiError(400, "something went wrong whike deleting comment");
  }

  return res.status(200).json(new ApiResponse(200, {}, "delete successfully"));
});

const getVideoComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limt = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(400, "video id not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "video doesn't exists");
  }

  const allComment = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $project: {
        content: 1,
      },
    },
  ]);

  if (!allComment) {
    throw new ApiError(500, "something went wrong");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { allComment }, " all commnet fetched successfully")
    );
});

export { addComment, updateComment, deleteComment, getVideoComment };
