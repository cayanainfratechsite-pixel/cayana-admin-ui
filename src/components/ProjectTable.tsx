import React, { useEffect, useState } from "react";
import Table, { TableColumn } from "./Table";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PaginationComponent from "./Pagination";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import SnackbarComponent from "@/components/SnackbarComponent";
import { deleteProject, fetchProjects } from "@/api/projects/page";

interface Project {
  _id: string;
  cardImage: string;
  name: string;
  status: string;
  basePrice: number;
  type: string;
  bedRooms: number;
  size: number;
  units: number;
  locationName: string;
}

interface ProjectsResponse {
  success: number;
  message?: string;
  result: {
    projects: Project[];
    totalProjects: number;
    totalPages: number;
  };
}

const ProjectsTable: React.FC = () => {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const data: ProjectsResponse = await fetchProjects(page);
        setProjects(data.result.projects);
        setTotalPages(data.result.totalPages);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  const handleOpenDeleteDialog = (_id: string) => {
    setSelectedProjectId(_id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedProjectId(null);
  };

  const handleDeleteProject = async () => {
    if (!selectedProjectId) return;

    try {
      await deleteProject(selectedProjectId);
      handleCloseDeleteDialog();
      setSnackbarMessage("Project deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error Deleting project:", error);
      if (error instanceof Error) {
        setSnackbarMessage(error.message || "Error Deleting project.");
      } else {
        setSnackbarMessage("Error Deleting project.");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };


  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const columns: TableColumn[] = [
    { header: "Image", accessor: "cardImage", className: "px-4 py-2" },
    { header: "Name", accessor: "name", className: "px-4 py-2" },
    { header: "Status", accessor: "status", className: "px-4 py-2" },
    { header: "Base Price", accessor: "basePrice", className: "px-4 py-2" },
    { header: "Type", accessor: "type", className: "px-4 py-2" },
    { header: "Bedrooms", accessor: "bedRooms", className: "px-4 py-2" },
    { header: "Size", accessor: "size", className: "px-4 py-2" },
    { header: "Units", accessor: "units", className: "px-4 py-2" },
    { header: "Location", accessor: "locationName", className: "px-4 py-2" },
    { header: "Action", accessor: "action" },
  ];

  const renderRow = (project: Project) => (
    <tr
      key={project._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-100"
    >
      <td className="px-4 py-5">
        <Image
          src={project.cardImage}
          alt={project.name}
          width={50}
          height={50}
        />
      </td>
      <td className="px-4 py-2">{project.name}</td>
      <td className="px-4 py-2">{project.status}</td>
      <td className="px-4 py-2">{project.basePrice}</td>
      <td className="px-4 py-2">{project.type}</td>
      <td className="px-4 py-2">{project.bedRooms}</td>
      <td className="px-4 py-2">{project.size}</td>
      <td className="px-4 py-2">{project.units}</td>
      <td className="px-4 py-2">{project.locationName}</td>
      <td>
        <div className="flex items-center gap-2">
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C3EBFA] hover:bg-[#ace9ff]"
            onClick={() => router.push(`/projects/${project._id}`)}
          >
            <Image src="/images/view.png" alt="View" width={16} height={16} />
          </button>

          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-300 hover:bg-red-400"
            onClick={() => handleOpenDeleteDialog(project._id)}
          >
            <Image
              src="/images/delete.png"
              alt="Delete"
              width={16}
              height={16}
            />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1">
      <Table columns={columns} renderRow={renderRow} data={projects} />

      <PaginationComponent
        count={totalPages}
        page={page}
        onChange={handlePageChange}
      />

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteProject} color="error">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>


      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default ProjectsTable;
