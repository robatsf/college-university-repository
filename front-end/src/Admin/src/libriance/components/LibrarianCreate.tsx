// src/components/librarians/LibrarianCreate.tsx
import React from "react";
import { Create, useNotify, useRedirect } from "react-admin";
import { LibrarianForm } from "./LibrarianForm";
import customDataProvider  from "../../dataProvider";

export const LibrarianCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSubmit = async (data) => {
    try {
      await customDataProvider.createfile("/create/", { data });
      notify("Librarian file created successfully", { type: "success" });
      redirect("/dashboard/libapprovals");
    } catch (error) {
      notify(`Error: ${error.message}`, { type: "error" });
    }
  };

  return (
    <Create>
      <LibrarianForm onSubmit={handleSubmit} />
    </Create>
  );
};