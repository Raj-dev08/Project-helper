import { useProjectStore } from "../store/useProjectStore";
import { useEffect, useState } from "react";
import { useParams ,useNavigate, Link} from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Eye,EyeOff } from "lucide-react";
import { useTypeWriter } from "../components/typeWriter";

const ProjectTasks = () => {
  const { id } = useParams();
  const navigate=useNavigate();
  const { clickedProjects, clickProject } = useProjectStore();
  const {authUser,checkAuth}=useAuthStore();
  const [showOnlyUnfixed, setShowOnlyUnfixed] = useState(false);
  const [searchText, setSearchText] = useState("");

  const placeholder=useTypeWriter("Search tasks by name or description ...",100)
  

  useEffect(() => {
    checkAuth();
    if(!authUser)return
    if (!id) return;
    if(!clickedProjects)clickProject(id);
  }, [id]);

  let tasks = clickedProjects?.tasks || [];

  if(showOnlyUnfixed){
    tasks=tasks.filter((i)=>i.status!=="done")
  }

  if(searchText){
    tasks=tasks.filter((i)=>
      i.taskName.toLowerCase().includes(searchText.toLowerCase())||
      i.taskDescription.toLowerCase().includes(searchText.toLowerCase())
    )
  }
  // console.log(clickedProjects)

  return (
    <div className="flex flex-col items-center min-h-screen bg-base-300 px-4 py-6">
      
      <div className="flex justify-between w-full max-w-5xl mb-10 mt-3">
        <h1 className="text-3xl font-bold font-mono underline">PROJECT TASKS</h1>
      
        <button
        onClick={() => setShowOnlyUnfixed((prev) => !prev)}
        className={`btn btn-sm transition-all duration-300 ease-in-out font-semibold tracking-wide
            ${showOnlyUnfixed 
            ? "bg-primary text-base-100 hover:bg-primary/5 hover:text-primary hover:border-primary/50 border" 
            : "btn-outline btn-primary hover:bg-primary hover:text-base-100"}
        `}
        >
        {showOnlyUnfixed ? (
            <>
            <Eye className="w-4 h-4 mr-2" />
            Show All Tasks
            </>
        ) : (
            <>
            <EyeOff className="w-4 h-4 mr-2" />
            Show Pending Tasks
            </>
        )}
        </button>

      </div>

      <div className="w-full max-w-5xl mb-10 flex items-center gap-4">
        <input
          type="text"
          placeholder={placeholder}
          className="input input-bordered w-full focus:outline-none focus:border-primary/40 transition"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="card w-full max-w-5xl bg-base-100 shadow-xl border border-primary/20">
        <div className="card-body space-y-6">
          {tasks.length === 0 ? (
            <p className="text-center text-lg text-gray-500">No tasks added yet.</p>
          ) : (
            tasks.map((task, idx) => (
              <div
                key={idx}
                className="border border-primary/30 bg-base-200 rounded-xl p-4 flex flex-col gap-2 hover:shadow-[0_0_10px_theme(colors.primary)] transition-all duration-200 "
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-md sm:text-xl font-semibold text-primary underline cursor-pointer"
                  onClick={()=>navigate(`/project/solve-task/${task._id}`)}
                  >{task.taskName}</h2>
                  <div className="flex space-x-5">
                  <span
                    className={`badge text-sm px-3 py-1 ${
                      task.status === "done"
                        ? "badge-success"
                        : "badge-neutral"
                    }`}
                  >
                    {task.status?.toUpperCase() || "PENDING"}
                  </span>
                  {clickedProjects?.creator?._id.toString()==authUser?._id.toString() && (
                      <Link to={`/project/admin/task/${task._id}`}>
                        <Eye/>
                      </Link>
                    )}
                  </div>
                </div>
                {task.taskDescription && (
                  <p className="text-sm text-gray-400 font-mono">{task.taskDescription}</p>
                )}
                <p className="text-xs text-right text-gray-500 mt-1">
                  Created on: {task.createdAt?.split("T")[0]}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      {clickedProjects?.creator?._id.toString()==authUser?._id.toString() && (
        <button
          className="fixed bottom-[60px] right-6 w-14 h-14 rounded-full btn btn-secondary transition flex items-center justify-center text-2xl"
          onClick={()=>navigate('create-task')}//relative path , pushing it to the existing one
        >
          +
        </button>
      )}
    </div>
  );
};

export default ProjectTasks;
