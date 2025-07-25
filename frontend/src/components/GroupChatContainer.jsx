import { useEffect, useRef ,useState} from "react";
import { useGroupChatStore } from "../store/useGroupChat";
import { useAuthStore } from "../store/useAuthStore";
import GroupChatHeader from "./GroupChatHeader";
import MessageInput from "./MessageInput";
import EditMessage from "./EditMessage";
import { Loader2 , EllipsisVertical , CheckCheck, X } from "lucide-react";
import { Link,useParams } from "react-router-dom";
import { Popover } from "@headlessui/react";
import {useProjectStore} from "../store/useProjectStore"

const SCROLL_THRESHOLD = 100;

const GroupChatContainer = () => {
  const {
    messages,
    getMessages,
    deleteMessage,
    hasMoreMessages,
    isMessagesLoading,
    selectedGroup,
    joinGroupChat,
    setSocketListeners,
    refreshMessages,
    typingUsers,
    setTypingListeners
  } = useGroupChatStore();

  const {clickedProjects , clickProject}=useProjectStore();
  const { id }=useParams();
  const { authUser, checkAuth } = useAuthStore();
  const containerRef = useRef(null);
  const [isEditing,setIsEditing]=useState(false);
  const [editedMessage,setEditedMessage]=useState();
  const [infoMessage, setInfoMessage] = useState(null);
  const [selectedMessage,setSelectedMessage]=useState(null);

  const limit = 10;

  useEffect(() => {
    if (!selectedGroup) return;
    if(!clickedProjects)clickProject(id);
    refreshMessages();
    checkAuth();
    getMessages(selectedGroup._id, limit, Date.now());
    joinGroupChat();
    setSocketListeners();
    setTypingListeners();
  }, [selectedGroup]);

  const handleScroll = async () => {
    if (!containerRef.current || isMessagesLoading) return;

    const scrollTop = containerRef.current.scrollTop;
    if (scrollTop < SCROLL_THRESHOLD && hasMoreMessages) {
      const oldest = messages[0];
      const before = oldest?.createdAt;
      const oldHeight = containerRef.current.scrollHeight;

      await getMessages(selectedGroup._id, limit, before);

      const newHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTop = newHeight - oldHeight + scrollTop;
    }
  };

  useEffect(() => {
    if (!containerRef.current || isMessagesLoading) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages.length,typingUsers.length]);

  // console.log(messages)
  // console.log(clickedProjects)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <GroupChatHeader />

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
              msg.senderId._id === authUser._id ? "chat-end" : "chat-start"}
              ${editedMessage?._id === msg?._id||selectedMessage?._id === msg?._id?"border border-primary/25 rounded-lg":""}`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  src={msg.senderId.profilePic || "/i.png"}
                  alt="Profile"
                />
              </div>
            </div>
            <div className="chat-bubble">
             
                <div className="cursor-pointer flex justify-between">
                    <Link to={`/profile/${msg.senderId._id}`}>
                        <p className="text-sm font-bold text-red-600">{msg?.senderId?.name?.toUpperCase()}</p>
                    </Link>
                    {msg.isEdited?(
                      <p className="text-xs text-base-content/30">(Edited)</p>
                    ):""}
                    <Popover className={` ${msg.senderId._id!==authUser._id?"hidden":"relative"}`}>
                    <Popover.Button className="p-1 hover:bg-base-200 rounded">
                        <EllipsisVertical className="size-4" />
                    </Popover.Button>

                    <Popover.Panel className="absolute right-0 mt-1 w-28 z-50 bg-base-100 border-none rounded-md shadow-md p-1 text-sm">
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
                        className="block w-full text-left px-2 py-1 hover:bg-base-300 rounded text-red-500"
                      >
                        🗑 Delete
                      </Popover.Button>

                      <Popover.Button
                      as="button"
                      onClick={() =>{
                         setInfoMessage(msg)
                         setSelectedMessage(msg)
                      }}
                      className="block w-full text-left px-2 py-1 hover:bg-base-300 rounded"
                    >
                      ℹ Info
                    </Popover.Button>


                    </Popover.Panel>
                    </Popover>

                </div>


              
              <p className="text-sm font-semibold pr-2">
                {msg?.text}
              </p>
              {msg?.image && (
                <img
                  src={msg?.image}
                  alt="Attachment"
                  className="max-w-[200px] rounded-md mt-2"
                />
              )}

              <span className="text-xs opacity-50 flex justify-between  mt-1">
                <p>
                <CheckCheck className={`size-4 ${msg?.senderId._id===authUser._id?"":"hidden"}
                   ${msg.readBy.length ===((clickedProjects?.contributors?.length )+ 1)?"text-blue-600":""}`}/>
                </p>
                <p>
                  {new Date(msg?.createdAt).toLocaleTimeString().slice(0,5)}
                </p>
              </span>
            </div>
            
          </div>
        ))}

        {typingUsers
          .filter((u) => u._id !== authUser._id)
          .map((u) => (
            <div key={u._id} className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img src={u.profilePic || "/i.png"} alt="Profile" />
                </div>
              </div>
              <div className="chat-bubble">
                <Link to={`/profile/${u._id}`}>
                  <p className="text-sm font-bold text-red-600 underline cursor-pointer">
                    {u.name}
                  </p>
                </Link>
                <div className="flex items-center gap-1 mt-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: "1.4s"
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}

          {infoMessage && (
            <div className="fixed inset-0 z-50 flex items-end bg-black/30">
              <div className="w-full bg-base-100 rounded-t-xl p-4 max-h-[60%] overflow-y-auto animate-slide-up shadow-xl">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-bold text-lg">Seen by</h2>
                  <button
                    onClick={() =>{
                       setInfoMessage(null)
                       setSelectedMessage(null)
                    }}
                    className="text-sm text-red-500 underline flex"
                  >
                    <X className="size-7"/>
                  </button>
                </div>

            {infoMessage.readBy.filter(u => u._id !== authUser._id).length === 0 ? (
              <p className="text-sm text-gray-500 italic">No one has seen this message yet.</p>
            ) : (
                    infoMessage.readBy
                      .filter(u => u._id !== authUser._id)
                      .map((user) => (
                        <div key={user._id} className="flex items-center gap-3 py-2">
                          <img
                            src={user.profilePic}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm font-medium">{user.name}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

      </div>
      {isEditing?(
        <EditMessage 
        msg={editedMessage} 
        setEditedMessage={setEditedMessage}
        setIsEditing={setIsEditing}
        mode="group"/>
      ):(
        <MessageInput mode="group" />
      )}
    </div>
  );
};

export default GroupChatContainer;
