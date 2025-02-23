const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");

const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
require("dotenv").config()


const app = express();
app.use(express.json());
app.use(cors({ origin: true }));


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    // useFindAndModify:false // Increase timeout to 30 seconds
  }).then(() => console.log("Connected to MongoDB")).catch(err => console.log(err));




// Patient Operations


const profileSchema = new mongoose.Schema({
    name: new mongoose.Schema({
        FName: String,
        LName: String,
    }),
    mobile: Number,
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Transgender', 'Other']
    },
    DOB: Date,
    address: new mongoose.Schema({
        street: String,
        city: String,
        state: String,
        pin: Number
    })
})


const healthReportSchema = new mongoose.Schema({
    // basic: [{
    //     name: String,
    //     value: String,
    //     date: Date
    // }],
    // all: {
    //     name: [String],
    //     date: [Date],
    //     data: [Buffer]
    // },
    predictions: [{     // Prediction Schema
        date: { type: Date, default: Date.now },
        normalPercentage: Number,
        hemorrhagicPercentage: Number
    }]
})


const patientSchema = new mongoose.Schema({
    email:
    {
        type: String,
        require: true
    },
    password:
    {
        type: String,
        require: true
    },
    sessionKey: String,
    HealthScore: Number,
    profile: profileSchema,
    healthReport: healthReportSchema,
    doctorsList: [{reg: String, date: Date}]
})


const patients = new mongoose.model('patient', patientSchema);


app.post("/patient/register", (req, res) => {
    const { email, password } = req.body;
    patients.findOne({ email: email }).then((data) => {
        if (!data) {
            patients.create({ email: email, password: password }).then(() => {
                return res.json({ status: 'done' })
            })
        } else {
            return res.json({ status: 'exist' })
        }
    }).catch(err => console.log(err));
});

app.post("/patient/healthscore/:email", (req, res) => {
    const { email, HealthScore } = req.body;
    
    patients.findOneAndUpdate({ email: email }, { HealthScore:HealthScore}, { new: true }).then(doc => {
        console.log(doc);
        return res.json(doc)
    }).catch(err => console.log(err));
})
app.post("/patient/profile", (req, res) => {
    const { email, sessionKey, name, mobile, gender, DOB, address } = req.body;
    const profile = {
        name: name,
        mobile: mobile,
        gender: gender,
        DOB: DOB,
        address: address
    }
    patients.findOneAndUpdate({ email: email }, { sessionKey: sessionKey, profile: profile }, { new: true }).then(doc => {
        console.log(doc);
        return res.json(doc)
    }).catch(err => console.log(err));
})


app.post("/patient/session", (req, res) => {
    const { email, sessionKey } = req.body;
    patients.findOne({ email: email }, { "password": 0}).then(data => {
        if (data && data.sessionKey == sessionKey) {
            return res.json({ data: data, status: "authenticated" })
        } else return res.json({ status: "unauthenticated" });
    })
})

