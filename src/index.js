document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const form = document.getElementById('dog-form');
  
    // Function to render the list of dogs
    const renderDogs = (dogs) => {
      tableBody.innerHTML = '';
      dogs.forEach((dog) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${dog.name}</td>
          <td>${dog.breed}</td>
          <td>${dog.sex}</td>
          <td>
            <button class="edit-dog" data-id="${dog.id}">Edit</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    };
  
    // Fetch the list of dogs on page load
    fetch('http://localhost:3000/dogs')
      .then((response) => response.json())
      .then((dogs) => renderDogs(dogs));
  
    // Handle form submission
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const name = formData.get('name');
      const breed = formData.get('breed');
      const sex = formData.get('sex');
      const id = form.getAttribute('data-id');
  
      // Make a PATCH request to update the dog information
      fetch(`http://localhost:3000/dogs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          breed,
          sex,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          // Fetch the list of dogs again and render them
          fetch('http://localhost:3000/dogs')
            .then((response) => response.json())
            .then((dogs) => renderDogs(dogs));
        });
  
      // Clear the form
      form.reset();
      form.removeAttribute('data-id');
      form.querySelector('input[type="submit"]').value = 'Submit';
    });
  
    // Handle edit button click
    tableBody.addEventListener('click', (event) => {
      if (event.target.matches('.edit-dog')) {
        const id = event.target.getAttribute('data-id');
  
        // Fetch the dog information and populate the form
        fetch(`http://localhost:3000/dogs/${id}`)
          .then((response) => response.json())
          .then((dog) => {
            form.setAttribute('data-id', dog.id);
            form.querySelector('input[name="name"]').value = dog.name;
            form.querySelector('input[name="breed"]').value = dog.breed;
            form.querySelector('input[name="sex"]').value = dog.sex;
            form.querySelector('input[type="submit"]').value = 'Update';
          });
      }
    });
  });
  