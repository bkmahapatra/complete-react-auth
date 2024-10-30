import { useEffect } from "react"
import api from "../api/api"

const Profile = () => {
  const fetchData = async () => {
    const res = await api.get('/user/profile');
    const data = await res.data
    console.log({ data })
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <div>Profile</div>
  )
}

export default Profile