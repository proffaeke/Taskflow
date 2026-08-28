// ====================
// Storage Keys
// ====================

const STORAGE_KEYS = {
  users: "taskflow_users",
  currentUser: "taskflow_current_user",
  tasks: "taskflow_tasks",
};

// ====================
// Storage Helpers
// ====================

function getData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function removeData(key) {
  localStorage.removeItem(key);
}

// ====================
// Update Helper
// ====================

function updateData(key, updateFunction) {
  const data = getData(key);
  const updatedData = updateFunction(data);
  saveData(key, updatedData);
  return updatedData;
}
