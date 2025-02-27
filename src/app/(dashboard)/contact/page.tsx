"use client";
import React from "react";
import Button from "@/components/Button";
import ContactEnquiryTable from "@/components/ContactEnquiryTable";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { downloadContactEnquiry } from "@/api/Contact/page";

const ContactEnquiryPage: React.FC = () => {
  const handleDownload = async () => {
    try {
      const data = await downloadContactEnquiry();
      
      if (data.success === 0) {
        const link = document.createElement("a");
        link.href = data.result;
        link.download = "AppliedJobs.xlsx";
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
            <h2 className="text-xl font-semibold text-gray-800">Contact Enquiry List</h2>
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
        <ContactEnquiryTable />
      </div>
    </div>
  );
};

export default ContactEnquiryPage;
