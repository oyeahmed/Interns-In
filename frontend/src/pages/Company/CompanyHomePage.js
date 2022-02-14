import React, { useState } from "react";
import CompanyHeader from "../../Components/Company/CompanyHeader";
import { Button, Checkbox, TextField, Typography } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import img from "../../assets/images/Userpfp.jpg";

export default function CompanyHomePage() {
  return (
    <div style={{ backgroundColor: "#f3f2ef" }}>
      <CompanyHeader />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "10px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "15px",
              width: "200px",
              marginTop: "40px",
              borderRadius: "8px",
              marginBottom: "5px",
            }}
          >
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <img
                style={{ borderRadius: "110px", marginTop: "-75px" }}
                width="150px"
                height="150px"
                src={img}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h3>Company XYZ</h3>
              <Typography>We are Hiring!</Typography>
            </div>
          </div>
          <div
            style={{
              padding: "15px",
              margin: "5px",
              backgroundColor: "#fff",
              width: "200px",
              borderRadius: "8px",
            }}
          >
            <h2>Jobs Posted</h2>
            <div style={{ padding: "10px" }}>
              <h3>Software Engineer</h3>
              <Button size="small" variant="outlined">
                View Applicants
              </Button>
            </div>
            <div style={{ padding: "10px", marginBottom: "20px" }}>
              <h3>SQA Engineer</h3>
              <Button size="small" variant="outlined">
                View Applicants
              </Button>
            </div>
            <Button size="small" variant="contained">
              View all
            </Button>
          </div>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "15px",
              margin: "5px",
              width: "200px",
              borderRadius: "8px",
            }}
          >
            <h3>Pending Interviews</h3>
            <div style={{ padding: "10px" }}>
              <h4>Ahmed Shabbir</h4>
              <Button size="small" variant="outlined">
                View Profile
              </Button>
            </div>
            <div style={{ padding: "10px" }}>
              <h3>Abdullah Shahzad</h3>
              <Button size="small" variant="outlined">
                View Profile
              </Button>
            </div>
            <div style={{ padding: "10px", marginBottom: "20px" }}>
              <h3>Muaaz Shabbir</h3>
              <Button size="small" variant="outlined">
                View Profile
              </Button>
            </div>
            <Button size="small" variant="contained">
              View all
            </Button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              flexWrap: "wrap",
              alignContent: "flex-start",
              padding: "20px",
              margin: "10px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div
              style={{
                borderRadius: "10px",
                padding: "15px",
                backgroundColor: "#fff",
                border: "2px solid blue",
                margin: "10px",
                width: "200px",
              }}
            >
              <h2>Post a Job</h2>
              <Button size="small" variant="contained">
                Add
              </Button>
            </div>
            <div
              style={{
                borderRadius: "10px",
                padding: "15px",
                backgroundColor: "#fff",
                border: "2px solid blue",
                margin: "10px",
                width: "200px",
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
                margin: "10px",
                width: "200px",
              }}
            >
              <h2>Pending Interviews</h2>
              <Typography>125</Typography>
            </div>
            <div
              style={{
                borderRadius: "10px",
                padding: "15px",
                backgroundColor: "#fff",
                border: "2px solid blue",
                margin: "10px",
                width: "200px",
              }}
            >
              <h2>Employees</h2>
              <Typography>125</Typography>
            </div>
          </div>
          <div>
            <h2>Posts</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
