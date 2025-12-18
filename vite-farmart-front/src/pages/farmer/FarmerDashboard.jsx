import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/api";
import { Link } from "react-router-dom";

const FarmerDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalBudget: 0,
  });

  // Fetch farmer projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get(`/farmers/${user.id}/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data);
        calculateStats(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProjects();
  }, [user, token]);

  const calculateStats = (projects) => {
    const totalBudget = projects.reduce(
      (sum, project) => sum + Number(project.budget || 0),
      0
    );
    setStats({
      totalProjects: projects.length,
      totalBudget,
    });
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-green-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Projects</h2>
          <p className="text-2xl font-bold">{stats.totalProjects}</p>
        </div>
        <div className="p-6 bg-blue-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Budget</h2>
          <p className="text-2xl font-bold">${stats.totalBudget}</p>
        </div>
        <div className="p-6 bg-yellow-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
          <Link
            to="/farmer/add-project"
            className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add New Project
          </Link>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects yet. Start by adding one!</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Budget</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="border px-4 py-2">{project.title}</td>
                  <td className="border px-4 py-2">${project.budget}</td>
                  <td className="border px-4 py-2">{project.description}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <Link
                      to={`/farmer/edit-project/${project.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  async function handleDelete(projectId) {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.delete(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(projects.filter((p) => p.id !== projectId));
      calculateStats(projects.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project.");
    }
  }
};

export default FarmerDashboard;
