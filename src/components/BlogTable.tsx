import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { fetchBlogs, deleteBlog } from "@/api/blogs/page";

interface BlogImage {
  cardImage: string;
  coverImage: string;
}

export interface Blog {
  id: string;
  images: BlogImage;
  publisherName: string;
  title: string;
  approxReadTime: number;
  publishedDate: string;
  modifiedDate: string;
}

interface BlogResponse {
  success: number;
  message?: string;
  result: {
    blogs: Blog[];
    totalPages: number;
  };
}

const BlogTable: React.FC = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const fetchBlogsData = async () => {
      try {
        const data: BlogResponse = await fetchBlogs(page);
        if (data.success === 0) {
          setBlogs(data.result.blogs);
          setTotalPages(data.result.totalPages);
        } else {
          setError(data.message || "An error occurred");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogsData();
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
    setSelectedBlogId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedBlogId(null);
  };

  const handleDeleteBlog = async () => {
    if (!selectedBlogId) return;

    try {
      await deleteBlog(selectedBlogId);
      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog.id !== selectedBlogId)
      );

      setSnackbarMessage("Blog deleted successfully");
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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const columns: TableColumn[] = [
    { header: "Image", accessor: "image", className: "px-4 py-2" },
    { header: "Title", accessor: "title", className: "px-4 py-2" },
    { header: "Publisher", accessor: "publisherName", className: "px-4 py-2" },
    { header: "Read Time", accessor: "approxReadTime", className: "px-4 py-2" },
    {
      header: "Published Date",
      accessor: "publishedDate",
      className: "px-4 py-2",
    },
    {
      header: "Modified Date",
      accessor: "modifiedDate",
      className: "px-4 py-2",
    },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (blog: Blog) => (
    <tr
      key={blog.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-100"
    >
      <td className="px-4 py-2">
        <img
          src={blog.images.cardImage}
          alt={blog.title}
          className="h-12 w-12 object-cover rounded"
        />
      </td>
      <td className="table-cell px-4 py-2">{blog.title}</td>
      <td className="px-4 py-2">{blog.publisherName}</td>
      <td className="px-4 py-2">{blog.approxReadTime} min</td>
      <td className="px-4 py-2">{blog.publishedDate}</td>
      <td className="px-4 py-2">{blog.modifiedDate}</td>
      <td>
        <div className="flex items-center gap-2">
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C3EBFA] hover:bg-[#ace9ff]"
            onClick={() => router.push(`/blogs/${blog.id}`)}
          >
            <Image src="/images/view.png" alt="View" width={16} height={16} />
          </button>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-300 hover:bg-red-400"
            onClick={() => handleOpenDeleteDialog(blog.id)}
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
      <Table columns={columns} renderRow={renderRow} data={blogs} />

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
            Are you sure you want to delete this blog?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteBlog} color="error">
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

export default BlogTable;
