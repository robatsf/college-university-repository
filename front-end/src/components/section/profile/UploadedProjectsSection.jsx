// components/UploadedProjectsSection.jsx
import { useState } from "react";
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Error as ErrorIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useProjects } from "../../../hooks/useProjects";
import EditProjectModal from "./EditProjectModal";

const ProjectStatus = ({ status, disapproval_reason }) => {
  if (disapproval_reason != null && status == "unapproved") {
    return (
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Rejected
        </span>
        <Tooltip title={disapproval_reason}>
          <ErrorIcon className="h-4 w-4 text-red-500 cursor-help" />
        </Tooltip>
      </div>
    );
  }

  if (status == "unapproved") {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
      Approved
    </span>
  );
};

const UploadedProjectsSection = ({ departmentId }) => {
  const { 
    projects, 
    isLoading, 
    error, 
    refreshProjects, 
    deleteProject,
  } = useProjects(departmentId);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleEditClick = (project) => {
    setEditingProject(project);
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      try {
        await deleteProject(projectToDelete.id);
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
        refreshProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error('Failed to load projects');
    return null;
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-xl">Uploaded Projects</h3>
        </div>
        <div className="grid gap-4">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{project.title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Uploaded on: {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                  <ProjectStatus 
                    status={project.approved} 
                    disapproval_reason={project.disapproval_reason}
                  />
                  <div className="flex space-x-2">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(project)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(project)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditProjectModal
        project={editingProject}
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSuccess={() => {
          setEditingProject(null);
          refreshProjects();
        }}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this project? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadedProjectsSection;