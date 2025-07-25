import { useParams } from "react-router-dom"
import { useProjectStore } from "../store/useProjectStore"
import { useGroupChatStore } from "../store/useGroupChat"

import { useEffect } from "react"
import { colorScheme } from "../components/Card"
import { Link } from "react-router-dom"
import { Link2 } from "lucide-react"
import GroupChatNotifications from "../components/GroupChatNotifications"
import VideoCallNotification from "../components/VideoCallNotification"

export const bgClassToHexMap = {
  "bg-red-500": "#ef4444",
  "bg-red-600": "#dc2626",
  "bg-red-300": "#fca5a5",
  "bg-red-400": "#f87171",

  "bg-blue-500": "#3b82f6",
  "bg-blue-600": "#2563eb",
  "bg-blue-300": "#93c5fd",
  "bg-blue-400": "#60a5fa",
  "bg-blue-800": "#1e40af",
  "bg-blue-900": "#1e3a8a",

  "bg-yellow-400": "#facc15",
  "bg-yellow-500": "#eab308",
  "bg-yellow-200": "#fde68a",
  "bg-yellow-300": "#fcd34d",

  "bg-sky-400": "#38bdf8",
  "bg-sky-500": "#0ea5e9",
  "bg-sky-300": "#7dd3fc",

  "bg-orange-500": "#f97316",
  "bg-orange-600": "#ea580c",
  "bg-orange-700": "#c2410c",
  "bg-orange-300": "#fdba74",
  "bg-orange-400": "#fb923c",

  "bg-gray-700": "#374151",
  "bg-gray-800": "#1f2937",
  "bg-gray-900": "#111827",
  "bg-gray-600": "#4b5563",
  "bg-gray-500": "#6b7280",

  "bg-indigo-600": "#4f46e5",
  "bg-indigo-700": "#4338ca",
  "bg-indigo-400": "#818cf8",
  "bg-indigo-500": "#6366f1",

  "bg-purple-700": "#6b21a8",
  "bg-purple-800": "#581c87",
  "bg-purple-400": "#a78bfa",
  "bg-purple-500": "#8b5cf6",

  "bg-cyan-700": "#0e7490",
  "bg-cyan-500": "#06b6d4",
  "bg-cyan-600": "#0891b2",

  "bg-green-400": "#4ade80",
  "bg-green-500": "#22c55e",
  "bg-green-600": "#16a34a",
  "bg-green-700": "#15803d",
  "bg-green-800": "#065f46",
  "bg-green-900": "#064e3b",

  "bg-emerald-500": "#10b981",
  "bg-emerald-600": "#059669",

  "bg-black": "#000000",
};


