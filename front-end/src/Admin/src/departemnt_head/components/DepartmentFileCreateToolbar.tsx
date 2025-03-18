// src/departemnt_head/components/DepartmentFileCreateToolbar.tsx
import React from "react";
import { Toolbar, SaveButton } from "react-admin";

const DepartmentFileCreateToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton label="Upload" />
  </Toolbar>
);

export default DepartmentFileCreateToolbar;