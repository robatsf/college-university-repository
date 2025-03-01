import React from "react";
import { Filter, TextInput } from "react-admin";

const DepartmentFileFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="title" alwaysOn />
    <TextInput label="Author" source="author" />
  </Filter>
);

export default DepartmentFileFilter;
