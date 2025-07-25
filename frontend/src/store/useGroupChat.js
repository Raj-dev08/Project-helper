import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useGroupChatStore = create((set, get) => ({
  messages: [],
  hasMoreMessages: true,
  selectedGroup: null,
  isMessagesLoading: false,
  isSendingMessage: false,
  isEditingMessage: false,
  typingUsers: [],
  unReadMessages:0,
  groupNotifications:null,
  videoCallNotification:null,

  setGroupNotificationsToNull: () => { 
    set({groupNotifications:null})
  },

  setVideoCallNotificationsToNull: ()=>{
    set({videoCallNotification:null})
  },

  // Clear chat data (e.g. on group switch)
  refreshMessages: () => {
    set({ messages: [], hasMoreMessages: true });
  },

  // Set selected group chat
  setSelectedGroup: (group) => set({ selectedGroup: group }),

  // Fetch messages with pagination
  getMessages: async (groupId, limit = 100, before) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get( `/groupchat/get/${groupId}?limit=${limit}&before=${before}`);

      const existingMessages = new Set(get().messages.map((m) => m._id));
      const newMessages = res.data.messages.filter((m) => !existingMessages.has(m._id));

      set((state) => ({
        messages: [...newMessages, ...state.messages],
        hasMoreMessages: res.data.hasMore,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a new message
  sendMessage: async (data) => {
    set({ isSendingMessage: true });
    try {
      const { selectedGroup, messages } = get();
      const res = await axiosInstance.post(`/groupchat/send/${selectedGroup._id}`, data);
      const newMsg = res.data.message;

      set({ messages: [...messages, newMsg] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      set({ isSendingMessage: false });
    }
  },

  // Edit existing message
  editMessage: async (messageId, payload) => {
    set({ isEditingMessage: true });
    try {
      const res = await axiosInstance.put(`/groupchat/edit/${messageId}`, payload);
      const updated = res.data.updatedMessage;

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? updated : msg
        ),
      }));

      toast.success(res.data.message)
    } catch (err) {
      console.log(err)
      toast.error(err.response?.data?.message || "Failed to edit message");
    } finally {
      set({ isEditingMessage: false });
    }
  },

  // Delete message
  deleteMessage: async (messageId) => {
    try {
      const res=await axiosInstance.delete(`/groupchat/delete/${messageId}`);
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
      toast.success(res.data.message||"message deleted successfully")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete message");
    }
  },

  // Get unread count
  getUnreadCount: async (groupId) => {
    try {
      const res = await axiosInstance.get(`/groupchat/unread/${groupId}`);
      set({unReadMessages:res.data.unreadCount}); 
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  },

  // SOCKET: join group room
  joinGroupChat: () => {
    const { selectedGroup } = get();
    const socket = useAuthStore.getState().socket;
    if (!socket || !selectedGroup) return;
    socket.emit("joinGroup", selectedGroup._id);
  },

  //SOCKET: join for notification
  joinGroupNotifications: (id) => {
    const socket = useAuthStore.getState().socket;
    if (!socket || !id) return;
    socket.emit("joinedGroupNotification",id)
  },


  setSocketListenersForNotification : () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("new_message_notification")
    socket.off("videoCallStarted")

    socket.on("new_message_notification",(msg)=>{
      set({groupNotifications:msg})
      set((state)=>({
        unReadMessages:(state.unReadMessages || 0) + 1
      }))
    })

    socket.on("videoCallStarted",(message)=>{
      console.log("works")
      console.log(message)
      set({videoCallNotification:message})
    })


  },

  // SOCKET: listen for new message
  setSocketListeners: () => {
    const socket = useAuthStore.getState().socket;
    // console.log("socket",socket)
    if (!socket) return;

    socket.off("new_message");

    socket.on("new_message", (message) => {
      const { selectedGroup, messages } = get();

      if (message.groupId !== selectedGroup?._id) return;

      const authUser = useAuthStore.getState().authUser;


      if (message.senderId !== authUser._id) {
        socket.emit("message_notification", { groupId: message.groupId, msg: message });
        socket.emit("message_seen", { message, id: authUser._id });
      }


      set({ messages: [...messages, message] });
    });

    socket.off("message_seen_byUser")

    socket.on("message_seen_byUser", ({ message }) => {
      const { messages } = get();

      const updatedMessages = messages.map((msg) =>
        msg._id === message._id ? message : msg
      );

      set({ messages: updatedMessages });
      set({unReadMessages:0})
    });


    socket.off("message_deleted");

    socket.on("message_deleted", ({ messageId }) => {
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    });

    socket.off("message_edited");
    socket.on("message_edited", (updatedMessage) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        ),
      }));
    });
  },

  // SOCKET: typing indicators
  setTypingListeners: () => {

    const socket = useAuthStore.getState().socket;
    const { selectedGroup } = get();
    if (!socket || !selectedGroup) return;

    socket.on("userTyping", ({ from }) => {
      const { typingUsers } = get();

      if (!typingUsers.some(u => u._id === from._id)) {
        set({ typingUsers: [...typingUsers, from] });
      }
    });

    socket.on("userStoppedTyping", ({ from }) => {
      const { typingUsers } = get();
      set({
        typingUsers: typingUsers.filter((u) => u._id !== from._id),
      });
    });
  },
}));
