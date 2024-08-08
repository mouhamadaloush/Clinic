import React, { useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";
import { Box, Container, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/actions/UsersActions";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "first_name", headerName: "First name", width: 200 },
  { field: "last_name", headerName: "Last name", width: 200 },
  {
    field: "email",
    headerName: "Email",
    width: 450,
  },

  {
    field: "dob",
    headerName: "DOB",
    width: 200,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 300,
  },

  {
    field: "gender",
    headerName: "Gender",
    width: 200,
  },

  {
    field: "is_staff",
    headerName: "Admin",
    width: 150,
  },
];

const AllUsers = () => {
  const dispatch = useDispatch();

  const { loading, users } = useSelector((state) => state.allUsers);

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  if (users) {
    console.log(users);
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        backgroundImage: "linear-gradient(180deg, #003c44 0%,  #00929d 100%)",
        overflowX: "hidden",
      }}
    >
      {/* <Container
        sx={{ transform: { xs: "translateY(15%)", sm: "translateY(25%)" } }}
      > */}

      {loading === true ? null : (
        <DataGrid
          rows={users ? users : []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 15, 20, 30]}
          checkboxSelection
          sx={{
            backgroundColor: "white",
            height: "calc(100vh - 64px)",
            fontSize: "20px",
          }}
        />
      )}

      {/* </Container> */}
    </Box>
  );
};

export default AllUsers;
