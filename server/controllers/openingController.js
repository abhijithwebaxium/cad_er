import Opening from "../models/opening.js";

export const createOpening = async (req, res, next) => {
  try {
    const {
      user: { userId, company },
    } = req;

    const opening = await Opening.create({
      ...req.body,
      tags: [req.body.tags],
      company,
      createdBy: userId,
    });
    res.status(201).json({ success: true, opening });
  } catch (err) {
    next(err);
  }
};

export const getAllOpenings = async (req, res, next) => {
  try {
    const openings = await Opening.find().populate("company");
    res.json({ success: true, openings });
  } catch (err) {
    next(err);
  }
};

export const getOpeningsByCompany = async (req, res, next) => {
  try {
    const openings = await Opening.find({
      company: req.params.companyId,
    }).populate("company");

    res.json({ success: true, openings });
  } catch (err) {
    next(err);
  }
};
