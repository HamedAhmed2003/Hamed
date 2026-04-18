import { Response } from 'express';
import Application from '../models/Application';
import Internship from '../models/Internship';
import { AuthRequest } from '../middlewares/auth';
import { sendSuccess, sendError } from '../utils/responseWrapper';

export const submitExamAndApply = async (req: AuthRequest, res: Response) => {
  try {
    const { id: internshipId } = req.params;
    const { answers } = req.body; // Record<string, number> where key = questionId, value = choice index
    const user = req.user!;

    const internship = await Internship.findById(internshipId);
    if (!internship) return sendError(res, 404, 'Internship not found');

    const hasApplied = await Application.findOne({ studentId: user._id, internshipId });
    if (hasApplied) return sendError(res, 400, 'Already applied to this internship');

    let score = 0;
    let totalWeight = 0;
    let percentage = 0;

    if (internship.exam && internship.exam.questions.length > 0) {
      if (!answers) return sendError(res, 400, 'Answers are required for this internship');
      
      internship.exam.questions.forEach(q => {
        totalWeight += q.weight;
        // The id from frontend might be object id string, but actually in mongoose it's _id
        const qId = (q as any)._id?.toString() || (q as any).id;
        if (answers[qId] === q.correctAnswer) {
          score += q.weight;
        }
      });
      percentage = totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
    }

    // Calculate basic skill match
    let matchCount = 0;
    const reqSkills = internship.requiredSkills || [];
    const userSkills = user.skills || [];
    if (reqSkills.length > 0) {
      reqSkills.forEach(sk => {
        if (userSkills.some(us => us.toLowerCase() === sk.toLowerCase())) {
          matchCount++;
        }
      });
    }
    const skillMatch = reqSkills.length > 0 ? Math.round((matchCount / reqSkills.length) * 100) : 0;

    const application = await Application.create({
      internshipId: internshipId as string,
      internshipTitle: internship.title,
      companyName: internship.companyName,
      studentId: user._id,
      studentName: user.username,
      studentEmail: user.email,
      studentPhone: user.phone,
      studentGender: user.gender,
      cvUrl: user.cvUrl,
      skills: user.skills,
      examScore: percentage,
      status: 'pending',
      skillMatch
    });

    return sendSuccess(res, 201, application, 'Application submitted successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const applyWithoutExam = async (req: AuthRequest, res: Response) => {
  try {
    const { id: internshipId } = req.params;
    const user = req.user!;

    const internship = await Internship.findById(internshipId);
    if (!internship) return sendError(res, 404, 'Internship not found');
    if (internship.exam && internship.exam.questions.length > 0) {
      return sendError(res, 400, 'This internship requires an exam submission');
    }

    const hasApplied = await Application.findOne({ studentId: user._id, internshipId });
    if (hasApplied) return sendError(res, 400, 'Already applied to this internship');

    let matchCount = 0;
    const reqSkills = internship.requiredSkills || [];
    const userSkills = user.skills || [];
    if (reqSkills.length > 0) {
      reqSkills.forEach(sk => {
        if (userSkills.some(us => us.toLowerCase() === sk.toLowerCase())) {
          matchCount++;
        }
      });
    }
    const skillMatch = reqSkills.length > 0 ? Math.round((matchCount / reqSkills.length) * 100) : 0;

    const application = await Application.create({
      internshipId: internshipId as string,
      internshipTitle: internship.title,
      companyName: internship.companyName,
      studentId: user._id,
      studentName: user.username,
      studentEmail: user.email,
      studentPhone: user.phone,
      studentGender: user.gender,
      cvUrl: user.cvUrl,
      skills: user.skills,
      status: 'pending',
      skillMatch
    });

    return sendSuccess(res, 201, application, 'Applied successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const apps = await Application.find({ studentId: req.user?._id }).sort({ appliedAt: -1 });
    return sendSuccess(res, 200, apps, 'Applications fetched');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getCompanyApplications = async (req: AuthRequest, res: Response) => {
  try {
    // Find all internships for the logged in company
    const internships = await Internship.find({ companyId: req.user?._id });
    const internshipIds = internships.map(i => i._id);

    // Find all applications where internshipId is in the above list
    const apps = await Application.find({ internshipId: { $in: internshipIds } }).sort({ appliedAt: -1 });
    return sendSuccess(res, 200, apps, 'Company applications fetched');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getInternshipApplications = async (req: AuthRequest, res: Response) => {
  try {
    const apps = await Application.find({ internshipId: req.params.internshipId }).sort({ appliedAt: -1 });
    return sendSuccess(res, 200, apps, 'Applications fetched');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return sendError(res, 404, 'Application not found');

    const internship = await Internship.findById(application.internshipId);
    if (!internship) return sendError(res, 404, 'Internship not found');

    if (internship.companyId.toString() !== req.user?._id?.toString()) {
      return sendError(res, 403, 'Not authorized');
    }

    application.status = status;
    await application.save();

    return sendSuccess(res, 200, application, 'Status updated');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};
