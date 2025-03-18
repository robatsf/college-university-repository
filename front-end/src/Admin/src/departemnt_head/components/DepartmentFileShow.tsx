import React, { useState } from "react";
import { Show, SimpleShowLayout, TextField, DateField, Button, TopToolbar, useRecordContext, useNotify } from "react-admin";
import { Eye, FileText, User, Calendar } from "lucide-react";
import { Typography, Grid, Box, Divider, styled } from "@mui/material";
import FileViewer from "./FileViewer";
import { apibase } from "../../dataProvider";
import { tokenManager } from "../../utils/tokenManager";

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

// Toolbar for Viewing Documents
const DepartmentFileShowActions = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

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

      setFileType(record?.file_extension);
      setFileUrl(data.file_url);
      setViewerOpen(true);
      notify("Document loaded successfully", { type: "success" });
    } catch (error) {
      console.error("Error viewing file:", error);
      notify("Error loading document", { type: "error" });
    }
  };

  return (
    <>
      <TopToolbar>
        <Button 
          label="View File" 
          onClick={() => handleViewFile(record?.id)} 
          icon={<Eye size={20} />} 
          disabled={!record?.id} 
        />
      </TopToolbar>

      <FileViewer 
        open={viewerOpen} 
        onClose={() => setViewerOpen(false)} 
        fileUrl={fileUrl} 
        fileName={record?.title || "Document"} 
        fileType={fileType} 
      />
    </>
  );
};

// Main Component
const DepartmentFileShow = () => (
  <Show actions={<DepartmentFileShowActions />}>
    <SimpleShowLayout>
      <SectionTitle variant="h6"><FileText size={20} /> Basic Information</SectionTitle>
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
    </SimpleShowLayout>
  </Show>
);

export default DepartmentFileShow;
