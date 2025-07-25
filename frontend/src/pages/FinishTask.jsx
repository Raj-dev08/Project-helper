import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const FinishTask = () => {
  const { id: taskId } = useParams();
  const navigate = useNavigate();
  const { authUser, checkAuth } = useAuthStore();
  const { finishTask, isCreatingProjects, checkTask, task } = useProjectStore();

  const [formData, setFormData] = useState({
    text: "",
    image: ""
  });

  useEffect(() => {
    checkAuth();
    if (!authUser || !taskId) navigate(-1);
    checkTask(taskId);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setFormData({ ...formData, image: base64Image });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return toast.error("Text is required");
    if (!formData.image.trim()) return toast.error("Image is required");

    await finishTask(taskId, formData);
    navigate(-1);
  };

//   console.log(task)

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-base-300 to-secondary/20">
      <div className="border border-secondary/25 flex flex-col w-full max-w-4xl m-[10%] bg-base-100 rounded-xl shadow-[0_0_10px] shadow-secondary/25 overflow-hidden">
        <form onSubmit={handleSubmit} className="w-full p-4 sm:p-8 flex flex-col">
          
          {/* 📌 Task Info Section */}
          <div className="mb-6 border border-primary/15 bg-base-200 p-4 rounded-lg shadow-sm">
            <h2 className="text-md sm:text-xl font-bold text-secondary mb-2">TASK NAME : {task?.taskName.toUpperCase() || "Task Title"}</h2>
            <p className="text-gray-600 text-sm sm:text-md">TASK DESCRIPTION : {task?.taskDescription || "No description provided."}</p>
          </div>

          {/* 📸 Image Upload */}
          <div className="flex flex-col items-center gap-4 mx-auto max-w-[60%] my-[5%]">
            <div className="relative w-full">
              <img
                src={
                  formData.image ||
                  "https://img.freepik.com/free-vector/digital-task-completion-illustration_23-2148820219.jpg"
                }
                alt="Upload Preview"
                className="w-full object-cover rounded-sm shadow-md shadow-secondary/25 max-h-[250px]"
              />
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isCreatingProjects}
              />
            </div>
            <h1 className="sm:text-2xl text-md font-bold text-center">Upload Completion Image</h1>
            <p className="text-sm text-center text-gray-500">Click the image to upload a new one</p>
          </div>

          {/* ✍️ Completion Text */}
          <div className="form-control my-4">
            <label className="label">
              <span className="label-text font-medium">Task Completion Text</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full min-h-28 focus:outline-none"
              placeholder="Describe what you completed"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            />
          </div>

          {/* ✅ Submit */}
          <button type="submit" className="btn rounded-full bg-gradient-to-r from-primary to-secondary 
              hover:bg-gradient-to-r hover:from-primary/50 hover:to-secondary/50 w-full
              shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.secondary)] 
              hover:shadow-[0_0_10px_theme(colors.primary),0_0_20px_theme(colors.secondary)] 
              transition duration-300 border-hidden text-base-content my-6" disabled={isCreatingProjects}>
            {isCreatingProjects ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinishTask;
