import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useProjectStore = create((set, get) => ({
  projects: [],
  isLoadingProjects: false,
  userProjects: [],
  hasMoreProjects: true,
  isCreatingProjects: false,
  clickedProjects: null,
  searchFilter: "",
  updatingProjects: [],
  isLoadingUserProjects: false,
  task:null,
  isChecking:false,

  setUpdatingProjects: (data) => set({ updatingProjects: data }),

  changeSearchFilter: (data) => {
    set({ searchFilter: data, projects: [], hasMoreProjects: true });
  },

  getProjects: async (limit, skip) => {
    set({ isLoadingProjects: true });
    try {
      const search = get().searchFilter;
      const query = `/projects?limit=${limit}&skip=${skip}${search ? `&search=${search}` : ""}`;
      const res = await axiosInstance.get(query);

      const existing = new Set(get().projects.map((p) => p._id));
      const newOnes = res.data.projects.filter((p) => !existing.has(p._id));

      set((state) => ({
        projects: [...state.projects, ...newOnes],
        hasMoreProjects: res.data.HasMore,
        isLoadingProjects: false,
      }));

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load projects");
      set({ isLoadingProjects: false });
    }
  },

  createProject: async (projectData) => {
    set({ isCreatingProjects: true });
    try {
      const res = await axiosInstance.post("/projects/create-project", projectData);
      set((state) => ({
        projects: [res.data.newProject, ...state.projects],
        isCreatingProjects: false,
      }));
      get().changeSearchFilter("");
      toast.success("Project created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
      set({ isCreatingProjects: false });
    }
  },

  clickProject: async (projectId) => {
    set({ isLoadingProjects: true });
    try {
      const res = await axiosInstance.get(`/projects/get-project/${projectId}`);
      set({ clickedProjects: res.data.project, isLoadingProjects: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load project");
      set({ isLoadingProjects: false });
    }
  },

  joinProject: async (projectId) => {
    try {
      const res = await axiosInstance.post(`/projects/contribute/${projectId}`);
      toast.success(res.data.message || "Joined project as contributor");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join project");
    }
  },

  deleteProject: async (projectId) => {
    try {
      const res = await axiosInstance.delete(`/projects/delete-project/${projectId}`);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== projectId),
        userProjects: state.userProjects.filter((p) => p._id !== projectId),
      }));
      toast.success(res.data.message || "Project deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  },

  updateProject: async (projectData) => {
    set({ isCreatingProjects: true });
    try {
      const res = await axiosInstance.put(`/projects/update-project/${projectData._id}`, projectData);
      set((state) => ({
        projects: state.projects.map((p) =>
          p._id === projectData._id ? res.data.project : p
        ),
      }));
      get().changeSearchFilter("");
      toast.success(res.data.message || "Project updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project");
    }finally {
      set({ isCreatingProjects: false });
    }
  },

  raiseIssue: async (projectId, issue) => {
    set({isCreatingProjects:true})
    try {
      const res = await axiosInstance.post(`/projects/raise-issue/${projectId}`, issue);
      toast.success(res.data.message || "Issue raised");
      get().clickProject(projectId)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to raise issue");
    } finally {
      set({isCreatingProjects:false})
    }
  },

  createTask: async (projectId, task) => {
    set({isCreatingProjects:true})
    try {
      const res = await axiosInstance.post(`/projects/create-tasks/${projectId}`, task);
      toast.success(res.data.message || "Task created");
      get().clickProject(projectId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    }finally{
      set({isCreatingProjects:false})
    }
  },

  finishTask: async (taskId,data) => {
    set({isCreatingProjects:true})
    try {
      const res = await axiosInstance.post(`/projects/complete-task/${taskId}`,data);
      toast.success(res.data.message || "Task submitted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit task");
    }finally{
      set({isCreatingProjects:false})
    }
  },

  checkTask: async (taskId) => {
    try {
      const res = await axiosInstance.get(`/projects/get-task/${taskId}`);
      set({task:res.data.task})
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load task");
    }
  },

  resolveTask: async (taskId, solverId) => {
    set({isChecking:true})
    try {    
      const res = await axiosInstance.put(`/projects/resolve-task/${taskId}/solved-by/${solverId}`);
      toast.success(res.data.message || "Task resolved");
      get().checkTask(taskId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resolve task");
    } finally {
      set({isChecking:false})
    }
  },

  resolveIssue: async (projectId, issueId) => {
    try {
      console.log(projectId,issueId)
      const res = await axiosInstance.put(`/projects/resolve-issue/${issueId}/from-project/${projectId}`);
      toast.success(res.data.message || "Issue resolved");
      get().clickProject(projectId)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resolve issue");
    }
  },
  getUserProjects: async () => {
    try {
      const res = await axiosInstance.get('/projects/user-projects');
      set({ userProjects: res.data.projects });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user projects");
    }
  }
}));
