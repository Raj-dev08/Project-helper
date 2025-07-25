import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { Loader2, CheckCheck, EllipsisVertical, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import EditMessage from "./EditMessage";
import { Popover } from "@headlessui/react";
import { Link } from "react-router-dom";

const SCROLL_THRESHOLD = 100;

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    hasMoreMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToSocketEvents,
    refreshMessages,
    setTypingIndicator,
    typingUsers,
    deleteMessage,
  } = useChatStore();

  const { socket, authUser } = useAuthStore();
  const containerRef = useRef(null);
  const limit = 10;

  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(null);

  useEffect(() => {
    if (!selectedUser) return;
    refreshMessages();
    getMessages(selectedUser._id, limit, Date.now());
    subscribeToSocketEvents();
    setTypingIndicator();
  }, [selectedUser]);

  useEffect(() => {
    const unseen = messages.filter(
      (msg) => !msg.isSeen && msg.senderId === selectedUser._id
    );
    unseen.forEach((msg) => {
      socket.emit("message_seen", { message: msg });
    });
  }, [messages.length]);

  const handleScroll = async () => {
    if (!containerRef.current || isMessagesLoading) return;

    const scrollTop = containerRef.current.scrollTop;

    if (scrollTop < SCROLL_THRESHOLD && hasMoreMessages) {
      const oldest = messages[0];
      const before = oldest?.createdAt;

      const oldHeight = containerRef.current.scrollHeight;

      await getMessages(selectedUser._id, limit, before);

      const newHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTop = newHeight - oldHeight + scrollTop;
    }
  };

  useEffect(() => {
    if (!containerRef.current || isMessagesLoading) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages.length, typingUsers.length]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ scrollbarWidth: "thin" }}
      >
        {isMessagesLoading && (
          <div className="text-center py-2 text-sm opacity-70">
            <Loader2 className="animate-spin mx-auto" />
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat ${
              msg.senderId === selectedUser._id ? "chat-start" : "chat-end"
            } ${
              editedMessage?._id === msg._id ? "border border-primary/25 rounded" : ""
            }`}
          >
            <div className="chat-bubble max-w-[60%] relative">
              <div className="flex justify-between mb-1">
                <p className="text-sm font-bold text-red-600">
                  {msg.senderId === authUser._id ? "You" : selectedUser.name}
                </p>
                {msg.isEdited && (
                  <p className="text-xs text-gray-500 mx-2">(Edited)</p>
                )}

                {msg.senderId === authUser._id && (
                  <Popover className="relative">
                    <Popover.Button className="p-1 hover:bg-base-200 rounded">
                      <EllipsisVertical className="size-4" />
                    </Popover.Button>

                    <Popover.Panel className="absolute right-0 mt-1 w-28 z-50 bg-base-100 border rounded-md shadow-md p-1 text-sm">
                      <Popover.Button
                        as="button"
                        onClick={() => {
                          setIsEditing(true);
                          setEditedMessage(msg);
                        }}
                        className="block w-full text-left px-2 py-1 hover:bg-base-300 rounded"
                      >
                        ✏️ Edit
                      </Popover.Button>

                      <Popover.Button
                        as="button"
                        onClick={() => deleteMessage(msg._id)}
                        className="block w-full text-left px-2 py-1 hover:bg-base-300 text-red-500 rounded"
                      >
                        🗑 Delete
                      </Popover.Button>
                    </Popover.Panel>
                  </Popover>
                )}
              </div>

              <p className="text-sm font-semibold">{msg.text}</p>

              {msg.image && (
                <img
                  src={msg.image}
                  alt="Attachment"
                  className="max-w-[200px] rounded-md mt-2"
                />
              )}

              <div className="flex justify-between mt-1 text-xs opacity-50">
                <p>
                  <CheckCheck
                    className={`size-4 ${
                      msg.senderId === authUser._id ? "" : "hidden"
                    } ${msg.isSeen ? "text-blue-500" : "text-gray-400"}`}
                  />
                </p>
                <p>{new Date(msg.createdAt).toLocaleTimeString().slice(0, 5)}</p>
              </div>
            </div>
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div key={selectedUser._id} className="chat chat-start">
            <div className="chat-bubble">
              <div className="flex items-center gap-1 mt-2">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      animationDuration: "1.4s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {isEditing ? (
        <EditMessage
          msg={editedMessage}
          setEditedMessage={setEditedMessage}
          setIsEditing={setIsEditing}
          mode="single"
        />
      ) : (
        <MessageInput mode="chat" />
      )}
    </div>
  );
};

export default ChatContainer;
