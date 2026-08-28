// ====================
// Create User
// ====================

function createUser(name, email, password) {
  const users = getData(STORAGE_KEYS.users);

  const newUser = {
    id: crypto.randomUUID(),
    name: name,
    email: email,
    password: password,
  };
  users.push(newUser);
  saveData(STORAGE_KEYS.users, users);
  return newUser;
}

// ====================
// Find User By Email
// ====================

function findUserByEmail(email) {
  const users = getData(STORAGE_KEYS.users);
  return users.find((user) => user.email === email);
}

// ====================
// Login User
// ====================

function loginUser(email, password) {
  const user = findUserByEmail(email);

  if (!user) {
    return {
      success: false,
      message: "No account found with this email.",
    };
  }
  if (user.password !== password) {
    return {
      success: false,
      message: "Incorrect password.",
    };
  }
  return {
    success: true,
    user: user,
  };
}

// ====================
// Create User Session
// ====================

function createSession(user) {
  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  saveData(STORAGE_KEYS.currentUser, sessionUser);
  return sessionUser;
}
// ====================
// Get Current User
// ====================

function getCurrentUser() {
  const user = localStorage.getItem(STORAGE_KEYS.currentUser);

  return user ? JSON.parse(user) : null;
}
// ====================
// Logout User
// ====================

function logoutUser() {
  removeData(STORAGE_KEYS.currentUser);
}

// ====================
// Protect Page
// ====================

function requireAuth() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "./login.html";
  }
  return currentUser;
}