const ProjectView = () => {
    const {id}=useParams();
    const {clickedProjects,clickProject}=useProjectStore();
    const {setSelectedGroup,getUnreadCount,unReadMessages,joinGroupNotifications,setSocketListenersForNotification}=useGroupChatStore();//todo create the live version by creating seperate room for notifications



    useEffect(()=>{
        if(!id)return;
        clickProject(id);
    },[id])

    // console.log(unReadMessages)

    useEffect(()=>{
      if(clickedProjects){
        setSelectedGroup(clickedProjects)
        getUnreadCount(clickedProjects._id)
        joinGroupNotifications(clickedProjects._id)
        setSocketListenersForNotification()
      }
    },[clickedProjects])

    // console.log(selectedGroup)

    // console.log(clickedProjects)
    
    
  return (
     <div className="flex flex-col items-center min-h-screen bg-base-300">
      <GroupChatNotifications />
      <VideoCallNotification/>
        <div className="flex flex-row justify-between min-w-full text-blue-600">
            <div className="min-w-[25%] min-h-20  flex justify-center items-center bg-base-100 border border-primary/25 rounded-md hover:bg-base-300">
                <Link to={``}>
                    <p className="sm:text-2xl text-sm font-bold font-mono underline  hover:text-blue-400">HOME</p>
                </Link>
            </div>
            <div className="min-w-[25%] min-h-20  flex justify-center items-center bg-base-300 border border-primary/25 rounded-md hover:bg-base-100">
                <Link to={`tasks`}>
                    <p className="sm:text-2xl text-sm font-bold font-mono underline hover:text-blue-400">TASKS</p>
                </Link>
            </div>
            <div className="min-w-[25%] min-h-20  flex justify-center items-center bg-base-300 border border-primary/25 rounded-md hover:bg-base-100">
                <Link to={`issues`}>
                    <p className="sm:text-2xl text-sm font-bold font-mono underline hover:text-blue-400">ISSUES</p>
                </Link>
            </div>
            <div className="min-w-[25%] min-h-20  flex justify-center items-center bg-base-300 border border-primary/25 rounded-md hover:bg-base-100">
                <Link to={`groupchat`}>
                    <p className="sm:text-2xl text-sm font-bold font-mono underline hover:text-blue-400">
                      GROUPCHAT 
                      <sup className="sm:text-xl text-xs font-semibold font-mono text-red-700">{unReadMessages>9?"9+":unReadMessages||0}</sup>
                      </p>
                </Link>
            </div>
        </div>
      <div className="card w-full  shadow-xl mt-[20px]">
        <div className="card-body flex flex-col items-cente bg-base-300">
        <div className="flex items-center p-4">
              <img
                src={clickedProjects?.creator?.profilePic || "/avatar.png"}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
                <div className="ml-3 flex flex-col">
                  <p className="font-semibold">{clickedProjects?.creator?.name?.toUpperCase()}</p>
                  <p>{clickedProjects?.createdAt.split("T")[0]}</p>
                </div>
          </div>
          <figure className="w-full h-[300px] flex items-center justify-center">
            <img
              src={clickedProjects?.image}
              alt="Product"
              className="object-contain w-full h-full rounded-lg bg-base-100"
            />
          </figure>
        </div>

        <div className="flex justify-between gap-10 p-10">

        {clickedProjects?.contributors?.length > 0 && (
          <div className=" no-scrollbar w-full max-w-[50%] bg-base-200 rounded-xl shadow-lg overflow-scroll  border border-primary/25 max-h-[300px]">
            <h3 className="text-xl font-bold text-center py-4">Contributors</h3>
            <table className="table w-full border border-base-300">
              <thead>
                <tr className="bg-base-300 text-left">
                  <th className="p-3">Profile</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Contributions</th>
                </tr>
              </thead>
              <tbody>
                {clickedProjects.contributors.map((c) => (
                  <tr key={c._id} className="hover:bg-base-100 transition">
                    <td className="p-3">
                      <img
                        src={c.contributor?.profilePic || "/avatar.png"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="p-3 font-semibold">{c.contributor?.name}</td>
                    <td className="p-3 text-center">{c.contributionNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      <div className="flex flex-col max-w-[50%]">
      <p className="text-lg font-bold hover:text-zinc-400 hover: cursor-pointer mt-4">Tech Stack:</p>
       <div className="overflow-scroll no-scrollbar max-h-[200px] bg-base-200 border border-primary/25 rounded-xl my-3 shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.secondary)] hover:shadow-[0_0_3px_theme(colors.primary),0_0_5px_theme(colors.secondary)]">
            
            {clickedProjects?.usedLanguages.split(' ').map((el)=>{
                const color=colorScheme[el]||"bg-primary"
                const shadow=bgClassToHexMap[color.split(' ')[0]]
                return (
                    <button key={el} className={`btn ${color} min-w-10 min-h-10 m-2 rounded-full text-xl border-none`} 
                    style={{ boxShadow: `0 0 10px ${shadow}`}}>{el}</button>
                )
            })}
          </div>

          </div>
          </div>
        <div className="card-body p-10">
          <h2 className="card-title p-10 flex flex-col items-center">{clickedProjects?.name?.toUpperCase()}</h2>


          <p className="text-lg font-bold hover:text-zinc-400 hover: cursor-pointer">{clickedProjects?.description?.toUpperCase()}</p>

          
         

          <div className="flex justify-between flex-row mt-10">
            <Link className="text-lg font-mono cursor-pointer flex text-blue-600 hover:text-blue-500" to={`${clickedProjects?.githubLink}`}>
                <Link2 className="mx-2"/>Github link
            </Link>
            <p className="text-md font-semibold  hover:text-zinc-400 hover: cursor-pointer flex justify-end">{clickedProjects?.contributors.length}+ students learning this</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectView