const uploadBtn = document.getElementById("uploadBtn");
const logoutBtn = document.getElementById("logoutBtn");
const titleInput = document.getElementById("titleInput");
const subjectInput = document.getElementById("subjectInput");
const fileInput = document.getElementById("fileInput");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const loginBtn = document.getElementById("loginBtn");
const crPassword = document.getElementById("crPassword");
const uploadSection = document.getElementById("uploadSection");
const loginSection = document.getElementById("loginSection");
const loginMessage = document.getElementById("loginMessage");

// CR password (you can change this)
const CR_PASS = "1234";

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let isCR = localStorage.getItem("isCR") === "true";

// Display Notes
function displayNotes(filteredNotes) {
  notesContainer.innerHTML = "";
  if (filteredNotes.length === 0) {
    notesContainer.innerHTML = "<p>No notes found...</p>";
    return;
  }

  filteredNotes.forEach((note, index) => {
    const card = document.createElement("div");
    card.classList.add("note-card");
    card.innerHTML = `
      <h3>${note.title}</h3>
      <p><b>Subject:</b> ${note.subject}</p>
      <a href="${note.fileURL}" class="download-btn" download>Download</a>
      ${isCR ? `<button class="delete-btn" onclick="deleteNote(${index})">X</button>` : ""}
    `;
    notesContainer.appendChild(card);
  });
}

// Delete note (CR only)
function deleteNote(index) {
  if (confirm("Are you sure you want to delete this note?")) {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes(notes);
  }
}

// Upload Note (CR only)
uploadBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const subject = subjectInput.value.trim();
  const file = fileInput.files[0];

  if (!title || !subject || !file) {
    alert("Please fill all fields!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const newNote = {
      title,
      subject,
      fileURL: event.target.result,
    };
    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes(notes);

    titleInput.value = "";
    subjectInput.value = "";
    fileInput.value = "";
    alert("Note uploaded successfully!");
  };
  reader.readAsDataURL(file);
});

// CR Login
loginBtn.addEventListener("click", () => {
  if (crPassword.value === CR_PASS) {
    isCR = true;
    localStorage.setItem("isCR", "true");
    loginSection.style.display = "none";
    uploadSection.style.display = "block";
    displayNotes(notes);
  } else {
    loginMessage.textContent = "❌ Incorrect password!";
    loginMessage.style.color = "red";
  }
});

// CR Logout
logoutBtn.addEventListener("click", () => {
  isCR = false;
  localStorage.removeItem("isCR");
  uploadSection.style.display = "none";
  loginSection.style.display = "block";
  alert("Logged out successfully!");
});

// Search Notes
searchInput.addEventListener("keyup", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query) ||
      note.subject.toLowerCase().includes(query)
  );
  displayNotes(filtered);
});

// On page load
if (isCR) {
  loginSection.style.display = "none";
  uploadSection.style.display = "block";
}
displayNotes(notes);
