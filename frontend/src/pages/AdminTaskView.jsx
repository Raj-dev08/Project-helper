import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import { Loader2 } from "lucide-react";

const renderLinkedText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;


  const parts = text.split(urlRegex);

  return parts.map((part, i) =>
    /^https?:\/\/[^\s]+$/.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline break-all hover:text-blue-500"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};


const AdminTaskView = () => {
  const { id: taskId } = useParams();
  const navigate = useNavigate();
  const { authUser, checkAuth } = useAuthStore();
  const { checkTask, task , resolveTask , isChecking } = useProjectStore();

  useEffect(() => {
    checkAuth();
    if (!authUser || !taskId) navigate(-1);
    checkTask(taskId);
  }, []);

  console.log(task)

  return (
    <div className="min-h-screen flex justify-center items-start py-10 bg-gradient-to-br from-base-300 to-primary/10 px-4">
      <div className="w-full max-w-5xl border border-primary/20 rounded-lg shadow-md bg-base-100 p-6">
        {/* Task Info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">{task?.taskName || "Task Title"}</h1>
          <p className="mt-2 text-gray-600">{task?.taskDescription || "No description provided."}</p>
          <div className="flex justify-between my-2">
            <p className="text-xl font-bold text-primary">Status</p>
            <span className={`min-w-12 rounded-badge text-center px-3
            text-md text-primary-content font-semibold ${task?.status==="done"?"bg-error":"bg-primary"}
            `}>{task?.status}</span>
          </div>
          {task?.solvedBy && (
            <div className="flex items-center justify-between my-4 border border-primary/25 p-2 rounded-lg">
              <p className="text-xl font-bold text-base-content ">SolvedBy</p>
              <div className="flex items-center gap-4 mb-4">
                    <img
                      src={task?.solvedBy?.profilePic || "https://via.placeholder.com/150"}
                      alt="User"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <h3 className="font-semibold">{task?.solvedBy?.name}</h3>
                      <p className="text-sm text-gray-500">{task?.solvedBy?.email}</p>
                    </div>
                  </div>

          </div>
          )}
        </div>

        {/* Submissions */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Submissions</h2>
          {task?.submittedBy?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {task.submittedBy.map((submission, index) => (
                <div key={index} className="bg-base-200 border border-primary/15 p-4 rounded-lg shadow-sm">
                  {/* Submitter Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-full w-10 h-10 bg-primary items-center justify-center flex font-bold text-mono text-primary-content cursor-pointer hover:bg-secondary hover:text-secondary-content">
                        {index+1}
                    </div>
                    <img
                      src={submission.submittedById?.profilePic || "https://via.placeholder.com/150"}
                      alt="User"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <h3 className="font-semibold">{submission.submittedById?.name}</h3>
                      <p className="text-sm text-gray-500">{submission.submittedById?.email}</p>
                    </div>
                  </div>

                  {/* Submission Content */}
                  <div className="mb-2">
                    <h4 className="font-medium mb-1 text-secondary">Completion Text:</h4>
                    <p className="text-base-content text-sm break-words">
                        {submission.text ? renderLinkedText(submission.text) : "No text submitted."}
                    </p>

                  </div>

                  {submission.image && (
                    <div className="mt-3">
                      <h4 className="font-medium mb-1 text-secondary">Submitted Image:</h4>
                      <img
                        src={submission.image}
                        alt="Submitted"
                        className="w-full max-h-64 object-contain rounded border border-base-300"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-center m-3">
                    {task?.status==="pending" && (
                       <button className="btn bg-gradient-to-r from-green-600 to-green-400 text-black w-[40%] 
                        hover:bg-gradient-to-r hover:from-green-500 hover:to-green-300
                        shadow-[0_0_10px_#22c55e] hover:shadow-[0_0_2px_#22c55e] border-none"
                        onClick={()=>resolveTask(task._id,submission.submittedById._id)}
                        disabled={isChecking}>{ isChecking?(
                          <Loader2/>
                        ):"Accept"}</button>
                    )}
                   
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-8">No one has submitted this task yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTaskView;
