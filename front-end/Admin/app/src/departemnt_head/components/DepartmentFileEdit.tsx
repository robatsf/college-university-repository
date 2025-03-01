import React from "react";
import { 
  Edit, 
  SimpleForm, 
  TextInput, 
  FileInput, 
  FileField, 
  required, 
  useNotify, 
  useRedirect,  
} from "react-admin";
import DepartmentFileCreateToolbar from "./DepartmentFileCreateToolbar";
import customDataProvider from "../../dataProvider";

const DepartmentFileEdit = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSubmit = async (data) => {
    try {
      await customDataProvider.update("department_files", {
        id: data.id, // Sending the ID for updating
        data,
      });
      notify("Department file updated successfully", { type: "success" });
      redirect("/department_files");
    } catch (error) {
      notify(`Error: ${error.message}`, { type: "error" });
    }
  };

  return (
    <Edit {...props}>
      <SimpleForm toolbar={<DepartmentFileCreateToolbar />} onSubmit={handleSubmit}>
        {/* Removed the ID field from the form */}
        <TextInput source="title" label="Title" fullWidth validate={[required()]} />
        <TextInput source="author" label="Author Name" fullWidth validate={[required()]} />
        {/* <TextInput source="departemnt" label="Department" defaultValue="Default Department" fullWidth disabled /> */}
        <TextInput source="description" label="Project/Research Description" multiline fullWidth validate={[required()]} />
        <FileInput 
          source="file" 
          label="Upload File" 
          accept={{
            "application/pdf": [".pdf"], 
          }} 
        >
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Edit>
  );
};

export default DepartmentFileEdit;