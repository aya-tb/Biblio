// --- CONFIGURATION ---
const ADMIN_EMAIL = "admin@biblio.dz";

// --- STATE MANAGEMENT ---
// Default to visitor if no active session is found in localStorage
let currentUser = JSON.parse(localStorage.getItem("sb_user")) || {
  email: "",
  role: "visitor"
};

/**
 * Handles login via email submission.
 * Assigns ADMIN role if email matches the admin address, otherwise assigns USER.
 */
function handleLogin(email) {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    alert("Please enter a valid email address.");
    return false;
  }

  const role = (cleanEmail === ADMIN_EMAIL.toLowerCase()) ? "ADMIN" : "USER";
  
  currentUser = {
    email: cleanEmail,
    role: role,
    name: role === "ADMIN" ? "Admin Sarah" : cleanEmail.split("@")[0]
  };

  // Persist session
  localStorage.setItem("sb_user", JSON.stringify(currentUser));
  return true;
}

/**
 * Logs out the current user and resets state to visitor.
 */
function handleLogout() {
  currentUser = { email: "", role: "visitor" };
  localStorage.removeItem("sb_user");
  location.hash = "#/login";
}