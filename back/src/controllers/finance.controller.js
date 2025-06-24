import Finance from "../models/finance.model.js";
import { client } from "../redis/client.js";
// import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import mongoose from "mongoose";

const post = async (req, res) => {
  try {
    const { title, amount, category, type, user } = req.body;

    if (
      [title, amount, type, category, user].some(
        (field) => field == null || field?.trim() === ""
      )
    ) {
      throw new ApiError("All fields are mandatory!", 400);
    }
    const newFinance = await Finance.create({
      title,
      amount,
      category,
      type,
      // owner: new mongoose.Types.ObjectId(user),
      owner: user,
    });
    if (!newFinance) {
      throw new ApiError("Internal Server Error", 500);
    }
    if (client.exists("finance")) {
      client.del("finance");
    }
    if (client.exists("groupedSums")) {
      client.del("groupedSums");
    }
    return res.status(200).json({ message: "Data saved successfully" });
  } catch (err) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.json({ message: err.message });
  }
};

// ------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

const getAll = async (req, res) => {
  try {
    const { user } = req.query;
    let userFinances;
    let groupedSums;

    const data = await client.get(`finance${user._id}`);
    if (data) userFinances = JSON.parse(data);
    else {
      userFinances = await Finance.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(user),
            // owner: user,
          },
        },
      ]);
      await client.set(`finance${user._id}`, JSON.stringify(userFinances));
      await client.expire(`finance${user._id}`, 30);
    }
    // console.log(userFinances);

    const redisData = await client.get(`groupedSums${user._id}`);
    if (redisData) groupedSums = JSON.parse(redisData);
    else {
      groupedSums = await Finance.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(user),
            // owner: user,
          },
        },
        // toInt and toDouble
        {
          $group: {
            _id: "$type",
            totalAmount: { $sum: "$amount" },
          },
        },
      ]);
      await client.set(`groupedSums${user._id}`, JSON.stringify(groupedSums));
      await client.expire(`groupedSums${user._id}`, 30);
    }
    const expenseData = groupedSums.find((item) => item._id === "expense") || {
      totalAmount: 0,
    };
    const incomeData = groupedSums.find((item) => item._id === "income") || {
      totalAmount: 0,
    };

    return res.status(200).json({
      message: "Data fetched successfully",
      finance: userFinances,
      expenseData,
      incomeData,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.log(err.message);
    return res.json({ message: err.message });
  }
};

const deleteFinance = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedFinance = await Finance.findByIdAndDelete(id);
    if (!deletedFinance) {
      throw new ApiError("Internal Server Error", 500);
    }

    if (client.exists("finance")) {
      client.del("finance");
    }
    if (client.exists("groupedSums")) {
      client.del("groupedSums");
    }
    return res
      .status(200)
      .json({ message: "Data deleted successfully", data: deletedFinance });
  } catch (err) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.json({ message: err.message });
  }
};
const editFinance = async (req, res) => {
  try {
    const id = req.params.id;
    const { amount } = req.body;
    const editedFinance = await Finance.findByIdAndUpdate(id, {
      $set: {
        amount,
      },
      new: true,
    });
    if (!editedFinance) {
      throw new ApiError("Internal Server Error", 500);
    }
    return res
      .status(200)
      .json({ message: "Amount updated successfully", data: editedFinance });
  } catch (err) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.json({ message: err.message });
  }
};

