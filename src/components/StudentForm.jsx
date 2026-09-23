import { useState } from "react";

import { addStudent } from "../services/api";

function StudentForm({
  onStudentAdded,
  onMessage,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] =
    useState("");
  const [age, setAge] = useState("");

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  // ========================================
  // VALIDATION
  // ========================================

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name =
        "Name is required";
    } else if (
      name.trim().length < 2
    ) {
      newErrors.name =
        "Name must contain at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email =
        "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    if (!department.trim()) {
      newErrors.department =
        "Department is required";
    }

    if (!age) {
      newErrors.age =
        "Age is required";
    } else if (
      Number(age) < 1 ||
      Number(age) > 120
    ) {
      newErrors.age =
        "Age must be between 1 and 120";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ========================================
  // SUBMIT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    if (onMessage) {
      onMessage(null);
    }

    try {
      const newStudent =
        await addStudent({
          name: name.trim(),
          email: email.trim(),
          department:
            department.trim(),
          age: Number(age),
        });

      onStudentAdded(newStudent);

      setName("");
      setEmail("");
      setDepartment("");
      setAge("");
      setErrors({});

      if (onMessage) {
        onMessage({
          type: "success",
          text: "Student added successfully!",
        });
      }
    } catch (error) {
      console.error(
        "Add student error:",
        error
      );

      if (onMessage) {
        onMessage({
          type: "error",
          text:
            error.message ||
            "Failed to add student",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Student</h2>

      <form
        onSubmit={handleSubmit}
        noValidate
      >
        {/* NAME */}

        <div className="form-group">
          <label htmlFor="student-name">
            Name
          </label>

          <input
            id="student-name"
            type="text"
            placeholder="Enter student name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);

              setErrors((current) => ({
                ...current,
                name: "",
              }));
            }}
          />

          {errors.name && (
            <small className="error-message">
              {errors.name}
            </small>
          )}
        </div>

        {/* EMAIL */}

        <div className="form-group">
          <label htmlFor="student-email">
            Email
          </label>

          <input
            id="student-email"
            type="email"
            placeholder="Enter student email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              setErrors((current) => ({
                ...current,
                email: "",
              }));
            }}
          />

          {errors.email && (
            <small className="error-message">
              {errors.email}
            </small>
          )}
        </div>

        {/* DEPARTMENT */}

        <div className="form-group">
          <label htmlFor="student-department">
            Department
          </label>

          <input
            id="student-department"
            type="text"
            placeholder="Enter department"
            value={department}
            onChange={(e) => {
              setDepartment(
                e.target.value
              );

              setErrors((current) => ({
                ...current,
                department: "",
              }));
            }}
          />

          {errors.department && (
            <small className="error-message">
              {errors.department}
            </small>
          )}
        </div>

        {/* AGE */}

        <div className="form-group">
          <label htmlFor="student-age">
            Age
          </label>

          <input
            id="student-age"
            type="number"
            min="1"
            max="120"
            placeholder="Enter age"
            value={age}
            onChange={(e) => {
              setAge(e.target.value);

              setErrors((current) => ({
                ...current,
                age: "",
              }));
            }}
          />

          {errors.age && (
            <small className="error-message">
              {errors.age}
            </small>
          )}
        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Adding Student..."
            : "Add Student"}
        </button>
      </form>
    </div>
  );
}

export default StudentForm;