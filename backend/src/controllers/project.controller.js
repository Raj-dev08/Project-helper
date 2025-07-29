import Projects from "../models/project.model.js";
import Task from "../models/tasks.model.js";
import cloudinary from "../lib/cloudinary.js";
import {redis} from "../lib/redis.js";

export const createProject = async (req,res,next) => {
    try {
        const {user}=req;

        if(!user){
            return res.status(401).json({message: "Unauthorized access"});
        }


        const { name, description,image,githubLink,usedLanguages}=req.body;

        if(!name||!description||!usedLanguages||!githubLink){
            return res.status(400).json({message: "All fields required"});
        }

        if (! /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?\/?$/.test(githubLink)) {
            return res.status(400).json({ message: "Invalid GitHub link" });
        }

        let imageUrl="https://media.istockphoto.com/id/1510696458/vector/vector-digital-green-background-of-streaming-binary-code-matrix-background-with-numbers-1-0.jpg?s=612x612&w=0&k=20&c=TTkG2rwjYzXCTVzLDcX59UjPjKD0AJSWE2BnPh7s8X4=";//a cool place holder image
        
        if(image){
            const uploadedResponse= await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }
        
        
        const newProject = new Projects({
            name,
            description,
            githubLink,
            usedLanguages,
            image: imageUrl,
            creator:user._id
        });
        user.projects.push(newProject._id);

        await newProject.save();
        await user.save();
        await redis.del(`userProjects:${user._id}`); // Invalidate the cache for user projects

        return res.status(201).json({message:"project created successfully" ,newProject});

    } catch (error) {
        next(error);
    }
}

export const getUserProjects = async (req, res,next) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const cachedProjects = await redis.get(`userProjects:${user._id}`);

        if(cachedProjects){
            return res.status(200).json({ projects: JSON.parse(cachedProjects) });
        }

        const projects = await Projects.find({ creator: user._id })
            .populate("creator", "name profilePic")
            .lean(); // Use lean() for better performance if you don't need Mongoose documents
 
        await redis.set(`userProjects:${user._id}`, JSON.stringify(projects), "EX", 60 * 60 * 24 * 7); // Cache for 7 days

        return res.status(200).json({ projects });

    } catch (error) {
        next(error);
    }
}

export const contributeToProject = async (req, res,next) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const projectId = req.params.id;

        if (!projectId) {
            return res.status(400).json({ message: "Project ID and amount are required" });
        }

        const project = await Projects.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if(project.creator.toString()===user._id.toString()){
            return res.status(401).json({message:"Creator cant contribute"})
        }

        if (project.contributors.some(contributor => contributor.contributor.toString() === user._id.toString())) {
            return res.status(400).json({ message: "You are already a contributor to this project" });
        }

        project.contributors.push({
            contributor: user._id,
            contributionNumber: 0, // Default contribution number
        });

        await project.save();
    
        await redis.del(`project:${projectId}`);

        return res.status(200).json({ message: "Succesfully joined as contributor"});

    } catch (error) {
        next(error);
    }
}

export const createTasks = async (req, res,next) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const projectId = req.params.id;
        const { taskName, taskDescription } = req.body;

        if (!projectId || !taskName || !taskDescription) {
            return res.status(400).json({ message: "Project ID, task name, and description are required" });
        }

        const project = await Projects.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if(project.creator.toString() !== user._id.toString()){
            return res.status(403).json({ message: "Only the project creator can create tasks" });
        }

        // Create a new task object
        const newTask = new Task({
            taskName,
            taskDescription,
            projectId,
            assignedBy: user._id, // Assign the task to the creator
        });

       await newTask.save();
       
       project.tasks.push(newTask._id); // Add the task to the project's tasks array

       await project.save();

       await redis.del(`project:${projectId}`);

       return res.status(201).json({ message: "Task created successfully", task: newTask });

    } catch (error) {
        next(error);
    }
}

