import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInternshipStore } from '@/store/internshipStore';
import { useAuthStore } from '@/store/authStore';
import { StudentProfile, Application } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatTime, calculateSkillMatch } from '@/lib/helpers';
import { toast } from 'sonner';
import { Clock, AlertTriangle } from 'lucide-react';

export default function ExamPage() {
  const { internshipId } = useParams<{ internshipId: string }>();
  const navigate = useNavigate();
  const { getInternship, applyToInternship } = useInternshipStore();
  const user = useAuthStore(s => s.user) as StudentProfile;
  const internship = getInternship(internshipId!);
  const exam = internship?.exam;

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState((exam?.duration ?? 15) * 60);
  const [submitted, setSubmitted] = useState(false);
  const startTime = useState(Date.now())[0];

  const submitExam = useCallback(async () => {
    if (submitted || !exam || !internship) return;
    setSubmitted(true);
    
    try {
      const { examService } = await import('@/services/api');
      const { data } = await examService.submitExam(internship.id, answers);
      
      // Update local store with the returned application
      applyToInternship(data);
      toast.success(`Exam submitted successfully!`);
      navigate('/student/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit exam');
      setSubmitted(false);
    }
  }, [submitted, exam, internship, answers, applyToInternship, navigate]);

  useEffect(() => {
    if (submitted || timeLeft <= 0) { if (timeLeft <= 0) submitExam(); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, submitExam]);

  if (!exam || !internship) return <div className="min-h-screen flex items-center justify-center"><p>Exam not found</p></div>;

  const question = exam.questions[currentQ];
  const isLowTime = timeLeft < 60;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{internship.title} — Exam</h1>
            <p className="text-sm text-muted-foreground">Question {currentQ + 1} of {exam.questions.length}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-lg font-bold ${
            isLowTime ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-primary/10 text-primary'
          }`}>
            {isLowTime && <AlertTriangle className="h-4 w-4" />}
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div className="gradient-primary h-2 rounded-full transition-all" style={{ width: `${((currentQ + 1) / exam.questions.length) * 100}%` }} />
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => setAnswers(prev => ({ ...prev, [question.id]: i }))}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[question.id] === i
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                {choice}
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentQ(c => c - 1)} disabled={currentQ === 0}>
            Previous
          </Button>
          {currentQ < exam.questions.length - 1 ? (
            <Button onClick={() => setCurrentQ(c => c + 1)} className="gradient-primary text-primary-foreground">
              Next
            </Button>
          ) : (
            <Button onClick={submitExam} className="gradient-primary text-primary-foreground">
              Submit Exam
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
