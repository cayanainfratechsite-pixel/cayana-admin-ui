"use client";
import React from "react";
import Button from "@/components/Button";
import ApplicationsTable from "@/components/ApplicationsTable";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { downloadAppliedJobs } from "@/api/Applications/page";

const ApplicationPage: React.FC = () => {
  const handleDownload = async () => {
    try {
      const data = await downloadAppliedJobs();
      
      // Check if the API response indicates success.
      if (data.success === 0) {
        // Create a temporary anchor element and trigger the download.
        const link = document.createElement("a");
        link.href = data.result;
        link.download = "Applications.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            <h2 className="text-xl font-semibold text-gray-800">Job Post List</h2>
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
