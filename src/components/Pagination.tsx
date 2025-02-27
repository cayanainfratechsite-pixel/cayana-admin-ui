import React from 'react';
import Pagination from '@mui/material/Pagination';

interface PaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({ count, page, onChange }) => {
  return (
    <div className="flex justify-center py-4">
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        variant="outlined"
        shape="rounded"
      />
    </div>
  );
};

export default PaginationComponent;