export const raiseIssue = async (req, res,next) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const projectId = req.params.id;
        const { issueName, issueDescription } = req.body;

        if (!projectId || !issueName || !issueDescription) {
            return res.status(400).json({ message: "Project ID, issue name, and description are required" });
        }

        const project = await Projects.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (!project.contributors.some(contributor => contributor.contributor.toString() === user._id.toString()) && project.creator.toString()!==user._id.toString()) {
            return res.status(400).json({ message: "You are not a contributor or creator of this project" });
        }

        const userIssueCount = project.issues.filter(
            (issue) => issue.raisedBy?.toString() === user._id.toString()
        ).length;

        if (userIssueCount >= 20 && project.creator.toString()!==user._id.toString()) {
            return res.status(400).json({ message: "User Issue limit reached. You can raise up to 20 issues per project." });
        }

        // Create a new issue object
        const newIssue = {
            raisedBy: user._id,
            issueName,
            issueDescription,
            isFixed: false, // Default value for new issues
        };

        project.issues.push(newIssue); // Add the issue to the project's issues array

        await project.save();

        await redis.del(`project:${projectId}`); // Invalidate the cache for this project

        return res.status(201).json({ message: "Issue raised successfully", issue: newIssue });

    } catch (error) {
        next(error);
    }
}

export const getProjectDetails = async (req, res,next) => {
    try {
        const projectId = req.params.id;

        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        // Check Redis cache first
        const cachedProject = await redis.get(`project:${projectId}`);

        if (cachedProject) {
            return res.status(200).json({ project: JSON.parse(cachedProject) });
        }

        const project = await Projects.findById(projectId)
            .populate("creator", "name profilePic")
            .populate("contributors.contributor", "name profilePic")
            .populate("issues.raisedBy", "name profilePic")
            .populate("tasks")
            .lean(); // Use lean() for better performance if you don't need Mongoose documents

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Cache the project details in Redis
        await redis.set(`project:${projectId}`, JSON.stringify(project), "EX", 60 * 60 * 24 * 7); // 7 days

        return res.status(200).json({ project });

    } catch (error) {
        next(error);
    }
}

export const getProjects = async (req, res,next) => {
    try {

        const search = req.query.search || "";
        const limit=parseInt(req.query.limit)|| 50;
        const skip=parseInt(req.query.skip)||0;

        let searchConditions
        
        if(search){
            searchConditions = { $text: { $search: search } };
        }


        const projects = await Projects.find(searchConditions)
            .populate("creator", "name profilePic")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for better performance if you don't need Mongoose documents

        const totalProjects = await Projects.countDocuments(searchConditions);

        const HasMore = totalProjects > skip + projects.length;

        return res.status(200).json({ projects, HasMore });

    } catch (error) {
        next(error);
    }
}


export const deleteProject = async (req, res,next) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const projectId = req.params.id;

        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const project = await Projects.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.creator.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Only the project creator can delete the project" });
        }

        await Projects.findByIdAndDelete(projectId);

        await redis.del(`project:${projectId}`); // Invalidate the cache for this project
        await redis.del(`userProjects:${user._id}`); // Invalidate the cache for user projects

        return res.status(200).json({ message: "Project deleted successfully" });

    } catch (error) {
        next(error);
    }
}


export const updateProject = async (req, res,next) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const projectId = req.params.id;
        const { name, description, image, githubLink, usedLanguages } = req.body;

        if(!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        if (!name && !description && !usedLanguages && !githubLink) {
            return res.status(400).json({ message: "Atleast one field is required" });
        }

        if ( githubLink && ! /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?\/?$/.test(githubLink)) {
            return res.status(400).json({ message: "Invalid GitHub link" });
        }

        const project = await Projects.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.creator.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Only the project creator can update the project" });
        }

        let imageUrl = project.image; // Keep the existing image URL if no new image is provided

        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }

        if(name){
            project.name = name;
        }

        if(description){
            project.description = description;
        }
        if(usedLanguages){
            project.usedLanguages = usedLanguages;
        }
        if(githubLink){
            project.githubLink = githubLink;
        }
        if(imageUrl){
            project.image = imageUrl;
        }

        await project.save();

        await redis.del(`project:${projectId}`); // Invalidate the cache for this project
        await redis.del(`userProjects:${user._id}`); // Invalidate the cache for user projects

        await redis.set(`project:${projectId}`, JSON.stringify(project), "EX", 60 * 60 * 24 * 7); // 7 days

        return res.status(200).json({ message: "Project updated successfully", project });

    } catch (error) {
        next(error);
    }
}

