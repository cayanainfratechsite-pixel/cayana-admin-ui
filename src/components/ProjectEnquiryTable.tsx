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
import {
  fetchProjectEnquiry,
  deleteProjectEnquiry,
} from "@/api/ProjectEnquiry/page";

// Updated interface based on your API data
interface ProjectEnquiry {
  _id: string;
  category: string;
  projectId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  date: string;
  time: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProjectEnquiryResponse {
  success: number;
  message?: string;
  result: {
    enquiries: ProjectEnquiry[];
    totalPages: number;
    totalEnquiries: number;
  };
}

const ProjectEnquiryTable: React.FC = () => {
  const [projectEnquiries, setProjectEnquiries] = useState<ProjectEnquiry[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(
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
    const fetchEnquiriesData = async () => {
      try {
        const data: ProjectEnquiryResponse = await fetchProjectEnquiry(page);
        // Note: Adjust the property if your API returns a different key
        setProjectEnquiries(data.result.enquiries);
        setTotalPages(data.result.totalPages);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiriesData();
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  const handleOpenDeleteDialog = (id: string) => {
    setSelectedEnquiryId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedEnquiryId(null);
  };

  const handleDeleteEnquiry = async () => {
    if (!selectedEnquiryId) return;

    try {
      await deleteProjectEnquiry(selectedEnquiryId);
      console.log("Project enquiry deleted successfully");

      setSnackbarMessage("Project enquiry deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      handleCloseDeleteDialog();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting project enquiry:", error);
      setSnackbarMessage("Error deleting project");
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

  // Define the table columns
  const columns: TableColumn[] = [
    { header: "Name", accessor: "name", className: "px-4 py-2" },
    { header: "Email", accessor: "email", className: "px-4 py-2" },
    { header: "Mobile", accessor: "mobile", className: "px-4 py-2" },
    { header: "Date", accessor: "date", className: "px-4 py-2" },
    { header: "Time", accessor: "time", className: "px-4 py-2" },
    { header: "Project Name", accessor: "projectName", className: "px-4 py-2" },
    { header: "Action", accessor: "action" },
  ];

  // Render each row using the new data structure
  const renderRow = (enquiry: ProjectEnquiry) => (
    <tr
      key={enquiry._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-100"
    >
      <td className="px-4 py-5">
        {enquiry.firstName} {enquiry.lastName}
      </td>
      <td className="px-4 py-2">{enquiry.email}</td>
      <td className="px-4 py-2">{enquiry.mobile}</td>
      <td className="px-4 py-2">{enquiry.date}</td>
      <td className="px-4 py-2">{enquiry.time}</td>
      <td className="px-4 py-2">{enquiry.projectName}</td>
      <td>
        <div className="flex items-center gap-2">
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-300 hover:bg-red-400"
            onClick={() => handleOpenDeleteDialog(enquiry._id)}
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
      <Table columns={columns} renderRow={renderRow} data={projectEnquiries} />

      {/* Pagination Component */}
      <PaginationComponent
        count={totalPages}
        page={page}
        onChange={handlePageChange}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project enquiry?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteEnquiry} color="error">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectEnquiryTable;
