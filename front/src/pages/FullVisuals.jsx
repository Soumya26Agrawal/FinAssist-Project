import Navbar from "../components/Navbar"
import Visuals from "../components/Visuals"


function FullVisuals() {
  return (
    <div className="bg-[#0D1B2A]">
      <Navbar/>
      <hr className=" bg-white h-2"/>
      <Visuals/>
    </div>
  )
}

export default FullVisuals