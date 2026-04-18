import { StudentProfile, CompanyProfile, AdminProfile, Internship, Application, ExamQuestion } from '@/types';

export const mockStudents: StudentProfile[] = [
  {
    id: 's1', email: 'ahmed@student.com', role: 'student', isVerified: true,
    username: 'Ahmed Hassan', gender: 'male', phone: '+201234567890',
    profileImage: '', cvUrl: '/sample-cv.pdf',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL'],
    extractedSkills: ['React', 'TypeScript', 'Node.js'],
  },
  {
    id: 's2', email: 'sara@student.com', role: 'student', isVerified: true,
    username: 'Sara Ali', gender: 'female', phone: '+201098765432',
    profileImage: '', cvUrl: '/sample-cv.pdf',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'TensorFlow'],
    extractedSkills: ['Python', 'Machine Learning', 'Data Analysis'],
  },
  {
    id: 's3', email: 'omar@student.com', role: 'student', isVerified: true,
    username: 'Omar Khaled', gender: 'male', phone: '+201112233445',
    profileImage: '', cvUrl: '',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
    extractedSkills: ['Java', 'Spring Boot'],
  },
];

export const mockCompanies: CompanyProfile[] = [
  {
    id: 'c1', email: 'hr@techcorp.com', role: 'company', isVerified: true,
    companyName: 'TechCorp', industry: 'Technology', phone: '+201000000001',
    taxRegister: 'TX-12345', description: 'Leading technology company specializing in web and mobile development.',
    logo: '', isApproved: true,
  },
  {
    id: 'c2', email: 'hr@dataflow.com', role: 'company', isVerified: true,
    companyName: 'DataFlow AI', industry: 'Artificial Intelligence', phone: '+201000000002',
    taxRegister: 'TX-67890', description: 'AI-powered data analytics and machine learning solutions.',
    logo: '', isApproved: true,
  },
  {
    id: 'c3', email: 'hr@greentech.com', role: 'company', isVerified: true,
    companyName: 'GreenTech Solutions', industry: 'Sustainability', phone: '+201000000003',
    taxRegister: 'TX-11111', description: 'Sustainable technology solutions for a greener future.',
    logo: '', isApproved: false,
  },
];

export const mockAdmin: AdminProfile = {
  id: 'a1', email: 'moustafamohamedshehata1@gmail.com', role: 'admin',
  isVerified: true, username: 'Admin',
};

const examQuestions1: ExamQuestion[] = [
  { id: 'q1', question: 'What is the virtual DOM in React?', choices: ['A real DOM copy', 'A lightweight JS representation of the DOM', 'A CSS framework', 'A database'], correctAnswer: 1, weight: 10 },
  { id: 'q2', question: 'Which hook is used for side effects in React?', choices: ['useState', 'useEffect', 'useContext', 'useRef'], correctAnswer: 1, weight: 10 },
  { id: 'q3', question: 'What does TypeScript add to JavaScript?', choices: ['Static typing', 'Dynamic typing', 'Memory management', 'Garbage collection'], correctAnswer: 0, weight: 10 },
  { id: 'q4', question: 'What is JSX?', choices: ['A database query language', 'JavaScript XML syntax extension', 'A CSS preprocessor', 'A testing framework'], correctAnswer: 1, weight: 10 },
  { id: 'q5', question: 'Which is NOT a React lifecycle method?', choices: ['componentDidMount', 'componentWillUpdate', 'componentDidRender', 'componentWillUnmount'], correctAnswer: 2, weight: 10 },
];

const examQuestions2: ExamQuestion[] = [
  { id: 'q6', question: 'What is a neural network?', choices: ['A computer network', 'A ML model inspired by the brain', 'A database system', 'An operating system'], correctAnswer: 1, weight: 10 },
  { id: 'q7', question: 'What does SQL stand for?', choices: ['Structured Query Language', 'Simple Query Logic', 'System Quality Level', 'Standard Query List'], correctAnswer: 0, weight: 10 },
  { id: 'q8', question: 'What is overfitting?', choices: ['Model is too simple', 'Model memorizes training data', 'Model is fast', 'Model uses less memory'], correctAnswer: 1, weight: 10 },
  { id: 'q9', question: 'Which is a Python ML library?', choices: ['React', 'TensorFlow', 'Angular', 'Laravel'], correctAnswer: 1, weight: 10 },
  { id: 'q10', question: 'What is a DataFrame in Pandas?', choices: ['A picture frame', 'A 2D labeled data structure', 'A function', 'A loop'], correctAnswer: 1, weight: 10 },
];

