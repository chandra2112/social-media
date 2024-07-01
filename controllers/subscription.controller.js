import mongoose, {isValidObjectId} from "mongoose"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "express-async-handler"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const userId = req.user._id; // assuming req.user is populated with the authenticated user's info

    // Validate channelId
    if (!channelId) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Check if the subscription already exists
    const existingSubscription = await Subscription.findOne({ channel: channelId, subscriber: userId });

    if (existingSubscription) {
        // If the subscription exists, remove it (toggle off)
        await existingSubscription.remove();
        return res.status(200).json(new ApiResponse(200, "Subscription removed successfully"));
    } else {
        // If the subscription does not exist, create a new subscription (toggle on)
        const newSubscription = new Subscription({ channel: channelId, subscriber: userId });
        await newSubscription.save();
        return res.status(201).json(new ApiResponse(201, "Subscription added successfully"));
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!channelId) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Find all subscribers of the specified channel
    const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber');

    // Extract subscriber details
    const subscriberList = subscribers.map(subscription => subscription.subscriber);

    return res.status(200).json(new ApiResponse(200, "Subscriber list retrieved successfully", subscriberList));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!subscriberId) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    // Find all subscriptions of the specified user
    const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate('channel');

    // Extract channel details
    const channelList = subscriptions.map(subscription => subscription.channel);

    return res.status(200).json(new ApiResponse(200, "Subscribed channels retrieved successfully", channelList));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}