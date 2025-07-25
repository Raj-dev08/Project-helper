import { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { motion , AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MessageNotification = () => {
    const {subscribeToSocketEvents,messageNotification, setMessageNotificationToNull} = useChatStore();
    const [showPopup, setShowPopup] = useState(false);
    const navigate=useNavigate();

    useEffect(()=>{
        subscribeToSocketEvents();
    },[])

    useEffect(() => {
        if (messageNotification) {
            setShowPopup(true);
        
        const timeout = setTimeout(() => {
            setShowPopup(false);
            setMessageNotificationToNull();
        }, 2000); // show for 2 seconds

        return () => clearTimeout(timeout);
        }
    }, [messageNotification]);


    // console.log("MessageNotification",messageNotification)

    return (
    <AnimatePresence>
        {showPopup && messageNotification && (
            <motion.div className="absolute top-5 right-20 z-50 flex"
            initial={{ opacity: 0, x: 500 }}
            animate={{ opacity: showPopup ? 1:0, x: showPopup ? 0 : 500}}
            exit={{ opacity: 0, x: 500 }}
            transition={{ duration: 0.2 }}
            onClick={()=>{
            navigate("/chat")
            setShowPopup(false)
            setMessageNotificationToNull()
            }}>
            <span className='w-full bg-primary text-primary-content px-4 py-2 rounded shadow-lg animate-bounce font-mono font-semibold'>
                New message : {messageNotification?.text.slice(0,10)} {messageNotification?.text.length > 10 ? "..." : ""}
            </span>
        </motion.div>
        )}
    </AnimatePresence>
    );
};

export default MessageNotification;
