import DoctorProfile from '@/components/DoctorProfile';
import PatientProfile from '@/components/PatientProfile';
import { useAuth } from '@/context/AuthContext';


const Profile = () => {
const {user, token} =useAuth()
  if (!user || !token) {
    
    return <div>Caricamento dati utente...</div>;
  }
  
  
  return (
    <div className="p-5 min-h-screen">
      {
       user && user?.role ==='PAZIENTE' ? <PatientProfile/> : <DoctorProfile/>
      }
    </div>
  )
}

export default Profile