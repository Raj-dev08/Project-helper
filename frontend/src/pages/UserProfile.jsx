import { useFriendStore } from "../store/useFriendStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useTypeWriter } from "../components/typeWriter";

export default function UserProfile() {
  const { id } = useParams();
  const { clickedProfile, viewFriendProfile, isLoading , sendFriendRequest } = useFriendStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const admin=useTypeWriter(` Admin : ${clickedProfile?.isAdmin ? "Yes" : "No"}`,200)
  const friends = useTypeWriter(` Friends : ${clickedProfile?.friends?.length || 0}`,200);
  const projects = useTypeWriter(` Projects : ${clickedProfile?.projects?.length || 0}`,200);
  const joined = useTypeWriter(` Joined : ${new Date(clickedProfile?.createdAt).toLocaleDateString()}`,200);

  useEffect(() => {
    if (id === authUser?._id) {
      navigate("/profile");
    } else {
      viewFriendProfile(id);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl min-h-screen flex justify-center items-center">
      {clickedProfile ? (
        <div className="card bg-base-300 shadow-xl p-10 rounded-lg w-full">
          <div className="card-body items-center text-center">
            <div className="avatar">
              <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={clickedProfile?.profilePic} alt="Profile" />
              </div>
            </div>
            <h2 className="card-title text-4xl mt-4 font-mono">{clickedProfile?.name}</h2>
            <p className="text-sm text-gray-500">{clickedProfile?.email}</p>
            <div className="mt-4 space-y-2 text-sm text-left w-full max-w-sm flex flex-col">

                <span className="font-semibold font-mono text-xl">{admin}</span>
                {/* {clickedProfile?.isAdmin ? "Yes" : "No"} */}
            
                <span className="font-semibold font-mono text-xl">{friends}</span>

                <span className="font-semibold font-mono text-xl">{projects}</span>

                <span className="font-semibold font-mono text-xl">{joined}</span>


            </div>

            {!clickedProfile?.friends.includes(authUser._id) && (
                <div className="mt-6 flex justify-center">
                    <button className="btn rounded-full bg-gradient-to-r from-primary to-secondary 
                    hover:bg-gradient-to-r hover:from-primary/50 hover:to-secondary/50
                    shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.secondary)] 
                    hover:shadow-[0_0_10px_theme(colors.primary),0_0_20px_theme(colors.secondary)] 
                    transition duration-300 border-hidden text-base-content"
                        onClick={() => sendFriendRequest(clickedProfile?._id)}
                    >
                        SEND FRIEND REQUEST
                    </button>
                </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center mt-10">
          <h2 className="text-xl font-bold text-error">User not found</h2>
        </div>
      )}
    </div>
  );
}
