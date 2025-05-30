import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "../libs/axiosInstance";

export const usePlaylistStore = create((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  playlistCount: null,
  error: null,

  createPlaylist: async (playlistData) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post(
        "/playlist/create",
        playlistData
      );

      set((state) => ({
        playlists: [...state.playlists, response.data.data],
      }));

      toast.success("Playlist created successfully");
      return response.data.data;
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast.error(error.response?.data?.error || "Failed to create playlist");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getAllPlaylists: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/playlist");
      set({ playlists: response.data.data });
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast.error("Failed to fetch playlists");
    } finally {
      set({ isLoading: false });
    }
  },

  getPlaylistDetails: async (playlistId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(`/playlist/${playlistId}`);
      set({ currentPlaylist: response.data.data });
    } catch (error) {
      console.error("Error fetching playlist details:", error);
      toast.error("Failed to fetch playlist details");
    } finally {
      set({ isLoading: false });
    }
  },

  addProblemToPlaylist: async (playlistId, problemIds) => {
    try {
      set({ isLoading: true });
      await axiosInstance.post(`/playlist/${playlistId}/add-problem`, {
        problemIds,
      });

      toast.success("Problem added to playlist");

      // Refresh the playlist details
      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }
    } catch (error) {
      console.error("Error adding problem to playlist:", error);
      toast.error("Failed to add problem to playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  removeProblemFromPlaylist: async (playlistId, problemId) => {
    try {
      set({ isLoading: true });
      await axiosInstance.delete(
        `/playlist/delete-playlist-problem/${playlistId}`,
        {
          data: {
            problemIds: [problemId], // यहां problemIds भेज रहे हैं
          },
        }
      );

      toast.success("Problem removed from playlist");

      // Refresh the playlist details
      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }
    } catch (error) {
      console.error("Error removing problem from playlist:", error);
      toast.error("Failed to remove problem from playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (playlistId) => {
    console.log(playlistId);

    try {
      set({ isLoading: true });
      const response = await axiosInstance.delete(
        `/playlist/delete-playlist/${playlistId}`
      );
      console.log(response);
      set((state) => ({
        playlists: state.playlists.filter((p) => p.id !== playlistId),
      }));

      toast.success("Playlist deleted successfully");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error("Failed to delete playlist");
    } finally {
      set({ isLoading: false });
    }
  },
  getPlaylistCount: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/playlist/get-playlist-count");
      set({ playlistCount: response.data.data.count });
    } catch (error) {
      console.error("Error fetching playlist count:", error);
      toast.error("Failed to fetch playlist count");
    } finally {
      set({ isLoading: false });
    }
  },
}));
