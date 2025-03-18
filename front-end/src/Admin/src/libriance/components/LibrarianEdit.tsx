// src/components/librarians/LibrarianEdit.tsx
import React from "react";
import { Edit } from "react-admin";
import { LibrarianForm } from "./LibrarianForm";

export const LibrarianEdit = () => (
  <Edit>
    <LibrarianForm isEdit={true} />
  </Edit>
);