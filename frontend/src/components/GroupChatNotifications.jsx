import { useEffect, useState } from 'react';
import { useGroupChatStore } from '../store/useGroupChat';
import { motion , AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GroupChatNotifications = () => {
    const {groupNotifications, setGroupNotificationsToNull} = useGroupChatStore();
    const [showPopup, setShowPopup] = useState(false);
    const navigate=useNavigate();

    useEffect(()=>{
        setGroupNotificationsToNull();
    },[])

    useEffect(() => {
        if (groupNotifications) {
            setShowPopup(true);
        
        const timeout = setTimeout(() => {
            setShowPopup(false);
            setGroupNotificationsToNull();
        }, 2000); // show for 2 seconds

        return () => clearTimeout(timeout);
        }
    }, [groupNotifications]);


    // console.log("GroupNotifications",groupNotifications)

    return (
    <AnimatePresence>
        {showPopup && groupNotifications && (
            <motion.div className="absolute top-5 right-20 z-50 flex"
            initial={{ opacity: 0, x: 500 }}
            animate={{ opacity: showPopup ? 1:0, x: showPopup ? 0 : 500}}
            exit={{ opacity: 0, x: 500 }}
            transition={{ duration: 0.2 }}
            onClick={()=>{
            navigate("groupchat")
            setShowPopup(false)
            setGroupNotificationsToNull()
            }}>
                <div className='flex bg-primary text-primary-content  px-4 py-2 rounded shadow-lg animate-bounce gap-3'>
                    <img className='size-8 rounded-full object-cover' src={groupNotifications?.senderId?.profilePic || "/avatar.png"} alt="Group" />
                    <span className='w-full font-mono font-semibold'>
                        {groupNotifications?.senderId?.name} : {groupNotifications?.text.slice(0,10)} {groupNotifications?.text.length > 10 ? "..." : ""}
                    </span>
                </div>
            
        </motion.div>
        )}
    </AnimatePresence>
    );
};

export default GroupChatNotifications;
