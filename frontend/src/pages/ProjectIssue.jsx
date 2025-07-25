import { useProjectStore } from "../store/useProjectStore";
import { useEffect , useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Check, Eye, EyeOff } from "lucide-react";
import { useTypeWriter } from "../components/typeWriter";

const ProjectIssues = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clickedProjects, clickProject ,resolveIssue} = useProjectStore();
  const { authUser, checkAuth } = useAuthStore();
  const [showOnlyUnfixed, setShowOnlyUnfixed] = useState(false);
  const [searchText, setSearchText] = useState("");

  const text=useTypeWriter("Search issues by name or description...",100)



  useEffect(() => {
    checkAuth();
    if (!authUser) return;
    if (!id) return;
    if (!clickedProjects) clickProject(id);
  }, [id]);

  let issues = clickedProjects?.issues|| [];

  if(showOnlyUnfixed){
    issues=issues.filter((i)=>!i.isFixed)
  }

  if(searchText){
    issues=issues.filter((i)=>
      i.issueName.toLowerCase().includes(searchText.toLowerCase())||
      i.issueDescription.toLowerCase().includes(searchText.toLowerCase())
    )
  }
  // console.log(issues)

  return (
    <div className="flex flex-col items-center min-h-screen bg-base-300 px-4 py-6">

      <div className="flex justify-between w-full max-w-5xl mb-10 mt-3">
        <h1 className="text-3xl font-bold font-mono underline">PROJECT ISSUES</h1>
      
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
            Show All Issues
            </>
        ) : (
            <>
            <EyeOff className="w-4 h-4 mr-2" />
            Show Only Unfixed
            </>
        )}
        </button>

      </div>

      <div className="w-full max-w-5xl mb-10 flex items-center gap-4">
        <input
          type="text"
          placeholder={text}
          className="input input-bordered w-full focus:outline-none focus:border-primary/40 transition"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      

      <div className="card w-full max-w-5xl bg-base-100 shadow-xl border border-primary/20">
        <div className="card-body space-y-6">
          {issues.length === 0 ? (
            <p className="text-center text-lg text-gray-500">No issues raised yet.</p>
          ) : (
            issues.map((issue, idx) => (
              <div
                key={idx}
                className="border border-primary/30 bg-base-200 rounded-xl p-4 flex flex-col gap-2 hover:shadow-[0_0_10px_theme(colors.primary)] transition-all duration-200"
              >
                 <div className="flex items-center gap-4 mb-4">
                    <img
                      src={issue.raisedBy?.profilePic || "https://via.placeholder.com/150"}
                      alt="User"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <h3 className="font-semibold">{issue.raisedBy?.name.toUpperCase()}</h3>
                    </div>
                  </div>

                <div className="flex justify-between items-center">
                  <h2
                    className="text-md sm:text-xl font-semibold text-primary underline cursor-pointer"
                  >
                    {issue.issueName}
                  </h2>
                  <div className="flex space-x-5 items-center">
                    <span
                      className={`badge text-sm px-3 py-1 ${
                        issue.isFixed
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {issue.isFixed?"Fixed":"Broken"}
                    </span>
                    {( clickedProjects?.creator?._id.toString() ===
                      authUser?._id.toString() && !issue.isFixed)&& (
                        <span className="badge badge-success text-sm px-3 py-1 cursor-pointer"
                        onClick={()=>resolveIssue(clickedProjects._id,issue._id)}>
                            Fix <Check/>
                        </span>
                    )}
                  </div>
                </div>
                {issue.issueDescription && (
                  <p className="text-sm text-gray-400 font-mono">
                    {issue.issueDescription}
                  </p>
                )}
                <p className="text-xs text-right text-gray-500 mt-1">
                    Created on : {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {(clickedProjects?.creator?._id.toString() ===
        authUser?._id.toString()||
        !clickedProjects?.contributors?.some(contributor => contributor.contributor.toString() === authUser._id.toString())
    ) && (
        <button
          className="fixed bottom-[60px] right-6 w-14 h-14 rounded-full btn btn-secondary transition flex items-center justify-center text-2xl"
          onClick={() => navigate("raise-issue")} // relative route
        >
          +
        </button>
      )}
    </div>
  );
};

export default ProjectIssues;
