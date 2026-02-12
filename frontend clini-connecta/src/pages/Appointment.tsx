import DoctorAgenda from "@/components/DoctorAgenda";
import PatientAgenda from "@/components/PatientAgenda";
import { useAuth } from "@/context/AuthContext"

const Appointment = () => {
  const {user, token} =useAuth()
  if (!user || !token) {
    
    return <div>Caricamento dati utente...</div>;
  }
  
  
  return (
    <div className="p-5">
      {
       user && user?.role ==='PAZIENTE' ? <PatientAgenda/> : <DoctorAgenda/>
      }
    </div>
  )
}

export default Appointment