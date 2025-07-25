import {motion} from "framer-motion"
import { Link } from "react-router-dom"
import { useProjectStore } from "../store/useProjectStore";
import { Link2 } from "lucide-react";
import { useTypeWriter } from "./typeWriter";
import { bgClassToHexMap } from "../pages/ProjectView";

export const colorScheme = {
    html: "bg-red-500 text-white hover:bg-red-600",
    css: "bg-blue-500 text-white hover:bg-blue-600",
    js: "bg-yellow-400 text-black hover:bg-yellow-500",
    ts: "bg-sky-400 text-black hover:bg-sky-500",
    java: "bg-orange-500 text-white hover:bg-orange-600",
    c: "bg-gray-700 text-white hover:bg-gray-800",
    "c++": "bg-indigo-600 text-white hover:bg-indigo-700",
    "c#": "bg-purple-700 text-white hover:bg-purple-800",
    python: "bg-yellow-200 text-blue-900 hover:bg-yellow-300",
    ruby: "bg-red-300 text-black hover:bg-red-400",
    php: "bg-indigo-400 text-white hover:bg-indigo-500",
    go: "bg-cyan-700 text-white hover:bg-cyan-800",
    rust: "bg-orange-700 text-white hover:bg-orange-800",
    dart: "bg-sky-300 text-black hover:bg-sky-400",
    kotlin: "bg-purple-400 text-white hover:bg-purple-500",
    swift: "bg-orange-300 text-black hover:bg-orange-400",

    // Frontend
    react: "bg-cyan-500 text-white hover:bg-cyan-600",
    vue: "bg-green-400 text-white hover:bg-green-500",
    angular: "bg-red-600 text-white hover:bg-red-700",
    svelte: "bg-orange-500 text-white hover:bg-orange-600",
    next: "bg-gray-900 text-white hover:bg-gray-800",
    nuxt: "bg-green-600 text-white hover:bg-green-700",

    // Backend
    node: "bg-green-600 text-white hover:bg-green-700",
    express: "bg-gray-800 text-white hover:bg-gray-900",
    django: "bg-green-700 text-white hover:bg-green-800",
    flask: "bg-gray-600 text-white hover:bg-gray-700",
    spring: "bg-green-500 text-white hover:bg-green-600",
    nest: "bg-red-500 text-white hover:bg-red-600",
    fastify: "bg-black text-white hover:bg-gray-800",

    // Databases
    mongodb: "bg-green-800 text-white hover:bg-green-900",
    mysql: "bg-blue-300 text-black hover:bg-blue-400",
    postgresql: "bg-blue-600 text-white hover:bg-blue-700",
    redis: "bg-red-500 text-white hover:bg-red-600",
    sqlite: "bg-gray-500 text-white hover:bg-gray-600",
    firebase: "bg-yellow-500 text-black hover:bg-yellow-600",
    supabase: "bg-emerald-500 text-white hover:bg-emerald-600",

    // DevOps / Tools
    docker: "bg-blue-500 text-white hover:bg-blue-600",
    kubernetes: "bg-blue-300 text-black hover:bg-blue-400",
    git: "bg-orange-400 text-black hover:bg-orange-500",
    github: "bg-gray-900 text-white hover:bg-gray-800",
    vercel: "bg-black text-white hover:bg-gray-900",
    netlify: "bg-green-500 text-white hover:bg-green-600",
    aws: "bg-orange-400 text-black hover:bg-orange-500",
    azure: "bg-blue-800 text-white hover:bg-blue-900",
    gcp: "bg-blue-400 text-white hover:bg-blue-500",

    // Mobile
    reactnative: "bg-sky-500 text-white hover:bg-sky-600",
    flutter: "bg-blue-400 text-white hover:bg-blue-500",

    // // Default fallback
    // default: "bg-gray-400 text-white hover:bg-gray-500",
    };

const Card = ({project}) => {
  const { joinProject}=useProjectStore();

  // console.log("project", project);

  const text=useTypeWriter(project.description,100)


  return (
    <motion.div key={project?._id} 
          className="shadow-md rounded-lg overflow-hidden border-primary/25 border-2 bg-base-300"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="flex items-center p-4">
              <img
                src={project?.creator?.profilePic || "/i.png"}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <Link to={`/profile/${project?.creator?._id}`}>
                <div className="ml-3">
                  <p className="font-semibold">{project?.creator?.name.toUpperCase()}</p>
                  <p className="text-sm">{new Date(project?.createdAt).toLocaleString()}</p>
                </div>
              </Link>
            </div>

            <Link to={`${project?.image}`}>
              <img src={project?.image||"/i.png"} alt="project" className="w-full object-contain " />
            </Link>

            <Link to={`/project/${project?._id}`}><p className="p-4 text-lg font-bold text-center text-blue-500 text underline">{project?.name.toUpperCase()}</p></Link>
            <span className="p-4 flex flex-col">
              <p className="overflow-scroll font-semibold font-mono h-[40px] no-scrollbar">{text.toUpperCase()}</p>
              <p className="p-4 font-bold underline text-green-700">TECH STACK:</p>
              <p className="w-full overflow-scroll no-scrollbar h-[50px] space-x-3 bg-base-200 border border-primary/25 rounded-xl">
              {project?.usedLanguages.split(' ').map((el,idx)=>{
                const color=colorScheme[el]||"bg-primary"
                const shadow=bgClassToHexMap[color.split(' ')[0]]
                return (
                    <button className={`btn ${color} min-w-5 min-h-5 m-2 rounded-full border-none hover:shadow-none`} key={idx}
                    style={{ boxShadow: `0 0 20px ${shadow}`}}>{el}</button>
                )
                })}
              </p>
              
              <Link to={`${project.githubLink}`}>
                <p className="p-4 font-mono flex">Github Link: <Link2 className="text-blue-500 hover:text-blue-700"/></p>
              </Link>
            </span>
            <div className="flex justify-center my-4">
              <button className="btn rounded-full bg-gradient-to-r from-primary to-secondary 
              hover:bg-gradient-to-r hover:from-primary/50 hover:to-secondary/50 w-[40%]
              shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.secondary)] 
              hover:shadow-[0_0_10px_theme(colors.primary),0_0_20px_theme(colors.secondary)] 
              transition duration-300 border-hidden text-base-content" onClick={()=>joinProject(project?._id)}>
                Contribute
              </button>
            </div>
          </motion.div>
  )
}

export default Card