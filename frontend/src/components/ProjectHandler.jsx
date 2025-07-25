import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const ProjectHandler = ({ projectData , setProjectData , isCreatingProjects , createProject , mode }) => {
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const success=validateForm()
        if(success===true) {
            await createProject(projectData)
            navigate(-1)
        }
    }

    const validateForm=()=>{
        const githubRegex = /^https:\/\/github\.com\/[A-Za-z0-9_-]+(\/[A-Za-z0-9_.-]+)?\/?$/;
        if (!projectData.description.trim()) return toast.error("Description is required");
        if (!projectData.name.trim()) return toast.error("Name is required");
        if (!projectData.usedLanguages.trim()) return toast.error("Timings are required");
        if (!projectData.githubLink.trim()) return toast.error("Price is required");
        if (!projectData.image.trim()) return toast.error("Image URL is required");
        
        if(!githubRegex.test(projectData.githubLink.trim())){
            return toast.error("Invalid github url")
        }

        return true;
    }

    const handleImageUpload=async(e)=>{
        const file = e.target.files[0];

        if(!file)return
        
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload= async ()=>{
            const base64Image=reader.result
            setProjectData({...projectData, image:base64Image })
        }
    }
  return (
   <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-base-300 to-primary/20">
        <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl m-[10%] bg-base-100 rounded-xl shadow-[0_0_10px] shadow-primary/25 overflow-hidden">
            <form onSubmit={handleSubmit} className="w-full  p-4 sm:p-8 flex flex-col ">
                <div className="flex flex-col items-center gap-4 mx-auto lg:max-h-[40%] max-h-[20%] max-w-[50%] my-[5%]">
                    <div className="relative">
                    <img
                        src={projectData?.image||"https://img.freepik.com/free-vector/matrix-style-binary-code-digital-falling-numbers-blue-background_1017-37387.jpg?semt=ais_hybrid&w=740"}
                        alt="Post"
                        className="w-full object-cover rounded-sm  shadow-md shadow-primary/25"
                    />     
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isCreatingProjects}
                        />
                    </div>

                    <h1 className="text-3xl font-bold text-center flex">Project Image</h1>
                    <p className="text-sm text-center text-gray-500">Click on the image to upload a new one</p>
                    
                    
                </div>

                <div className="form-control my-4">
                    <label className="label">
                        <span className="label-text font-medium">Project Name</span>
                    </label>
                    <input
                        type="text"
                        className={`input input-bordered w-full focus:outline-none`}
                        placeholder="Project Name"
                        value={projectData.name}
                        onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                    />
                </div>

                <div className="form-control my-4">
                    <label className="label">
                        <span className="label-text font-medium">Project Description</span>
                    </label>
                    <textarea
                        className={`textarea textarea-bordered w-full min-h-24 overflow-auto focus:outline-none`}
                        placeholder="Project Description (add detailed description)"
                        value={projectData.description}
                        onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                    />
                </div>

                <div className="form-control my-4">
                    <label className="label">
                        <span className="label-text font-medium">Used Language Or tech stack</span>
                    </label>
                    <input
                        type="text"
                        className={`input input-bordered w-full focus:outline-none`}
                        placeholder="Project languages / stack ( JS , MERN etc)"
                        value={projectData.usedLanguages}
                        onChange={(e) => setProjectData({ ...projectData, usedLanguages: e.target.value })}
                    />
                </div>

                <div className="form-control my-4">
                    <label className="label">
                        <span className="label-text font-medium">Project Github Link</span>
                    </label>
                    <input
                        type="text"
                        className={`input input-bordered w-full focus:outline-none`}
                        placeholder="Project Link"
                        value={projectData.githubLink}
                        onChange={(e) => setProjectData({ ...projectData, githubLink: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-full my-[5%]" disabled={isCreatingProjects}>
                    {isCreatingProjects ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        mode==="create"?"Create Project":"Update Project"
                    )}
                </button>
            </form>
        </div>
    </div>
  )
}

export default ProjectHandler