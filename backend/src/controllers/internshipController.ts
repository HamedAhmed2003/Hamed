import { Response } from 'express';
import Internship, { IInternship } from '../models/Internship';
import { AuthRequest } from '../middlewares/auth';
import { sendSuccess, sendError } from '../utils/responseWrapper';
import User from '../models/User';

export const getInternships = async (req: AuthRequest, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.mode) filters.mode = req.query.mode;
    if (req.query.isPaid === 'true') filters.isPaid = true;

    const internships = await Internship.find(filters).sort({ createdAt: -1 });
    return sendSuccess(res, 200, internships, 'Internships fetched successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getInternshipById = async (req: AuthRequest, res: Response) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return sendError(res, 404, 'Internship not found');
    
    // Do not return exam correct answers
    if (internship.exam) {
      internship.exam.questions = internship.exam.questions.map(q => {
        const qObj = (q as any).toObject ? (q as any).toObject() : { ...q };
        delete qObj.correctAnswer;
        return qObj;
      }) as any;
    }

    return sendSuccess(res, 200, internship, 'Internship fetched successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const createInternship = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      title, description, requiredSkills, duration, isPaid, 
      salaryMin, salaryMax, mode, city, seatsAvailable, 
      applicationDeadline, exam 
    } = req.body;

    const internship = await Internship.create({
      companyId: req.user?._id,
      companyName: req.user?.companyName,
      title,
      description,
      requiredSkills,
      duration,
      isPaid,
      salaryMin,
      salaryMax,
      mode,
      city,
      seatsAvailable,
      applicationDeadline,
      exam
    });

    return sendSuccess(res, 201, internship, 'Internship created successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const updateInternship = async (req: AuthRequest, res: Response) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return sendError(res, 404, 'Internship not found');

    if (internship.companyId.toString() !== req.user?._id?.toString()) {
      return sendError(res, 403, 'Not authorized to update this internship');
    }

    const updated = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return sendSuccess(res, 200, updated, 'Internship updated successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const deleteInternship = async (req: AuthRequest, res: Response) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return sendError(res, 404, 'Internship not found');

    if (internship.companyId.toString() !== req.user?._id?.toString() && req.user?.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to delete this internship');
    }

    await internship.deleteOne();
    return sendSuccess(res, 200, null, 'Internship deleted successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getExam = async (req: AuthRequest, res: Response) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship || !internship.exam) return sendError(res, 404, 'Exam not found');

    const sanitizedQuestions = internship.exam.questions.map(q => {
      const { correctAnswer, ...rest } = (q as any).toObject ? (q as any).toObject() : { ...q };
      return rest;
    });

    return sendSuccess(res, 200, {
      duration: internship.exam.duration,
      questions: sanitizedQuestions
    }, 'Exam fetched successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};
