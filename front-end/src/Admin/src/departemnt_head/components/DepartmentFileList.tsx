// src/components/DepartmentFileList.tsx
import React from "react";
import { 
  List, 
  Datagrid, 
  TextField, 
  EditButton, 
  DeleteButton,
  useRecordContext 
} from "react-admin";
import { Tooltip, Typography } from "@mui/material";
import DepartmentFileFilter from "./DepartmentFileFilter";

const TruncatedDescriptionField = () => {
  const record = useRecordContext();
  if (!record) return null;

  const description = record.description || '';
  const truncatedText = description.length > 10 
    ? `${description.substring(0, 15)}...` 
    : description;
  
  return (
    <Tooltip 
      title={description} 
      placement="top"
      arrow
      enterDelay={500}
    >
      <Typography 
        sx={{ 
          cursor: 'help',
          '&:hover': { 
            textDecoration: 'underline',
            color: 'primary.main'
          }
        }}
      >
        {truncatedText}
      </Typography>
    </Tooltip>
  );
};

const DepartmentFileList = () => (
  <List 
    filters={<DepartmentFileFilter />}
    sort={{ field: 'created_at', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid
    >
      <TextField source="title" label="Title" />
      <TextField source="author" label="Author" />
      <TruncatedDescriptionField source="description" label="Description" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default DepartmentFileList;