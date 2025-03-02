// src/components/DepartmentFileCreate.tsx
import React from "react";
import { Create, SimpleForm, TextInput, FileInput, FileField, required, useNotify, useRedirect } from "react-admin";
import customDataProvider from "../../dataProvider";
import DepartmentFileCreateToolbar from "./DepartmentFileCreateToolbar";

const DepartmentFileCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSubmit = async (data) => {
    try {
      await customDataProvider.createfile("/create/", { data });
      notify("Department file created successfully", { type: "success" });
      redirect("/department_files");
    } catch (error) {
      notify(`Error: ${error.message}`, { type: "error" });
    }
  };

  return (
    <Create>
      <SimpleForm onSubmit={handleSubmit} toolbar={<DepartmentFileCreateToolbar />}>
        <TextInput source="filename" label="File Name" fullWidth validate={[required()]} />
        <TextInput source="author" label="Author Name" fullWidth validate={[required()]} />
        <TextInput source="department" label="Department" defaultValue="Default Department" fullWidth disabled />
        <TextInput source="description" label="Project/Research Description" multiline fullWidth validate={[required()]} />
        <FileInput source="file" label="Upload File" accept={{ "application/pdf": [".pdf"]}} validate={[required()]}>
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};

export default DepartmentFileCreate;