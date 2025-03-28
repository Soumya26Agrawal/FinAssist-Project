import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { income, expense } from "../config/categories";
import { axiosIns2 } from "../config/axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
function Dashboard() {
  const amount = useRef(null);
  const user = useSelector((state) => state.user.user);
  const [finances, setFinances] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [category, setCategory] = useState(expense);
  // const [editAmountBool, setEditAmountBool] = useState(true);
  const [newAmount, setNewAmount] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  // const handleShow = (id) => {
  //   setShow(true);
  //   amount.current = id;
  // };
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      data.user = user._id;
      const res = await axiosIns2.post("/post", data);
      reset();
      toast.success(res.data.message);
      await fetchFinances();
    } catch (err) {
      toast.error(err.response.data.message);
    }

    console.log(data);
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    if (type === "expense") setCategory(expense);
    else setCategory(income);
  };

  async function handleDelTransaction(id) {
    try {
      const res = await axiosIns2.delete(`/delete/${id}`);
      toast.success(res.data.message);
      await fetchFinances();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }
  const handleAmountEdit = async () => {
    try {
      // if (!(e.key === "Enter")) return;
      const res = await axiosIns2.patch(`/edit/${amount.current}`, {
        amount: newAmount,
      });
      setShow(false);
      toast.success(res.data.message);
      await fetchFinances();
      // setEditAmountBool(true);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const fetchFinances = async function () {
    const res = await axiosIns2.get("/get", {
      params: {
        user: user._id,
      },
    });
    console.log(res?.data?.finance);
    setFinances(res?.data?.finance);
    console.log(Number(res?.data?.expenseData?.totalAmount)); //Reduce function can be used to extract income and expense
    setTotalExpense(Number(res?.data?.expenseData?.totalAmount)); //Reduce function can be used to extract income and expense
    setTotalIncome(Number(res?.data?.incomeData?.totalAmount));
  };

  useEffect(() => {
    fetchFinances();
  }, []);
  return (
    <div className="flex-1">
      <div className="grid grid-cols-3 text-white text-center gap-2 mt-4">
        <div>
          <h2 className="text-xl mb-2">Earnings</h2>
          <p className="text-[#FFB400]">{totalIncome}</p>
        </div>

        <div>
          <h2 className="text-xl mb-2">Balance</h2>
          <p className="text-[#FFB400]">{-totalExpense + totalIncome}</p>
        </div>

        <div>
          <h2 className="text-xl mb-2">Spendings</h2>
          <p className="text-[#FFB400]">{totalExpense}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center h-[80vh] gap-9 bg-[#0D1B2A] text-[#E0E1DD]  ">
        <h1 className="text-4xl">Add Transaction</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" rounded-2xl flex flex-col  items-center gap-2 h-[65%] w-[40vw] border border-gray-1000 pt-5 "
        >
          <input
            placeholder="enter your title"
            type="text"
            {...register("title", { required: true })}
            className="w-[100%] focus:outline-none focus:bg-[#0D1B2A] p-4"
          />
          <input
            placeholder="enter your amount"
            type="number"
            {...register("amount", { required: true })}
            className="w-[100%] focus:outline-none focus:bg-[#0D1B2A]  p-4"
          />
          <select
            {...register("type", { required: true })}
            onChange={handleTypeChange}
            className="w-[100%] focus:outline-none focus:bg-[#0D1B2A]  p-4"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select
            {...register("category", { required: true })}
            className="w-[100%] focus:outline-none focus:bg-[#0D1B2A]  p-4"
          >
            {category.map((c, idx) => (
              <option key={idx} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            disabled={isSubmitting}
            type="submit"
            className="w-[60%] bg-[#FFB400] rounded-full text-black py-1 px-3 mt-4 transition-all duration-300 hover:bg-[#0D1B2A] hover:text-white hover:border hover:border-amber-300 cursor-pointer"
          />
        </form>
      </div>

      <div className="w-full max-h-[400px] overflow-auto border border-gray-100 rounded-lg shadow-lg p-2">
        <table className="w-full min-w-[600px] border-collapse bg-white">
          {/* Table Head */}
          <thead className="bg-gradient-to-r bg-[#0D1B2A] text-white sticky top-0">
            <tr>
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Reason</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}

          {/* finances.length>0 */}
          <tbody>
            {finances.map((f, index) => (
              // setNewAmount(f.amount)
              <tr
                key={f._id}
                className={`${
                  index % 2 === 0 ? "bg-[#1B263B]" : "bg-[#0D1B2A]"
                } hover:bg-gray-600 transition text-white`}
              >
                <td className="py-3 px-6 border-b">{index + 1}</td>
                <td className="py-3 px-6 border-b">{f.title}</td>
                <td className="py-3 px-6 border-b">
                  {" "}
                  {/* <input
                    type="number"
                    defaultValue={f.amount}
                    disabled={editAmountBool}
                    value={newAmount || f.amount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    onKeyDown={(e) => handleAmountEdit(f._id, e)}
                    className="bg-white text-black"
                    ref={amount}
                  /> */}
                  {f.amount}{" "}
                </td>
                <td className="py-3 px-6 border-b">{f.category}</td>
                <td
                  className={`py-3 px-6  border-b border-white font-semibold ${
                    f.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {f.type}
                </td>
                <td className="py-3 px-6 border-b">
                  {/* <button
                    onClick={() => {
                      alert("Click on amount value to edit");
                      setEditAmountBool(false);
                      amount.current.focus();
                    }}
                    onClick={() => handleShow(f._id)}
                    className="bg-[#0D1B2A]  px-3 py-1 rounded hover:bg-white hover:text-black "
                  >
                    Edit
                  </button> */}
                  <button
                    onClick={() => handleDelTransaction(f._id)}
                    className="bg-[#0D1B2A]  px-3 py-1 rounded hover:bg-white hover:text-black "
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="Number"
            value={newAmount}
            placeholder="Enter new amount"
            onChange={(e) => setNewAmount(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAmountEdit}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Dashboard;
