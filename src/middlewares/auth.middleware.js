// we are making to get the access of the user in logout function
// instead of returning user , we are adding user in req body
// then pass to next middleware with next

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookie?.accessToken ||
            req.header("Authrization")?.replace("Bearer ", "");
        // the user mignt call with header call , so we handel that to

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).remove("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "invalid Access TOken");
        }
        console.log("req.body", req.body);
        req.user = user;
        console.log("req.body", req.body);
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
        // this can be 501
    }
});