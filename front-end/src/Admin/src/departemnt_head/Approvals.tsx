import React, { useState } from "react";
import { 
  Show, 
  SimpleShowLayout, 
  TextField, 
  DateField, 
  Button, 
  TopToolbar, 
  useRecordContext, 
  useNotify,
  useRefresh,
  List,
  Datagrid,
  ShowButton,
  Filter,
  TextInput,
  useRedirect
} from "react-admin";
import { Eye, FileText, User, Calendar, Check, X } from "lucide-react";
import { 
  Typography, 
  Box, 
  Divider, 
  styled, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField as MuiTextField 
} from "@mui/material";
import FileViewer from "./components/FileViewer";
import customDataProvider, { apibase } from "../dataProvider";
import { tokenManager } from "../utils/tokenManager";

// Types
interface DisapprovalDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

interface ApprovalButtonProps {
  type: 'approved' | 'disapproved';
}

// Styled Components
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

// Filter Component
const ApprovalFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="title" alwaysOn />
    <TextInput label="Author" source="author" />
    <TextInput label="Year" source="year" />
  </Filter>
);

// Disapproval Dialog Component
const DisapprovalDialog: React.FC<DisapprovalDialogProps> = ({ open, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Why are you disapproving this file?</DialogTitle>
      <DialogContent>
        <MuiTextField
          autoFocus
          margin="dense"
          label="Reason for disapproval"
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" disabled={!reason.trim()}>
          Confirm Disapproval
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Approval Button Component
const ApprovalButton: React.FC<ApprovalButtonProps> = ({ type }) => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const [loading, setLoading] = useState(false);
  const [openDisapprovalDialog, setOpenDisapprovalDialog] = useState(false);

  if (!record) return null;

  const handleApproval = () => {
    if (type === 'disapproved') {
      setOpenDisapprovalDialog(true);
    } else {
      handleConfirm();
    }
  };

  const handleConfirm = async (reason?: string) => {
    setLoading(true);
    try {
      const updateData = {
        status: type,
        ...(reason && { reason: reason })
      };
  
      const response = await customDataProvider.updateAppprove(
        'approvals',
        record.id,
        updateData
      );
  
      if (response.status === 200) {
        notify(`File ${type === 'approved' ? 'approved' : 'disapproved'} successfully`, { type: 'success' });
        refresh();
        redirect('list', 'approvals');
      } else {
        notify(`Error: ${response.statusText}`, { type: 'error' });
      }
    } catch (error) {
      notify(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`, { type: 'error' });
    } finally {
      setLoading(false);
      setOpenDisapprovalDialog(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color={type === 'approved' ? 'success' : 'error'}
        onClick={handleApproval}
        disabled={loading}
        startIcon={type === 'approved' ? <Check size={16} /> : <X size={16} />}
      >
        {type === 'approved' ? 'Approve' : 'Reject'}
      </Button>

      <DisapprovalDialog
        open={openDisapprovalDialog}
        onClose={() => setOpenDisapprovalDialog(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

// List Component
export const ApprovalList = () => (
  <List filters={<ApprovalFilter />}>
    <Datagrid>
      <TextField source="title" />
      <TextField source="author" />
      <TextField source="description" label="Description" />
      <TextField source="approved" label="Approval State"/>
      <ShowButton label="View Details" icon={<Eye />} />
    </Datagrid>
  </List>
);

// Show Component
export const ApprovalShow = () => (
  <Show>
    <ApprovalShowContent />
  </Show>
);

// Separate component to access record context
const ApprovalShowContent = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  if (!record) return null;

  const handleViewFile = async (id: string) => {
    try {
      const url = `${apibase}/view/${id}/`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await tokenManager.getAuthHeaders()}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch document");

      const data = await response.json();
      if (!data.file_url) throw new Error("Invalid response from server");

      setFileType(record.file_extension);
      setFileUrl(data.file_url);
      setViewerOpen(true);
      notify("Document loaded successfully", { type: "success" });
    } catch (error) {
      console.error("Error viewing file:", error);
      notify("Error loading document", { type: "error" });
    }
  };

  return (
    <SimpleShowLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <SectionTitle variant="h6">
          <FileText size={20} /> Basic Information
        </SectionTitle>
        <Box display="flex" gap={2}>
          <Button 
            variant="contained"
            color="primary"
            startIcon={<Eye size={20} />}
            onClick={() => handleViewFile(record.id)}
            disabled={!record?.id} 
          >
            View File
          </Button>
          <ApprovalButton type="approved" />
          <ApprovalButton type="disapproved" />
        </Box>
      </Box>
      <InfoRow><Typography variant="subtitle1">Title:</Typography><TextField source="title" /></InfoRow>
      <InfoRow><Typography variant="subtitle1">Description:</Typography><TextField source="description" /></InfoRow>
      <Divider />

      <SectionTitle variant="h6"><User size={20} /> Author & Department</SectionTitle>
      <InfoRow><Typography variant="subtitle1">Author:</Typography><TextField source="author" /></InfoRow>
      <InfoRow><Typography variant="subtitle1">Department:</Typography><TextField source="department" /></InfoRow>
      <Divider />

      <SectionTitle variant="h6"><Calendar size={20} /> Timestamps</SectionTitle>
      <InfoRow><Typography variant="subtitle1">Created:</Typography><DateField source="created_at" showTime /></InfoRow>
      <InfoRow><Typography variant="subtitle1">Updated:</Typography><DateField source="updated_time" showTime /></InfoRow>

      <FileViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        fileUrl={fileUrl}
        fileName={record?.title || "Document"}
        fileType={fileType}
      />
    </SimpleShowLayout>
  );
};

export default ApprovalShow;