import { useEffect, useState } from 'react';
import { useFriendStore } from '../store/useFriendStore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const { notifications, setNotificationsToNull , setNotifications} = useFriendStore();
    const [showPopup, setShowPopup] = useState(false);
    const navigate=useNavigate();

    useEffect(()=>{
        setNotifications();
    },[])

    useEffect(() => {
        if (notifications) {
            setShowPopup(true);
        
        const timeout = setTimeout(() => {
            setShowPopup(false);
            setNotificationsToNull();
        }, 3000); // show for 3 seconds

        return () => clearTimeout(timeout);
        }
    }, [notifications]);

    if (!showPopup || !notifications) return null;

    return (
        <motion.div className=" flex justify-center pt-5"
        initial={{ opacity: 0, x: 500 ,y: -100}}
        animate={{ opacity: showPopup ? 1:0, x: showPopup ? 0 : 500, y: showPopup ? 0 : -100 }}
        onClick={()=>{
            navigate("/incoming-requests")
            setShowPopup(false)
            setNotificationsToNull()
            }}>
            <span className='bg-primary text-primary-content px-4 py-2 rounded shadow-lg animate-bounce font-mono font-semibold'>📩 New friend request from {notifications?.sender?.name || "Someone"}</span>
        </motion.div>
    );
};

export default Notifications;
