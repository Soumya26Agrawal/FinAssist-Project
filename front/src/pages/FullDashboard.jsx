import Dashboard from "../components/Dashboard"
import Navbar from "../components/Navbar"


function FullDashboard() {
  return (
    <div className="bg-[#0D1B2A] flex flex-col ">
      <Navbar/>
      <hr className=" bg-white h-2"/>
      <Dashboard/>

    </div>
  )
}

export default FullDashboard