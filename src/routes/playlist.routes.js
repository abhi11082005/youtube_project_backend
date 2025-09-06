import { Router } from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist } from "../controllers/playlist.controller.js";

const playlistRouter=Router()
playlistRouter.use(authMiddleware)

playlistRouter.route("/")
.post(createPlaylist)

playlistRouter.route("/videoupdate")
.get(getPlaylistById)   
.post(addVideoToPlaylist)
.delete(removeVideoFromPlaylist)

playlistRouter.route("/playlistupdate")
.post(updatePlaylist)
.delete(deletePlaylist)

export default playlistRouter