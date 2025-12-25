import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Quiz, QuizResult } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Trophy } from "lucide-react";

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (results: QuizResult[]) => void;
  onBack: () => void;
}

export function QuizPlayer({ quiz, onComplete, onBack }: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasSelectedAnswer = selectedAnswers[currentQuestion.id] !== undefined;

  const handleSelectAnswer = (answerId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answerId,
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const results: QuizResult[] = quiz.questions.map(q => {
        const selectedId = selectedAnswers[q.id];
        const correctAnswer = q.answers.find(a => a.isCorrect);
        return {
          questionId: q.id,
          selectedAnswerId: selectedId || null,
          isCorrect: selectedId === correctAnswer?.id,
        };
      });
      onComplete(results);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="p-8 rounded-2xl gradient-card border border-border/50 animate-scale-in" key={currentQuestion.id}>
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
          {currentQuestion.text}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.answers.map((answer, index) => (
            <Button
              key={answer.id}
              variant={selectedAnswers[currentQuestion.id] === answer.id ? "quizSelected" : "quiz"}
              className="h-auto p-5 justify-start text-left text-base whitespace-normal"
              onClick={() => handleSelectAnswer(answer.id)}
            >
              <span className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center font-medium text-sm shrink-0 mr-4 transition-all",
                selectedAnswers[currentQuestion.id] === answer.id 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{answer.text}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={currentQuestionIndex === 0 ? onBack : handlePrevious}
          className="flex-1"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          {currentQuestionIndex === 0 ? "Back to Menu" : "Previous"}
        </Button>
        <Button
          variant="hero"
          onClick={handleNext}
          disabled={!hasSelectedAnswer}
          className="flex-1"
        >
          {isLastQuestion ? (
            <>
              <Trophy className="h-5 w-5 mr-2" />
              Finish Quiz
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
