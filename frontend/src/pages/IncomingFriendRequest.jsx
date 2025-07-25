import { useEffect } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTypeWriter } from "../components/typeWriter";


export const IncomingRequests = () => {
  const {
    getFriendRequestsToMe,
    friendRequestsToMe,
    isLoadingRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    setSocketListnerForNotifications,
  } = useFriendStore();

  const banner = useTypeWriter("Incoming Friend Requests", 100);

  useEffect(() => {
    setSocketListnerForNotifications();
    getFriendRequestsToMe();  
  }, []);

  if (isLoadingRequests) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-base-300 min-h-screen">
      <h2 className="text-2xl font-semibold m-10 text-center font-mono underline">{banner}</h2>
      {friendRequestsToMe.length === 0 ? (
        <p className="text-gray-600 my-5">No incoming friend requests.</p>
      ) : (
        <ul className="space-y-4 border border-primary/25
            shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.primary)] rounded-xl">
          {friendRequestsToMe.map((req) => (
            <li key={req._id} className="flex justify-between items-center p-4 rounded-xl">
              <div className="flex">
                <img 
                src={req.sender.profilePic}
                className="w-12 h-12 rounded-full"/>

                <div className="mx-3">
                <Link to={`/profile/${req.sender._id}`} className="text-blue-600 hover:underline">
                  {req.sender.name}
                </Link>
                <p className="text-sm text-gray-500">{req.sender.email}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="btn rounded-full bg-gradient-to-r from-success to-success/50
                hover:bg-gradient-to-r hover:from-success/50 hover:to-success/20 w-[40%]
                shadow-[0_0_5px_theme(colors.success),0_0_10px_theme(colors.success)] 
                hover:shadow-[0_0_10px_theme(colors.success),0_0_20px_theme(colors.success)] 
                transition duration-300 border-hidden text-success-content" 
                onClick={() => acceptFriendRequest(req._id)}>Accept</button>

                <button className="btn rounded-full bg-gradient-to-r from-error to-error/50 
                hover:bg-gradient-to-r hover:from-error/50 hover:to-error/20 w-[40%]
                shadow-[0_0_5px_theme(colors.error),0_0_10px_theme(colors.error)] 
                hover:shadow-[0_0_10px_theme(colors.error),0_0_20px_theme(colors.error)] 
                transition duration-300 border-hidden text-error-content"
                onClick={() => rejectFriendRequest(req._id)}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export const OutgoingRequests = () => {
  const { getFriendRequestsFromMe, friendRequestsFromMe, isLoadingRequests } = useFriendStore();

  useEffect(() => {
    getFriendRequestsFromMe();
  }, []);

  const text = useTypeWriter("Outgoing Friend Requests", 100);

  if (isLoadingRequests) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

 

  return (
    <div className="max-w-3xl mx-auto p-4  bg-base-300 min-h-screen">
      <h2 className="text-2xl font-semibold m-10 text-center font-mono underline">{text}</h2>
      {friendRequestsFromMe?.length === 0 ? (
        <p className="text-gray-600 my-5">No outgoing friend requests.</p>
      ) : (
        <ul className="space-y-4 border border-primary/25
            shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.primary)] rounded-xl">
          {friendRequestsFromMe?.map((req) => (
            <li key={req._id} className="flex justify-between items-center shadow-md p-4 rounded-xl">
              <div className="flex">
                <img 
                src={req.receiver.profilePic}
                className="w-12 h-12 rounded-full"/>
                <div className="mx-3">
                <Link to={`/profile/${req.receiver._id}`} className="text-blue-600 hover:underline">
                  {req.receiver.name}
                </Link>
                <p className="text-sm text-gray-500">{req.receiver.email}</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">Pending</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};