import { useAuthStore } from "../store/useAuthStore"
import { useGroupChatStore } from "../store/useGroupChat"
import GroupChatContainer from "../components/GroupChatContainer"
import { useEffect } from "react"
import { Navigate,useNavigate } from "react-router-dom"

const GroupChat = () => {
    const { selectedGroup }=useGroupChatStore();
    const { authUser }=useAuthStore();
    const navigate=useNavigate();

    useEffect(()=>{
        if(!selectedGroup){
            navigate(-1)
        }

        const isCreator = selectedGroup?.creator._id.toString()===authUser._id.toString();

        const isContributor = selectedGroup?.contributors.some((c)=>c.contributor._id.toString()===authUser._id.toString())

        if(!isCreator&&!isContributor){
            navigate("/explore")
        }
    },[selectedGroup,authUser])

    if(!selectedGroup){
        navigate(-1)
    }

    // console.log(selectedGroup)

    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-10 px-4">
            <div className="bg-base-300 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-(3rem+80px))]">
                <div className="flex h-full rounded-lg overflow-hidden">


                {selectedGroup && <GroupChatContainer />}
                </div>
            </div>
            </div>
        </div>
    )
}

export default GroupChat