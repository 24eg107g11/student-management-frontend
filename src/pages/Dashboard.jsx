import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  deleteStudent,
  getStudents,
  logoutUser,
  updateStudent,
} from "../services/api";

import StudentForm from "../components/StudentForm";
import StudentDetails from "../components/StudentDetails";

function Dashboard() {
  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("default");

  const [viewStudent, setViewStudent] =
    useState(null);

  const [editStudent, setEditStudent] =
    useState(null);

  const [editErrors, setEditErrors] =
    useState({});

  const [updateLoading, setUpdateLoading] =
    useState(false);

  const [message, setMessage] =
    useState(null);

  // ========================================
  // LOAD STUDENTS
  // ========================================

  const loadStudents = async () => {
    setLoading(true);

    try {
      const data = await getStudents();

      setStudents(data);
    } catch (error) {
      console.error(
        "Get students error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.message ||
          "Failed to load students",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // ========================================
  // ADD STUDENT
  // ========================================

  const handleStudentAdded = (
    newStudent
  ) => {
    setStudents((current) => [
      ...current,
      newStudent,
    ]);
  };

  // ========================================
  // DELETE STUDENT
  // ========================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmed) {
      return;
    }

    setMessage(null);

    try {
      await deleteStudent(id);

      setStudents((current) =>
        current.filter(
          (student) =>
            student.id !== id
        )
      );

      if (
        viewStudent &&
        viewStudent.id === id
      ) {
        setViewStudent(null);
      }

      if (
        editStudent &&
        editStudent.id === id
      ) {
        setEditStudent(null);
      }

      setMessage({
        type: "success",
        text:
          "Student deleted successfully!",
      });
    } catch (error) {
      console.error(
        "Delete student error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.message ||
          "Failed to delete student",
      });
    }
  };

  // ========================================
  // EDIT VALIDATION
  // ========================================

  const validateEditForm = () => {
    const errors = {};

    if (!editStudent.name.trim()) {
      errors.name =
        "Name is required";
    } else if (
      editStudent.name.trim()
        .length < 2
    ) {
      errors.name =
        "Name must contain at least 2 characters";
    }

    if (!editStudent.email.trim()) {
      errors.email =
        "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        editStudent.email.trim()
      )
    ) {
      errors.email =
        "Enter a valid email address";
    }

    if (
      !editStudent.department.trim()
    ) {
      errors.department =
        "Department is required";
    }

    if (
      editStudent.age === "" ||
      editStudent.age === null
    ) {
      errors.age =
        "Age is required";
    } else if (
      Number(editStudent.age) < 1 ||
      Number(editStudent.age) > 120
    ) {
      errors.age =
        "Age must be between 1 and 120";
    }

    setEditErrors(errors);

    return (
      Object.keys(errors).length === 0
    );
  };

  // ========================================
  // UPDATE STUDENT
  // ========================================

  const handleUpdate = async () => {
    if (!validateEditForm()) {
      return;
    }

    setUpdateLoading(true);
    setMessage(null);

    try {
      const updatedStudent =
        await updateStudent(
          editStudent.id,
          {
            name:
              editStudent.name.trim(),

            email:
              editStudent.email.trim(),

            department:
              editStudent.department.trim(),

            age:
              Number(editStudent.age),
          }
        );

      setStudents((current) =>
        current.map((student) =>
          student.id ===
          updatedStudent.id
            ? updatedStudent
            : student
        )
      );

      setEditStudent(null);
      setEditErrors({});

      setMessage({
        type: "success",
        text:
          "Student updated successfully!",
      });
    } catch (error) {
      console.error(
        "Update student error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.message ||
          "Failed to update student",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  // ========================================
  // FILTER + SEARCH + SORT
  // ========================================

  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Search
    if (search.trim()) {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      result = result.filter(
        (student) =>
          student.name
            .toLowerCase()
            .includes(searchValue) ||
          student.email
            .toLowerCase()
            .includes(searchValue) ||
          student.department
            .toLowerCase()
            .includes(searchValue)
      );
    }

    // Department
    if (
      departmentFilter !== "All"
    ) {
      result = result.filter(
        (student) =>
          student.department ===
          departmentFilter
      );
    }

    // Sort
    if (sortBy === "nameAsc") {
      result.sort((a, b) =>
        a.name.localeCompare(
          b.name
        )
      );
    }

    if (sortBy === "nameDesc") {
      result.sort((a, b) =>
        b.name.localeCompare(
          a.name
        )
      );
    }

    if (sortBy === "ageAsc") {
      result.sort(
        (a, b) =>
          a.age - b.age
      );
    }

    if (sortBy === "ageDesc") {
      result.sort(
        (a, b) =>
          b.age - a.age
      );
    }

    return result;
  }, [
    students,
    search,
    departmentFilter,
    sortBy,
  ]);

  // ========================================
  // DEPARTMENTS
  // ========================================

  const departments = useMemo(() => {
    return [
      ...new Set(
        students.map(
          (student) =>
            student.department
        )
      ),
    ];
  }, [students]);

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmed) {
      return;
    }

    logoutUser();
  };

  // ========================================
  // STATS
  // ========================================

  const totalStudents =
    students.length;

  const totalDepartments =
    departments.length;

  const averageAge =
    students.length > 0
      ? (
          students.reduce(
            (sum, student) =>
              sum +
              Number(student.age),
            0
          ) /
          students.length
        ).toFixed(1)
      : 0;

  // ========================================
  // JSX
  // ========================================

  return (
    <div className="dashboard">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="navbar-brand">
          🎓 Student Management
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

      <div className="dashboard-container">

        {/* PAGE TITLE */}

        <div className="dashboard-header">

          <div>
            <h1>
              Student Dashboard
            </h1>

            <p>
              Manage your students
              easily.
            </p>
          </div>

        </div>

        {/* MESSAGE */}

        {message && (
          <div
            className={`message ${
              message.type ===
              "success"
                ? "success-message"
                : "error-box"
            }`}
          >
            <span>
              {message.text}
            </span>

            <button
              onClick={() =>
                setMessage(null)
              }
            >
              ×
            </button>
          </div>
        )}

        {/* STATS */}

        <div className="stats-grid">

          <div className="stat-card">
            <h3>
              Total Students
            </h3>

            <strong>
              {totalStudents}
            </strong>
          </div>

          <div className="stat-card">
            <h3>
              Departments
            </h3>

            <strong>
              {totalDepartments}
            </strong>
          </div>

          <div className="stat-card">
            <h3>
              Average Age
            </h3>

            <strong>
              {averageAge}
            </strong>
          </div>

        </div>

        {/* ADD STUDENT */}

        <div className="dashboard-card">

          <StudentForm
            onStudentAdded={
              handleStudentAdded
            }
            onMessage={
              setMessage
            }
          />

        </div>

        {/* CONTROLS */}

        <div className="student-controls">

          <input
            type="text"
            placeholder="Search by name, email or department..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <select
            value={
              departmentFilter
            }
            onChange={(e) =>
              setDepartmentFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Departments
            </option>

            {departments.map(
              (department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              )
            )}
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
          >
            <option value="default">
              Sort By
            </option>

            <option value="nameAsc">
              Name A-Z
            </option>

            <option value="nameDesc">
              Name Z-A
            </option>

            <option value="ageAsc">
              Age Low-High
            </option>

            <option value="ageDesc">
              Age High-Low
            </option>
          </select>

        </div>

        {/* RESULT COUNT */}

        {!loading && (
          <p className="result-count">
            Showing{" "}
            <strong>
              {filteredStudents.length}
            </strong>{" "}
            of{" "}
            <strong>
              {students.length}
            </strong>{" "}
            students
          </p>
        )}

        {/* STUDENTS */}

        <div className="dashboard-card">

          <h2>
            Students
          </h2>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>

              <p>
                Loading students...
              </p>
            </div>
          ) : filteredStudents.length ===
            0 ? (
            <div className="empty-state">

              <div className="empty-icon">
                📚
              </div>

              <h3>
                No students found
              </h3>

              <p>
                Try changing your
                search or filter,
                or add a new student.
              </p>

            </div>
          ) : (
            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>
                      Department
                    </th>
                    <th>Age</th>
                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredStudents.map(
                    (student) => (
                      <tr
                        key={
                          student.id
                        }
                      >

                        <td>
                          {student.id}
                        </td>

                        <td>
                          {student.name}
                        </td>

                        <td>
                          {student.email}
                        </td>

                        <td>
                          {
                            student.department
                          }
                        </td>

                        <td>
                          {student.age}
                        </td>

                        <td>

                          <button
                            className="view-button"
                            onClick={() =>
                              setViewStudent(
                                student
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            className="edit-button"
                            onClick={() => {
                              setEditStudent(
                                {
                                  ...student,
                                }
                              );

                              setEditErrors(
                                {}
                              );
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDelete(
                                student.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      {/* VIEW MODAL */}

      <StudentDetails
        student={
          viewStudent
        }
        onClose={() =>
          setViewStudent(null)
        }
      />

      {/* EDIT MODAL */}

      {editStudent && (
        <div className="modal-overlay">

          <div className="edit-modal">

            <div className="modal-header">

              <h2>
                Edit Student
              </h2>

              <button
                className="modal-close"
                onClick={() => {
                  setEditStudent(
                    null
                  );

                  setEditErrors(
                    {}
                  );
                }}
              >
                ×
              </button>

            </div>

            <div className="modal-form">

              {/* NAME */}

              <div className="form-group">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  value={
                    editStudent.name
                  }
                  onChange={(e) =>
                    setEditStudent(
                      {
                        ...editStudent,
                        name:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                {editErrors.name && (
                  <small className="error-message">
                    {
                      editErrors.name
                    }
                  </small>
                )}

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={
                    editStudent.email
                  }
                  onChange={(e) =>
                    setEditStudent(
                      {
                        ...editStudent,
                        email:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                {editErrors.email && (
                  <small className="error-message">
                    {
                      editErrors.email
                    }
                  </small>
                )}

              </div>

              {/* DEPARTMENT */}

              <div className="form-group">

                <label>
                  Department
                </label>

                <input
                  type="text"
                  value={
                    editStudent.department
                  }
                  onChange={(e) =>
                    setEditStudent(
                      {
                        ...editStudent,
                        department:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                {editErrors.department && (
                  <small className="error-message">
                    {
                      editErrors
                        .department
                    }
                  </small>
                )}

              </div>

              {/* AGE */}

              <div className="form-group">

                <label>
                  Age
                </label>

                <input
                  type="number"
                  min="1"
                  max="120"
                  value={
                    editStudent.age
                  }
                  onChange={(e) =>
                    setEditStudent(
                      {
                        ...editStudent,
                        age:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                {editErrors.age && (
                  <small className="error-message">
                    {
                      editErrors.age
                    }
                  </small>
                )}

              </div>

            </div>

            <div className="modal-footer">

              <button
                className="cancel-button"
                onClick={() => {
                  setEditStudent(
                    null
                  );

                  setEditErrors(
                    {}
                  );
                }}
              >
                Cancel
              </button>

              <button
                className="save-button"
                onClick={
                  handleUpdate
                }
                disabled={
                  updateLoading
                }
              >
                {updateLoading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;