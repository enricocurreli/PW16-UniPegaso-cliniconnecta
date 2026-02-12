import { DoctorProfileForm } from "@/components/DoctorProfileForm";
import { PatientProfileForm } from "@/components/PatientProfileForm"
import { useAuth } from "@/context/AuthContext"

const CompleteProfile = () => {
  const {user, token} =useAuth()
  if (!user || !token) {
    
    return <div>Caricamento dati utente...</div>;
  }
  
  
  return (
    <div className="w-1/2 p-5">
      {
       user && user?.role ==='PAZIENTE' ? <PatientProfileForm/> : <DoctorProfileForm/>
      }
    </div>
  )
}

export default CompleteProfile