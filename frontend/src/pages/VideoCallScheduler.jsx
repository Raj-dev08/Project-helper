import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const VideoCallScheduler = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // project ID from URL
  const { scheDuleVideoCall } = useAuthStore();

  const [data, setData] = useState({
    roomId:id,
    title: "",
    startTime: 1, // in minutes
  });

  const [isScheduling, setIsScheduling] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsScheduling(true);
      await scheDuleVideoCall(data);
      toast.success("Video call scheduled successfully");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule call");
    } finally {
      setIsScheduling(false);
    }
  };

  const validateForm = () => {
    if (!data.title.trim()) return toast.error("Title is required");
    if (!data.startTime || isNaN(data.startTime))
      return toast.error("Start time must be a number");
    if (data.startTime <= 0 || data.startTime > 1440)
      return toast.error("Time must be between 1 and 1440 minutes");
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-base-300 to-primary/20">
      <div className="border border-primary/25 flex flex-col w-full max-w-lg p-8 bg-base-100 rounded-xl shadow-[0_0_10px] shadow-primary/25 overflow-hidden">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Schedule Video Call
        </h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Call Title</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full focus:outline-none"
              placeholder="Enter meeting title"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Start Time (minutes)</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full focus:outline-none"
              placeholder="Time in minutes (1 - 1440)"
              value={data.startTime}
              onChange={(e) => setData({ ...data, startTime: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={isScheduling}
          >
            {isScheduling ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Scheduling...
              </>
            ) : (
              "Schedule Call"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoCallScheduler;
