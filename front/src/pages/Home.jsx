

// function Home() {
//   return (
//     <div className="bg-[#0D1B2A] text-[#E0E1DD] flex flex-col items-center justify-center min-h-screen gap-6" >
//         <h1 className="text-5xl">Welcome to world of FinAssist</h1>
//         <div className="flex flex-row gap-10 text-xl">
//         <button className=" bg-[#C9A227] rounded-full px-4 py-2 text-black hover:bg-[#0D1B2A] hover:text-white hover:border hover:border-amber-200">Signup</button>
//         <button className=" bg-[#C9A227] rounded-full px-4 py-2 text-black hover:bg-[#0D1B2A] hover:text-white hover:border hover:border-amber-200">Login</button>
//         </div>
//     </div>
//   )
// }

import { Link } from "react-router-dom";

// export default Home

// 🔹 BG: #0D1B2A (Deep Navy Blue)
// 🔹 Text: #E0E1DD (Soft Off-White)
// 🔹 Accent: #FFB400 (Gold) for highlights like buttons and charts
//              #FFB400: Deep golden



function Home() {
  return (
    <div className="bg-[#0D1B2A] text-[#E0E1DD] flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-5xl font-bold mb-4 text-center tracking-wide">
        Welcome to the World of <span className="text-[#FFB400]">FinAssist</span>
      </h1>
      <p className="text-lg text-gray-300 max-w-xl text-center mb-6">
        Empowering your financial journey with seamless assistance and smart insights.
      </p>
      <div className="flex flex-row gap-6">
        <Link to="/signup" className="bg-[#FFB400] text-black font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300 hover:bg-[#0D1B2A] hover:text-white hover:border hover:border-amber-300">
          Signup
        </Link>
        <Link to="/login" className="bg-[#FFB400] text-black font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300 hover:bg-[#0D1B2A] hover:text-white hover:border hover:border-amber-300">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;
