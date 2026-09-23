import { useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  registerUser
} from "../services/api";


function Register() {

  const navigate =
    useNavigate();


  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");


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


    if (!password) {

      newErrors.password =
        "Password is required";

    } else if (
      password.length < 6
    ) {

      newErrors.password =
        "Password must contain at least 6 characters";
    }


    setErrors(newErrors);


    return (
      Object.keys(newErrors)
        .length === 0
    );
  };


  // ========================================
  // REGISTER
  // ========================================

  const handleRegister =
    async (e) => {

      e.preventDefault();


      if (!validateForm()) {
        return;
      }


      setLoading(true);


      try {

        await registerUser({

          name:
            name.trim(),

          email:
            email.trim(),

          password:
            password

        });


        alert(
          "Registration successful! Please login."
        );


        setName("");
        setEmail("");
        setPassword("");

        setErrors({});


        navigate("/");


      } catch (error) {

        console.error(
          "Registration error:",
          error
        );


        if (
          error.message
            .toLowerCase()
            .includes(
              "already registered"
            )
        ) {

          setErrors({
            email:
              "This email is already registered"
          });

        } else {

          setErrors({
            general:
              error.message ||
              "Registration failed"
          });
        }


      } finally {

        setLoading(false);
      }
    };


  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1>
          🎓 Student Management
        </h1>

        <h2>
          Create Account
        </h2>


        {errors.general && (

          <div className="error-box">

            {errors.general}

          </div>

        )}


        <form
          onSubmit={handleRegister}
          noValidate
        >

          {/* NAME */}

          <div>

            <label>
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {

                setName(
                  e.target.value
                );

                setErrors(
                  (current) => ({
                    ...current,
                    name: "",
                    general: ""
                  })
                );

              }}
            />


            {errors.name && (

              <small className="error-message">

                {errors.name}

              </small>

            )}

          </div>


          {/* EMAIL */}

          <div>

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {

                setEmail(
                  e.target.value
                );

                setErrors(
                  (current) => ({
                    ...current,
                    email: "",
                    general: ""
                  })
                );

              }}
            />


            {errors.email && (

              <small className="error-message">

                {errors.email}

              </small>

            )}

          </div>


          {/* PASSWORD */}

          <div>

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {

                setPassword(
                  e.target.value
                );

                setErrors(
                  (current) => ({
                    ...current,
                    password: "",
                    general: ""
                  })
                );

              }}
            />


            {errors.password && (

              <small className="error-message">

                {errors.password}

              </small>

            )}

          </div>


          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Register"}

          </button>

        </form>


        <div className="auth-footer">

          <p>
            Already have an account?
          </p>

          <Link to="/">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}


export default Register;