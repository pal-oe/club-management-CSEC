document.addEventListener('DOMContentLoaded', function () {
  // Theme switch functionality
  const lightThemeBtn = document.getElementById('lightThemeBtn');
  const darkThemeBtn = document.getElementById('darkThemeBtn');

  lightThemeBtn.addEventListener('click', function () {
    document.body.classList.remove('dark-theme');
    document.getElementById('membersJoined').innerText = '10'; // Replace with actual data
  document.getElementById('activitiesThisWeek').innerText = '5'; // Replace with actual data
  document.getElementById('overallParticipation').innerText = '80%'; // Replace with actual data
  });

  darkThemeBtn.addEventListener('click', function () {
    document.body.classList.add('dark-theme');
  });
});


document.addEventListener('DOMContentLoaded', function () {
  // Call the function to create the members table
  createMembersTable();
});

// Function to create the members table dynamically
function createMembersTable() {
  // Fetch members data from the server
  fetch('/members')
    .then(response => response.json())
    .then(data => {
      // Get the table body element
      const tableBody = document.getElementById('membersTableBody');

      // Check if the tableBody element is null
      if (!tableBody) {
        console.error('Table body element not found.');
        return;
      }

      // Clear existing rows
      tableBody.innerHTML = '';

      // Iterate through the sorted members and create rows
      data.forEach(member => {
        const row = tableBody.insertRow();

        // Add cells to the row
        const idCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        const statusCell = row.insertCell(2);
        const roleCell = row.insertCell(3);
        const actionCell = row.insertCell(4);
        const actionCell2 = row.insertCell(5);

        // Populate cells with member data
        idCell.textContent = member.id;
        nameCell.textContent = member.name;
        statusCell.textContent = member.status;
        roleCell.textContent = member.role;

        // Add a delete and add button to each row
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.onclick = function () {
          // Call a function to handle delete operation
          handleDelete(member.id);
        };
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'btn btn-success btn-sm btn-block';
        editButton.onclick = function () {
          // Call a function to handle delete operation
          handleEdit(member.id);
        };

        // Append the delete button to the action cell
        actionCell.appendChild(editButton);
        actionCell2.appendChild(deleteButton);
      });
    })
    .catch(error => {
      console.error('Error fetching members data:', error);
    });
}

// Function to handle member deletion
function handleDelete(memberId) {
  // Send an HTTP DELETE request to the server
  fetch('/members/' + memberId, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      console.log('Member deleted successfully:', data.message);
      // Optionally, you can update the table or perform other actions after deletion

      // After deletion, renumber the remaining members
      createMembersTable();
    })
    .catch(error => {
      console.error('Error deleting member:', error);
    });
}

// Add an edit button to each row
const editButton = document.createElement('button');
editButton.textContent = 'Edit';
editButton.className = 'btn btn-success btn-sm btn-block';
editButton.onclick = function () {
  // Call a function to handle edit operation and pass the member id
  handleEdit(member.id);
};

// Append the edit button to the action cell
let currentMemberId;
// Function to handle member editing
function handleEdit(memberId) {
  // Fetch member data from the server based on the memberId
  fetch('/members/' + memberId + '/edit')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch member data');
    }
    const contentType = response.headers.get('Content-Type');
    console.log(contentType)
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      throw new Error('Response is not in JSON format');
    }
  })
    .then(member => {
    const modal = document.getElementById('editMemberModal');
    const nameInput = document.getElementById('editMemberName');
    const statusInput = document.getElementById('editMemberStatus');
    const roleInput = document.getElementById('editMemberRole');

    nameInput.value = member.name;
    statusInput.value = member.status;
    roleInput.value = member.role;

    // Set the memberId as a data attribute on the modal
    currentMemberId = memberId

    $(modal).modal('show');
  });
}

