import * as React from "react";
import Typography from "@mui/material/Typography";
import AdminHeader from "../../Components/Admin/Adminheader";

export default function AdminDashboard() {
  return (
    <div style={{ backgroundColor: "#f3f2ef" }}>
      <AdminHeader />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          padding: "50px",
          margin: "10px",
        }}
      >
        <div
          style={{
            borderRadius: "10px",
            padding: "15px",
            backgroundColor: "#fff",
            border: "2px solid blue",
          }}
        >
          <h2>Pending Approvals</h2>
          <Typography>125</Typography>
        </div>
        <div
          style={{
            borderRadius: "10px",
            padding: "15px",
            backgroundColor: "#fff",
            border: "2px solid blue",
          }}
        >
          <h2>Jobs Posted</h2>
          <Typography>125</Typography>
        </div>
        <div
          style={{
            borderRadius: "10px",
            padding: "15px",
            backgroundColor: "#fff",
            border: "2px solid blue",
          }}
        >
          <h2>Users Registered</h2>
          <Typography>125</Typography>
        </div>
        <div
          style={{
            borderRadius: "10px",
            padding: "15px",
            backgroundColor: "#fff",
            border: "2px solid blue",
          }}
        >
          <h2>Companies registered</h2>
          <Typography>125</Typography>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          padding: "50px",
          margin: "10px",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            borderRadius: "10px",
            height: "400px",
            width: "500px",
            margin: "10px",
            backgroundColor: "#fff",
            border: "2px solid blue",
          }}
        >
          <h2>Users Joining</h2>
        </div>
        <div
          style={{
            borderRadius: "10px",
            height: "400px",
            width: "500px",
            margin: "10px",
            backgroundColor: "#fff",
            border: "2px solid blue",
          }}
        >
          <h2>Companies Joining</h2>
        </div>
      </div>
    </div>
  );
}
