import { useState } from "react"
import { useProjectStore } from "../store/useProjectStore";
import CourseHandler from "../components/ProjectHandler";

const EditProject = () => {
    const {updatingProjects,isCreatingProjects,updateProject}=useProjectStore();

    const [projectData,setProjectData]=useState(updatingProjects)

    console.log(projectData)

  return (
    <div>
        <CourseHandler
            projectData={projectData}
            setProjectData={setProjectData}
            createProject={updateProject}
            isCreatingProjects={isCreatingProjects}
            mode="edit"
        />
    </div>
  )
}

export default EditProject