export const mockInternships: Internship[] = [
  {
    id: 'i1', companyId: 'c1', companyName: 'TechCorp', title: 'Frontend Developer Intern',
    description: 'Join our frontend team to build modern web applications using React, TypeScript, and Next.js. You will work on real projects with senior developers.',
    requiredSkills: ['React', 'TypeScript', 'CSS', 'Git'],
    duration: '3 months', isPaid: true, salaryMin: 300, salaryMax: 500,
    mode: 'hybrid', city: 'Cairo', seatsAvailable: 5,
    applicationDeadline: '2026-05-15', createdAt: '2026-03-01',
    exam: { id: 'e1', internshipId: 'i1', questions: examQuestions1, duration: 15 },
  },
  {
    id: 'i2', companyId: 'c2', companyName: 'DataFlow AI', title: 'Machine Learning Intern',
    description: 'Work on cutting-edge ML projects including NLP, computer vision, and recommendation systems.',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
    duration: '6 months', isPaid: true, salaryMin: 400, salaryMax: 700,
    mode: 'online', seatsAvailable: 3,
    applicationDeadline: '2026-06-01', createdAt: '2026-03-10',
    exam: { id: 'e2', internshipId: 'i2', questions: examQuestions2, duration: 20 },
  },
  {
    id: 'i3', companyId: 'c1', companyName: 'TechCorp', title: 'Backend Developer Intern',
    description: 'Build scalable APIs and microservices using Node.js and Express. Database design with PostgreSQL.',
    requiredSkills: ['Node.js', 'Express', 'PostgreSQL', 'REST API'],
    duration: '3 months', isPaid: true, salaryMin: 300, salaryMax: 500,
    mode: 'offline', city: 'Alexandria', seatsAvailable: 4,
    applicationDeadline: '2026-05-20', createdAt: '2026-03-05',
    exam: { id: 'e3', internshipId: 'i3', questions: examQuestions1, duration: 15 },
  },
  {
    id: 'i4', companyId: 'c2', companyName: 'DataFlow AI', title: 'Data Analyst Intern',
    description: 'Analyze large datasets and create insightful visualizations and reports for business stakeholders.',
    requiredSkills: ['Python', 'SQL', 'Data Analysis', 'Excel', 'Tableau'],
    duration: '4 months', isPaid: true, salaryMin: 200, salaryMax: 400,
    mode: 'hybrid', city: 'Cairo', seatsAvailable: 6,
    applicationDeadline: '2026-06-15', createdAt: '2026-03-15',
  },
  {
    id: 'i5', companyId: 'c1', companyName: 'TechCorp', title: 'UI/UX Design Intern',
    description: 'Design beautiful and intuitive user interfaces for web and mobile applications.',
    requiredSkills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    duration: '3 months', isPaid: false,
    mode: 'online', seatsAvailable: 2,
    applicationDeadline: '2026-05-30', createdAt: '2026-03-20',
  },
  {
    id: 'i6', companyId: 'c2', companyName: 'DataFlow AI', title: 'DevOps Intern',
    description: 'Learn and implement CI/CD pipelines, containerization with Docker, and cloud infrastructure.',
    requiredSkills: ['Docker', 'Linux', 'CI/CD', 'AWS', 'Git'],
    duration: '6 months', isPaid: true, salaryMin: 350, salaryMax: 600,
    mode: 'offline', city: 'Giza', seatsAvailable: 2,
    applicationDeadline: '2026-07-01', createdAt: '2026-03-25',
    exam: { id: 'e6', internshipId: 'i6', questions: examQuestions1, duration: 20 },
  },
  {
    id: 'i7', companyId: 'c1', companyName: 'TechCorp', title: 'Mobile App Developer Intern',
    description: 'Build cross-platform mobile applications using React Native and Flutter.',
    requiredSkills: ['React Native', 'JavaScript', 'Mobile Development', 'Git'],
    duration: '4 months', isPaid: true, salaryMin: 250, salaryMax: 450,
    mode: 'hybrid', city: 'Cairo', seatsAvailable: 3,
    applicationDeadline: '2026-06-10', createdAt: '2026-04-01',
  },
  {
    id: 'i8', companyId: 'c2', companyName: 'DataFlow AI', title: 'NLP Research Intern',
    description: 'Research and develop natural language processing models for text classification and sentiment analysis.',
    requiredSkills: ['Python', 'NLP', 'Deep Learning', 'PyTorch', 'Transformers'],
    duration: '6 months', isPaid: true, salaryMin: 500, salaryMax: 800,
    mode: 'online', seatsAvailable: 2,
    applicationDeadline: '2026-07-15', createdAt: '2026-04-05',
  },
  {
    id: 'i9', companyId: 'c1', companyName: 'TechCorp', title: 'QA Testing Intern',
    description: 'Write automated tests, perform manual testing, and ensure software quality.',
    requiredSkills: ['Testing', 'Selenium', 'JavaScript', 'Bug Tracking'],
    duration: '3 months', isPaid: false,
    mode: 'online', seatsAvailable: 4,
    applicationDeadline: '2026-06-20', createdAt: '2026-04-10',
  },
  {
    id: 'i10', companyId: 'c2', companyName: 'DataFlow AI', title: 'Cloud Engineering Intern',
    description: 'Design and manage cloud infrastructure on AWS and GCP for scalable applications.',
    requiredSkills: ['AWS', 'GCP', 'Terraform', 'Python', 'Networking'],
    duration: '5 months', isPaid: true, salaryMin: 400, salaryMax: 650,
    mode: 'hybrid', city: 'Cairo', seatsAvailable: 2,
    applicationDeadline: '2026-08-01', createdAt: '2026-04-12',
  },
];

