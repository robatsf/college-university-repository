import React, { useState, useEffect } from "react";
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
  Edit,
  SelectInput,
} from "react-admin";
import { tokenManager } from "../utils/tokenManager";
import { apibase } from "../dataProvider";

// Custom hook for fetching departments
const useDepartments = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = await tokenManager.getAuthHeaders();
        if (!token) throw new Error('No token found');

        const response = await fetch(`${apibase}/departments/?all=true`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch departments');
        
        const result = await response.json();
        
        if (result.status === 'success') {
          // Transform departments for SelectInput
          const departmentChoices = result.data.departments.map(dept => ({
            id: dept.id,
            name: dept.name
          }));
          setDepartments(departmentChoices);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, []);

  return departments;
};

const FileFilter = (props) => {
  const departments = useDepartments();
  
  return (
    <Filter {...props}>
      <TextInput label="Search" source="q" alwaysOn />
      <TextInput label="Author" source="author" />
      <TextInput label="File Name" source="filename" />
      <SelectInput 
        label="Department" 
        source="department_id" 
        choices={departments}
        optionText="name"
        optionValue="id"
      />
      <TextInput label="status" source="status" />
    </Filter>
  );
};

const DepartmentFileCreateToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton label="Upload" />
  </Toolbar>
);

export const FileList = () => (
  <List filters={<FileFilter />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="filename" label="File Name" />
      <TextField source="author" label="Author" />
      <TextField source="department.name" label="Department" />
      <TextField source="description" label="Description" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const FileForm = ({ isEdit = false }) => {
  const departments = useDepartments();

  return (
    <SimpleForm toolbar={<DepartmentFileCreateToolbar />}>
      <TextInput
        source="filename"
        label="File Name"
        fullWidth
        validate={[required()]}
      />
      <TextInput
        source="author"
        label="Author Name"
        fullWidth
        validate={[required()]}
      />
      <SelectInput
        source="department_id"
        label="Department"
        choices={departments}
        optionText="name"
        optionValue="id"
        fullWidth
        validate={[required()]}
      />
      <TextInput
        source="description"
        label="Project/Research Description"
        multiline
        fullWidth
        validate={[required()]}
      />
      {!isEdit && (
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
      )}
    </SimpleForm>
  );
};

export const FileEdit = () => (
  <Edit>
    <FileForm isEdit={true} />
  </Edit>
);

export const FileCreate = () => (
  <Create>
    <FileForm />
  </Create>
);






