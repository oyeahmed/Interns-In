import React, { useState, useEffect, useRef } from "react";
import { Button, Checkbox, TextField, Typography } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import UserHeader from "../../Components/User/Userheader";
import SearchIcon from "@mui/icons-material/Search";
import img from "../../assets/images/Userpfp.jpg";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CircularProgress from "@mui/material/CircularProgress";

import { db, auth } from "../../firebase-config";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import CallIcon from "@mui/icons-material/Call";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { forwardRef } from "react";
import SavedJobs from "./SavedJobs";
import VideocamIcon from "@mui/icons-material/Videocam";
import "../Company/index.css";
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//video call code----------------------------------------------------------------------------------------------------------------------------------------------

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);

function Videos({ mode, callId, setPage }) {
  const [webcamActive, setWebcamActive] = useState(false);
  const [roomId, setRoomId] = useState(callId);

  const localRef = useRef();
  const remoteRef = useRef();

  const hangUp = async () => {
    pc.close();

    if (roomId) {
      const roomRef = doc(db, "calls", roomId);
      await getDocs(collection(roomRef, "answerCandidates")).then(
        (querySnapshot) => {
          querySnapshot.forEach((d) => {
            deleteDoc(d.ref);
          });
        }
      );

      await getDocs(collection(roomRef, "offerCandidates")).then(
        (querySnapshot) => {
          querySnapshot.forEach((d) => {
            deleteDoc(d.ref);
          });
        }
      );

      await deleteDoc(roomRef);
    }

    window.location.reload();
  };

  const setupSources = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    localRef.current.srcObject = localStream;
    remoteRef.current.srcObject = remoteStream;

    setWebcamActive(true);

    if (mode === "create") {
      const callDoc = doc(collection(db, "calls"));
      const offerCandidates = collection(callDoc, "offerCandidates");
      const answerCandidates = collection(callDoc, "answerCandidates");

      setRoomId(callDoc.id);
      // console.log()

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          addDoc(offerCandidates, event.candidate.toJSON());
        }
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await setDoc(callDoc, { offer });

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });

      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
    } else if (mode === "join") {
      const callDoc = doc(db, "calls", callId);
      const answerCandidates = collection(callDoc, "answerCandidates");
      const offerCandidates = collection(callDoc, "offerCandidates");

      pc.onicecandidate = (event) => {
        event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
      };

      const callData = (await getDoc(callDoc)).data();

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await updateDoc(callDoc, { answer });

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    }

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected") {
        hangUp();
      }
    };
  };

  return (
    <div
      className="videos"
      // style = {{display : 'flex', backgroundColor: 'white', height :'100%'}}
      // className="flex items-center whitespace-nowrap bg-whitetext-black"
    >
      <video ref={localRef} autoPlay playsInline className="local" muted />
      <video ref={remoteRef} autoPlay playsInline className="remote" />

      <div className="buttonsContainer">
        <Button
          variant="contained"
          style={{ backgroundColor: "red" }}
          type="button"
          onClick={hangUp}
          disabled={!webcamActive}
          className="hangup button"
        >
          <CallIcon />
        </Button>
        <div
          style={{ backgroundColor: "#401F86" }}
          tabIndex={0}
          role="button"
          className="more button"
        >
          <MoreVertIcon />
          <div
            className="popover"
            style={{
              backgroundColor: "blue",
            }}
          >
            <Button
              variant="contained"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                console.log(roomId);
              }}
            >
              <ContentCopyIcon />
              Copy joining code
            </Button>
          </div>
        </div>
      </div>

      {!webcamActive && (
        <div className="modalContainer">
          <div
            className="modal"
            style={{ display: "flex", flexDirection: "column", color: "black" }}
          >
            <h3>By pressing start your camera and microphone will turn on</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                margin: "25px",
              }}
              // className="container"
              color="primary"
              // className="flex gap-4 mt-8"
            >
              <Button
                type="button"
                variant="contained"
                onClick={setupSources}
                style={{ backgroundColor: "green" }}
                // fullWidth
              >
                Start
              </Button>

              <Button
                type="button"
                // fullWidth
                variant="contained"
                onClick={() => setPage("home")}
                style={{ backgroundColor: "red" }}
                // className="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Menu({ joinCode, setJoinCode, setPage }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <input
        required
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        placeholder="Join with code"
        style={{ marginBottom: "10px" }}
      />
      <Button style={{ color: "white" }} onClick={() => setPage("join")}>
        Join
      </Button>
    </div>
  );
}
//=========================================================================================================================================

