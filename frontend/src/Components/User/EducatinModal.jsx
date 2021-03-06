import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Button, Modal, TextField, Typography } from "@mui/material";
import { updateDoc, doc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";

export default function EduEdit({
  degree,
  Institute,
  duration,
  durationOne,
  open,
  close,
  id,
}) {
  const [newDegree, setNewDegree] = useState();
  const [newInstitute, setNewInstitute] = useState();
  const [newDuration, setNewDuration] = useState();
  const [newDurationOne, setNewDurationOne] = useState();

  const updateDegree = async (id, nDegree) => {
    if (nDegree == undefined) {
      nDegree = degree;
    }
    const EDUcollection = doc(db, "UserEducation", id);
    const nf = { Degree_Name: nDegree };
    updateDoc(EDUcollection, nf);
  };

  const updateInstitute = async (id, nInstitute) => {
    if (nInstitute == undefined) {
      nInstitute = Institute;
    }
    const EDUcollection = doc(db, "UserEducation", id);
    const nf = { Institute_name: nInstitute };
    updateDoc(EDUcollection, nf);
  };

  const updateDuration = async (id, nDuration) => {
    if (nDuration == undefined) {
      nDuration = duration;
    }
    const EDUcollection = doc(db, "UserEducation", id);
    const nf = { Duration: nDuration };
    updateDoc(EDUcollection, nf);
  };

  const updateDurationOne = async (id, mDuration) => {
    if (mDuration == undefined) {
      mDuration = duration;
    }
    const EDUcollection = doc(db, "UserEducation", id);
    const nf = { DurationOne: mDuration };
    updateDoc(EDUcollection, nf);
  };

  const editEdu = async () => {
    updateDegree(id, newDegree);
    updateInstitute(id, newInstitute);
    updateDuration(id, newDuration);
    updateDurationOne(id, newDurationOne);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={close}
        // aria-labelledby="modal-modal-title"
        // aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* <Form> */}
          <h2>Add Education</h2>
          <TextField
            style={{ marginBottom: "10px" }}
            fullWidth
            label="Degree Name"
            defaultValue={degree}
            onChange={(e) => setNewDegree(e.target.value)}
          />
          <TextField
            style={{ marginBottom: "10px" }}
            fullWidth
            label="Institute Name"
            defaultValue={Institute}
            onChange={(e) => setNewInstitute(e.target.value)}
          />
          <div>
            <h3>Duration</h3>
            <TextField
              style={{ marginBottom: "10px" }}
              fullWidth
              defaultValue={duration}
              onChange={(e) => setNewDuration(e.target.value)}
              type="date"
            />
            <TextField
              style={{ marginBottom: "10px" }}
              fullWidth
              defaultValue={durationOne}
              onChange={(e) => setNewDurationOne(e.target.value)}
              type="date"
            />
          </div>

          <Button onClick={close}>Close</Button>
          <Button onClick={() => editEdu()}>Add</Button>
          {/* </Form> */}
        </Box>
      </Modal>
    </div>
  );
}
