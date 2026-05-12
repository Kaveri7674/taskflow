import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/auth.css";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");



  // HANDLE INPUTS

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  // HANDLE REGISTER

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const res = await axios.post(
        "/api/auth/register",
        formData
      );

      console.log("REGISTER RESPONSE:");
      console.log(res.data);

      alert("Registration Successful");

      navigate("/");

    } catch (error) {

      console.log("REGISTER ERROR:");
      console.log(error);

      setError(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1 className="auth-title">
          Create Account
        </h1>

        <p className="auth-subtitle">
          Join TaskFlow and organize your work beautifully.
        </p>



        <form
          onSubmit={handleRegister}
          className="auth-form"
          autoComplete="off"
        >

         <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          className="auth-input"
          autoComplete="off"
          required
        />


          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
            autoComplete="off"
            required
          />


          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
            autoComplete="new-password"
            required
          />


          {error && (

            <div className="auth-message error-message">
              {error}
            </div>

          )}


          <button
            type="submit"
            className="auth-btn"
          >
            Register
          </button>

        </form>



        <p className="auth-footer">

          Already have an account?

          <span
            className="auth-link"
            onClick={() => navigate("/")}
          >
            Login
          </span>

        </p>

      </div>

    </div>
  );
}

export default Register;
