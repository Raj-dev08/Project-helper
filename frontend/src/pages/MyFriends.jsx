import { useEffect, useState } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { Link, useNavigate } from "react-router-dom";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import { Send , UserPlus  , UserCheck, Users  } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const MyFriends = () => {
  const { userFriends, getMyFriends, isLoading } = useFriendStore();
  const [searchText,setSearchText]=useState();
  const navigate = useNavigate();
  const { setSelectedUser } = useChatStore();

  useEffect(() => {
    getMyFriends();
  }, []);

  const breakpointColumnsObj = {
    default: 3,
    1179:2,
    935: 1,
    480: 1,
  }

  let friends=userFriends
  if(searchText){
      friends=userFriends.filter((i)=>
      i.name.toLowerCase().includes(searchText.toLowerCase())||
      i.email.toLowerCase().includes(searchText.toLowerCase())
    )
  }

//   console.log(userFriends);

  return (
    <div className="p-4 max-w-full mx-auto min-h-screen bg-base-100 pt-10">
      <div className="flex justify-between mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center flex gap-3">
          <Link to="/add-friends">
            <Users className="size-7 lg:size-10"/>
          </Link>
          <p className="hidden lg:block"> My Friends</p>
          </h2>
        <div>
           <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full focus:outline-none focus:border-primary/40 transition"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex gap-9 font-mono font-semibold">
          <Link to="/incoming-requests" className="flex gap-2">
          <UserCheck/>
            <p className="hidden lg:block">Incoming requests</p>
          </Link>

          <Link to="/outgoing-requests" className="flex gap-2">
          <UserPlus />
            <p className="hidden lg:block">Outgoing requests</p>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : friends?.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">You have no friends yet.</div>
      ) : (
        <div className="mx-[10%]">
            <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                    >
            {friends?.map((friend) => (
                <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                viewport={{ once: true }}
                key={friend._id}
                className="card bg-base-100 shadow-xl border border-base-300 transition duration-300 hover:border-primary/50 "
                >
                <div className="card-body items-center text-center ">
                    <div className="p-4 cursor-pointer w-full flex flex-col items-center space-y-5"
                     onClick={()=>navigate(`/profile/${friend._id}`)}>
                        <div className="avatar">
                        <div className="w-16 rounded-full hover:shadow-[0_0_10px_theme(colors.primary),0_0_20px_theme(colors.secondary)] hover:scale-150 transition duration-300">
                            <img src={friend.profilePic || "/default-avatar.png"} alt={friend.name} />
                        </div>
                        </div>
                        <h3 className="card-title mt-2 text-2xl">{friend.name}</h3>
                        <div className="w-full space-y-4">
                            <div className="flex justify-between text-sm text-gray-500">
                                <p className="flex justify-start">Email:</p>
                                <p className="flex justify-end">{friend.email}</p>
                            </div>
                            
                            <div className="flex justify-between text-sm text-gray-500">
                                <p className="flex justify-start">Friends : {friend.friends.length}</p>
                                <p className="flex justify-end">Projects : {friend.projects.length}</p>
                            </div>
                        </div>
                    </div>

                    <motion.button 
                    initial={{ opacity: 0, scale: 0.8 , x: -100}}
                    whileInView={{ opacity: 1, scale: 1 , x: 0}}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    viewport={{ once: true }}
                    className="btn rounded-full bg-gradient-to-r from-primary to-secondary 
                    hover:bg-gradient-to-r hover:from-primary/50 hover:to-secondary/50 min-w-[40%]
                    shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.secondary)] 
                    hover:shadow-[0_0_10px_theme(colors.primary),0_0_20px_theme(colors.secondary)] 
                    transition duration-300 border-hidden text-primary-content mt-10 text-xs sm:text-lg flex"
                    onClick={() => {
                      setSelectedUser(friend);
                      navigate(`/chat`);
                    }}
                    > Message <Send className="hidden sm:flex"/></motion.button>
                </div>
                </motion.div>
            ))}
          </Masonry>
        </div>
      )}
    </div>
  );
};

export default MyFriends;
