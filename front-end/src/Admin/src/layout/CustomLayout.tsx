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
import  DepartmentFileCreate  from "../departemnt_head/components/DepartmentFileCreate";
import DepartmentFileEdit from "../departemnt_head/components/DepartmentFileEdit";
import DepartmentFileList from "../departemnt_head/components/DepartmentFileList";
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
import DepartmentFileShow from "../departemnt_head/components/DepartmentFileShow";
import { LibrarianList } from "../libriance/components/LibrarianList";
import { LibrarianCreate } from "../libriance/components/LibrarianCreate";
import { LibrarianEdit } from "../libriance/components/LibrarianEdit";
import librarianFileShow from "../libriance/components/Librarianshow";
import { Home } from "lucide-react";
import { localhost } from "../App";

const RedirectResource = () => {
  localhost("/")
};

const roleResources = {
  librarian: [
    <Resource
      key="home"
      name="home"
      list={RedirectResource} 
      icon={Home} 
      options={{ label: "Home" }} 
    />,
    <Resource
      key="files"
      name="libapprovals"
      list={LibrarianList}
      create={LibrarianCreate}
      edit={LibrarianEdit}
      show={librarianFileShow}
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
  department_head: [
    <Resource
      key="home"
      name="home"
      list={RedirectResource} 
      icon={Home} 
      options={{ label: "Home" }} 
    />,
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
      name="department_files"
      list={DepartmentFileList}
      edit={DepartmentFileEdit}
      create={DepartmentFileCreate}
      show={DepartmentFileShow}
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