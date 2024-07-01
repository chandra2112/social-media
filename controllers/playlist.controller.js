import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user?._id;

  if (!name || !description) {
    throw new ApiError(404, "Name and description are required");
  }
  const playlist = await Playlist.create({
    name,
    description,
    owner: userId,
    videos: [],
  });
  if (!playlist) {
    throw new ApiError(404, "something wrong while creating playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist , "playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  if (!userId) {
    throw new ApiError(404, "userId is required");
  }
  const userPlaylist = await Playlist.find({ owner: userId });
  if (!userPlaylist) {
    throw new ApiError(404, "something went wrong");
  }
  return res
    .status(200)
    .json(200, { userPlaylist }, " User playlist fetched successfully");
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!playlistId) {
    throw new ApiError(404, "playlist ID is required");
  }
  const playListById = await Playlist.findById(playlistId);

  if (!playListById) {
    throw new ApiError(404, "something went wrong");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, playListById , "playlist fetched successfully")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new ApiError(404, "Playlist Id and Video ID is required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const playlist = await Video.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.videos.includes(videoId)) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video allready exist in playlist"));
  }
  const updatePlaylist = await Playlist.updateOne(
    {
      _id: new mongoose.Types.ObjectId(playlistId),
    },
    {
      $push: {
        videos: videoId,
      },
    }
  );
  if (!updatePlaylist) {
    throw new ApiError(404, "Not able to add video to playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200,  updatePlaylist , "Video added in playlist "));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!playlistId || !videoId) {
    throw new ApiError(404, "Playlist Id and Video ID is required");
  }
  const removeVideo = await Playlist.findOneAndUpdate(
    playlistId,
    {
        $pull:{
            videos:videoId
        }

    },
    {new:true}
  )
  if (!condition) {
    throw new ApiError(404, "Not able to remove video to playlist");
    
  }
  return res
  .status(200)
  .json(new ApiResponse(200,removeVideo,"Video removed form playlist"))

});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!playlistId) {
    throw new ApiError(404, "Playlist Id is required");
  }
  const Playlist = await Playlist.findOneAndDelete(playlistId)

  if (!Playlist) {
    throw new ApiError(404, "unable to delete Playlist");
  }
  return res
  .status(200)
  .json(new ApiResponse(200,Playlist,"playlist deleted"))

});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  if (!playlistId) {
    throw new ApiError(404, "Playlist Id is required");
  }
  if (!name || !description) {
    throw new ApiError(404, "Name and description are required");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
        $set:{
            name,
            description
        }
    },
    {new:true}
  )
  if (!updatedPlaylist) {
    throw new ApiError(404, "Something went wrong while updating ");

    
  }
  return res
  .status(200)
  .json(new ApiResponse(200,updatedPlaylist,"Name and description updated successfully"))



});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
