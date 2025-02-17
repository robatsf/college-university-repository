// src/layout/CustomLayout.js
import { Resource } from "react-admin";
import { Box } from "@mui/material";
import { 
  FileText, 
  ClipboardCheck, 
  BarChart2, 
  FolderPlus,
  Lock
} from "lucide-react";
import { CustomTopBar } from '../components/CustomTopBar';
import { 
  FileList, 
  FileCreate, 
  FileEdit,
} from "../libriance/librianiesFiles";
import { 
  DepartmentFileList, 
  DepartmentFileCreate ,
  DepartmentFileEdit
} from "../departemnt_head/DepartmentFiles";
import { 
  ApprovalList, 
  ApprovalShow 
} from "../departemnt_head/Approvals";
// import { 
//   StatisticsList 
// } from "../components/Statistics";

import { ThemeProvider,createTheme } from '@mui/material/styles';
import { Layout, LayoutProps  } from 'react-admin';
import {UpdateLibriancePassword} from '../libriance/Updatepassword'
import {UpdateDepartemntPassword} from '../departemnt_head/Updatepassword'

const roleResources = {
  librarian: [
    <Resource
      key="files"
      name="files"
      list={FileList}
      create={FileCreate}
      edit={FileEdit}
      icon={FileText}
      options={{ 
        label: 'Library Files',
      }}
    />,
    <Resource
      key="updatePassword"
      name="updatePassword"
      list={UpdateLibriancePassword}
      icon={Lock}
      options={{ 
        label: 'Update Password',
      }}
    />,
  ],
  departmentHead: [
    <Resource
      key="approvals"
      name="approvals"
      list={ApprovalList}
      show={ApprovalShow}
      icon={ClipboardCheck}
      options={{ 
        label: 'Department Approvals',
      }}
    />,
    // <Resource
    //   key="statistics"
    //   name="statistics"
    //   list={StatisticsList}
    //   icon={BarChart2}
    //   options={{ 
    //     label: 'Department Statistics',
    //   }}
    // />,
    <Resource
      key="deptfiles"
      name="deptfiles"
      list={DepartmentFileList}
      edit={DepartmentFileEdit}
      create={DepartmentFileCreate}
      icon={FolderPlus}
      options={{ 
        label: 'Department Files',
      }}
    />,
    <Resource
      key="updatePassword"
      name="updatePassword"
      list={UpdateDepartemntPassword}
      icon={Lock}
      options={{ 
        label: 'Update Password',
      }}
    />,
  ],
};

// Custom theme
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
        },
      },
    },
  },
});

// Custom Layout component
const CustomLayout = (props: LayoutProps) => {
  const role = localStorage.getItem('role') || 'librarian';

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CustomTopBar role={role} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 3, // Add padding top to account for AppBar height
          }}
        >
          <Layout 
            {...props} 
            sx={{
              '& .RaLayout-content': {
               pl:5
              },
            }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export { roleResources, CustomLayout };