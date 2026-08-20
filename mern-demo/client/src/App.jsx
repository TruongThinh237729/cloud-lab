import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  const API_URL = 'http://localhost:5000/api/students';

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Thêm sinh viên mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ studentId: '', name: '', email: '' });
    fetchStudents();
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchStudents();
    }
  };

  // Sửa tên sinh viên
  const handleUpdate = async (id, oldName) => {
    const newName = prompt('Nhập tên mới:', oldName);
    if (newName && newName !== oldName) {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      fetchStudents();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2 style={{ color: '#2c3e50' }}>🎓 Quản lý Sinh viên (MERN Stack)</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
        <input name="studentId" placeholder="MSSV" value={formData.studentId} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <input name="name" placeholder="Họ tên" value={formData.name} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <button type="submit" style={{ padding: '6px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Thêm</button>
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#343a40', color: 'white' }}>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                <button onClick={() => handleUpdate(s._id, s.name)} style={{ marginRight: '10px', background: '#ffc107', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}>Sửa</button>
                <button onClick={() => handleDelete(s._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;