// GET Request to fetch all patient data
app.get("/patients", (req, res) => {
    patients.find({}, { password: 0, sessionKey: 0 }) // Exclude password and sessionKey fields
        .then((data) => {
            if (data) {
                return res.json(data);
            } else {
                return res.status(404).json({ message: "No patients found" });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        });
});

// GET Request to fetch a specific patient by email
app.get("/patient/:email", (req, res) => {
    const { email } = req.params;
    patients.findOne({ email: email }, { password: 0, sessionKey: 0 }) // Exclude password and sessionKey fields
        .then((data) => {
            if (data) {
                return res.json(data);
            } else {
                return res.status(404).json({ message: "Patient not found" });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        });
});

app.post("/patient/login", (req, res) => {
    const { email, password } = req.body;
    patients.findOne({ email: email }).then(data => {
        if (data) {
            if (data.password == password) {
                return res.json({ data: data, status: "authenticated" })
            } else return res.json({ status: "wrongPassword" });
        } else return res.json({ status: "emailNotRegistered" });
    })
})


// POST Request for saving the prediction


app.post("/patientrecord", (req, res) => {
    const { email, prediction } = req.body;
    console.log(email, prediction);
    const predictionData={
        date: Date.now(),
        
        normalPercentage: prediction.normalPercentage,
        hemorrhagicPercentage: prediction.hemorrhagicPercentage
    }
    patients.findOneAndUpdate(
        { email: email },
        { $push: {'healthReport.predictions': predictionData} },
        { new: true }
    )
    .then((patient) => {
        if (!patient) return res.status(404).json({ error: "Patient not found" });
        res.json(patient.predictions);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    });
});


app.get("/patient/doctors", (req, res) => {
    doctors.find({}, { "password": 0, "sessionKey": 0 }).then(data => {
        if (data)
            return res.json(data);
    })
})




// Doctor Operations


const doctorProfileSchema = new mongoose.Schema({
    name: new mongoose.Schema({
        FName: String,
        LName: String,
    }),
    registration: String,
    degree: String,
    fees: Number,
    mobile: Number,
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Transgender', 'Other']
    },
    DOB: Date,
    address: new mongoose.Schema({
        street: String,
        city: String,
        state: String,
        pin: Number
    })
})


const doctorSchema = new mongoose.Schema({
    email:
    {
        type: String,
        require: true
    },
    password:
    {
        type: String,
        require: true
    },
    sessionKey: String,
    profile: doctorProfileSchema,
    patientsList: [{email: String, date: Date}]
})


const doctors = new mongoose.model('doctor', doctorSchema);


app.post("/doctor/register", (req, res) => {
    const { email, password } = req.body;
    doctors.findOne({ email: email }).then((data) => {
        if (!data) {
            doctors.create({ email: email, password: password }).then(() => {
                return res.json({ status: 'done' })
            })
        } else {
            return res.json({ status: 'exist' })
        }
    }).catch(err => console.log(err));
});


app.post("/doctor/profile", (req, res) => {
    const { email, sessionKey, name, registration, degree, fees, mobile, gender, DOB, address } = req.body;
    const profile = {
        name: name,
        registration: registration,
        degree: degree,
        fees: fees,
        mobile: mobile,
        gender: gender,
        DOB: DOB,
        address: address
    }
    doctors.findOneAndUpdate({ email: email }, { sessionKey: sessionKey, profile: profile }, { new: true }).then(doc => {
        return res.json(doc)
    }).catch(err => console.log(err));
})


app.post("/doctor/session", (req, res) => {
    const { email, sessionKey } = req.body;
    doctors.findOne({ email: email }).then(data => {
        if (data && data.sessionKey == sessionKey) {
            return res.json({ data: data, status: "authenticated" })
        } else return res.json({ status: "unauthenticated" });
    })
})


app.post("/doctor/login", (req, res) => {
    const { email, password } = req.body;
    doctors.findOne({ email: email }).then(data => {
        if (data) {
            if (data.password == password) {
                return res.json({ data: data, status: "authenticated" })
            } else return res.json({ status: "wrongPassword" });
        } else return res.json({ status: "emailNotRegistered" });
    })
})

app.get("/doctors", (req, res) => {
    doctors.find({}, { password: 0, sessionKey: 0 }) // Exclude password and sessionKey fields
        .then((data) => {
            if (data.length > 0) {
                return res.json(data);
            } else {
                return res.status(404).json({ message: "No doctors found" });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        });
});


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Client connected");

  // Simulate real-time medical data
  const interval = setInterval(async () => {
    const healthData = {
        heartRate: Math.floor(Math.random() * (100 - 60) + 60), // Normal: 60-100 BPM
        hrv: Math.floor(Math.random() * (150 - 50) + 50), // Normal: 50-150 ms
        ecg: (Math.random() * (1.2 - 0.8) + 0.8).toFixed(2), // Normal ECG: 0.8-1.2 mV
        temperature: (Math.random() * (37.5 - 36.1) + 36.1).toFixed(1), // Normal: 36.1-37.5°C
        systolicBP: Math.floor(Math.random() * (130 - 110) + 110), // Normal: 110-130 mmHg
        diastolicBP: Math.floor(Math.random() * (85 - 70) + 70), // Normal: 70-85 mmHg
        spo2: Math.floor(Math.random() * (100 - 95) + 95), // Normal: 95-100%
        steps: Math.floor(Math.random() * (8000 - 3000) + 3000), // Average: 3,000-8,000 steps/day
    };

      const formattedData = {
        data: [
          healthData.heartRate,
          healthData.hrv,
          parseFloat(healthData.ecg), // Convert string to float
          parseFloat(healthData.temperature), // Convert string to float
          healthData.systolicBP,
          healthData.diastolicBP,
          healthData.spo2,
          healthData.steps,
        ],
      };

    // Send health data to frontend
    socket.emit("healthData", healthData);

    // Send data to ML model for prediction
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict_heart", formattedData);
      socket.emit("prediction", response.data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  }, 3000); // Streaming data every 2 seconds

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});
const port = process.env.PORT || "5000";
server.listen(port, () => {
    console.log("Server is Started on PORT: " + port);
});



