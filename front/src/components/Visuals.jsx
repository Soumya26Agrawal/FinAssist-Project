import BarMonth from "./BarMonth";
import BarYear from "./BarYear";
import LineChart from "./LineChart";
import PieChart from "./PieChart";

function Visuals() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 min-h-screen w-full text-center">
      <BarMonth />
      <BarYear />
      <LineChart />
      <PieChart />
    </div>
  );
}

export default Visuals;
