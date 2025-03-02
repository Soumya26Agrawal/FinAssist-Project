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

    const data = await client.get("finance");
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
      await client.set("finance", JSON.stringify(userFinances));
      await client.expire("finance", 30);
    }
    // console.log(userFinances);

    const redisData = await client.get("groupedSums");
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
      await client.set("groupedSums", JSON.stringify(groupedSums));
      await client.expire("groupedSums", 30);
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
    data.forEach((item) => {
      if (!year.includes(item._id.year)) year.push(item._id.year);
      if (item._id.type === "expense") expense.push(item.totalAmount);
      else income.push(item.totalAmount);
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
    let expense = [];
    let income = [];
    data.forEach((item) => {
      if (!month.includes(item._id.month)) month.push(item._id.month);
      if (item._id.type === "expense") expense.push(item.totalAmount);
      else income.push(item.totalAmount);
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
            year: new Date().getFullYear,
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
      await client.set("linedaily", JSON.stringify(data));
      await client.expire("linedaily", 30);
    }
    let day = [];
    let expense = [];
    let income = [];
    data.forEach((item) => {
      if (!day.includes(item._id.day)) day.push(item._id.day);
      if (item._id.type === "expense") expense.push(item.totalAmount);
      else income.push(item.totalAmount);
    });

    // Assuming you want to send the response back
    res.json({ data: { day, expense, income } });
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
};
