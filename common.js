// Common utility functions

// Initialize progress bar
window.initProgressBar = initProgressBar;
function initProgressBar(currentStep, totalSteps) {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    if (progressFill && progressText) {
        const percentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = percentage + '%';
        progressText.textContent = `Step ${currentStep} of ${totalSteps}`;
    }
}

// Store data in sessionStorage
window.saveData = saveData;
function saveData(key, value) {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving data:', e);
    }
}

// Get data from sessionStorage
window.getData = getData;
function getData(key) {
    try {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error getting data:', e);
        return null;
    }
}



// Handle option button selection (single choice)
window.setupOptionButtons = setupOptionButtons;
function setupOptionButtons() {
    const optionButtons = document.querySelectorAll('.option-btn');

    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            optionButtons.forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');

            // Save selection
            const dataKey = this.getAttribute('data-key');
            const dataValue = this.getAttribute('data-value');
            if (dataKey && dataValue) {
                saveData(dataKey, dataValue);
            }
        });
    });
}

// Handle tag button selection (multiple choice)
window.setupTagButtons = setupTagButtons;
function setupTagButtons() {
    const tagButtons = document.querySelectorAll('.tag-btn');

    tagButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('selected');

            // Save all selected tags
            const selectedTags = Array.from(document.querySelectorAll('.tag-btn.selected'))
                .map(btn => btn.textContent.trim());
            saveData('eventTags', selectedTags);
        });
    });
}




window.formatTime = formatTime;

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}

// Calculate duration between two times
window.calculateDuration = calculateDuration;
function calculateDuration(startMinutes, endMinutes) {
    const diff = endMinutes - startMinutes;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    if (hours === 0) {
        return `${minutes} minutes`;
    } else if (minutes === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
        return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
    }
}




// Load saved data and restore selections
window.restoreSelections = restoreSelections;
function restoreSelections() {
    // Restore option button selection
    const optionButtons = document.querySelectorAll('.option-btn[data-key]');
    optionButtons.forEach(button => {
        const key = button.getAttribute('data-key');
        const value = button.getAttribute('data-value');
        const savedValue = getData(key);

        if (savedValue === value) {
            button.classList.add('selected');
        }
    });

    // Restore tag selections
    const savedTags = getData('eventTags');
    if (savedTags && Array.isArray(savedTags)) {
        const tagButtons = document.querySelectorAll('.tag-btn');
        tagButtons.forEach(button => {
            if (savedTags.includes(button.textContent.trim())) {
                button.classList.add('selected');
            }
        });
    }

    // Restore form inputs
    const formInputs = document.querySelectorAll('input[data-key], select[data-key]');
    formInputs.forEach(input => {
        const key = input.getAttribute('data-key');
        const savedValue = getData(key);
        if (savedValue !== null) {
            if (input.type === 'checkbox') {
                input.checked = savedValue;
            } else {
                input.value = savedValue;
            }
        }
    });
}

// Auto-save form inputs
window.setupAutoSave = setupAutoSave;
function setupAutoSave() {
    const formInputs = document.querySelectorAll('input[data-key], select[data-key], textarea[data-key]');

    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            const key = this.getAttribute('data-key');
            const value = this.type === 'checkbox' ? this.checked : this.value;
            saveData(key, value);
        });
    });
}

// Get all saved event data
window.getAllEventData = getAllEventData;
function getAllEventData() {
    return {
        applicantName: getData('applicantName'),
        applicantContact: getData('applicantContact'),
        isGroup: getData('isGroup'),
        address: getData('address'),
        organizationType: getData('organizationType'),
        charityNumber: getData('charityNumber'),
        eventType: getData('eventType'),
        eventTags: getData('eventTags'),
        groupSize: getData('groupSize'),
        audience: getData('audience'),
        accessibility: getData('accessibility'),
        ticketsRequired: getData('ticketsRequired'),
        ticketPrice: getData('ticketPrice'),
        ticketsFree: getData('ticketsFree'),
        numberOfTickets: getData('numberOfTickets'),
        ticketContact: getData('ticketContact'),
        ticketPlatform: getData('ticketPlatform'),
        eventStartDate: getData('eventStartDate'),
        eventEndDate: getData('eventEndDate'),
        startTime: getData('startTime'),
        endTime: getData('endTime'),
        venueType: getData('venueType'),
        venueAddress: getData('venueAddress'),
        venueReason: getData('venueReason')
    };
}

window.parseDateString = parseDateString;
function parseDateString(dateStr) {
    const parts = dateStr.split('-');
    const year  = parseInt(parts[0]);
    const month = parseInt(parts[1]) ; // convert back to 0-based
    const day   = parseInt(parts[2]);
    return new Date(year, month, day);
}
// Clear all event data
window.clearAllData = clearAllData;
function clearAllData() {
    sessionStorage.clear();
}
window.formatDate = formatDate;
function formatDate(dateStr) {
    const date = parseDateString(dateStr);

    const monthNames = [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
    ];

    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
