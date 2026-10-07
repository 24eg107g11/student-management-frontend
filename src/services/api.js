const API_URL =
    "https://studentmanagement-backend-sik3.onrender.com";

const getToken = () => {
    return localStorage.getItem("token");
};

const getHeaders = () => {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

const handleResponse = async (response) => {
    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";

        throw new Error(
            "Session expired. Please login again."
        );
    }

    if (response.status === 403) {
        throw new Error(
            "You do not have permission to perform this action."
        );
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Something went wrong. Please try again."
        );
    }

    return data;
};


// ===============================
// AUTH
// ===============================

export const registerUser = async (userData) => {

    const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(userData),
        }
    );

    return handleResponse(response);
};


export const loginUser = async (loginData) => {

    const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(loginData),
        }
    );

    return handleResponse(response);
};


// ===============================
// STUDENTS - GET
// ===============================

export const getStudents = async () => {

    const response = await fetch(
        `${API_URL}/api/students`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return handleResponse(response);
};


export const getStudentById = async (id) => {

    const response = await fetch(
        `${API_URL}/api/students/${id}`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return handleResponse(response);
};


// ===============================
// ADD STUDENT
// ===============================

export const addStudent = async (studentData) => {

    const response = await fetch(
        `${API_URL}/api/students`,
        {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(studentData),
        }
    );

    return handleResponse(response);
};


// ===============================
// CREATE STUDENT
// Alias of addStudent
// ===============================

export const createStudent = addStudent;


// ===============================
// UPDATE STUDENT
// ===============================

export const updateStudent = async (
    id,
    studentData
) => {

    const response = await fetch(
        `${API_URL}/api/students/${id}`,
        {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(studentData),
        }
    );

    return handleResponse(response);
};


// ===============================
// DELETE STUDENT
// ===============================

export const deleteStudent = async (id) => {

    const response = await fetch(
        `${API_URL}/api/students/${id}`,
        {
            method: "DELETE",
            headers: getHeaders(),
        }
    );

    if (response.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";

        throw new Error(
            "Session expired. Please login again."
        );
    }

    if (response.status === 403) {

        throw new Error(
            "You do not have permission to delete students."
        );
    }

    if (!response.ok) {

        const data =
            await response
                .json()
                .catch(() => ({}));

        throw new Error(
            data.message ||
            "Failed to delete student."
        );
    }

    return true;
};


// ===============================
// LOGOUT
// ===============================

export const logoutUser = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
};


// Keep "logout" available too
export const logout = logoutUser;


// ===============================
// AUTH CHECK
// ===============================

export const isAuthenticated = () => {

    return !!localStorage.getItem("token");
};


// ===============================
// DEFAULT EXPORT
// ===============================

export default {

    registerUser,

    loginUser,

    getStudents,

    getStudentById,

    addStudent,

    createStudent,

    updateStudent,

    deleteStudent,

    logoutUser,

    logout,

    isAuthenticated,
};