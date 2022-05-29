import { Button, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import CompanyHeader from "../../Components/Company/CompanyHeader";
import img from "../../assets/images/Userpfp.jpg";
import { db, auth } from "../../firebase-config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useHref, useNavigate } from "react-router-dom";

export default function Shortlisted() {
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [user, setUser] = useState({});
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const userCollection = collection(db, "UserProfile");
  const shortlistCollectionRef = collection(
    db,
    `UserProfile/${userInfo?.id}/shortlisted`
  );

  const getShortlisted = async () => {
    const data = await getDocs(shortlistCollectionRef);
    const shortlisted = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  
    setApplicants(shortlisted);
    // console.log(applicants);
    setLoading(false);
  };

  const hireApplicant = async (id) => {
    const data = await getDocs(shortlistCollectionRef);
    const shortlisted = data.docs?.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const shortlistedFilter = shortlisted.filter((i) => i.id == id);

    const employeesCollectionRef = collection(
      db,
      `UserProfile/${userInfo?.id}/employees`
    );
    const employeesData = await getDocs(employeesCollectionRef);
    const employeesProfiles = employeesData.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const employeeFilter = employeesProfiles.filter(
      (i) => i.applicantid == shortlistedFilter[0]?.applicantid
    );

    if (employeeFilter[0].applicantid == shortlistedFilter[0]?.applicantid) {
      console.log("already hired");
      setLoading(false);
    } else {
      const h = await addDoc(
        collection(db, `UserProfile/${userInfo?.id}/employees`),
        {
          applicantEmail: shortlistedFilter[0]?.applicantEmail,
          employeename: shortlistedFilter[0]?.firstname,
          lastname: shortlistedFilter[0]?.lastname,
          pfp: shortlistedFilter[0]?.pfp,
          resume: shortlistedFilter[0]?.resume,
          bio: shortlistedFilter[0]?.bio,
          address: shortlistedFilter[0]?.address,
          about: shortlistedFilter[0]?.about,
          city: shortlistedFilter[0]?.city,
          province: shortlistedFilter[0]?.province,
          applicantid: shortlistedFilter[0]?.applicantid,
        }
      );
      setLoading(false);
    }

    // console.log(shortlistedFilter[0]?.applicantid);
    // console.log(shortlistedFilter[0]?.applicantid);
  };

  const getUserInfo = async () => {
    const data = await getDocs(userCollection);
    const profiles = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const userData = profiles.filter((i) => i.Email == user?.email);
    
    setUserInfo(userData[0]);

    setLoading(false);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        getUserInfo();
        getShortlisted();
      } else {
        navigate("/SignIn");
      }
    });
  }, [user, userInfo?.id]);

  if (loading) {
    return <div>loading...</div>;
  } else {
    return (
      <div style={{ backgroundColor: "#f3f2ef" }}>
        <CompanyHeader />
        <div
          style={{
            display: "flex",
            marginTop: "30px",
            flexDirection: "column",
            alignItems: "center",
            width: "900px",
            minHeight: "500px",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "10px",
            padding: "15px",
          }}
        >
          <h1>Shortlisted</h1>
          {applicants?.map((a, key) => {
            if (applicants?.length == 0) {
              <div></div>;
            } else {
              return (
                <div key={key}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      margin: "10px",
                      padding: "10px",
                      backgroundColor: "white",
                      width: "700px",
                      borderRadius: "5px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <img width="80px" height="80px" src={img} />
                      </div>
                      <p style={{ marginLeft: "15px" }}>
                        {a?.firstname + " " + a?.lastname}
                      </p>
                    </div>
                    <div>
                      <Button
                        style={{ margin: "10px" }}
                        size="small"
                        variant="outlined"
                        color="success"
                      >
                        Interview
                      </Button>                      
                      <Button
                        style={{ margin: "10px" }}
                        size="small"
                        variant="outlined"
                        onClick={() => hireApplicant(a.id)}
                      >
                        Hire
                      </Button>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
}
