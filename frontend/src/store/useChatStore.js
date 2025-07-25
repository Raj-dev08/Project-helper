import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import {useFriendStore} from "./useFriendStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  selectedUser: null,
  isMessagesLoading: false,
  isSendingMessages: false,
  typingUsers: [],
  hasMoreMessages: true,
  isEditingMessageForUser: false,
  messageNotification:null,

  setMessageNotificationToNull: () => {
    set({messageNotification:null})
  },

  refreshMessages: () => {
    set({ messages: [], hasMoreMessages: true });
  },

  setSelectedUser: (user) => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;
    const friendStore = useFriendStore.getState();

    friendStore.resetUnreadCount(user._id);

    if (!socket) return;

    if(user) {
      socket.emit("joinUserMessageRoom", user?._id, authUser._id);
    }

    set({ selectedUser:user });
  },

  setSelectedUserToNull:(selectedUser,authUser)=>{
    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    socket.emit("leaveUserMessageRoom", selectedUser?._id, authUser._id);

    set({ selectedUser: null, messages: [], hasMoreMessages: true });
  },

  getMessages: async (id, limit = 30, before = null) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/get/messages/${id}?limit=${limit}&before=${before}`);

      const existing = new Set(get().messages.map((msg) => msg._id));
      const newMessages = res.data.messages.filter((msg) => !existing.has(msg._id));

      set((state) => ({
        messages: [...newMessages, ...state.messages],
        hasMoreMessages: res.data.hasMore,
      }));
      

    } catch (err) {
      console.error("Get messages error", err);
      toast.error(err?.response?.data?.message || "Could not load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessageUser: async (data) => {
    set({ isSendingMessages: true });
    try {
      const { selectedUser, messages } = get();
      const res = await axiosInstance.post(`/message/send/messages/${selectedUser._id}`, data);

      set({ messages: [...messages, res.data.message] });
    } catch (err) {
      console.error("Send message error", err);
      toast.error(err?.response?.data?.message || "Failed to send message");
    } finally {
      set({ isSendingMessages: false });
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/message/delete/messages/${messageId}`);
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
      toast.success("Message deleted");
    } catch (err) {
      console.error("Delete message error", err);
      toast.error(err?.response?.data?.message || "Failed to delete message");
    }
  },

  editMessageUser: async (messageId, data) => {
    set({ isEditingMessageForUser: true });
    try {
      const res = await axiosInstance.put(`/message/edit/messages/${messageId}`, data);
      const updated = res.data.message;

      set((state) => ({
        messages: state.messages.map((msg) => (msg._id === updated._id ? updated : msg)),
      }));

      toast.success("Message edited");
    } catch (err) {
      console.error("Edit message error", err);
      toast.error(err?.response?.data?.message || "Failed to edit message");
    }
    finally{
      set({isEditingMessageForUser: false});
    }
  },

  getUnreadCount: async (id) => {
    try {
      const res = await axiosInstance.get(`/message/get/messages/unread-count/${id}`);
      return res.data.unreadCount;
    } catch (err) {
      console.error("Unread count error", err);
    }
  },

  subscribeToSocketEvents: () => {
    const socket = useAuthStore.getState().socket;
    // const { selectedUser } = get();


    if (!socket) return;

    // Remove existing listeners
    socket.off("new_message");
    socket.off("message_edited");
    socket.off("message_deleted");
    socket.off("message_seen_byUser");

    //set store
    const friendStore=useFriendStore.getState();

    // On new message
    socket.on("new_message", (msg) => {
      const {selectedUser}=get();
      if(!selectedUser || msg.senderId !== selectedUser._id){
        set({messageNotification:msg})
        // console.log("New message received:", msg);
        // console.log("New message from another user:", msg);
        friendStore.incrementUnreadCount(msg.senderId);
        return ;
      }
      

      socket.emit("message_seen", {
        message: msg,
      });

      set((state) => ({ messages: [...state.messages, msg] }));           
    });


    socket.on("message_seen_byUser", ({ message }) => {
      // console.log("Message seen by user:", message);
      const { selectedUser } = get();

      // console.log("message seen by user", message)
      // console.log("selectedUser", selectedUser)

      if (message.receiverId !== selectedUser._id) return;

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === message._id ? message : { ...msg, isSeen: true }
        ),
      }));
    });

    // On edit
    socket.on("message_edited", (updated) => {
      set((state) => ({
        messages: state.messages.map((msg) => (msg._id === updated._id ? updated : msg)),
      }));
    });

    // (Optional) emit on delete if you add it on backend
    socket.on("message_deleted", (id) => {
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== id),
      }));
    });
  },

  setTypingIndicator: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();

    if (!socket || !selectedUser) return;

    socket.on("userTypingToUser", ({ from }) => {
      if (from !== selectedUser._id) return;
      set({ typingUsers: [from] });
    });

    socket.on("userStoppedTypingToUser", () => {
      set({ typingUsers: [] });
    });
  },
}));
