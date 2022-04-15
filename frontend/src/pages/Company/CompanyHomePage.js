import React, { useState, useEffect } from "react";
import CompanyHeader from "../../Components/Company/CompanyHeader";
import { Button, TextField, Typography } from "@mui/material";
import img from "../../assets/images/Userpfp.jpg";
import { db, auth } from "../../firebase-config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import FormEdit from "../../Components/Company/FormEdit";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function CompanyHomePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [jobid, setjobid] = useState("");
  const [open, setOpen] = useState(false);
  let [editJob, setEditJob] = useState([]);
  const [jobsPosted, setJobsPosted] = useState();

  const jobCollection = collection(db, "Job");
  const userProfile = collection(db, "UserProfile");

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  const updateJob = async (id) => {
    setEditJob(jobs[id]);
    setjobid(jobs[id].id);
    openModal();
  };

  const deleteJob = async (id) => {
    const jobDoc = doc(db, "Job", jobs[id].id);
    await deleteDoc(jobDoc);
    window.location.reload();
  };

  const getJobs = async () => {
    const data = await getDocs(jobCollection);
    setJobs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  const getData = async () => {
    const d = await getDocs(jobCollection);

    const job = d.docs.map((doc) => ({ ...doc.data() }));

    setJobsPosted(job);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Function Calls
        getJobs();
      } else {
        navigate("/CompanySignIn");
      }
    });
    getData();
  }, [user, open]);

  if (loading) {
    return <div>loading...</div>;
  } else {
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
                <h3>Company</h3>
                <Typography>We are Hiring!</Typography>
              </div>
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
                <Button href="/postjob" size="small" variant="contained">
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
                <Typography>{jobsPosted.length}</Typography>
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

              {jobs.map((job, key) => {
                return (
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "20px",
                      margin: "50px",
                      borderRadius: "8px",
                    }}
                    key={key}
                  >
                    <h2>
                      {job.Title}, {job.Type}, {job.Mode}, {job.City}
                    </h2>
                    <Typography>{job.Description}</Typography>
                    <div>
                      <h2 style={{ color: "green" }}> {job.Salary} pkr</h2>
                      <Button
                        style={{ margin: "10px" }}
                        variant="outlined"
                        onClick={() => updateJob(key)}
                      >
                        Edit
                      </Button>
                      <Button
                        style={{
                          margin: "10px",
                        }}
                        variant="outlined"
                        color="error"
                        onClick={() => deleteJob(key)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <FormEdit
            id={jobid}
            key={jobid}
            open={open}
            close={closeModal}
            title={editJob.Title}
            description={editJob.Description}
            city={editJob.City}
            salary={editJob.Salary}
          />
        </div>
      </div>
    );
  }
}
