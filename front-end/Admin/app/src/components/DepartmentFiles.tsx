// src/components/DepartmentFiles.js
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Create,
  SimpleForm,
  TextInput,
  FileInput,
  FileField,
  required,
  Toolbar,
  SaveButton,
  Filter,
  Edit
} from "react-admin";

// Custom filter component for the list view
const DepartmentFileFilter = (props) => (
  <Filter {...props}>
    {/* Global search */}
    <TextInput label="Search" source="q" alwaysOn />
    <TextInput label="Author" source="author" />
    <TextInput label="File Name" source="filename" />
  </Filter>
);

// Custom toolbar for the create form with a custom save button label.
const DepartmentFileCreateToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton label="Upload" />
  </Toolbar>
);

export const DepartmentFileList = () => (
  <List filters={<DepartmentFileFilter />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="filename" label="File Name" />
      <TextField source="author" label="Author" />
      <TextField source="department" label="Department" />
      <TextField source="description" label="Description" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const DepartmentFileCreate = () => (
  <Create>
    <SimpleForm toolbar={<DepartmentFileCreateToolbar />}>
      {/* File title/name */}
      <TextInput
        source="filename"
        label="File Name"
        fullWidth
        validate={[required()]}
      />

      {/* Author name input */}
      <TextInput
        source="author"
        label="Author Name"
        fullWidth
        validate={[required()]}
      />

      {/* Department field preset with a default value and disabled */}
      <TextInput
        source="department"
        label="Department"
        defaultValue="Default Department"
        fullWidth
        disabled
      />

      {/* Project/Research description field */}
      <TextInput
        source="description"
        label="Project/Research Description"
        multiline
        fullWidth
        validate={[required()]}
      />

      {/* File upload field accepting PDF, DOC, and DOCX files */}
      <FileInput
        source="file"
        label="Upload File"
        accept={{
          "application/pdf": [".pdf"],
          "application/msword": [".doc"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        }}
        validate={[required()]}
      >
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Create>
);

export const DepartmentFileEdit = () => (
  <Edit>
 <SimpleForm toolbar={<DepartmentFileCreateToolbar />}>
      {/* File title/name */}
      <TextInput
        source="filename"
        label="File Name"
        fullWidth
        validate={[required()]}
      />

      {/* Author name input */}
      <TextInput
        source="author"
        label="Author Name"
        fullWidth
        validate={[required()]}
      />

      {/* Department field preset with a default value and disabled */}
      <TextInput
        source="department"
        label="Department"
        defaultValue="Default Department"
        fullWidth
        disabled
      />

      {/* Project/Research description field */}
      <TextInput
        source="description"
        label="Project/Research Description"
        multiline
        fullWidth
        validate={[required()]}
      />

      {/* File upload field accepting PDF, DOC, and DOCX files */}
      <FileInput
        source="file"
        label="Upload File"
        accept={{
          "application/pdf": [".pdf"],
          "application/msword": [".doc"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        }}
        validate={[required()]}
      >
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Edit>
);

