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
    $('#addMemberModal').modal('hide');

    // After adding, refresh the members table
    createMembersTable();
  })
  .catch(error => {
    console.error('Error Editing member:', error);
  });
}

// Add this function to handle the submission of the Add Member form
function submitAddMemberForm() {
  const memberName = document.getElementById('memberName').value;
  const memberStatus = document.getElementById('memberStatus').value;
  const memberRole = document.getElementById('memberRole').value;

  // Validate the input fields if needed

  // Create an object with the member data
  const newMember = {
    name: memberName,
    status: memberStatus,
    role: memberRole
  };

  // Send an HTTP POST request to add the new member to the database
  fetch('/add-member', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      name: memberName,
      status: memberStatus,
      role: memberRole,
    }),
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