import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Userslist() {
  const [users, setUsers] = useState([])
  const [editUser, setEditUser] = useState(null)
  const [userName, setName] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await axios.get('/api/userlist')
      setUsers(data)
    }
    fetchUsers()
  }, [])

  const handleEdit = (user) => {
    setEditUser(user)
    setName(user.userName)
    setRole(user.role)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/userlist?id=${id}`)
      setUsers(users.filter((user) => user._id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const { data } = await axios.put(`/api/userlist?id=${editUser._id}`, { userName, role })
      console.log(data)
      setUsers(users.map((user) => (user._id === editUser._id ? { ...user, userName, role } : user)))
      setEditUser(null)
      setName('')
      setRole('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
    <div className='w-screen h-screen bg-black'>
    <h1 className=' absolute font-bold text-xl  ml-[45%] text-red-800 '>USERS</h1>
      <table  className='absolute font-bold text-xl mt-[15%] w-[70%] leading-loose bg-black text-white ml-[15%]'>
      
      <thead>
          <tr>
            <th className='px-7'>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className='text-white'>
          {users.map((user) => (
            <tr className='text-white  ' key={user._id}>
              <td className='px-16'>{user.userName}</td>
              <td>{user.role}</td>
              <td className=''>
                <button className='px-5' onClick={() => handleEdit(user)}>Edit</button>
                <button className='' onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editUser && (
        <form className='bg-black h-[20%] w-full absolute text-white' onSubmit={handleSubmit}>
          <h2 className='font-bold mb-[5%]'>Edit User</h2>
          <label className='text-white'>
            Name:
            <input className='bg-white rounded-lg text-black' type="text" value={userName} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            Role:
            <input className='bg-white rounded-lg text-black' type="text" value={role} onChange={(event) => setRole(event.target.value)} />
          </label>
          <button className='bg-white w-[5%]  text-black rounded-lg absolute ml-[10%]' type="submit">Save</button>
          <button className='bg-white w-[5%] text-black rounded-lg absolute ml-[20%]' type="button" onClick={() => setEditUser(null)}>
            Cancel
          </button>
        </form>
      )}
      </div>
    </>
    
  )
}