import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function Leaderboard() {

  const { quizId } = useParams();
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res =
        await API.get(
          `/results/leaderboard/${quizId}`
        );

      setLeaders(res.data.leaderboard);

    } catch (error) {
      console.log(error);
    }
  };

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  };

  return (
    <div style={styles.container}>

      <h1>🏆 Leaderboard</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Student</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {leaders.map((user, index) => (
            <tr key={index}>
              <td>{getMedal(index)}</td>
              <td>{user.student.name}</td>
              <td>
                {user.score} /
                {user.totalQuestions}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    textAlign: "center"
  },

  table: {
    margin: "auto",
    borderCollapse: "collapse",
    width: "60%"
  }
};

export default Leaderboard;