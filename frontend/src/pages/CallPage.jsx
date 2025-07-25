import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";

import { Loader } from "lucide-react";


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser,isCheckingAuth,callHandler}=useAuthStore();



  useEffect(() => {
    const initCall = async () => {

       const callToken = await callHandler();

       console.log("Call token:", callToken);
   

      if (!callToken?.token || !authUser || !callId) return;

      try {
        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: callToken.token,
        });

        const callInstance = videoClient.call("default", callId);

        if (callInstance?.currentUser) {
        try {
            await callInstance.leave(); // leave if already somehow joined
        } catch (e) {
            console.warn("Not previously joined, safe to ignore");
        }
        }

        await callInstance.join({ create: true ,audio:false,video:false,publish:false});

        console.log("Joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    return () => {
        const end=async () => {
            await call?.leave();
            await client?.disconnectUser();
        }
        end();
      
    };
  }, []);

  if (isCheckingAuth || isConnecting) return(
    <div className="min-h-screen flex justify-center items-center">
      <Loader/>
    </div>
  )
   

  return (
    <div className="h-screen flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full bg-base-100 shadow-lg rounded-lg overflow-hidden p-10">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    const navigate = useNavigate();

    useEffect(() => {
        if (callingState === CallingState.LEFT) navigate(-1);
    }, [callingState, navigate]);

    return (
        <StreamTheme>
        <SpeakerLayout />
        <CallControls />
        </StreamTheme>
    );
};

export default CallPage;