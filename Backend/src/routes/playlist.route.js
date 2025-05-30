import { Router } from "express";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  deleteProblemFromPlaylist,
  getAllListDetail,
  getPlaylistCount,
  getPlayListDetails,
} from "../controller/playlist.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const route = Router();

route.post("/create", isLoggedIn, createPlaylist);
route.get("/get-playlist-count", isLoggedIn, getPlaylistCount);
route.get("/", isLoggedIn, getAllListDetail);
route.get("/:playlistId", isLoggedIn, getPlayListDetails);
route.post("/:playlistId/add-problem", isLoggedIn, addProblemToPlaylist);
route.delete("/delete-playlist/:playlistId", isLoggedIn, deletePlaylist);
route.delete(
  "/delete-playlist-problem/:playlistId",
  isLoggedIn,
  deleteProblemFromPlaylist
);

export default route;
