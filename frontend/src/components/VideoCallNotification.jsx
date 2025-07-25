import { useEffect, useState } from 'react';
import { useGroupChatStore } from '../store/useGroupChat';
import { motion , AnimatePresence } from 'framer-motion';

const VideoCallNotification = () => {
    const {VideoCallNotification, setVideoCallNotificationsToNull} = useGroupChatStore();
    const [showPopup, setShowPopup] = useState(false);

    useEffect(()=>{
        setVideoCallNotificationsToNull();
    },[])

    useEffect(() => {
        if (VideoCallNotification) {
            setShowPopup(true);
        
        const timeout = setTimeout(() => {
            setShowPopup(false);
            setVideoCallNotificationsToNull();
        }, 2000); // show for 2 seconds

        return () => clearTimeout(timeout);
        }
    }, [VideoCallNotification]);


    // console.log("GroupNotifications",groupNotifications)

    return (
    <AnimatePresence>
        {showPopup && VideoCallNotification && (
            <motion.div className="absolute top-5 right-20 z-50 flex"
            initial={{ opacity: 0, x: 500 }}
            animate={{ opacity: showPopup ? 1:0, x: showPopup ? 0 : 500}}
            exit={{ opacity: 0, x: 500 }}
            transition={{ duration: 0.2 }}
            onClick={()=>{
            setShowPopup(false)
            setVideoCallNotificationsToNull()
            }}>
                <div className='flex bg-primary text-primary-content  px-4 py-2 rounded shadow-lg animate-bounce gap-3'>
                    {VideoCallNotification}
                </div>
            
        </motion.div>
        )}
    </AnimatePresence>
    );
};

export default VideoCallNotification;
