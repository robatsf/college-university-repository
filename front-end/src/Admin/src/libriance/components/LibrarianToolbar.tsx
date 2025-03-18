// src/components/librarians/LibrarianToolbar.tsx
import React from "react";
import { Toolbar, SaveButton } from "react-admin";

export const LibrarianToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton label="Upload" />
  </Toolbar>
);