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
import SnackbarComponent from "@/components/SnackbarComponent";
import { fetchJobPosts, deleteJobPost } from "@/api/jobPosts/page";

export interface JobPosts {
  _id: string;
  title: string;
  description: number;
}

interface JobPostsResponse {
  success: number;
  message?: string;
  result: {
    jobs: JobPosts[];
    totalPages: number;
  };
}

const JobPostsTable: React.FC = () => {
  const [jobPosts, setJobPosts] = useState<JobPosts[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJobPostsId, setSelectedJobPostsId] = useState<string | null>(
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
    const fetchJobPostsData = async () => {
      try {
        const data: JobPostsResponse = await fetchJobPosts(page);
        setJobPosts(data.result.jobs);
        setTotalPages(data.result.totalPages);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostsData();
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
    setSelectedJobPostsId(_id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedJobPostsId(null);
  };

  const handleDeleteJobPosts = async () => {
    if (!selectedJobPostsId) return;

    try {
      await deleteJobPost(selectedJobPostsId);
      setJobPosts((prevJobPosts) =>
        prevJobPosts.filter((jobPosts) => jobPosts._id !== selectedJobPostsId)
      );

      console.log("Job post deleted successfully");
      setSnackbarMessage("Job post deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      window.location.reload();

    } catch (error) {
      console.error("Error delete Job post ", error);
      setSnackbarMessage("Error delete Job post");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      handleCloseDeleteDialog();
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
    { header: "Title", accessor: "title", className: "px-4 py-2" },
    { header: "Description", accessor: "description", className: "px-4 py-2" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (jobPosts: JobPosts) => (
    <tr
      key={jobPosts._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-100"
    >
      <td className="table-cell px-4 py-5">{jobPosts.title}</td>
      <td className="px-4 py-2">{jobPosts.description}</td>
      <td>
        <div className="flex items-center gap-2">
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-300 hover:bg-red-400"
            onClick={() => handleOpenDeleteDialog(jobPosts._id)}
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
      <Table columns={columns} renderRow={renderRow} data={jobPosts} />

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
            Are you sure you want to delete this Job Post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteJobPosts} color="error">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobPostsTable;
