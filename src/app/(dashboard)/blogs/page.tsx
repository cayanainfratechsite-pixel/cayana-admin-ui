// pages/blog/index.tsx

"use client"
import React from 'react';
import BlogTable from '@/components/BlogTable';
import Button from '@/components/Button';
import AddIcon from '@mui/icons-material/Add';  
import { useRouter } from "next/navigation";


const BlogPage: React.FC = () => {
  const router = useRouter();
  const handleNewBlog = () => {
    router.push('/blogs/newBlog');
  };


  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-full flex flex-col gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">
              Blog Page
            </h2>
          </div>
          <div className="ml-4">
            <Button
              text="New Blog"
              onClick={handleNewBlog}
              color="primary"
              variant="outlined"
              icon={<AddIcon />}
            />
          </div>
        </div>
        <BlogTable />
      </div>
    </div>
  );
};

export default BlogPage;
