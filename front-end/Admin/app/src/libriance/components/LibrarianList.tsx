import React from "react";
import { 
  List, 
  Datagrid, 
  TextField, 
  EditButton, 
  DeleteButton,
  useRecordContext
} from "react-admin";
import { LibrarianFilter } from "./LibrarianFilter";
import { 
  Tooltip, 
  Typography,
  styled,
  Box
} from "@mui/material";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

// Types
export interface Librarian {
  id: string;
  title: string;
  author: string;
  approved: string;
  description: string;
  disapproval_reason?: string;
  created_at: string;
  updated_time: string;
}

// Styled Components
const StatusCell = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "status"
})<{ status: 'approved' | 'rejected' | 'pending' }>(({ theme, status }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: status === 'approved' 
    ? theme.palette.success.main 
    : status === 'rejected'
    ? theme.palette.error.main
    : theme.palette.warning.main,
  fontWeight: 500,
}));

// Custom Description Field Component
const TruncatedDescriptionField = () => {
  const record = useRecordContext();
  if (!record) return null;

  const description = record.description || '';
  const truncatedText = description.length > 10 
    ? `${description.substring(0, 10)}...` 
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
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        {truncatedText}
      </Typography>
    </Tooltip>
  );
};

// Custom Status Field Component
const ApprovalStatusField = () => {
  const record = useRecordContext<Librarian>();
  if (!record) return null;

  const getStatusConfig = () => {
    if (record.approved === 'unapproved') {
      if (record.disapproval_reason) {
        return {
          text: 'Rejected',
          status: 'rejected' as const,
          icon: <AlertCircle size={16} />,
          tooltipText: `Rejection Reason: ${record.disapproval_reason}`
        };
      }
      return {
        text: 'Pending',
        status: 'pending' as const,
        icon: <Clock size={16} />,
        tooltipText: 'Awaiting approval'
      };
    }
    return {
      text: 'Approved',
      status: 'approved' as const,
      icon: <CheckCircle size={16} />,
      tooltipText: 'Approved'
    };
  };

  const statusConfig = getStatusConfig();
  
  return (
    <StatusCell status={statusConfig.status}>
      {statusConfig.text}
      <Tooltip 
        title={
          <Box>
            <Typography variant="body2">{statusConfig.tooltipText}</Typography>
            {record.updated_time && (
              <Typography variant="caption" display="block">
                Last updated: {new Date(record.updated_time).toLocaleString()}
              </Typography>
            )}
          </Box>
        }
        arrow
      >
        {statusConfig.icon}
      </Tooltip>
    </StatusCell>
  );
};

// Custom Row Component
const CustomRow = ({ record, ...props }) => {
  if (!record) return null;

  const getRowColor = () => {
    if (record.approved === 'unapproved') {
      return record.disapproval_reason 
        ? 'rgba(211, 47, 47, 0.1)' // Red for rejected
        : 'rgba(255, 193, 7, 0.1)'; // Yellow for pending
    }
    return 'rgba(76, 175, 80, 0.1)'; // Green for approved
  };

  return (
    <tr 
      {...props} 
      style={{
        backgroundColor: getRowColor(),
        transition: 'background-color 0.2s ease',
      }}
    >
      {props.children}
    </tr>
  );
};

// Main List Component
export const LibrarianList = () => (
  <List 
    filters={<LibrarianFilter />}
    sort={{ field: 'created_at', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid >
      <TextField source="title" label="Title" />
      <TextField source="author" label="Author" />
      <ApprovalStatusField source="approved" label="Status" />
      <TruncatedDescriptionField source="description" label="Description" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default LibrarianList;