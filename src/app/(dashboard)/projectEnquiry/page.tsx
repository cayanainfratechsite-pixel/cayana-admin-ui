"use client";
import React from "react";
import Button from "@/components/Button";
import ProjectEnquiryTable from "@/components/ProjectEnquiryTable";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { downloadProjectEnquiry } from "@/api/ProjectEnquiry/page";
import * as XLSX from "xlsx";

const ProjectEnquiryPage: React.FC = () => {
  const handleDownload = async () => {
    try {
      const data = await downloadProjectEnquiry();

      if (data.success === 0 && data.result.enquiries) {
        // Transform enquiries data for Excel
        const excelData = data.result.enquiries.map((enquiry: any, index: number) => ({
          "S.No": index + 1,
          "First Name": enquiry.firstName,
          "Last Name": enquiry.lastName,
          "Project Name": enquiry.projectName,
          "Email": enquiry.email,
          "Mobile": enquiry.mobile,
          "Date": enquiry.date,
          "Time": enquiry.time,
          "Enquiry On": enquiry.enquiryOn,
        }));

        // Create a new workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Project Enquiries");

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, "Project_Enquiries.xlsx");
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
            <h2 className="text-xl font-semibold text-gray-800">
              Project Enquiry List
            </h2>
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
        <ProjectEnquiryTable />
      </div>
    </div>
  );
};

export default ProjectEnquiryPage;
