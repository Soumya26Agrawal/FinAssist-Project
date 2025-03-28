import BarMonth from "./BarMonth";
import BarYear from "./BarYear";
import LineChart from "./LineChart";
import PieChart from "./PieChart";

function Visuals() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-10 min-h-screen w-full text-center">
      <div className="h-full w-[90%]">
        <PieChart />
      </div>
      <div className="h-full">
        <LineChart />
      </div>

      <div className="h-full">
        <BarMonth />
      </div>
      <div className="h-full">
        <BarYear />
      </div>
    </div>
  );
}

export default Visuals;
