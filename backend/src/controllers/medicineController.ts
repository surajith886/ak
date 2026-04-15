import { Request, Response } from 'express';
import Medicine from '../models/medicineModel';
import { Op } from 'sequelize';

// @desc    Fetch all medicines
// @route   GET /api/medicines
// @access  Public
export const getMedicines = async (req: Request, res: Response) => {
  const category = req.query.category as string;
  const keyword = req.query.keyword as string;

  const where: any = {};
  
  if (keyword) {
    where.name = { [Op.like]: `%${keyword}%` };
  }
  
  if (category && category !== 'All') {
    where.category = category;
  }

  const medicines = await Medicine.findAll({ where });
  res.json(medicines);
};

// @desc    Fetch single medicine
// @route   GET /api/medicines/:id
// @access  Public
export const getMedicineById = async (req: Request, res: Response) => {
  const medicine = await Medicine.findByPk(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

  if (medicine) {
    res.json(medicine);
  } else {
    res.status(404).json({ message: 'Medicine not found' });
  }
};

// @desc    Create a medicine
// @route   POST /api/medicines
// @access  Private/Admin
export const createMedicine = async (req: Request, res: Response) => {
  const medicine = await Medicine.create(req.body);
  res.status(201).json(medicine);
};

// @desc    Update a medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin
export const updateMedicine = async (req: Request, res: Response) => {
  const medicine = await Medicine.findByPk(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

  if (medicine) {
    await medicine.update(req.body);
    res.json(medicine);
  } else {
    res.status(404).json({ message: 'Medicine not found' });
  }
};

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
export const deleteMedicine = async (req: Request, res: Response) => {
  const medicine = await Medicine.findByPk(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

  if (medicine) {
    await medicine.destroy();
    res.json({ message: 'Medicine removed' });
  } else {
    res.status(404).json({ message: 'Medicine not found' });
  }
};
