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

    // Add event listener to close button
    const closeButton = document.getElementById('close-details');
    closeButton.addEventListener('click', () => {
        detailsContainer.style.display = 'none';
    });
}