console.log('Script loaded.');
document.addEventListener('DOMContentLoaded', function() {
  var stateSelect = document.getElementById('state-select');
  var collegeSelect = document.getElementById('college-select');
  var inStateTuitionField = document.getElementById('inStateTuition');
  var outOfStateTuitionField = document.getElementById('outOfStateTuition');
  var averageSalary6Field = document.getElementById('averageSalary6');
  var averageSalary10Field = document.getElementById('averageSalary10');
  var costOfLivingField = document.getElementById('costOfLivingFigure');
  var timeToRecoupInStateField = document.getElementById('timeToRecoupFundsInState');
  var timeToRecoupOutOfStateField = document.getElementById('timeToRecoupFundsOutOfState');
  var leftoverSavings2 = document.getElementById('leftoverSavings');
  var inStateTuitionTwoYearsField = document.getElementById('inStateTuitionTwoYears');
  var outOfStateTuitionTwoYearsField = document.getElementById('outOfStateTuitionTwoYears');
  var potentialSavingsInStateField = document.getElementById('potentialSavingsInState');
  var potentialSavingsOutOfStateField = document.getElementById('potentialSavingsOutOfState');

  // Populate the states dropdown
  var states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  states.forEach(function(stateAbbreviation) {
    var option = document.createElement('option');
    option.value = stateAbbreviation;
    option.textContent = stateAbbreviation;
    stateSelect.appendChild(option);
  });

 function toggleCells(selectedStateStatus) {
    // Cells IDs to hide or show
    var cellsToHide = selectedStateStatus === 'inState' ? ['1', '2', '6'] : ['3', '4', '5'];
    var cellsToShow = selectedStateStatus === 'inState' ? ['3', '4', '5'] : ['1', '2', '6'];

    // Hide the specified cells
    cellsToHide.forEach(function(cellId) {
      document.getElementById(cellId).style.display = 'none';
    });

    // Show the specified cells
    cellsToShow.forEach(function(cellId) {
      document.getElementById(cellId).style.display = '';
    });
  }

  // Listen for changes on the stateStatusSelect dropdown to show/hide cells
  stateStatusSelect.addEventListener('change', function() {
    var selectedStateStatus = this.value;
    toggleCells(selectedStateStatus);
  });

  // Function to fetch college details and update fields
  function fetchCollegeDetails(collegeName) {
    var endpointUrl = 'https://us-east-1.aws.data.mongodb-api.com/app/roitoolapp-jnjed/endpoint/collegeDetails?college=' + encodeURIComponent(collegeName);
    console.log("Fetching college details from:", endpointUrl);

    fetch(endpointUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log("Data received for college:", data);

        // Check if the necessary data is present
        if (data.latest_cost_tuition_in_state && data.latest_cost_tuition_out_of_state && data.latest_earnings_6_yrs_after_entry_median && data.latest_earnings_10_yrs_after_entry_median) {
          // Update the tuition fields
          inStateTuitionField.textContent = "$" + (data.latest_cost_tuition_in_state * 4).toLocaleString();
          outOfStateTuitionField.textContent = "$" + (data.latest_cost_tuition_out_of_state * 4).toLocaleString();

          // Update the salary fields
          averageSalary6Field.textContent = "$" + data.latest_earnings_6_yrs_after_entry_median.toLocaleString();
          averageSalary10Field.textContent = "$" + data.latest_earnings_10_yrs_after_entry_median.toLocaleString();

          fetchCostOfLivingData(stateSelect.value);
        
        } else {
          console.error("Some necessary data is missing for the selected college");
        }
      })
      .catch(error => {
        console.error('Error fetching college details:', error);
      });
  }
  // Listen for changes on the states dropdown
  stateSelect.addEventListener('change', function() {
    var stateAbbreviation = this.value;
    collegeSelect.innerHTML = ''; // Clear previous colleges
    var endpointUrl = 'https://us-east-1.aws.data.mongodb-api.com/app/roitoolapp-jnjed/endpoint/colleges?state=' + encodeURIComponent(stateAbbreviation);

    console.log("Requesting colleges from URL:", endpointUrl);

    fetch(endpointUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then(colleges => {
        // Clear the college dropdown before adding new options
        collegeSelect.innerHTML = '';
        colleges.forEach(function(collegeName) {
          var option = document.createElement('option');
          option.value = collegeName; // Use the college name as the value
          option.textContent = collegeName; // The text to display is also the college name
          collegeSelect.appendChild(option);
        });
        console.log("Colleges loaded for state: " + stateAbbreviation);
      })
      .catch(error => {
        console.error('Error fetching colleges:', error);
      });
  });

  // Function to fetch cost of living data
  function fetchCostOfLivingData(state) {
    var endpointUrl = 'https://us-east-1.aws.data.mongodb-api.com/app/roitoolapp-jnjed/endpoint/costOfLiving?state=' + encodeURIComponent(state);
    console.log("Fetching cost of living data from:", endpointUrl);

    fetch(endpointUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log("Cost of living data received:", data);

        const costOfLiving = data
        // Update the cost of living field
        costOfLivingField.textContent = "$" + data.toLocaleString();

const averageSalary6 = parseInt(averageSalary6Field.textContent.replace(/\$/g, '').replace(/,/g, ''), 10);
const averageSalary10 = parseInt(averageSalary10Field.textContent.replace(/\$/g, '').replace(/,/g, ''), 10);
console.log(averageSalary6)
console.log(averageSalary10)
  const averageSalary = (averageSalary6 + averageSalary10) / 2;
       console.log(averageSalary)
        // Calculate leftover savings
     		const leftoverSavings = averageSalary - costOfLiving
        leftoverSavings2.textContent = "$" + leftoverSavings.toLocaleString();
        if (leftoverSavings < 0) {
          timeToRecoupInStateField.textContent = "No leftover savings per year, payoff will be extremely difficult";
          timeToRecoupOutOfStateField.textContent = "No leftover savings per year, payoff will be extremely difficult";
        } else {
          // Calculate time to recoup funds for in-state tuition
          const inStateTuition = parseInt(inStateTuitionField.textContent.replace(/\$/g, '').replace(/,/g, ''), 10);
          const yearsToRecoupInState = Number(Math.floor(inStateTuition / (leftoverSavings))).toLocaleString('en', { useGrouping: true });
          timeToRecoupInStateField.textContent = yearsToRecoupInState + " years";

          // Calculate time to recoup funds for out-of-state tuition
          const outOfStateTuition = parseInt(outOfStateTuitionField.textContent.replace(/\$/g, '').replace(/,/g, ''), 10);
          const yearsToRecoupOutOfState = Number(Math.floor(outOfStateTuition / (leftoverSavings))).toLocaleString('en', { useGrouping: true });
          timeToRecoupOutOfStateField.textContent = yearsToRecoupOutOfState + " years";

          const inStateTuitionTwoYears = inStateTuition / 2;
         
          // Calculate time to recoup funds for out-of-state tuition over two years
          const outOfStateTuitionTwoYears = outOfStateTuition / 2;
        }
        const inStateTuition = parseInt(inStateTuitionField.textContent.replace(/\$/g, '').replace(/,/g, ''), 10);
        const outOfStateTuition = parseInt(outOfStateTuitionField.textContent.replace(/\$/g, '').replace(/,/g, ''), 10);

        potentialSavingsInStateField.textContent = "$" + (inStateTuition / 2).toLocaleString('en', { useGrouping: true });
        potentialSavingsOutOfStateField.textContent = "$" + (outOfStateTuition / 2).toLocaleString('en', { useGrouping: true });
      })
      .catch(error => {
        console.error('Error fetching cost of living data:', error);
      });
  }
  // Listen for changes on the colleges dropdown
  collegeSelect.addEventListener('change', function() {
    var collegeName = this.value;
    if (collegeName !== "Select a college...") {
      fetchCollegeDetails(collegeName);
    } else {
      console.log("No college selected.");
    }
  });
});


collegeSelect.addEventListener('change', function() {
    console.log('Checking session storage for emailSubmitted...');
if (!sessionStorage.getItem('emailSubmitted')) {
        console.log('Showing modal...'); showModal(); // Show the modal if no email has been submitted
    } else {
        console.log('Fetching college details...');
fetchCollegeDetails(this.value); // Proceed with fetching college details if email already submitted
    }
});
