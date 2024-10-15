document.addEventListener("DOMContentLoaded", function() {
    const username = 'coalition';
    const password = 'skills-test';
    const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev';
    const encodedCredentials = btoa(`${username}:${password}`);

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + encodedCredentials
        }
    })
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data) && data.length > 0) {
            const patientInfoContainer = document.getElementById("patient-info");
            patientInfoContainer.innerHTML = '';

            data.forEach(patient => {
                const patientSection = document.createElement("section");
                patientSection.classList.add("patient-info");

                patientSection.innerHTML = `
                    <div class="card-body patient-details">
                        <picture>
                            <source
                                media="(min-width: 50em)"
                                srcset="${patient.profile_picture}"
                            />
                            <img
                                src="${patient.profile_picture}"
                                alt="${patient.name} profile photo"
                                width="48"
                                height="48"
                            />
                        </picture>
                        <div class="patient-info">
                            <h4 class="patient-name">${patient.name}</h4>
                            <span class="role">${patient.gender}, ${patient.age}</span>
                        </div>
                        <a href="#" class="ri-more-2-line menu-item"></a>
                    </div>
                `;

                patientInfoContainer.appendChild(patientSection);

                // Add click event listener to each patient section
                patientSection.addEventListener('click', () => displayPatientDetails(patient));
            });
        } else {
            console.error('Patients data is not available or not in the expected format.');
        }
    })
    .catch(error => console.error('Error fetching the data:', error));
});

// Function to display patient details
function displayPatientDetails(patient) {
    const detailsContainer = document.getElementById('patient-details-container');
    const detailsContent = document.getElementById('patient-details');

    detailsContent.innerHTML = `
        <div class="card-profile-img">
            <picture>
                <source
                    media="(min-width: 50em)"
                    srcset="${patient.profile_picture}"
                />
                <img
                    src="${patient.profile_picture}"
                    alt="${patient.name}"
                    width="200"
                    height="200"
                />
            </picture>
            <h2>${patient.name}</h2>
        </div>
        <div class="card-profile-contacts">
            <div>
                <a href="#"><i class="ri-calendar-line"></i></a>
                <span>
                    <p>date of birth</p>
                    <h3>${patient.date_of_birth}</h3>
                </span>
            </div>
            <div>
                <a href="#"><i class="ri-women-line"></i></a>
                <span>
                    <p>Gender</p>
                    <h3>${patient.gender}</h3>
                </span>
            </div>
            <div>
                <a href="#"><i class="ri-phone-line"></i></a>
                <span>
                    <p>Contact Info.</p>
                    <h3>${patient.phone_number}</h3>
                </span>
            </div>
            <div>
                <a href="#"><i class="ri-phone-line"></i></a>
                <span>
                    <p>Emergency Contacts</p>
                    <h3>${patient.emergency_contact}</h3>
                </span>
            </div>
            <div>
                <a href="#"><i class="ri-shield-check-line"></i></a>
                <span>
                    <p>Insurance Provider</p>
                    <h3>${patient.insurance_type}</h3>
                </span>
            </div>
        </div>
        <button class="btn btn-green">See more information</button>
    `;

    detailsContainer.style.display = 'block';

    if (patient.diagnosis_history) {
        renderDiagnosisHistoryChart(patient.diagnosis_history);
    }
    if (patient.lab_results) {
        renderLabResults(patient.lab_results)
    }

    if (patient.diagnostic_list && Array.isArray(patient.diagnostic_list)) {
        renderDiagnosticList(patient.diagnostic_list);
    } else {
        console.log("No diagnostic history available for this patient.");
    }
}

