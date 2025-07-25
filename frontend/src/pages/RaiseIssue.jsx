import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStore } from "../store/useProjectStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const RaiseIssue = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { authUser, checkAuth } = useAuthStore();
  const { clickedProjects, clickProject, raiseIssue, isCreatingProjects } = useProjectStore();

  const [formData, setFormData] = useState({
    issueName: "",
    issueDescription: ""
  });

  useEffect(() => {
    checkAuth();
    if (!authUser) navigate(-1);
    if (!projectId) navigate(-1);
    if (!clickedProjects) clickProject(projectId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.issueName.trim() || !formData.issueDescription.trim()) {
      toast.error("All fields are required");
      return;
    }
    await raiseIssue(projectId, formData);
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-tl from-base-300 to-primary/40 px-4 py-8">
      <div className="card w-full max-w-2xl bg-base-100 border border-primary/20 shadow-[2px_2px_5px_theme(colors.primary),2px_2px_7px_theme(colors.secondary)]">
        <div className="card-body">
          <h1 className="text-2xl font-bold mb-4 text-center">Raise New Issue</h1>

          <form onSubmit={handleSubmit} className="p-2">
            <div className="my-5">
              <label className="block mb-3 font-medium">Issue Name</label>
              <input
                type="text"
                className="input input-bordered w-full focus:outline-none focus:shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.secondary)]"
                value={formData.issueName}
                onChange={(e) => setFormData({ ...formData, issueName: e.target.value })}
                placeholder="Enter issue title"
              />
            </div>

            <div className="my-5">
              <label className="block mb-3 font-medium">Issue Description</label>
              <textarea
                className="textarea textarea-bordered w-full focus:outline-none focus:shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.secondary)] no-scrollbar"
                value={formData.issueDescription}
                onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                placeholder="Describe the issue..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn rounded-full bg-gradient-to-r from-primary to-secondary 
              hover:bg-gradient-to-r hover:from-primary/50 hover:to-secondary/50
              shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.secondary)] 
              hover:shadow-[0_0_10px_theme(colors.primary),0_0_20px_theme(colors.secondary)] 
              transition duration-300 border-hidden text-base-content w-full mt-[30px]"
              disabled={isCreatingProjects}
            >
              {isCreatingProjects ? (<span className="flex">
                <Loader2/>"Submitting..."
                </span>) : "Raise Issue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RaiseIssue;
