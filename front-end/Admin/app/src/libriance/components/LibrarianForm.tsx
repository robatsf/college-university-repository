// src/components/librarians/LibrarianForm.tsx
import React from "react";
import { SimpleForm, TextInput, SelectInput, FileInput, FileField, required } from "react-admin";
import { useDepartments } from "./useDepartments";
import { LibrarianToolbar } from "./LibrarianToolbar";

interface LibrarianFormProps {
  isEdit?: boolean;
  onSubmit?: (data: any) => Promise<void>;
}

export const LibrarianForm: React.FC<LibrarianFormProps> = ({ 
  isEdit = false, 
  onSubmit 
}) => {
  const departments = useDepartments();

  return (
    <SimpleForm 
      toolbar={<LibrarianToolbar />}
      onSubmit={onSubmit}
    >
      <TextInput
        source="title"
        label="Title"
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
        source="departemnt_id"
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

        <FileInput
          source="file"
          label="Upload File"
          accept={{
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
          }}
          validate={!isEdit ? [required()] : undefined}
        >
          <FileField source="src" title="title" />
        </FileInput>
    </SimpleForm>
  );
};