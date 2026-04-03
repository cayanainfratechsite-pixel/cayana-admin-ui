import React, { useEffect, useState } from "react";
import Table, { TableColumn } from "./Table";
import Image from "next/image";
import PaginationComponent from "./Pagination";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CustomButton from "./Button";
import SnackbarComponent from "@/components/SnackbarComponent";
import { fetchApplications, deleteApplication } from "@/api/Applications/page";

interface Applications {
  _id: string;
  jobId: string;
  fullName: string;
  email: string;
  mobile: string;
  resume: string;
  message: string;
  jobName: string;
}

interface ApplicationsResponse {
  success: number;
  message?: string;
  result: {
    applyJobs: Applications[];
    totalPages: number;
  };
}

const ApplicationsTable: React.FC = () => {
  const [applications, setApplications] = useState<Applications[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApplicationsId, setSelectedApplicationsId] = useState<
    string | null
  >(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const fetchApplicationsData = async () => {
      try {
        const data: ApplicationsResponse = await fetchApplications(page);
        setApplications(data.result.applyJobs);
        setTotalPages(data.result.totalPages);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationsData();
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
    setSelectedApplicationsId(_id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedApplicationsId(null);
  };

  const handleDeleteApplications = async () => {
    if (!selectedApplicationsId) return;

    try {
      await deleteApplication(selectedApplicationsId);
      console.log("Job post deleted successfully");
      setSnackbarMessage("Job post deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      handleCloseDeleteDialog();

      window.location.reload();
    } catch (error) {
      console.error("Error deleting Jobpost:", error);
      setSnackbarMessage("Error deleting Jobpost");
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
    { header: "Full Name", accessor: "fullName", className: "px-4 py-2" },
    { header: "Email", accessor: "email", className: "px-4 py-2" },
    { header: "Mobile", accessor: "mobile", className: "px-4 py-2" },
    { header: "Resume", accessor: "resume", className: "px-4 py-2" },
    { header: "Message", accessor: "message", className: "px-4 py-2" },
    { header: "Job Name", accessor: "jobName", className: "px-4 py-2" },
    { header: "Action", accessor: "action" },
  ];

  const renderRow = (applications: Applications) => (
    <tr
      key={applications._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-100"
    >
      <td className="px-4 py-5">{applications.fullName}</td>
      <td className="px-4 py-2">{applications.email}</td>
      <td className="px-4 py-2">{applications.mobile}</td>
      <td className="px-4 py-2">
        <a
          href={applications.resume}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <CustomButton
            text=""
            variant="outlined"
            color="error"
            icon={<FileDownloadOutlinedIcon />}
          />
        </a>
      </td>

      <td className="px-4 py-2">{applications.message}</td>
      <td className="px-4 py-2">{applications.jobName}</td>
      <td>
        <div className="flex items-center gap-2">
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-300 hover:bg-red-400"
            onClick={() => handleOpenDeleteDialog(applications._id)}
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
  console.log(applications);
  return (
    <div className="bg-white p-4 rounded-md flex-1">
      <Table columns={columns} renderRow={renderRow} data={applications} />

      {/* Pagination Component */}
      <PaginationComponent
        count={totalPages}
        page={page}
        onChange={handlePageChange}
      />

      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteApplications} color="error">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplicationsTable;
