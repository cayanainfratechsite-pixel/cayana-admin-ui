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
import { fetchContactEnquiry, deleteContactEnquiry } from "@/api/contact/page";

interface ContactEnquiry {
  _id: string;
  category: string;
  projectId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  date: string;
  city: string;
  message: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ContactEnquiryResponse {
  success: number;
  message?: string;
  result: {
    enquiries: ContactEnquiry[];
    totalPages: number;
    totalEnquiries: number;
  };
}

const ContactEnquiryTable: React.FC = () => {
  const [contactEnquiries, setContactEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchEnquiriesData = async () => {
      try {
        const data: ContactEnquiryResponse = await fetchContactEnquiry(page);
        setContactEnquiries(data.result.enquiries);
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
      <div className="flex justify-center items-center py-8">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error}
      </div>
    );
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
      await deleteContactEnquiry(selectedEnquiryId);
      console.log("Contact enquiry deleted successfully");
      handleCloseDeleteDialog();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting contact enquiry:", error);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const columns: TableColumn[] = [
    { header: "Name", accessor: "name", className: "px-4 py-2" },
    { header: "Email", accessor: "email", className: "px-4 py-2" },
    { header: "Mobile", accessor: "mobile", className: "px-4 py-2" },
    { header: "City", accessor: "city", className: "px-4 py-2" },
    { header: "Message", accessor: "message", className: "px-4 py-2" },
    { header: "Action", accessor: "action" },
  ];

  const renderRow = (enquiry: ContactEnquiry) => (
    <tr
      key={enquiry._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-100"
    >
      <td className="px-4 py-5">
        {enquiry.firstName} {enquiry.lastName}
      </td>
      <td className="px-4 py-2">{enquiry.email}</td>
      <td className="px-4 py-2">{enquiry.mobile}</td>
      <td className="px-4 py-2">{enquiry.city}</td>
      <td className="px-4 py-2">{enquiry.message}</td>
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
      <Table columns={columns} renderRow={renderRow} data={contactEnquiries} />

      <PaginationComponent
        count={totalPages}
        page={page}
        onChange={handlePageChange}
      />

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this contact enquiry?
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

export default ContactEnquiryTable;
