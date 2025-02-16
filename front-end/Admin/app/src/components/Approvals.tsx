// src/components/Approvals.js
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  Show,
  SimpleShowLayout,
  useUpdate,
  useNotify,
  useRefresh,
  Filter,
} from "react-admin";
import { Button } from "@mui/material";

const ApprovalFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <TextInput label="Author" source="author" />
    <TextInput label="year" source="year" />
  </Filter>
);

const ApprovalButtonField = ({ source, label }) => {
  const [update, { loading }] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  if (!record) return null;

  const handleClick = () => {
    // Prepare update payload. For example, setting the field to true.
    const updateData = { [source]: true };

    update(
      "approvals", // resource name
      record.id,   // record id
      updateData,
      {
        onSuccess: () => {
          notify(`${label} update successful`, { type: "info" });
          refresh();
        },
        onFailure: () => {
          notify(`${label} update failed`, { type: "warning" });
        },
      }
    );
  };

  return (
    <Button
      variant="contained"
      size="small"
      onClick={handleClick}
      disabled={loading}
    >
      {label}: {record[source] ? "Yes" : "No"}
    </Button>
  );
};

export const ApprovalList = (props) => (
  <List filters={<ApprovalFilter />} {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="request" label="Request" />
      <TextField source="status" label="Status" />
      <TextField source="author" label="Author" />
      <TextField source="department" label="Department" />
      <TextField source="year" label="Year" />
      {/* Approved/Disapproved rendered as clickable buttons */}
      <ApprovalButtonField source="approved" label="Approved" />
      <ApprovalButtonField source="disapproved" label="Disapproved" />
      <EditButton />
    </Datagrid>
  </List>
);


// export const ApprovalEdit = () => (
//   <Edit>
//     <SimpleForm>
//       <TextInput source="request" label="Request" />
//       <TextInput source="status" label="Status" />
//       <TextInput source="author" label="Author" />
//       <TextInput source="description" label="Description" multiline />
//       <TextInput source="department" label="Department" />
//       <TextInput source="year" label="Year" />
//       <TextInput source="approved" label="Approved" />
//       <TextInput source="disapproved" label="Disapproved" />
//     </SimpleForm>
//   </Edit>
// );

/**
 * ApprovalShow view displays the details of an approval request.
 */
export const ApprovalShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="request" label="Request" />
      <TextField source="status" label="Status" />
      <TextField source="author" label="Author" />
      <TextField source="description" label="Description" />
      <TextField source="department" label="Department" />
      <TextField source="year" label="Year" />
      <ApprovalButtonField source="approved" label="Approved" />
      <ApprovalButtonField source="disapproved" label="Disapproved" />
    </SimpleShowLayout>
  </Show>
);