const BarYearlyData = async (req, res) => {
  try {
    const { id } = req.params;
    let data;

    const cache = await client.get("baryearly");
    if (cache) data = JSON.parse(cache);
    else {
      data = await Finance.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $addFields: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
        },
        {
          $group: {
            _id: {
              type: "$type",
              year: "$year",
            },

            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $sort: {
            "_id.year": -1,
          },
        },
        {
          $limit: 10,
        },
      ]);

      await client.set("baryearly", JSON.stringify(data));
      await client.expire("baryearly", 30);
    }

    let year = [];
    let expense = [];
    let income = [];
    const currYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      year.push(currYear - i);
    }
    // data.forEach((item) => {
    //   if (item._id.type === "expense")
    //     expense[item._id.year - currYear] = item.totalAmount;
    //   else income[item._id.year - currYear] = item.totalAmount;
    // });

    data.forEach((item) => {
      const index = year.indexOf(item._id.year);
      if (index !== -1) {
        if (item._id.type === "expense") expense[index] = item.totalAmount;
        else income[index] = item.totalAmount;
      }
    });

    // Assuming you want to send the response back
    res.json({ data: { year, expense, income } });
  } catch (err) {
    res.json({ message: err.message });
  }
};
const BarMonthlyData = async (req, res) => {
  try {
    const { id } = req.params;
    let data;
    const redisData = await client.get("barmonthly");
    if (redisData) data = JSON.parse(redisData);
    else {
      data = await Finance.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $addFields: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
        },
        {
          $match: {
            year: new Date().getFullYear,
          },
        },
        {
          $group: {
            _id: {
              type: "$type",

              month: "$month",
            },

            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $sort: {
            "_id.month": -1,
          },
        },
        {
          $limit: 10,
        },
      ]);
      await client.set("barmonthly", JSON.stringify(data));
      await client.expire("barmonthly", 30);
    }
    let month = [];

    const currMonth = new Date().getMonth() + 1;
    for (let i = 0; i < Math.min(5, currMonth); i++) {
      month.push(currMonth - i);
    }

    let expense = new Array(month.length).fill(0);
    let income = new Array(month.length).fill(0);
    data.forEach((item) => {
      const idx = month.indexOf(item._id.month);
      if (idx !== -1) {
        if (item._id.type === "expense") expense[idx] = item.totalAmount;
        else income[idx] = item.totalAmount;
      }
    });

    const newMonth = [];
    const monthAbbreviations = {
      1: "Jan",
      2: "Feb",
      3: "Mar",
      4: "Apr",
      5: "May",
      6: "Jun",
      7: "Jul",
      8: "Aug",
      9: "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec",
    };

    for (const mon of month) {
      newMonth.push(monthAbbreviations[mon]);
    }

    // Assuming you want to send the response back
    res.json({ data: { newMonth, expense, income } });
  } catch (err) {
    res.json({ message: err.message });
  }
};
const LineCurrMonthData = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    let data;
    const redisData = await client.get("linedaily");
    if (redisData) data = JSON.parse(redisData);
    else {
      data = await Finance.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $addFields: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
        },
        {
          $match: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
          },
        },
        {
          $group: {
            _id: {
              type: "$type",
              day: "$day",
            },

            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $sort: {
            "_id.day": 1,
          },
        },
        {
          $limit: 62,
        },
      ]);

      console.log(data);
      await client.set("linedaily", JSON.stringify(data));
      await client.expire("linedaily", 30);
    }

    let day = [];
    const date = new Date().getDate();
    for (let i = date-10; i <= date; i++) {
      day.push(i);
    }
    console.log(day);
    let expense = new Array(day.length).fill(0);
    let income = new Array(day.length).fill(0);
    data.forEach((item) => {
      const idx = day.indexOf(item._id.day);
      if (idx !== -1) {
        if (item._id.type === "expense") expense[idx] = item.totalAmount;
        else income[idx] = item.totalAmount;
      }
    });
    console.log(income, expense);
    // Assuming you want to send the response back
    res.json({ data: { day, expense, income } });
  } catch (err) {
    res.json({ message: err.message });
  }
};

const PieChartData = async (req, res) => {
  try {
    const { id } = req.params;
    let data;

    const cache = await client.get("pie");
    if (cache) data = JSON.parse(cache);
    else {
      data = await Finance.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(id),
            type: "expense",
          },
        },

        {
          $group: {
            _id: "$category",

            totalAmount: { $sum: "$amount" },
          },
        },
      ]);

      await client.set("pie", JSON.stringify(data));
      await client.expire("pie", 30);
    }

    const categories = [
      "Housing & Rent",
      "Groceries & Food",
      "Transportation",
      "Utilities (electricity, water, phone bills)",
      "Loans & Debt Payments",
      "Health & Medical",
      "Entertainment & Leisure",
      "Savings & Investments",
    ];
    let expense = new Array(categories.length).fill(0);

    // data.forEach((item) => {
    //   if (item._id.type === "expense")
    //     expense[item._id.year - currYear] = item.totalAmount;
    //   else income[item._id.year - currYear] = item.totalAmount;
    // });

    // let sum = 0;
    data.forEach((item) => {
      const index = categories.indexOf(item._id);
      if (index !== -1) {
        expense[index] = item.totalAmount;
        // sum += item.totalAmount;
      }
    });

    // Assuming you want to send the response back
    res.json({ data: { categories, expense } });
  } catch (err) {
    res.json({ message: err.message });
  }
};

export {
  post,
  getAll,
  deleteFinance,
  editFinance,
  BarYearlyData,
  BarMonthlyData,
  LineCurrMonthData,
  PieChartData,
};
