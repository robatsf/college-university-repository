// src/components/librarians/LibrarianFileShow.tsx
import React from "react";
import { 
  Show, 
  SimpleShowLayout, 
  TextField, 
  DateField, 
  useRecordContext 
} from "react-admin";
import { 
  FileText, 
  User, 
  Calendar, 
  AlertCircle,
  CheckCircle 
} from "lucide-react";
import { 
  Typography, 
  Box, 
  Divider, 
  styled,
  Alert,
  Chip,
  Paper
} from "@mui/material";

// Types
export interface LibrarianFile {
  id: string;
  title: string;
  description: string;
  author: string;
  department: string;
  approved: 'pending' | 'approved' | 'disapproved';
  disapproval_reason?: string;
  created_at: string;
  updated_time: string;
}

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const SectionTitle = styled(Typography)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: "bold",
  marginBottom: "16px",
  marginTop: "16px",
});

const InfoRow = styled(Box)({
  display: "flex",
  gap: "32px",
  marginBottom: "16px",
  alignItems: "center",
});

const StatusBanner = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiAlert-root': {
    marginBottom: theme.spacing(2),
  },
}));

const StatusChip = styled(Chip)(({ theme, status }: { theme: any, status: string }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: status === 'approved' 
    ? theme.palette.success.light 
    : status === 'disapproved' 
      ? theme.palette.error.light 
      : theme.palette.warning.light,
  color: status === 'approved' 
    ? theme.palette.success.dark 
    : status === 'disapproved' 
      ? theme.palette.error.dark 
      : theme.palette.warning.dark,
  '& .MuiChip-icon': {
    color: 'inherit'
  }
}));

// Status Component
const ApprovalStatus = () => {
  const record = useRecordContext<LibrarianFile>();
  if (!record) return null;

  const getStatusDetails = () => {
    if (record.approved === 'approved') {
      return {
        icon: <CheckCircle size={20} />,
        label: 'Approved',
        color: 'success'
      };
    } else if (record.approved === 'unapproved' && record.disapproval_reason ) {
      return {
        icon: <AlertCircle size={20} />,
        label: 'Disapproved',
        color: 'error'
      };
    }
    return {
      icon: <AlertCircle size={20} />,
      label: 'Pending',
      color: 'warning'
    };
  };

  const statusDetails = getStatusDetails();

  return (
    <StatusBanner>
      <Box display="flex" flexDirection="column" gap={2}>
        <StatusChip
          icon={statusDetails.icon}
          label={statusDetails.label}
          status={record.approved}
        />
        {record.approved === 'unapproved' && record.disapproval_reason && (
          <Alert 
            severity="error" 
            icon={<AlertCircle size={20} />}
            sx={{
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Disapproval Reason:
              </Typography>
              <Typography variant="body2" paragraph>
                {record.disapproval_reason}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Disapproved on: {new Date(record.updated_time).toLocaleString()}
              </Typography>
            </Box>
          </Alert>
        )}
      </Box>
    </StatusBanner>
  );
};

// Main Component
const LibrarianFileShow = () => {
  const record = useRecordContext<LibrarianFile>();

  return (
    <Show>
      <SimpleShowLayout>
        <StyledPaper elevation={1}>
          <ApprovalStatus />
          
          <SectionTitle variant="h6">
            <FileText size={20} /> Basic Information
          </SectionTitle>
          <InfoRow>
            <Typography variant="subtitle1">Title:</Typography>
            <TextField source="title" />
          </InfoRow>
          <InfoRow>
            <Typography variant="subtitle1">Description:</Typography>
            <TextField source="description" />
          </InfoRow>
        </StyledPaper>

        <StyledPaper elevation={1}>
          <SectionTitle variant="h6">
            <User size={20} /> Author
          </SectionTitle>
          <InfoRow>
            <Typography variant="subtitle1">Author:</Typography>
            <TextField source="author" />
          </InfoRow>
          {/* <InfoRow>
            <Typography variant="subtitle1">Department:</Typography>
            <TextField source="department" />
          </InfoRow> */}
        </StyledPaper>

        <StyledPaper elevation={1}>
          <SectionTitle variant="h6">
            <Calendar size={20} /> Timestamps
          </SectionTitle>
          <InfoRow>
            <Typography variant="subtitle1">Created:</Typography>
            <DateField source="created_at" showTime />
          </InfoRow>
          <InfoRow>
            <Typography variant="subtitle1">Updated:</Typography>
            <DateField source="updated_time" showTime />
          </InfoRow>
        </StyledPaper>

        {record?.approved === 'disapproved' && (
          <StyledPaper elevation={1}>
            <SectionTitle variant="h6">
              <AlertCircle size={20} /> Disapproval Information
            </SectionTitle>
            <InfoRow>
              <Typography variant="subtitle1">Reason:</Typography>
              <TextField source="disapproval_reason" />
            </InfoRow>
          </StyledPaper>
        )}
      </SimpleShowLayout>
    </Show>
  );
};

export default LibrarianFileShow;