// Handle form submission
function submitEditMemberForm() {
  console.log("submit edit memeber form()")
  const modal = document.getElementById('editMemberModal');
  const memberId = currentMemberId;
  const name = document.getElementById('editMemberName').value;
  const status = document.getElementById('editMemberStatus').value;
  const role = document.getElementById('editMemberRole').value;

  fetch(`/edit/${memberId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      status: status,
      role: role,
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Member Edited successfully:', data.message);

    // Close the modal
    $('#editMemberModal').modal('hide');

    // After adding, refresh the members table
    createMembersTable();
  })
  .catch(error => {
    console.error('Error Editing member:', error);
  });
}

function submitAddMemberForm() {
  const memberName = document.getElementById('memberName').value;
  const memberStatus = document.getElementById('memberStatus').value;
  const memberRole = document.getElementById('memberRole').value;
  const memberPassword = document.getElementById('user_pass').value; // Update the variable name to match the correct id

  // Validate the input fields if needed

  // Create an object with the member data
  const newMember = {
    name: memberName,
    status: memberStatus,
    role: memberRole,
    user_pass: memberPassword // Include the password in the newMember object
  };

  // Send an HTTP POST request to add the new member to the database
  fetch('/add-member', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Update the Content-Type header to 'application/json'
    },
    body: JSON.stringify(newMember), // Stringify the newMember object
  })
    .then(response => response.json())
    .then(data => {
      console.log('Member added successfully:', data.message);

      // Optionally, you can update the table or perform other actions after adding a member

      // Close the modal
      $('#addMemberModal').modal('hide');

      // After adding, refresh the members table
      createMembersTable();
    })
    .catch(error => {
      console.error('Error adding member:', error);
    });
}

// Function to handle the form submission and post an event
// custom.js

// Function to handle the form submission and post an event
async function postEvent() {
  console.log("postEvent function is running");

  // Retrieve form values
  var eventTitle = document.getElementById("eventTitle").value;
  var eventDescription = document.getElementById("eventDescription").value;
  var eventDate = document.getElementById("eventDate").value;
  var eventTime = document.getElementById("eventTime").value;
  var eventLocation = document.getElementById("eventLocation").value;
  var eventImage = document.getElementById("eventImage").files[0]; // Get the selected image file

  // Validate form fields
  if (!eventTitle || !eventDescription || !eventDate || !eventTime || !eventLocation || !eventImage) {
      alert("Please fill in all fields");
      return;
  }

  // Create a new FormData object to handle file upload
  var formData = new FormData();
  formData.append("eventTitle", eventTitle);
  formData.append("eventDescription", eventDescription);
  formData.append("eventDate", eventDate);
  formData.append("eventTime", eventTime);
  formData.append("eventLocation", eventLocation);
  formData.append("eventImage", eventImage);

  try {
      // Use the fetch API to make the POST request
      const response = await fetch("/postEvent", {
          method: "POST",
          body: formData,
      });

      // Check the response status
      if (response.ok) {
          console.log("Event successfully posted");
      } else {
          console.error("Failed to post event:", response.status, response.statusText);
      }
  } catch (error) {
      console.error("Error during fetch:", error);
  }

  // Clear the form fields
  $("#eventModal").modal("hide");
  console.log("Here we are at hide");

  // You can add additional code to update the UI or load the posted event data as needed
}
// Function to fetch and display posts
async function displayPosts() {
  // Make a GET request to fetch the data
  try {
      const response = await fetch("/getEvents"); // Update the endpoint to match your server route
      if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
      }

      const events = await response.json();

      // Clear the existing posts
      document.getElementById("postContainer").innerHTML = "";

      // Display each event as a post
      events.forEach(event => {
          createPost(event);
      });
  } catch (error) {
      console.error("Error fetching events:", error);
  }
}

// Function to create a post for a single event
// Function to create a post for a single event
function createPost(event) {
  // Create a card element
  var card = document.createElement("div");
  card.className = "card mb-3";

  // Create an image element
  var img = document.createElement("img");
  img.className = "card-img-top";
  // Set the image source based on your data (replace 'image_data' with the actual property name)
  img.src = `data:image/png;base64,${event.image_data}`;
  img.alt = "Event Image";

  // Create a card body
  var cardBody = document.createElement("div");
  cardBody.className = "card-body";

  // Populate the card body with event details
  var title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = event.event_title;

  var description = document.createElement("p");
  description.className = "card-text";
  description.textContent = event.description;

  var details = document.createElement("p");
  details.className = "card-text";
  details.innerHTML = `<strong>Date:</strong> ${event.event_date}<br><strong>Time:</strong> ${event.event_time}<br><strong>Location:</strong> ${event.location}`;

  // Create a delete button
  var deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-danger";
  deleteButton.textContent = "Delete";
  // Attach a click event listener to the delete button
  deleteButton.addEventListener("click", () => deleteEvent(event.id));

  // Append elements to the card body
  cardBody.appendChild(title);
  cardBody.appendChild(description);
  cardBody.appendChild(details);
  cardBody.appendChild(deleteButton);

  // Append elements to the card
  card.appendChild(img);
  card.appendChild(cardBody);

  // Append the card to the post container
  document.getElementById("postContainer").appendChild(card);
}


// Function to delete an event
async function deleteEvent(eventId) {
  try {
      const response = await fetch(`/deleteEvent/${eventId}`, {
          method: "DELETE",
      });

      if (!response.ok) {
          throw new Error(`Failed to delete event: ${response.status} ${response.statusText}`);
      }

      // Refresh the displayed posts after deletion
      displayPosts();
  } catch (error) {
      console.error("Error deleting event:", error);
  }
}

// Call the displayPosts function to initially load and display events
displayPosts();