export default function UserHomepage() {
  const navigate = useNavigate();

  const [searchJob, setSearchJob] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobsShown, setJobsShown] = useState([]);
  const [user, setUser] = useState(null);
  const [UserInfo, setUserInfo] = useState([]);

  const [loading, setLoading] = useState(true);

  const jobCollection = collection(db, "Job");
  const UserCollection = collection(db, "UserProfile");

  // apply now snackbars
  const [warningOpen, setWarningOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const [saveOpen, setSaveOpen] = useState(false);
  const [alreadySaveOpen, setAlreadySaveOpen] = useState(false);
  const [searchResult, setSearchResult] = useState(false);

  //VideoCall
  const [currentPage, setCurrentPage] = useState("home");
  const [joinCode, setJoinCode] = useState("");

  const handleSearchResult = () => {
    setSearchResult(true);
  };

  const handleSearchResultClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSearchResult(false);
  };

  const handleSaveClick = () => {
    setSaveOpen(true);
  };

  const handleSaveClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSaveOpen(false);
  };

  const handleAlreadySaveClick = () => {
    setAlreadySaveOpen(true);
  };

  const handleAlreadySaveClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlreadySaveOpen(false);
  };

  const handleWarningClick = () => {
    setWarningOpen(true);
  };

  const handleWarningClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setWarningOpen(false);
  };

  const handleApplyClick = () => {
    setApplyOpen(true);
  };

  const handleApplyClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setApplyOpen(false);
  };

  const handleSuccessClick = () => {
    setSuccessOpen(true);
  };

  const handleSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessOpen(false);
  };

  const saveJob = async (id) => {
    const data = await getDocs(UserCollection);
    const profiles = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const userData = profiles.filter((u) => u.Email == user?.email);

    const saveJobRef = collection(db, `UserProfile/${userData[0].id}/savejobs`);
    const d = await getDocs(saveJobRef);
    const saveJobs = d.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    const jobDetails = jobs?.filter((j) => j.id == id);

    if (saveJobs[0]?.jobid == id) {
      handleAlreadySaveClick();
    } else {
      await addDoc(collection(db, `UserProfile/${userData[0].id}/savejobs`), {
        title: jobDetails[0].Title,
        city: jobDetails[0].City,
        description: jobDetails[0].Description,
        mode: jobDetails[0].Mode,
        salary: jobDetails[0].Salary,
        type: jobDetails[0].Type,
        company: jobDetails[0].company,
        postedby: jobDetails[0].postedby,
        jobid: id,
      });

      handleSaveClick();
    }
  };

  const applyJob = async (id) => {
    const d = await getDocs(UserCollection);
    const profiles = d.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const userData = profiles.filter((u) => u.Email == user?.email);

    const applicantsReference = collection(db, `Job/${id}/applicants`);
    const applicantsData = await getDocs(applicantsReference);
    const applicants = applicantsData.docs?.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const applicantFilter = applicants.filter(
      (j) => j.applicantEmail == user?.email
    );
    console.log(applicants);

    const jobDetails = jobs?.filter((j) => j.id == id);

    if (applicantFilter[0]?.applicantEmail == user?.email) {
      handleWarningClick();
    } else {
      const a = await addDoc(collection(db, `Job/${id}/applicants`), {
        applicantEmail: user?.email,
        firstname: userData[0]?.FirstName,
        lastname: userData[0]?.LastName,
        pfp: userData[0]?.Pfp,
        resume: userData[0]?.cv,
        bio: userData[0]?.bio,
        address: userData[0]?.address,
        about: userData[0]?.about,
        city: userData[0]?.city,
        province: userData[0]?.province,
        applicantid: userData[0]?.id,
      });

      await addDoc(
        collection(db, `UserProfile/${userData[0]?.id}/appliedJobs`),
        {
          title: jobDetails[0].Title,
          city: jobDetails[0].City,
          description: jobDetails[0].Description,
          mode: jobDetails[0].Mode,
          salary: jobDetails[0].Salary,
          type: jobDetails[0].Type,
          company: jobDetails[0].company,
          postedby: jobDetails[0].postedby,
          jobid: id,
        }
      );

      handleSuccessClick();
    }
  };

  const search = async () => {
    if (searchJob !== "") {
      const results = jobs.filter((job) => {
        return job?.Title?.toLowerCase().startsWith(searchJob);
        // Use the toLowerCase() method to make it case-insensitive
      });

      setJobsShown(results);

      if (results.length == 0) {
        handleSearchResult();
      }
    } else {
      setJobsShown(jobs);

      // If the text field is empty, show all jobs
    }
  };

  const getJobs = async () => {
    const data = await getDocs(jobCollection);
    const x = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setJobs(x);
    setJobsShown(x);
    setLoading(false);
  };

  const getUserInfo = async () => {
    const data = await getDocs(UserCollection);
    const profiles = data.docs.map((doc) => ({ ...doc.data() }));
    const userData = profiles.filter((i) => i.Email == user?.email);

    setUserInfo(userData[0]);
    console.log(UserInfo);

    setLoading(false);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (user) {
        // get user info
        getUserInfo();

        // get jobs
        getJobs();
      }
    });
  }, [user]);

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <div style={{ backgroundColor: "#f3f2ef" }}>
        <UserHeader />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "40px",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginRight: "40px",
              // width: "300px",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                width: "250px",
                marginTop: "40px",
                borderRadius: "8px",
                marginBottom: "5px",
              }}
            >
              {UserInfo?.Pfp ? (
                <div
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <img
                    style={{
                      borderRadius: "110px",
                      marginTop: "-75px",
                      backgroundColor: "white",
                    }}
                    width="150px"
                    height="150px"
                    src={UserInfo?.Pfp}
                  />
                </div>
              ) : (
                <div
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <img
                    style={{
                      borderRadius: "110px",
                      marginTop: "-75px",
                      backgroundColor: "white",
                      border: "blue 2px solid",
                    }}
                    width="150px"
                    height="150px"
                  />
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <h3>{UserInfo?.FirstName + " " + UserInfo?.LastName}</h3>
                <Typography>{UserInfo?.bio}</Typography>
              </div>
            </div>

            <div
              style={{
                padding: "15px",
                margin: "5px",
                backgroundColor: "#fff",
                width: "200px",
                borderRadius: "8px",
                width: "250px",
                color: "white",
                backgroundColor: "#2563eb",
              }}
            >
              <h4>Video Conference</h4>
              <div className="app">
                {currentPage === "home" ? (
                  <Menu
                    joinCode={joinCode}
                    setJoinCode={setJoinCode}
                    setPage={setCurrentPage}
                  />
                ) : (
                  <Videos
                    mode={currentPage}
                    callId={joinCode}
                    setPage={setCurrentPage}
                  />
                )}
              </div>
            </div>

            <div
              style={{
                padding: "15px",
                margin: "5px",
                backgroundColor: "#fff",
                width: "200px",
                borderRadius: "8px",
                width: "250px",
              }}
            >
              <h2>Top companies</h2>
              <div style={{ padding: "10px" }}>
                <h3>Systems Limited</h3>
                <Button size="small" variant="outlined">
                  View Profile
                </Button>
              </div>
            </div>
          </div>
          <div style={{ padding: "10px" }}>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  margin: "10px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <input
                  type="search"
                  value={searchJob}
                  onChange={(e) => {
                    setSearchJob(e.target.value);
                  }}
                  className="input"
                  placeholder="Search Jobs"
                  style={{
                    width: "650px",
                    height: "50px",
                    border: "2px solid #2563eb",
                  }}
                ></input>
                <Button
                  style={{
                    marginTop: "5px",
                    height: "40px",
                  }}
                  size="small"
                  onClick={() => search()}
                >
                  <SearchIcon />
                </Button>
              </div>
            </div>
            <div>
              <h2>Posts</h2>
              {jobsShown.map((job, key) => {
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
                    <h2 style={{ color: "green" }}> {job.Salary} pkr</h2>
                    <Button
                      style={{ margin: "10px" }}
                      variant="contained"
                      onClick={() => applyJob(job.id)}
                    >
                      Apply now
                    </Button>
                    <Button
                      style={{
                        margin: "10px",
                      }}
                      onClick={() => saveJob(job.id)}
                      color="success"
                      variant="outlined"
                    >
                      <BookmarkIcon sx={{ marginRight: "3px" }}></BookmarkIcon>{" "}
                      save
                    </Button>
                  </div>
                );
              })}
            </div>
            <Snackbar
              open={warningOpen}
              autoHideDuration={2000}
              onClose={handleWarningClose}
            >
              <Alert
                onClose={handleWarningClose}
                sx={{ width: "100%" }}
                severity="warning"
              >
                You have already applied to this Job
              </Alert>
            </Snackbar>

            <Snackbar
              open={applyOpen}
              autoHideDuration={2000}
              onClose={handleApplyClose}
            >
              <Alert
                onClose={handleApplyClose}
                sx={{ width: "100%" }}
                severity="warning"
              >
                Please complete your Profile first
              </Alert>
            </Snackbar>

            <Snackbar
              open={searchResult}
              autoHideDuration={2000}
              onClose={handleSearchResultClose}
            >
              <Alert
                onClose={handleSearchResultClose}
                sx={{ width: "100%" }}
                severity="warning"
              >
                No jobs Found
              </Alert>
            </Snackbar>

            <Snackbar
              open={successOpen}
              autoHideDuration={2000}
              onClose={handleSuccessClose}
            >
              <Alert
                onClose={handleSuccessClose}
                sx={{ width: "100%" }}
                severity="success"
              >
                Applied Successfully!
              </Alert>
            </Snackbar>

            <Snackbar
              open={saveOpen}
              autoHideDuration={2000}
              onClose={handleSaveClose}
            >
              <Alert
                onClose={handleSaveClose}
                sx={{ width: "100%" }}
                severity="success"
              >
                Job Saved
              </Alert>
            </Snackbar>

            <Snackbar
              open={alreadySaveOpen}
              autoHideDuration={2000}
              onClose={handleAlreadySaveClose}
            >
              <Alert
                onClose={handleAlreadySaveClose}
                sx={{ width: "100%" }}
                severity="warning"
              >
                Job is already saved
              </Alert>
            </Snackbar>
          </div>
        </div>
      </div>
    );
  }
}
