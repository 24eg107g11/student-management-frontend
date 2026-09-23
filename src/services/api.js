const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

// ========================================
// GET JWT TOKEN
// ========================================

const getToken = () => {
  return localStorage.getItem("token");
};

// ========================================
// COMMON API REQUEST
// ========================================

const apiRequest = async (
  endpoint,
  options = {}
) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Add JWT token
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );
  } catch (error) {
    throw new Error(
      "Cannot connect to backend. Make sure Spring Boot is running on port 8080."
    );
  }

  // ========================================
  // SESSION EXPIRED
  // ========================================

  if (
    response.status === 401 ||
    response.status === 403
  ) {
    localStorage.removeItem("token");

    if (
      window.location.pathname !== "/" &&
      window.location.pathname !== "/register"
    ) {
      window.location.href = "/";
    }

    throw new Error(
      "Session expired. Please login again."
    );
  }

  // ========================================
  // NO CONTENT
  // ========================================

  if (response.status === 204) {
    return null;
  }

  // ========================================
  // READ RESPONSE
  // ========================================

  const contentType =
    response.headers.get("content-type");

  let data;

  if (
    contentType &&
    contentType.includes(
      "application/json"
    )
  ) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // ========================================
  // HANDLE API ERROR
  // ========================================

  if (!response.ok) {
    let message = "Request failed";

    if (typeof data === "string") {
      message =
        data || "Request failed";
    } else if (data?.message) {
      message = data.message;
    } else if (data?.error) {
      message = data.error;
    }

    throw new Error(message);
  }

  return data;
};

// ========================================
// AUTH
// ========================================

export const registerUser = async (
  userData
) => {
  return apiRequest(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(userData),
    }
  );
};

export const loginUser = async (
  loginData
) => {
  return apiRequest(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(loginData),
    }
  );
};

// ========================================
// STUDENTS
// ========================================

export const getStudents = async () => {
  return apiRequest(
    "/api/students",
    {
      method: "GET",
    }
  );
};

export const getStudent = async (
  id
) => {
  return apiRequest(
    `/api/students/${id}`,
    {
      method: "GET",
    }
  );
};

export const addStudent = async (
  student
) => {
  return apiRequest(
    "/api/students",
    {
      method: "POST",
      body: JSON.stringify(student),
    }
  );
};

export const updateStudent = async (
  id,
  student
) => {
  return apiRequest(
    `/api/students/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(student),
    }
  );
};

export const deleteStudent = async (
  id
) => {
  return apiRequest(
    `/api/students/${id}`,
    {
      method: "DELETE",
    }
  );
};

// ========================================
// LOGOUT
// ========================================

export const logoutUser = () => {
  localStorage.removeItem("token");

  window.location.href = "/";
};

// ========================================
// AUTHENTICATION CHECK
// ========================================

export const isAuthenticated = () => {
  return Boolean(
    localStorage.getItem("token")
  );
};