import { useEffect, useState } from "react";
import API from "../api/axios";

function AdminDashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await API.get("/dashboard/admin");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const approveTeacher = async (userId) => {
    try {
      await API.put(`/auth/admin/approve/${userId}`);
      fetchAdminData();
    } catch (error) {
      console.log(error);
    }
  };

  if (!data) return <h2>Loading...</h2>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">👑 Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{data.totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Teachers</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{data.totalTeachers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Students</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{data.totalStudents}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Quizzes</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">{data.totalQuizzes}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Attempts</p>
          <p className="mt-2 text-3xl font-bold text-orange-600">{data.totalAttempts}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">Pending Teacher Approvals</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {data.pendingTeachers.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No pending teachers to approve.
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {data.pendingTeachers.map((teacher) => (
              <li key={teacher._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-lg font-medium text-slate-900">{teacher.name}</p>
                  <p className="text-sm text-slate-500">{teacher.email}</p>
                </div>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                  onClick={() => approveTeacher(teacher._id)}
                >
                  ✅ Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;