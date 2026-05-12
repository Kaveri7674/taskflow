import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] =
    useState("");



  // HANDLE INPUTS

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  // HANDLE LOGIN

  const handleSubmit = async (e) => {

    e.preventDefault();

    // EMPTY VALIDATION

    if (
      !formData.email ||
      !formData.password
    ) {

      setMessage(
        "Please fill all fields"
      );

      setMessageType("error");

      return;
    }

    try {

      const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          formData
        );

        console.log(res.data);

        localStorage.setItem(
          "token",
          res.data.token
        );

      // STORE USER NAME

      localStorage.setItem(
        "userName",
        res.data.name || "User"
      );

      // SUCCESS ALERT

     window.location.href = "/dashboard";

    } catch (error) {

      const backendMessage =
        error.response?.data?.message;

      // USER NOT FOUND

      if (
        backendMessage
          ?.toLowerCase()
          .includes("user")
      ) {

        setMessage(
          "User does not exist"
        );
      }

      // WRONG PASSWORD

      else if (
        backendMessage
          ?.toLowerCase()
          .includes("password")
      ) {

        setMessage(
          "Incorrect credentials"
        );
      }

      else {

        setMessage(
          backendMessage ||
          "Login Failed"
        );
      }

      setMessageType("error");
    }
  };



  return (

    <>

      <style>

        {`

          *{
            margin:0;
            padding:0;
            box-sizing:border-box;
          }

          body{
            font-family:Arial,sans-serif;
          }

          .auth-page{
            min-height:100vh;

            display:flex;
            justify-content:center;
            align-items:center;

            padding:20px;

            background:
              linear-gradient(
                135deg,
                #dbeafe,
                #ffffff,
                #ede9fe
              );
          }

          .auth-card{
            width:100%;
            max-width:430px;

            padding:40px 34px;

            border-radius:32px;

            background:
              rgba(255,255,255,0.72);

            backdrop-filter:blur(18px);

            box-shadow:
              0 14px 34px rgba(0,0,0,0.12);

            animation:fadeAuth 0.5s ease;

            transition:0.3s ease;

            position:relative;
          }

          .auth-card:hover{
            transform:translateY(-4px);

            box-shadow:
              0 22px 40px rgba(0,0,0,0.16);
          }

          .auth-title{
            font-size:38px;

            font-weight:800;

            text-align:center;

            margin-bottom:10px;

            background:
              linear-gradient(
                to right,
                #3b82f6,
                #8b5cf6
              );

            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
          }

          .auth-subtitle{
            text-align:center;

            color:#6b7280;

            font-size:15px;

            margin-bottom:32px;

            line-height:1.5;
          }

          .auth-form{
            display:flex;
            flex-direction:column;

            gap:18px;
          }

          .auth-input{
            width:100%;

            padding:15px 18px;

            border-radius:16px;

            border:1px solid #d1d5db;

            outline:none;

            font-size:15px;

            transition:0.25s ease;
          }

          .auth-input:focus{
            border-color:#3b82f6;

            transform:scale(1.01);

            box-shadow:
              0 0 0 4px rgba(59,130,246,0.18);
          }

          .auth-btn{
            width:100%;

            padding:15px;

            border:none;

            border-radius:16px;

            cursor:pointer;

            font-size:15px;
            font-weight:700;

            color:white;

            background:
              linear-gradient(
                to right,
                #3b82f6,
                #8b5cf6
              );

            transition:0.25s ease;

            box-shadow:
              0 10px 20px rgba(59,130,246,0.25);
          }

          .auth-btn:hover{
            transform:
              translateY(-2px)
              scale(1.02);

            box-shadow:
              0 18px 30px rgba(59,130,246,0.32);
          }

          .auth-footer{
            margin-top:24px;

            text-align:center;

            font-size:14px;

            color:#6b7280;
          }

          .auth-link{
            color:#3b82f6;

            font-weight:700;

            margin-left:6px;

            cursor:pointer;
          }

          .auth-link:hover{
            color:#8b5cf6;
          }

          /* ALERT */

          .auth-message{
            padding:14px 18px;

            border-radius:16px;

            text-align:center;

            font-size:14px;
            font-weight:700;

            animation:fadeAlert 0.35s ease;
          }

          .success-message{
            background:
              linear-gradient(
                to right,
                #22c55e,
                #16a34a
              );

            color:white;
          }

          .error-message{
            background:
              linear-gradient(
                to right,
                #ef4444,
                #dc2626
              );

            color:white;
          }

          @keyframes fadeAuth{

            from{
              opacity:0;
              transform:translateY(24px);
            }

            to{
              opacity:1;
              transform:translateY(0);
            }
          }

          @keyframes fadeAlert{

            from{
              opacity:0;
              transform:translateY(-10px);
            }

            to{
              opacity:1;
              transform:translateY(0);
            }
          }

        `}

      </style>



      <div className="auth-page">

        <div className="auth-card">

          <h1 className="auth-title">
            Welcome Back
          </h1>

          <p className="auth-subtitle">
            Login to continue managing your tasks beautifully.
          </p>



          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="auth-input"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="auth-input"
              onChange={handleChange}
            />



            {message && (

              <div
                className={
                  messageType === "success"
                    ? "auth-message success-message"
                    : "auth-message error-message"
                }
              >
                {message}
              </div>

            )}



            <button className="auth-btn">
              Login
            </button>

          </form>



          <p className="auth-footer">

            Don't have an account?

            <span
              className="auth-link"
              onClick={() =>
                navigate("/register")
              }
            >
              Register
            </span>

          </p>

        </div>

      </div>

    </>
  );
}

export default Login;