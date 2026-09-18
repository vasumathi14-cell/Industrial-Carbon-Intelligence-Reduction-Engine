const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));


// ------------------------------------
// EMISSION DATA
// ------------------------------------

let emissions = [
    {
        source: "Electricity",
        activity: 10000,
        factor: 0.82
    },

    {
        source: "Diesel",
        activity: 5000,
        factor: 2.68
    },

    {
        source: "Logistics",
        activity: 20000,
        factor: 0.095
    },

    {
        source: "Production",
        activity: 5000,
        factor: 1.9
    },

    {
        source: "Waste",
        activity: 1000,
        factor: 0.42
    }
];


// ------------------------------------
// REDUCTION PROJECTS
// ------------------------------------

let projects = [

    {
        name: "Solar Energy",
        cost: 50000,
        reduction: 300
    },

    {
        name: "LED Lighting",
        cost: 20000,
        reduction: 100
    },

    {
        name: "EV Vehicles",
        cost: 80000,
        reduction: 350
    },

    {
        name: "Route Optimization",
        cost: 30000,
        reduction: 150
    },

    {
        name: "Waste Recycling",
        cost: 15000,
        reduction: 80
    }

];


// ------------------------------------
// CALCULATE TOTAL EMISSIONS
// ------------------------------------

function calculateEmissions() {

    let total = 0;

    emissions.forEach(item => {

        let emission =
            item.activity *
            item.factor;

        total += emission;

    });

    return total / 1000;
}


// ------------------------------------
// DASHBOARD API
// ------------------------------------

app.get("/api/dashboard", (req, res) => {

    let total =
        calculateEmissions();

    res.json({

        totalEmissions: total,

        sources: emissions,

        projects: projects

    });

});


// ------------------------------------
// OPTIMIZATION API
// ------------------------------------

app.post("/api/optimize", (req, res) => {

    let budget =
        Number(req.body.budget);

    let selected = [];

    let totalCost = 0;

    let totalReduction = 0;


    // Sort projects by carbon reduction
    projects.sort(
        (a, b) =>
            b.reduction - a.reduction
    );


    projects.forEach(project => {

        if (
            totalCost +
            project.cost
            <= budget
        ) {

            selected.push(project);

            totalCost +=
                project.cost;

            totalReduction +=
                project.reduction;

        }

    });


    res.json({

        budget: budget,

        selected: selected,

        totalCost: totalCost,

        totalReduction:
            totalReduction,

        remainingBudget:
            budget - totalCost

    });

});


// ------------------------------------
// ADD EMISSION SOURCE
// ------------------------------------

app.post("/api/emissions", (req, res) => {

    const {

        source,
        activity,
        factor

    } = req.body;


    emissions.push({

        source: source,

        activity:
            Number(activity),

        factor:
            Number(factor)

    });


    res.json({

        message:
            "Emission source added"

    });

});


// ------------------------------------
// START SERVER
// ------------------------------------

app.listen(5000, () => {

    console.log(
        "Server running at http://localhost:5000"
    );

});