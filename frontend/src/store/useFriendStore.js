import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useFriendStore = create((set) => ({
  isLoading: false,
  isLoadingRequests: false,

  clickedProfile: null,
  friendRequestsToMe: [],
  friendRequestsFromMe: [],
  userFriends: [],
  userUnseenMap:{},

  notifications: null,

  //increment the unread count for a user
  incrementUnreadCount: (friendId) => {
    set((state)=>({
      userUnseenMap:{
        ...state.userUnseenMap,
        [friendId]:( state.userUnseenMap[friendId] || 0 ) +1
      }
    }))
  }, 

  //reset unread count for a specific friend
  resetUnreadCount: (friendId) => {
    set((state)=>({
      userUnseenMap:{
        ...state.userUnseenMap,
        [friendId]:0
      }
    }))
  },
  
  // search friends
  searchProfiles: async (query) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/friends/search?search=${query}`);
      return res.data.profile; // Return directly for the component
    } catch (error) {
      console.error("Error searching profiles", error);
      toast.error(error?.response?.data?.message || "Failed to search profiles");
      return [];
    } finally {
      set({ isLoading: false });
    }
  },


  // View a user's public profile
  viewFriendProfile: async (friendId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/friends/view-profile/${friendId}`);
      set({ clickedProfile: res.data.friend });
    } catch (error) {
      console.log("Error viewing profile", error);
      toast.error(error?.response?.data?.message || "Failed to view profile");
    } finally {
      set({ isLoading: false });
    }
  },

  // Get all friends of the current user
  getMyFriends: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/friends/friends");
      set({ userFriends: res.data.friends ,userUnseenMap:res.data.unreadCounts});
    } catch (error) {
      console.log("Error getting friends", error);
      toast.error(error?.response?.data?.message || "Failed to fetch friends");
    } finally {
      set({ isLoading: false });
    }
  },

  // Get friend requests received by the current user
  getFriendRequestsToMe: async () => {
    set({ isLoadingRequests: true });
    try {
      const res = await axiosInstance.get("/friends/friend-requests/to-me");
      set({ friendRequestsToMe: res.data.friendRequests });
    } catch (error) {
      console.log("Error getting requests to me", error);
      // toast.error(error?.response?.data?.message || "Failed to fetch requests");
    } finally {
      set({ isLoadingRequests: false });
    }
  },

  // Get friend requests sent by the current user
  getFriendRequestsFromMe: async () => {
    set({ isLoadingRequests: true });
    try {
      const res = await axiosInstance.get("/friends/friend-requests/from-me");
      set({ friendRequestsFromMe: res.data.friendRequests });
    } catch (error) {
      console.log("Error getting requests from me", error);
      // toast.error(error?.response?.data?.message || "Failed to fetch requests");
    } finally {
      set({ isLoadingRequests: false });
    }
  },

  // Send a friend request
  sendFriendRequest: async (receiverId) => {
    try {
      const res = await axiosInstance.post(`/friends/send-request/${receiverId}`);
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error sending friend request", error);
      toast.error(error?.response?.data?.message || "Failed to send request");
    }
  },

  // Accept a friend request
  acceptFriendRequest: async (requestId) => {
    try {
      const res = await axiosInstance.post(`/friends/accept-request/${requestId}`);
      toast.success(res.data.message);
      set((state) => ({
        friendRequestsToMe: state.friendRequestsToMe.filter((req) => req._id !== requestId),
      }));
    } catch (error) {
      console.log("Error accepting request", error);
      toast.error(error?.response?.data?.message || "Failed to accept request");
    }
  },

  // Reject a friend request
  rejectFriendRequest: async (requestId) => {
    try {
      const res = await axiosInstance.post(`/friends/reject-request/${requestId}`);
      toast.success(res.data.message);
      set((state) => ({
        friendRequestsToMe: state.friendRequestsToMe.filter((req) => req._id !== requestId),
      }));
    } catch (error) {
      console.log("Error rejecting request", error);
      toast.error(error?.response?.data?.message || "Failed to reject request");
    }
  },

  setSocketListnerForNotifications: () => {
    const socket = useAuthStore.getState().socket;

    if(!socket)return 

    socket.off("new_friend_request")

    socket.on("new_friend_request", (friendRequest) => {
        set((state)=>({
            friendRequestsToMe: [...state.friendRequestsToMe, friendRequest ]
        }))
    })
  },

  setNotifications : ()=>{
    const socket = useAuthStore.getState().socket;

    if(!socket)return 

    socket.off("new_friend_request");

    socket.on("new_friend_request", (friendRequest) => {
      
      set({notifications : friendRequest})

    });
  },

  setNotificationsToNull : ()=>{
    set({notifications: null})
  },

  
}));
