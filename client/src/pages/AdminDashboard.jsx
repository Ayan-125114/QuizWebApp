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
    <div style={{ padding: "30px" }}>

      <h1>👑 Admin Dashboard</h1>

      <h2>Platform Stats</h2>

      <p>Total Users: {data.totalUsers}</p>
      <p>Total Teachers: {data.totalTeachers}</p>
      <p>Total Students: {data.totalStudents}</p>
      <p>Total Quizzes: {data.totalQuizzes}</p>
      <p>Total Attempts: {data.totalAttempts}</p>

      <hr />

      <h2>Pending Teachers</h2>

      {data.pendingTeachers.length === 0 && (
        <p>No pending teachers</p>
      )}

      {data.pendingTeachers.map((teacher) => (
        <div key={teacher._id}
             style={{border:"1px solid gray",padding:"10px",margin:"10px"}}>

          <p>Name: {teacher.name}</p>
          <p>Email: {teacher.email}</p>

          <button
            onClick={() =>
              approveTeacher(teacher._id)
            }
          >
            ✅ Approve
          </button>

        </div>
      ))}

    </div>
  );
}

export default AdminDashboard;