import express from 'express';
import { getProjects,
        createProject,
        getUserProjects,
        updateProject,
        deleteProject ,
        getProjectDetails,
        raiseIssue,
        createTasks,
        contributeToProject,
        resolveIssue,
        finishTask,
        checkTasks,
        resolveTask
    } from '../controllers/project.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getProjects);
router.get('/user-projects', protectRoute, getUserProjects);
router.post('/create-project', protectRoute, createProject);
router.put('/update-project/:id', protectRoute, updateProject);
router.delete('/delete-project/:id', protectRoute, deleteProject);

router.get('/get-project/:id',protectRoute,getProjectDetails)

router.post('/raise-issue/:id', protectRoute, raiseIssue);

router.post('/create-tasks/:id', protectRoute, createTasks);

router.post('/contribute/:id', protectRoute, contributeToProject);

router.put('/resolve-issue/:issueId/from-project/:id', protectRoute, resolveIssue);

router.post('/complete-task/:id',protectRoute,finishTask)

router.get('/get-task/:id',protectRoute,checkTasks)

router.put('/resolve-task/:taskId/solved-by/:id',protectRoute,resolveTask)

export default router;