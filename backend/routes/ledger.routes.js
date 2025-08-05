const express = require("express");
const { getAllLedger } = require("../controllers/ledger.controller");
const router = express.Router();

router.get("/", getAllLedger);

module.exports = { router };
