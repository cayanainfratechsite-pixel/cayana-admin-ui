"use client";
import React from "react";
import Button from "@/components/Button";
import ProjectTable from "@/components/ProjectTable";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import SnackbarComponent from "@/components/SnackbarComponent";

const ProjectPage: React.FC = () => {
  
  const router = useRouter();
  const handleNewProject = () => {
    router.push("/projects/newProjects");
  };

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-full flex flex-col gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">
              Job Post List
            </h2>
          </div>
          <div className="ml-4">
            <Button
              text="Add Project"
              onClick={handleNewProject}
              color="primary"
              variant="outlined"
              icon={<AddIcon />}
            />
          </div>
        </div>
        <ProjectTable />
      </div>
    </div>
  );
};

export default ProjectPage;
