import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import {
  loginUser,
  isAuthenticated,
} from "./services/api";


// ========================================
// PROTECTED ROUTE
// ========================================

function ProtectedRoute({
  children
}) {

  const authenticated =
    isAuthenticated();


  if (!authenticated) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  return children;
}


// ========================================
// LOGIN
// ========================================

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);


  const navigate =
    useNavigate();


  // ========================================
  // VALIDATION
  // ========================================

  const validateForm = () => {

    const newErrors = {};


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
    }


    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };


  // ========================================
  // LOGIN
  // ========================================

  const handleLogin =
    async (e) => {

      e.preventDefault();


      if (!validateForm()) {
        return;
      }


      setLoading(true);


      try {

        const data =
          await loginUser({
            email:
              email.trim(),

            password:
              password
          });


        localStorage.setItem(
          "token",
          data.token
        );


        alert(
          "Login successful!"
        );


        navigate(
          "/dashboard"
        );


      } catch (error) {

        console.error(
          "Login error:",
          error
        );


        setErrors({
          login:
            error.message ||
            "Invalid email or password"
        });


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
          Login
        </h2>


        {errors.login && (

          <div className="error-box">

            {errors.login}

          </div>

        )}


        <form
          onSubmit={handleLogin}
          noValidate
        >

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
                    login: ""
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {

                setPassword(
                  e.target.value
                );

                setErrors(
                  (current) => ({
                    ...current,
                    password: "",
                    login: ""
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


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>


        <div className="auth-footer">

          <p>
            Don't have an account?
          </p>

          <Link to="/register">
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
}


// ========================================
// APP
// ========================================

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={<Login />}
        />


        {/* REGISTER */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* PROTECTED DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>
          }
        />


        {/* UNKNOWN URL */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;