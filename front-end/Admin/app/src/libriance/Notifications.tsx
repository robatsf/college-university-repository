// src/components/Notifications.js
import React from "react";
import { List, Datagrid, TextField, DateField } from "react-admin";

export const NotificationList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="message" label="Notification" />
      <DateField source="date" />
    </Datagrid>
  </List>
);
