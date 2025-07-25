import { useState } from "react"
import { useProjectStore } from "../store/useProjectStore.js"
import ProjectHandler from "../components/ProjectHandler"


const CreateProject = () => {
    const [projectData,setProjectData]=useState({
        image:"",
        name:"",
        description:"",
        usedLanguages:"",
        githubLink:"",
    })

    const { createProject,isCreatingProjects}=useProjectStore();
  return (
    <div>
        <ProjectHandler
            projectData={projectData}
            setProjectData={setProjectData}
            isCreatingProjects={isCreatingProjects}
            createProject={createProject}
            mode="create"
        />
    </div>
  )
}

export default CreateProject