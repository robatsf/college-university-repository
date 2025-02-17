// src/components/Statistics.js
import React from "react";
import { List, Datagrid, TextField } from "react-admin";

export const StatisticsList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="metric" label="Metric" />
      <TextField source="value" label="Value" />
    </Datagrid>
  </List>
);
