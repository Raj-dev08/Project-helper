import { useChatStore } from "../store/useChatStore"

import ChatContainer from "../components/ChatContainer"
import SideBar from "../components/SideBar"
import HorizontalBar from "../components/HorizontalBar"
import MessageNotification from "../components/MessageNotification"

const Messages = () => {
  const { selectedUser } = useChatStore();
  
  return (
    <div className="h-screen bg-base-200">
      <MessageNotification/>
    <div className="flex items-center justify-center xl:pt-3 px-4">
      <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl xl:h-[calc(100vh-(0.75rem+80px))] h-[calc(100vh-100px)]">
        <div className="flex h-full rounded-lg overflow-hidden flex-col xl:flex-row">

          <div className="hidden xl:block">
            <SideBar/>
          </div>
          <div className="block xl:hidden">
            <HorizontalBar/>
          </div>


          {!selectedUser ? "": <ChatContainer />}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Messages