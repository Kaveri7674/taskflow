import { useEffect, useState } from "react";
import axios from "axios";

import {
  Search,
  X,
  Moon,
  Sun,
  LogOut,
  Pencil,
  Trash2,
  CheckCircle,
  Clock3,
  Flag,
  CalendarDays
} from "lucide-react";

import "../styles/dashboard.css";

function Dashboard() {

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filter, setFilter] = useState("All");

  const [darkMode, setDarkMode] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const tasksPerPage = 5;

  const [showEditModal, setShowEditModal] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editDueDate, setEditDueDate] = useState("");

  const token = localStorage.getItem("token");

  // ALERTS

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] =
    useState("");

  // USER NAME

  const [userName, setUserName] =
    useState(
      localStorage.getItem("userName") ||
      "User"
    );


  // FETCH TASKS

  const fetchTasks = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.log(error);

      setTasks([]);

    }
  };


  useEffect(() => {

    fetchTasks();

  }, []);


  // ADD TASK

  const addTask = async () => {

    if (!title.trim()) return;

    try {

      await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title,
          priority,
          deadline,
        },
        {
           headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setPriority("Medium");
      setDeadline("");

      fetchTasks();

      setMessage(
        "Task Added Successfully"
      );

      setMessageType("success");

      setTimeout(() => {
        setMessage("");
      }, 2000);

    } catch (error) {

      console.log(error);

      setMessage("Failed To Add Task");

      setMessageType("error");

    }
  };


  // COMPLETE TASK

  const toggleTask = async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {},
        {
           headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();

      setMessage("Task Updated");

      setMessageType("success");

      setTimeout(() => {
        setMessage("");
      }, 2000);

    } catch (error) {

      console.log(error);

    }
  };


  // DELETE TASK

  const deleteTask = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/tasks/${id}`,
        {
           headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();

      setMessage("Task Deleted");

      setMessageType("success");

      setTimeout(() => {
        setMessage("");
      }, 2000);

    } catch (error) {

      console.log(error);

    }
  };


  // OPEN EDIT MODAL

  const openEditModal = (task) => {

    setEditingTask(task);

    setEditTitle(task.title);

    setEditPriority(task.priority);

    setEditDueDate(task.deadline || "");

    setShowEditModal(true);
  };


  // SAVE EDIT

  const saveEditTask = async () => {

    try {

      await axios.patch(
        `http://localhost:5000/api/tasks/${editingTask._id}`,
        {
          title: editTitle,
          priority: editPriority,
          deadline: editDueDate,
        },
        {
           headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowEditModal(false);

      fetchTasks();

      setMessage(
        "Task Edited Successfully"
      );

      setMessageType("success");

      setTimeout(() => {
        setMessage("");
      }, 2000);

    } catch (error) {

      console.log(error);

    }
  };


  // SEARCH + FILTER

  const filteredTasks = tasks.filter((task) => {

    const matchesSearch = task.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "Completed") {
      return matchesSearch && task.completed;
    }

    if (filter === "Pending") {
      return matchesSearch && !task.completed;
    }

    if (
      ["High", "Medium", "Low"].includes(filter)
    ) {
      return (
        matchesSearch &&
        task.priority === filter
      );
    }

    return matchesSearch;
  });


  // PAGINATION

  const indexOfLastTask =
    currentPage * tasksPerPage;

  const indexOfFirstTask =
    indexOfLastTask - tasksPerPage;

  const currentTasks =
    tasks.slice(
      indexOfFirstTask,
      indexOfLastTask
    );

  const totalPages =
    Math.ceil(tasks.length / tasksPerPage);


  return (

    <div
      className={
        darkMode
          ? "dashboard-dark"
          : "dashboard-light"
      }
    >

      {/* ALERT */}

      {message && (

  <div
    className={
      messageType === "success"
        ? "dashboard-alert success-alert"
        : "dashboard-alert error-alert"
    }
  >

    <div className="dashboard-alert-content">

      <div className="dashboard-alert-icon">
        {messageType === "success"
          ? "✓"
          : "!"}
      </div>

          <div className="dashboard-alert-text">
      <p>{message}</p>
    </div>

    </div>

    <div
      className="dashboard-alert-close"
      onClick={() => setMessage("")}
    >
      ×
    </div>

  </div>

)}

      {/* HEADER */}

      <div
        className={`dashboard-header ${
          darkMode
            ? "header-dark"
            : "header-light"
        }`}
      >

        <div>

          <h1 className="dashboard-title">
            TaskFlow
          </h1>

          <p className="dashboard-subtitle">
            Welcome, {userName}
          </p>

        </div>


        <div className="top-buttons">

          {/* SEARCH */}

          <div className="tooltip-wrapper">

            <button
              className="icon-btn"
              onClick={() => {
                setShowSearch(!showSearch);
                setSearch("");
                setFilter("All");
              }}
            >
              {showSearch
                ? <X size={22} />
                : <Search size={22} />}
            </button>

            <span className="tooltip">
              {showSearch
                ? "Close Search"
                : "Search Tasks"}
            </span>

          </div>


          {/* DARK MODE */}

          <div className="tooltip-wrapper">

            <button
              className="icon-btn"
              onClick={() =>
                setDarkMode(!darkMode)
              }
            >
              {darkMode
                ? <Sun size={22} />
                : <Moon size={22} />}
            </button>

            <span className="tooltip">
              {darkMode
                ? "Light Mode"
                : "Dark Mode"}
            </span>

          </div>


          {/* LOGOUT */}

          <div className="tooltip-wrapper">

            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userName");
                window.location.href = "/";
              }}
              className="delete-btn"
            >
              <LogOut size={20} />
            </button>

            <span className="tooltip">
              Logout
            </span>

          </div>

        </div>

      </div>


      {/* SEARCH MODE */}

      {showSearch ? (

        <div
          className={`search-panel ${
            darkMode
              ? "card-dark"
              : "card-light"
          }`}
        >

          <div className="form-row">

            <input
              type="text"
              placeholder="Search tasks..."
              className="input-field"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />


            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="input-field"
            >
              <option>All</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

          </div>


          {search.trim() !== "" && (

            <div className="tasks-container">

              {filteredTasks.length === 0 ? (

                <div className="not-found">
                  Task Not Found
                </div>

              ) : (

                filteredTasks.map((task) => (

                  <div
                    key={task._id}
                    className={`task-card ${
                      darkMode
                        ? "card-dark"
                        : "card-light"
                    }`}
                  >

                    <div className="task-info">

                      <h2>
                        {task.title}
                      </h2>

                      <div className="task-badges">

                        <p className="badge">
                          {task.completed ? (
                            <>
                              <CheckCircle size={16} />
                              Completed
                            </>
                          ) : (
                            <>
                              <Clock3 size={16} />
                              Pending
                            </>
                          )}
                        </p>

                        <p className="badge">
                          <Flag size={16} />
                          {task.priority}
                        </p>

                        <p className="badge">
                          <CalendarDays size={16} />
                          {task.deadline || "No Date"}
                        </p>

                      </div>

                    </div>

                  </div>

                ))
              )}

            </div>
          )}

        </div>

      ) : (

        <>

          {/* STATS */}

          <div className="stats-grid">

            <div
              className={`stat-card ${
                darkMode
                  ? "card-dark"
                  : "card-light"
              }`}
            >
              <h2>Total Tasks</h2>

              <p className="stat-number">
                {tasks.length}
              </p>
            </div>


            <div
              className={`stat-card ${
                darkMode
                  ? "card-dark"
                  : "card-light"
              }`}
            >
              <h2>Completed</h2>

              <p className="stat-number">
                {
                  tasks.filter(
                    (task) => task.completed
                  ).length
                }
              </p>
            </div>


            <div
              className={`stat-card ${
                darkMode
                  ? "card-dark"
                  : "card-light"
              }`}
            >
              <h2>Pending</h2>

              <p className="stat-number">
                {
                  tasks.filter(
                    (task) => !task.completed
                  ).length
                }
              </p>
            </div>

          </div>


          {/* ADD TASK */}

          <div
            className={`task-form ${
              darkMode
                ? "card-dark"
                : "card-light"
            }`}
          >

            <div className="form-group">

              <input
                type="text"
                placeholder="Enter task..."
                className="input-field"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />


              <div className="form-row">

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                  className="input-field"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>


                <input
                  type="date"
                  value={deadline}
                   onChange={(e) =>
                       setDeadline(e.target.value)
                   }
                  className="input-field"
                />


                <button
                  onClick={addTask}
                  className="primary-btn"
                >
                  Add Task
                </button>

              </div>

            </div>

          </div>


          {/* TASKS */}

          <div className="tasks-container">

            {currentTasks.length > 0 ? (

              currentTasks.map((task) => (

                <div
                  key={task._id}
                  className={`task-card ${
                    darkMode
                      ? "card-dark"
                      : "card-light"
                  }`}
                >

                  <div className="task-info">

                    <h2
                      className={
                        task.completed
                          ? "completed-task"
                          : ""
                      }
                    >
                      {task.title}
                    </h2>


                    <div className="task-badges">

                      <p className="badge">

                        {task.completed ? (
                          <>
                            <CheckCircle size={16} />
                            Completed
                          </>
                        ) : (
                          <>
                            <Clock3 size={16} />
                            Pending
                          </>
                        )}

                      </p>


                      <p className="badge">
                        <Flag size={16} />
                        {task.priority}
                      </p>


                      <p className="badge">
                        <CalendarDays size={16} />
                        {task.deadline || "No Date"}
                      </p>

                    </div>

                  </div>


                  <div className="task-actions">

                    <div className="tooltip-wrapper">

                      <button
                        onClick={() =>
                          toggleTask(task._id)
                        }
                        className="complete-btn"
                      >
                        <CheckCircle size={18} />
                      </button>

                      <span className="tooltip">
                        Mark As Completed
                      </span>

                    </div>


                    {!task.completed && (

                      <div className="tooltip-wrapper">

                        <button
                          onClick={() =>
                            openEditModal(task)
                          }
                          className="edit-btn"
                        >
                          <Pencil size={18} />
                        </button>

                        <span className="tooltip">
                          Edit Task
                        </span>

                      </div>

                    )}


                    <div className="tooltip-wrapper">

                  <button
                    onClick={() =>
                      deleteTask(task._id)
                    }
                    className="delete-btn"
                  >
                    <Trash2 size={18} />
                  </button>

                  <span className="tooltip">
                    Delete Task
                  </span>

                </div>

                  </div>

                </div>

              ))

            ) : (

              <div className="not-found">
                No Tasks Added Yet
              </div>

            )}

          </div>


          {/* PAGINATION */}

          {tasks.length > tasksPerPage && (

            <div className="pagination">

              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(currentPage - 1)
                }
              >
                Prev
              </button>


              {[...Array(totalPages)].map(
                (_, index) => (

                  <button
                    key={index}
                    className={
                      currentPage === index + 1
                        ? "page-btn active-page"
                        : "page-btn"
                    }
                    onClick={() =>
                      setCurrentPage(index + 1)
                    }
                  >
                    {index + 1}
                  </button>

                )
              )}


              <button
                className="page-btn"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(currentPage + 1)
                }
              >
                Next
              </button>

            </div>
          )}

        </>
      )}


      {/* EDIT MODAL */}

      {showEditModal && (

        <div className="modal-overlay">

          <div
            className={`modal-box ${
              darkMode
                ? "card-dark"
                : "card-light"
            }`}
          >

            <button
                className="modal-close-btn"
                    onClick={() =>
                      setShowEditModal(false)
                    }
                  >
                    ×
                  </button>

            <h2>Edit Task</h2>

            <div className="form-group">

              <input
                type="text"
                value={editTitle}
                onChange={(e) =>
                  setEditTitle(e.target.value)
                }
                className="input-field"
              />


              <select
                value={editPriority}
                onChange={(e) =>
                  setEditPriority(e.target.value)
                }
                className="input-field"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>


              <input
                type="date"
                value={editDueDate}
                onChange={(e) =>
                  setEditDueDate(e.target.value)
                }
                className="input-field"
              />


              <div className="modal-actions">

                <button
                  onClick={saveEditTask}
                  className="primary-btn"
                >
                  Save Changes
                </button>


              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;