import React from "react";
import { Box, Typography, Button, Dialog, IconButton, styled } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

const ViewerDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    height: "99vh",
    maxWidth: "99vw",
    width: "90vw",
    backgroundColor: "#f5f5f5",
  },
}));

const ViewerHeader = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 16px",
  backgroundColor: "#fff",
  borderBottom: "1px solid #e0e0e0",
}));

const ViewerContent = styled(Box)(() => ({
  height: "calc(90vh - 64px)",
  overflow: "auto",
  padding: "16px",
  display: "flex",
  justifyContent: "center",
  backgroundColor: "#f5f5f5",
}));

interface FileViewerProps {
  open: boolean;
  onClose: () => void;
  fileUrl: string | null;
  fileName: string | null;
}

const FileViewer: React.FC<FileViewerProps> = ({
  open,
  onClose,
  fileUrl,
  fileName,
}) => {
  const handleDownload = () => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ViewerDialog open={open} onClose={onClose}>
      <ViewerHeader>
        <Typography variant="h6">{fileName || "Document"}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={handleDownload}
            title="Download"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5 
            }}
          >
            <DownloadIcon />
            <Typography variant="button">Download</Typography>
          </IconButton>
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{ ml: 1 }}
            title="Close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </ViewerHeader>
      <ViewerContent>
        {fileUrl ? (
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0&view=FitH&zoom=50`}
            title="PDF Viewer"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              WebkitTouchCallout: "none",
              userSelect: "none",
              "-webkit-user-select": "none",
              "-moz-user-select": "none",
              "-ms-user-select": "none",
              overflow: "auto",
            }}
            onContextMenu={(e) => e.preventDefault()}
          />
        ) : (
          <Typography>No file URL provided.</Typography>
        )}
      </ViewerContent>
    </ViewerDialog>
  );
};

export default FileViewer;