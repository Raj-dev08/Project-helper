import { useState, useEffect } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { motion } from "framer-motion";
import { UserPlus , Send} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddFriends = () => {
  const { searchProfiles, sendFriendRequest, isLoading } = useFriendStore();
  const {authUser,checkAuth}=useAuthStore()
  const { setSelectedUser } = useChatStore();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const navigate=useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    const profiles = await searchProfiles(searchText);
    setResults(profiles);
  };
  
  useEffect(()=>{
    checkAuth();
  },[checkAuth])

//   console.log(authUser)

  return (
    <div className="p-4 max-w-full mx-auto min-h-screen bg-base-100 pt-10">
      <h2 className="text-3xl font-bold mb-10 text-center">Add Friends</h2>
      <div className="flex justify-center mb-6">
        <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or email"
          className="input input-bordered w-full max-w-md focus:outline-none focus:border-primary/40 transition"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : results?.length === 0 && searchText ? (
        <div className="text-center text-gray-500 mt-10">No users found.</div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-[10%] ${results?.length>0?"border border-primary/25":""} p-10 rounded-badge`}>
          {results?.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="card bg-base-100 shadow-xl border border-base-300 hover:border-primary/50 transition duration-300"
            >
              <div className="card-body items-center text-center">
                <div className="avatar">
                  <div className="w-16 rounded-full cursor-pointer">
                    <img src={user.profilePic || "/default-avatar.png"} alt={user.name} onClick={()=>navigate(`/profile/${user._id}`)} />
                  </div>
                </div>
                <h3 className="card-title mt-2 cursor-pointer" onClick={()=>navigate(`/profile/${user._id}`)}>{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>

                {!authUser.friends.includes(user._id)?   (

                    <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="btn rounded-full bg-gradient-to-r from-primary to-secondary mt-5
                    hover:bg-gradient-to-r hover:from-primary/50 hover:to-secondary/50 
                    shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.secondary)] 
                    transition duration-300 border-hidden text-primary-content flex gap-2"
                    onClick={() => sendFriendRequest(user._id)}
                    >
                    Add Friend <UserPlus />
                    </motion.button>
                ):(
                    <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="btn rounded-full bg-gradient-to-r from-primary to-secondary mt-5
                    hover:bg-gradient-to-r hover:from-primary/50 hover:to-secondary/50 
                    shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.secondary)] 
                    transition duration-300 border-hidden text-primary-content flex gap-2"
                    onClick={() => {
                        setSelectedUser(user._id)
                        navigate(`/chat`);
                        }
                    }
                    >
                    Message <Send className="hidden sm:flex"/>
                    </motion.button>
                )}
                
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddFriends;
