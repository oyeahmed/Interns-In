import React, { useState } from "react";
import CompanyHeader from "../../Components/Company/CompanyHeader";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@mui/material";
import Userpfp from "../../assets/images/Userpfp.jpg";

export default function () {
  const [startDate, setStartDate] = useState(null);
  return (
    <div style={{ backgroundColor: "#f3f2ef" }}>
      <CompanyHeader />
      <div
        style={{ marginTop: "50px", display: "flex", justifyContent: "center" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "800px",
            backgroundColor: "white",
            borderRadius: "10px",
            height: "730px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ padding: "10px", margin: "20px" }}>Add A New Post</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "600px",
              height: "600px",
            }}
          >
            <TextField style={{ margin: "10px" }} fullWidth label="Job Title" />
            <TextField
              style={{ margin: "10px" }}
              fullWidth
              label="Job Description"
            />
            <h3>Job Type</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                }}
              >
                <FormGroup>
                  <FormControlLabel control={<Checkbox />} label="Full Time" />
                  <FormControlLabel control={<Checkbox />} label="Part Time" />
                </FormGroup>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                }}
              >
                <FormGroup>
                  <FormControlLabel control={<Checkbox />} label="Internship" />
                  <FormControlLabel control={<Checkbox />} label="Job" />
                </FormGroup>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                }}
              >
                <FormGroup>
                  <FormControlLabel control={<Checkbox />} label="Online" />
                  <FormControlLabel control={<Checkbox />} label="Physical" />
                </FormGroup>
              </div>
            </div>
            <h4>Set Salary</h4>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <TextField label="Minimum Salary" />
              <TextField label="Maximum Salary" />
            </div>
            <h4>Set Location and Deadline</h4>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <TextField label="City Name" />
              <div>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
            </div>
            <div style={{ padding: "40px" }}>
              <Button variant="contained">Post</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
