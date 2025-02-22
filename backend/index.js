

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




// Razorpay API


// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const { default: HealthScore } = require("../frontend/src/components/doctor/dashboard/partials/dashboard/HealthScore");


// app.post("/payments/orders", async (req, res) => {
//     try {
//         const instance = new Razorpay({
//             key_id: process.env.KEY_ID,
//             key_secret: process.env.KEY_SECRET,
//         });
//         const options = {
//             amount: req.body.amount * 100,
//             currency: "INR",
//             receipt: crypto.randomBytes(10).toString("hex"),
//         };
//         instance.orders.create(options, (error, order) => {
//             console.log(order);
//             if (error) {
//                 console.log(error);
//                 return res.status(500).json({ message: "Something Went Wrong!" });
//             }
//             res.status(200).json({ data: order });
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Internal Server Error!" });
//         console.log(error);
//     }
// })


// app.post("/payments/verify", async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//             req.body;
//         const sign = razorpay_order_id + "|" + razorpay_payment_id;
//         const expectedSign = crypto
//             .createHmac("sha256", process.env.KEY_SECRET)
//             .update(sign.toString())
//             .digest("hex");


//         if (razorpay_signature === expectedSign) {
//             const { registration, patientEmail, date } = req.body;
//             patients.updateOne({ email: patientEmail }, { $push: { doctorsList: {reg: registration, date: date} } }).then(data => console.log(data));
//             doctors.updateOne({ 'profile.registration': registration }, { $push: { patientsList: {email: patientEmail, date: date} } }).then(data => console.log(data));


//             return res.status(200).json({ message: "Payment verified successfully" });
//         } else {
//             return res.status(400).json({ message: "Invalid signature sent!" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: "Internal Server Error!" });
//         console.log(error);
//     }
// })




const port = process.env.PORT || "5000";
app.listen(port, () => {
    console.log("Server is Started on PORT: " + port)
})



