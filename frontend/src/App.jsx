import { Routes, Route ,Navigate,useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { MessageCirclePlus  } from "lucide-react"

import { useAuthStore } from "./store/useAuthStore"
import { useChatStore } from "./store/useChatStore"
import { useThemeStore } from "./store/useThemeStore"

import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import CreateProject from "./pages/CreateProject"
import ExplorePage from "./pages/ExplorePage"
import ProjectView from "./pages/ProjectView"
import ProjectTasks from "./pages/ProjectTasks"
import CreateTask from "./pages/CreateTask"
import FinishTask from "./pages/FinishTask"
import AdminTaskView from "./pages/AdminTaskView"
import ProjectIssues from "./pages/ProjectIssue"
import RaiseIssue from "./pages/RaiseIssue"
import GroupChat from "./pages/GroupChat"
import HomePage from "./pages/HomePage"
import Messages from "./pages/MessagePage"
import UserProfile from "./pages/UserProfile"
import { IncomingRequests } from "./pages/IncomingFriendRequest"
import { OutgoingRequests } from "./pages/IncomingFriendRequest"
import Notifications from "./components/Notifications"
import MyFriends from "./pages/MyFriends"
import ProfilePage from "./pages/ProfilePage"
import EditProject from "./pages/EditProject"
import CallPage from "./pages/CallPage"
import NavBar from "./components/NavBar"
import MobileNavBar from "./components/MobileNavBar"
import AddFriends from "./pages/AddFriends"
import VideoCallScheduler from "./pages/VideoCallScheduler"
import SettingsPage from "./pages/SettingsPage"

import { Toaster } from "react-hot-toast"
import { Loader } from "lucide-react"


function App() {
  const { authUser, isCheckingAuth ,checkAuth} = useAuthStore();
  const { getUnreadCount}=useChatStore();
  const { theme }=useThemeStore();
  const navigate=useNavigate()
  const [unReadMessages,setUnReadMessages]=useState()
  const location=useLocation();


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  useEffect(()=>{
    if(authUser){
      const unread=getUnreadCount()
      setUnReadMessages(unread)
    }
  },[getUnreadCount,authUser])


  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

    // console.log(theme)
  return (
    <div data-theme={theme}> 
        <Toaster position="top-right" reverseOrder={false} />
        <Notifications />

        <div className={`${location.pathname==="/"?"hidden":"hidden xl:block"} `}>
          <NavBar/>
           <div className={`${(location.pathname=="/chat" || location.pathname.includes("project") || location.pathname.includes("call"))? "hidden":""} bg-primary rounded-full fixed bottom-10 right-48 w-24 h-24 flex items-center justify-center cursor-pointer hover:bg-primary/50`}
            onClick={()=>navigate("/chat")}>
              <MessageCirclePlus  className="size-10 text-primary-content"/>
              {unReadMessages && (
                <sup className="sm:text-xl text-xs font-semibold font-mono text-red-700">{ unReadMessages.value == 0 ? "" : unReadMessages}</sup>
              )}
          </div>
        </div>

        <div className={`${location.pathname==="/"?"":" xl:mt-[80px]"} mt-[50px] max-w-8xl xl:mb-0`}>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/"/>} />
            <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>} />
            <Route path="/create-project" element={authUser?<CreateProject/>:<Navigate to="/login"/>}/>
            <Route path="/explore" element={authUser?<ExplorePage/>:<Navigate to="/login"/>}/>
            <Route path="/project/:id" element={authUser?<ProjectView/>:<Navigate to="/login"/>}/>
            <Route path="/project/:id/tasks" element={authUser?<ProjectTasks/>:<Navigate to="/login"/>}/>
            <Route path="/project/:id/tasks/create-task" element={authUser?<CreateTask/>:<Navigate to="/login"/>}/>
            <Route path="/project/solve-task/:id" element={authUser?<FinishTask/>:<Navigate to="/login"/>}/>
            <Route path="/project/admin/task/:id" element={authUser?<AdminTaskView />:<Navigate to="/login"/>} />
            <Route path="/project/:id/issues" element={authUser?<ProjectIssues/>:<Navigate to="/login"/>}/>
            <Route path="/project/:id/issues/raise-issue" element={authUser?<RaiseIssue/>:<Navigate to="/login"/>}/>
            <Route path="/project/:id/groupchat" element={authUser?<GroupChat/>:<Navigate to="/login"/>}/>
            <Route path="/profile/:id" element={authUser?<UserProfile/>:<Navigate to="/login"/>}/>
            <Route path="/incoming-requests" element={authUser?<IncomingRequests/>:<Navigate to="/login"/>}/>
            <Route path="/outgoing-requests" element={authUser?<OutgoingRequests/>:<Navigate to="/login"/>}/>
            <Route path="/my-friends" element={authUser?<MyFriends/>:<Navigate to="/login"/>}/>
            <Route path="/chat" element={authUser?<Messages/>:<Navigate to="/login"/>}/>
            <Route path="/profile" element={authUser?<ProfilePage/>:<Navigate to="/login"/>}/>
            <Route path="/edit" element={authUser?<EditProject/>:<Navigate to="/login"/>}/>
            <Route path="/call/:id" element={authUser?<CallPage/>:<Navigate to="/login"/>}/>
            <Route path="/call/:id/schedule" element={authUser?<VideoCallScheduler/>:<Navigate to="/login"/>}/>
            <Route path="/add-friends" element={authUser?<AddFriends/>:<Navigate to="/login"/>}/>
            <Route path="/settings" element={<SettingsPage/>}/>
        </Routes>

       

      </div>
      <div className="xl:hidden">
        <MobileNavBar/>
      </div>
      

      <div className={`${(location.pathname=="/chat" || location.pathname.includes("project") || location.pathname.includes("call"))? "hidden":""} bg-primary rounded-full fixed bottom-[80px] right-[40px] w-14 h-14 flex items-center justify-center xl:hidden`}
        onClick={()=>navigate("/chat")}>
          <MessageCirclePlus  className={`${location.pathname=="/chat"?"hidden":""} size-10 text-primary-content`}/>
          {unReadMessages && (
            <sup className="sm:text-xl text-xs font-semibold font-mono text-red-700">{ unReadMessages.value == 0 ? "" : unReadMessages}</sup>
          )}
      </div>

    </div>
    
  )
}

export default App