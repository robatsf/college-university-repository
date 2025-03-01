// src/components/librarians/LibrarianFilter.tsx
import React from "react";
import { Filter, TextInput, SelectInput } from "react-admin";
import { useDepartments } from "./useDepartments";

export const LibrarianFilter = (props) => {
  const departments = useDepartments();
  const approved= ['approved' ,'unapproved']
  
  return (
    <Filter {...props}>
      <TextInput label="Search" source="title" alwaysOn />
      <TextInput label="Author" source="author" />
      {/* <TextInput label="File Name" source="filename" /> */}
      {/* <SelectInput 
        label="Department" 
        source="department_id" 
        choices={departments}
        optionText="name"
        optionValue="id"
      /> */}
      <SelectInput label="approved" choices={approved} source="approved" />
    </Filter>
  );
};