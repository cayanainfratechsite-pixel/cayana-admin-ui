"use client";
import React from "react";
import Button from "@/components/Button";
import ApplicationsTable from "@/components/ApplicationsTable";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { downloadAppliedJobs } from "@/api/applications/page";

const ApplicationPage: React.FC = () => {
  const handleDownload = async () => {
    try {
      const data = await downloadAppliedJobs();

      // Check if the API response indicates success.
      if (data.success === 0) {
        // Fetch the file as a blob to handle binary data properly.
        fetch(data.result, {
          method: 'GET',
        })
          .then(response => response.blob())
          .then(blob => {
            // Create a temporary URL for the blob.
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "Applications.xlsx";  // Set the filename for download.
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Revoke the blob URL to free memory.
            window.URL.revokeObjectURL(url);
          })
          .catch(error => console.error("Download failed:", error));
      } else {
        console.error("Failed to download file: ", data.message);
      }
    } catch (error) {
      console.error("Error fetching download API: ", error);
    }
  };

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-full flex flex-col gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">Applications Enquiry List</h2>
          </div>
          <div className="ml-4">
            <Button
              text="Download List"
              color="primary"
              variant="outlined"
              icon={<FileDownloadOutlinedIcon />}
              onClick={handleDownload}
            />
          </div>
        </div>
        <ApplicationsTable />
      </div>
    </div>
  );
};

export default ApplicationPage;
