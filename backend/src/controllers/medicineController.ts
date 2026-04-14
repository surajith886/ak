import { Request, Response } from 'express';
import Medicine from '../models/medicineModel';

// @desc    Fetch all medicines
// @route   GET /api/medicines
// @access  Public
export const getMedicines = async (req: Request, res: Response) => {
  const category = req.query.category as string;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword as string,
          $options: 'i',
        },
      }
    : {};

  const query = category && category !== 'All' ? { ...keyword, category } : { ...keyword };

  const medicines = await Medicine.find(query);
  res.json(medicines);
};

// @desc    Fetch single medicine
// @route   GET /api/medicines/:id
// @access  Public
export const getMedicineById = async (req: Request, res: Response) => {
  const medicine = await Medicine.findById(req.params.id);

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
  const medicine = new Medicine({
    ...req.body,
  });

  const createdMedicine = await medicine.save();
  res.status(201).json(createdMedicine);
};

// @desc    Update a medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin
export const updateMedicine = async (req: Request, res: Response) => {
  const medicine = await Medicine.findById(req.params.id);

  if (medicine) {
    Object.assign(medicine, req.body);
    const updatedMedicine = await medicine.save();
    res.json(updatedMedicine);
  } else {
    res.status(404).json({ message: 'Medicine not found' });
  }
};

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
export const deleteMedicine = async (req: Request, res: Response) => {
  const medicine = await Medicine.findById(req.params.id);

  if (medicine) {
    await Medicine.deleteOne({ _id: medicine._id });
    res.json({ message: 'Medicine removed' });
  } else {
    res.status(404).json({ message: 'Medicine not found' });
  }
};