export const mockApplications: Application[] = [
  {
    id: 'a1', internshipId: 'i1', internshipTitle: 'Frontend Developer Intern', companyName: 'TechCorp',
    studentId: 's1', studentName: 'Ahmed Hassan', studentEmail: 'ahmed@student.com',
    studentPhone: '+201234567890', studentGender: 'male', cvUrl: '/sample-cv.pdf',
    skills: ['React', 'TypeScript', 'Node.js'], examScore: 85, examTimeTaken: 480,
    status: 'pending', appliedAt: '2026-04-01', skillMatch: 75,
  },
  {
    id: 'a2', internshipId: 'i2', internshipTitle: 'Machine Learning Intern', companyName: 'DataFlow AI',
    studentId: 's2', studentName: 'Sara Ali', studentEmail: 'sara@student.com',
    studentPhone: '+201098765432', studentGender: 'female', cvUrl: '/sample-cv.pdf',
    skills: ['Python', 'Machine Learning', 'Data Analysis'], examScore: 92, examTimeTaken: 600,
    status: 'accepted', appliedAt: '2026-04-02', skillMatch: 90,
  },
  {
    id: 'a3', internshipId: 'i1', internshipTitle: 'Frontend Developer Intern', companyName: 'TechCorp',
    studentId: 's2', studentName: 'Sara Ali', studentEmail: 'sara@student.com',
    studentPhone: '+201098765432', studentGender: 'female', cvUrl: '/sample-cv.pdf',
    skills: ['Python', 'Machine Learning', 'Data Analysis'], examScore: 60, examTimeTaken: 720,
    status: 'rejected', appliedAt: '2026-04-03', skillMatch: 25,
  },
  {
    id: 'a4', internshipId: 'i3', internshipTitle: 'Backend Developer Intern', companyName: 'TechCorp',
    studentId: 's3', studentName: 'Omar Khaled', studentEmail: 'omar@student.com',
    studentPhone: '+201112233445', studentGender: 'male', cvUrl: '',
    skills: ['Java', 'Spring Boot', 'MySQL'], examScore: 70, examTimeTaken: 550,
    status: 'pending', appliedAt: '2026-04-05', skillMatch: 40,
  },
  {
    id: 'a5', internshipId: 'i2', internshipTitle: 'Machine Learning Intern', companyName: 'DataFlow AI',
    studentId: 's1', studentName: 'Ahmed Hassan', studentEmail: 'ahmed@student.com',
    studentPhone: '+201234567890', studentGender: 'male', cvUrl: '/sample-cv.pdf',
    skills: ['React', 'TypeScript', 'Node.js'], examScore: 45, examTimeTaken: 900,
    status: 'rejected', appliedAt: '2026-04-06', skillMatch: 20,
  },
];