// Function to create/update the chart with diagnosis history data
function renderDiagnosisHistoryChart(diagnosisHistory) {
    const labels = diagnosisHistory.map(entry => `${entry.month} ${entry.year}`);
    const systolicData = diagnosisHistory.map(entry => entry.blood_pressure.systolic.value);
    const diastolicData = diagnosisHistory.map(entry => entry.blood_pressure.diastolic.value);

    const ctx = document.getElementById('diagnosisHistoryChart').getContext('2d');

    // Check if the chart instance exists and is a Chart instance before destroying it
    if (window.diagnosisHistoryChart instanceof Chart) {
        window.diagnosisHistoryChart.destroy();
    }

    // Create the new chart
    window.diagnosisHistoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Systolic Blood Pressure',
                    data: systolicData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Diastolic Blood Pressure',
                    data: diastolicData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                    tension: 0.4
                }
            ]
        }
    });
    // Calculate and display blood pressure stats
    const stats = calculateBloodPressureStats(diagnosisHistory);
    // const diagnostic = renderDiagnosticList(diagnosticList);
    const statsContainer = document.getElementById('blood-pressure-stats');
    const bioContainer = document.getElementById('bioData');

    statsContainer.innerHTML = `
        <div class="card-layout">
            <h6><li>Systolic</li></h6>
            <h4><b>${stats.highestSystolic}</b></h4>
            <small><img src="img/arrowUp.svg" />  ${stats.highestSystolicLevel}</small>
            <hr/>
            <h6><li>Diastolic</li></h6>
            <h4><b>${stats.lowestDiastolic}</b></h4>
            <small><img src="img/arrowDown.svg" />  ${stats.lowestSystolicLevel}</small>
        </div>
    `;
    bioContainer.innerHTML = `
    <div class="heartRate">
            <img src="img/HeartBPM.svg" alt=""><br/>
            <small>Heart Rate</small>
            <h1><b>${stats.heart.value} bpm</b></h1>
            <small>${stats.heart.levels}</small>
          </div>
          <div class="temperature">
            <img src="img/temperature.svg" alt=""><br/>
            <small>Temperature Rate</small>
            <h1><b>${stats.temperature.value} F</b></h1>
            <small>${stats.temperature.levels}</small>
          </div>
         <div class="respiratory">
            <img src="img/respiratory rate.svg" alt=""><br/>
            <small>Respiratory Rate</small>
            <h1><b>${stats.lungs.value} bpm</b></h1>
            <small>${stats.lungs.levels}</small>
          </div>
            `;
}

// Function to calculate blood pressure stats
function calculateBloodPressureStats(diagnosisHistory) {
    let highestSystolic = -Infinity;
    let lowestDiastolic = Infinity;
    let highestSystolicLevel = '';
    let highestSystolicDate = '';
    let lowestDiastolicDate = '';
    let lowestSystolicLevel = '';
    let heart = '';
    let lungs = ''
    let temperature = '';

    diagnosisHistory.forEach(entry => {
        const systolic = entry.blood_pressure.systolic.value;
        const systolicLevel = entry.blood_pressure.systolic.levels;
        const diastolicLevel = entry.blood_pressure.diastolic.levels;
        const diastolic = entry.blood_pressure.diastolic.value;
        const heartRate = entry.heart_rate;
        const respiratoryRate = entry.respiratory_rate;
        const temperatureRate = entry.temperature;
        const date = `${entry.month} ${entry.year}`;


        heart = heartRate;
        lungs = respiratoryRate;
        temperature = temperatureRate;
        if (systolic > highestSystolic) {
            highestSystolic = systolic;
            highestSystolicLevel = systolicLevel
            highestSystolicDate = date;
        }

        if (diastolic < lowestDiastolic) {
            lowestDiastolic = diastolic;
            lowestSystolicLevel = diastolicLevel;
            lowestDiastolicDate = date;
        }
    });

    return {
        highestSystolic,
        highestSystolicDate,
        lowestDiastolic,
        lowestDiastolicDate,
        highestSystolicLevel,
        lowestSystolicLevel,
        heart,
        lungs,
        temperature,
    };
}

function renderDiagnosticList(diagnosticList) {
    const diagnosticContainer = document.getElementById('diagnostic-list');

    diagnosticList.forEach(entry => {
        const listName = entry.name;
        const listDescription = entry.description;
        const listStatus = entry.status;

        diagnosticContainer.innerHTML = `
        <table>
                <tr class="first-row">
                  <th>Problem/Diagnosis</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
                <tr>
                  <td>${listName}</td>
                  <td>${listDescription}</td>
                  <td>${listStatus}</td>
                </tr>
              </table>
        `;

        
    })


}

function renderLabResults(labResults) {
    const labResultsContainer = document.getElementById('lab__test-results');

    labResults.forEach(entry => {
        const testName = entry;
        labResultsContainer.innerHTML += `
        <div class="lab-result">
              <p>${testName}</p>
              <a href="" class="ri-download-2-line download-result">
              </a>
            </div>
        `
    });
}