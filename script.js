async function loadDashboard() {

    const response =
        await fetch(
            "/api/dashboard"
        );


    const data =
        await response.json();


    // Total emissions

    document.getElementById(
        "totalEmission"
    ).innerText =
        data.totalEmissions.toFixed(2);


    // Number of sources

    document.getElementById(
        "sourceCount"
    ).innerText =
        data.sources.length;


    // Number of projects

    document.getElementById(
        "projectCount"
    ).innerText =
        data.projects.length;


    // Create table

    let table = "";


    data.sources.forEach(item => {

        let emission =
            item.activity *
            item.factor;


        table += `

            <tr>

                <td>
                    ${item.source}
                </td>

                <td>
                    ${item.activity}
                </td>

                <td>
                    ${item.factor}
                </td>

                <td>
                    ${emission.toFixed(2)}
                    kgCO₂e
                </td>

            </tr>

        `;

    });


    document.getElementById(
        "emissionTable"
    ).innerHTML = table;

}


// ------------------------------------
// ADD EMISSION
// ------------------------------------

async function addEmission() {

    let source =
        document.getElementById(
            "source"
        ).value;


    let activity =
        document.getElementById(
            "activity"
        ).value;


    let factor =
        document.getElementById(
            "factor"
        ).value;


    if (
        source === "" ||
        activity === "" ||
        factor === ""
    ) {

        alert(
            "Please enter all values"
        );

        return;

    }


    await fetch(
        "/api/emissions",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify({

                    source:
                        source,

                    activity:
                        activity,

                    factor:
                        factor

                })

        }
    );


    alert(
        "Emission source added"
    );


    // Clear inputs

    document.getElementById(
        "source"
    ).value = "";


    document.getElementById(
        "activity"
    ).value = "";


    document.getElementById(
        "factor"
    ).value = "";


    loadDashboard();

}


// ------------------------------------
// OPTIMIZE BUDGET
// ------------------------------------

async function optimize() {

    let budget =
        document.getElementById(
            "budget"
        ).value;


    if (
        budget === "" ||
        Number(budget) <= 0
    ) {

        alert(
            "Enter a valid budget"
        );

        return;

    }


    const response =
        await fetch(
            "/api/optimize",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify({

                        budget:
                            Number(budget)

                    })

            }
        );


    const data =
        await response.json();


    let html = `

        <h3>
            Optimization Result
        </h3>

        <p>
            Budget:
            ₹${data.budget}
        </p>

        <p>
            Total Investment:
            ₹${data.totalCost}
        </p>

        <p>
            Carbon Reduction:
            ${data.totalReduction}
            tCO₂e/year
        </p>

        <p>
            Remaining Budget:
            ₹${data.remainingBudget}
        </p>

        <h3>
            Selected Projects
        </h3>

    `;


    data.selected.forEach(
        project => {

            html += `

                <div class="project">

                    <b>
                        ${project.name}
                    </b>

                    <br>

                    Cost:
                    ₹${project.cost}

                    <br>

                    Reduction:
                    ${project.reduction}
                    tCO₂e/year

                </div>

            `;

        }
    );


    document.getElementById(
        "result"
    ).innerHTML = html;

}
