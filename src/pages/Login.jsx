import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();


  const handleLogin = async (e) => {

    e.preventDefault();


    // Prevent multiple clicks
    if (loading) {
      return;
    }


    const cleanEmail = email.trim();


    // Validation

    if (!cleanEmail) {

      alert("Please enter your email");

      return;
    }


    if (!cleanEmail.includes("@")) {

      alert(
        "Please enter a valid email address"
      );

      return;
    }


    if (!password) {

      alert("Please enter your password");

      return;
    }


    if (password.length < 6) {

      alert(
        "Password must contain at least 6 characters"
      );

      return;
    }


    setLoading(true);


    try {

      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: cleanEmail,
            password: password
          })
        }
      );


      const data = await response.json();


      if (response.ok) {

        localStorage.setItem(
          "token",
          data.token
        );


        alert(
          "Login successful!"
        );


        navigate("/dashboard");

      } else {

        alert(
          data.message ||
          "Invalid email or password"
        );

      }

    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      alert(
        "Cannot connect to backend. Make sure Spring Boot is running."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">


        <div className="auth-logo">
          🎓
        </div>


        <h1>
          Student Management
        </h1>


        <p className="auth-subtitle">
          Login to your account
        </p>


        <form
          className="auth-form"
          onSubmit={handleLogin}
        >


          {/* EMAIL */}

          <div className="auth-field">

            <label>
              Email
            </label>


            <input
              type="email"
              placeholder="Enter your email"
              value={email}

              onChange={(e) =>
                setEmail(e.target.value)
              }

              disabled={loading}

              required
            />

          </div>


          {/* PASSWORD */}

          <div className="auth-field">

            <label>
              Password
            </label>


            <div className="password-container">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                placeholder="Enter your password"

                value={password}

                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }

                disabled={loading}

                required
              />


              <button
                type="button"

                className="password-toggle"

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

                disabled={loading}
              >

                {showPassword
                  ? "Hide"
                  : "Show"}

              </button>

            </div>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="auth-button"

            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>


        </form>


        <p className="auth-footer">

          Don't have an account?

          {" "}

          <Link to="/register">
            Create account
          </Link>

        </p>


      </div>

    </div>

  );
}

export default Login;