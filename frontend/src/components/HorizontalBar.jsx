import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useFriendStore } from "../store/useFriendStore";
import { Users, Loader2 } from "lucide-react";

const HorizontalBar = () => {
  const { selectedUser, setSelectedUser , subscribeToSocketEvents} = useChatStore();
  const { getMyFriends, userFriends, isLoadingUser, userUnseenMap } = useFriendStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getMyFriends();
    subscribeToSocketEvents();
  }, []);

  const filteredUsers = showOnlineOnly
    ? userFriends.filter((user) => onlineUsers.includes(user._id))
    : userFriends;

  if (isLoadingUser) return <Loader2 />;

  return (
    <header className="w-full border-b border-base-300 flex flex-col gap-2 transition-all duration-200">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Users className="size-5" />
          <span className="font-medium text-base">Contacts</span>
        </div>
        <label className="cursor-pointer flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          Show online only
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </label>
      </div>

      <div className="overflow-x-auto w-full flex px-4 gap-4 pb-3">
        {filteredUsers?.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              flex flex-col items-center justify-center gap-1
              hover:bg-base-300 p-2 rounded-full transition
              ${selectedUser?._id === user._id ? "bg-base-300 rounded-full" : ""}
            `}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-6 rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-1 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
              {userUnseenMap[user._id] > 0 && (
                <span className="absolute -top-2 -right-3 min-w-[18px] h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center px-1 font-semibold shadow">
                  {userUnseenMap[user._id] > 9 ? "9+" : userUnseenMap[user._id]}
                </span>
              )}
            </div>
            <div className="text-xs text-center w-16 truncate">{user.name}</div>
          </button>
        ))}

        {filteredUsers?.length === 0 && (
          <div className="text-center text-zinc-500 py-4 w-full">No online users</div>
        )}
      </div>
    </header>
  );
};

export default HorizontalBar;
