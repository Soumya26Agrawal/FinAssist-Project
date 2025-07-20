import { Router } from "express";
const router = Router();

import {
  post,
  getAll,
  deleteFinance,
  editFinance,
  BarYearlyData,
  BarMonthlyData,
  LineCurrMonthData,
  PieChartData,
} from "../controllers/finance.controller.js";

router.route("/post").post(post);
router.route("/get").get(getAll);
router.route("/delete/:id/:userid").delete(deleteFinance);
router.route("/edit/:id").patch(editFinance);
router.route("/graph1/:id").get(BarYearlyData);
router.route("/graph2/:id").get(BarMonthlyData);
router.route("/graph3/:id").get(LineCurrMonthData);
router.route("/graph4/:id").get(PieChartData);

export default router;
