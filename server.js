const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Temporary storage for patient transfers
let patientTransfers = {};

// Send patient details to another hospital
app.post("/send-patient", (req, res) => {
    const { patientName, age, condition, disease, contact, familyContact, fromHospital, toHospital, ambulanceno } = req.body;

    if (!patientName || !age || !condition || !disease || !contact || !familyContact || !fromHospital || !toHospital || !ambulanceno) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure that the hospital has a record entry
    if (!patientTransfers[toHospital]) {
        patientTransfers[toHospital] = [];
    }

    const transfer = { patientName, age, condition, disease, contact, familyContact, fromHospital, toHospital };
    patientTransfers[toHospital].push(transfer);

    res.json({ message: `Patient transfer request sent to ${toHospital} successfully!`, transfer });
});

// Retrieve patient details for a specific hospital
app.get("/received-patients/:hospital", (req, res) => {
    const hospital = req.params.hospital;
    res.json(patientTransfers[hospital] || []);
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));