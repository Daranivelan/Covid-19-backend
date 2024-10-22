const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const file = require("./utils/file");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Covid-19 API" });
});

app.get("/covid/cases/:region", async (req, res, next) => {
  const region = req.params.region;
  const data = await file("cases.json");
  const filleredData = data.cases.filter((item) => item.name === region);
  res.status(200).json(filleredData);
});

app.post("/covid/cases/update", async (req, res, next) => {
  console.log("Request received at /covid/cases/update");
  console.log("Request body:", req.body);

  const { name, cases, deaths, recovered } = req.body;

  try {
    // Step 1: Read the existing cases JSON file
    const filePath = "./cases.json"; // Path to your cases.json file
    const data = await fs.readFile(filePath, "utf-8");
    const casesData = JSON.parse(data);

    // Step 2: Find if the case entry already exists
    const caseIndex = casesData.cases.findIndex((item) => item.name === name);

    if (caseIndex !== -1) {
      // Step 3: If case entry exists, update the details
      casesData.cases[caseIndex] = {
        ...casesData.cases[caseIndex],
        cases, // Update case count
        deaths, // Update death count
        recovered, // Update recovered count
      };
    } else {
      // Step 4: If the case entry doesn't exist, add it to the data
      casesData.cases.push({
        name,
        cases,
        deaths,
        recovered,
      });
    }

    // Step 5: Write the updated data back to the cases.json file
    await fs.writeFile(filePath, JSON.stringify(casesData, null, 2));

    // Step 6: Respond with success
    res.status(200).json({
      message: "Case data updated successfully",
      cases: casesData.cases,
    });
  } catch (error) {
    console.error("Error updating case data:", error);
    res.status(500).json({ message: "Failed to update case data" });
  }
});

app.get("/covid/vaccination-status", async (req, res, next) => {
  const data = await file("vaccination.json");
  res.status(200).json(data.vaccination);
});

app.get("/covid/vaccination-status/:region", async (req, res, next) => {
  const region = req.params.region;
  const data = await file("vaccination.json");
  const filleredData = data.vaccination.filter((item) => item.name === region);
  res.status(200).json(filleredData);
});

app.get("/covid/hospitals/resources", async (req, res, next) => {
  const data = await file("hospitals.json");
  res.status(200).json(data.hospitals);
});

app.get("/covid/hospitals/resources/:region", async (req, res, next) => {
  const region = req.params.region;
  const data = await file("hospitals.json");
  const filleredData = data.hospitals.filter((item) => item.name === region);
  res.status(200).json(filleredData);
});

const fs = require("fs").promises; // Use fs.promises to work with async/await for file operations

app.post("/covid/hospitals/resources/update", async (req, res, next) => {
  console.log("Request received at /covid/hospitals/resources/update");
  console.log("Request body:", req.body);

  const { name, hospitals, beds, ventilators, icu_capacity } = req.body;

  try {
    // Step 1: Read the existing JSON file
    const filePath = "./hospitals.json"; // Path to your JSON file
    const data = await fs.readFile(filePath, "utf-8");
    const hospitalsData = JSON.parse(data);

    // Step 2: Find if the hospital already exists
    const hospitalIndex = hospitalsData.hospitals.findIndex(
      (hospital) => hospital.name === name
    );

    if (hospitalIndex !== -1) {
      // Step 3: If hospital exists, update the details
      hospitalsData.hospitals[hospitalIndex] = {
        ...hospitalsData.hospitals[hospitalIndex],
        hospitals, // Update hospitals count
        beds, // Update beds count
        ventilators, // Update ventilators count
        icu_capacity, // Update ICU capacity
      };
    } else {
      // Step 4: If hospital doesn't exist, add it to the data
      hospitalsData.hospitals.push({
        name,
        hospitals,
        beds,
        ventilators,
        icu_capacity,
      });
    }

    // Step 5: Write the updated data back to the JSON file
    await fs.writeFile(filePath, JSON.stringify(hospitalsData, null, 2));

    // Step 6: Respond with success
    res.status(200).json({
      message: "Hospital data updated successfully",
      hospitals: hospitalsData.hospitals,
    });
  } catch (error) {
    console.error("Error updating hospital data:", error);
    res.status(500).json({ message: "Failed to update hospital data" });
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