export const resolveIssue = async (req, res,next) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const projectId = req.params.id;
        const issueId = req.params.issueId;

        if (!projectId || !issueId) {
            return res.status(400).json({ message: "Project ID and issue ID are required" });
        }

        const project = await Projects.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if(project.creator.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Only the project creator can resolve issues" });
        }

        const issue = project.issues.id(issueId);

      
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        issue.isFixed = true; // Mark the issue as resolved

        await project.save();

        await redis.del(`project:${projectId}`); // Invalidate the cache for this project

        return res.status(200).json({ message: "Issue resolved successfully" });

    } catch (error) {
        next(error);
    }
}

export const finishTask=async (req,res,next) => {
    try {
        const {user}=req
        
        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const taskId=req.params.id

        const {text,image}=req.body;

        if(!taskId){
            return res.status(400).json({message:"Task id is required"})
        }

        if(!text||!image){
            return res.status(400).json({message:"text or image is required"})
        }

        const uploadedResponse= await cloudinary.uploader.upload(image);
        const imageUrl = uploadedResponse.secure_url;

        const task = await Task.findById(taskId)

        if(!task){
            return res.status(404).json({message:"Task not found"})
        }

        if(task.status==="done"){
            return res.status(400).json({message:"Task already done"})
        }

        const projectId=task.projectId

        const project=await Projects.findById(projectId)

        if(!project){
            return res.status(404).json({message:"Project Not found"})
        }
        if(project.creator.toString()===user._id.toString()){
            return res.status(401).json({message:"Task asigner cant complete task"})
        }

        if (!project.contributors.some(contributor => contributor.contributor.toString() === user._id.toString())) {
            return res.status(400).json({ message: "You are not a contributor to this project" });
        }

        if(task.submittedBy.some(s=>s.submittedById.toString()===user._id.toString())){
            return res.status(401).json({message:"Already submitted the task once"})
        }

        task.submittedBy.push({
            submittedById:user._id,
            text,
            image:imageUrl
        })

        await task.save();

        return res.status(200).json({message:"task submitted succesfully"})
    } catch (error) {
        next(error)
    }
}

export const checkTasks=async (req,res,next) => {
    try {
        const {user}=req

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const taskId=req.params.id

        if(!taskId){
            return res.status(400).json({message:"No taskID provided"})
        }

        const task=await Task.findById(taskId)

        if(!task){
            return res.status(404).json({message:"task not found"})
        }

        const project=await Projects.findById(task.projectId)

        if(!project){
            return res.status(404).json({message:"no projects from this task"})
        }
        const userPayload={
            taskName:task.taskName,
            taskDescription:task.taskDescription,
        }

        if(project.creator.toString()!==user._id.toString()){
            return res.status(200).json({task:userPayload})
        }

        await task.populate("submittedBy.submittedById","name email profilePic")

        if(task.solvedBy){
            await task.populate("solvedBy","name email profilePic")
        }

        return res.status(200).json({task});
    } catch (error) {
        next(error)
    }
}


export const resolveTask=async (req,res,next) => {
    try {
        const {user}=req;

        const solverId=req.params.id

        const {taskId}=req.params


        if(!user||!solverId||!taskId){
            return res.status(400).json({message:"User or solverId or taskId missing"})
        }

        const task=await Task.findById(taskId)

        if(!task){
            return res.status(404).json({message:"no task found"})
        }

        if(task.status==="done"){
            return res.status(400).json({message:"Task already done"})
        }

        const project=await Projects.findById(task.projectId)

        if(!project){
            return res.status(404).json({message:"no project found"})
        }

        if(project.creator.toString()!==user._id.toString()){
            return res.status(401).json({message:"You are not the creator"})
        }

        task.status="done"
        task.solvedBy=solverId

        await task.save()

        await Projects.updateOne(
        { _id: task.projectId, "contributors.contributor": solverId },
        { $inc: { "contributors.$.contributionNumber": 1 } }
        );

        await redis.del(`project:${task.projectId}`)

        return res.status(200).json({message:"Resolved task succesfully"})
    } catch (error) {
        next(error)
    }
}
