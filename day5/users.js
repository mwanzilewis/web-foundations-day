const loadBtn = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusEl = document.getElementById("status");
const usersList = document.getElementById("users-list");

let allUsers = [];

function renderUsers(list) {
  usersList.innerHTML = "";

  if (list.length === 0) {
    if (allUsers.length > 0) {
      statusEl.textContent = "No users match your filter.";
    }
    return;
  }

  list.forEach(user => {
    const li = document.createElement("li");

    const name = document.createElement("strong");
    name.textContent = user.name;

    const email = document.createElement("div");
    email.textContent = `Email: ${user.email}`;

    const city = document.createElement("div");
    city.textContent = `City: ${user.address.city}`;

    const company = document.createElement("div");
    company.textContent = `Company: ${user.company.name}`;

    li.appendChild(name);
    li.appendChild(email);
    li.appendChild(city);
    li.appendChild(company);

    usersList.appendChild(li);
  });
}

async function loadUsers() {
  try {
    loadBtn.disabled = true;
    statusEl.textContent = "Loading users...";
    usersList.innerHTML = "";

    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const users = await response.json();
    allUsers = users;

    renderUsers(allUsers);
    statusEl.textContent = `Loaded ${allUsers.length} users successfully.`;

  } catch (error) {
    statusEl.textContent = `Failed to load users: ${error.message}`;
    console.error(error);
  } finally {
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
  const query = filterInput.value.toLowerCase().trim();
  const filtered = allUsers.filter(u => u.name.toLowerCase().includes(query));
  renderUsers(filtered);

  if (filtered.length > 0 && query) {
    statusEl.textContent = `Showing ${filtered.length} of ${allUsers.length} users`;
  } else if (filtered.length > 0 && !query) {
    statusEl.textContent = `Loaded ${allUsers.length} users successfully.`;
  }
});
