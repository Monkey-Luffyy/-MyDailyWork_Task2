import { Button } from "@/components/ui/button";
import { Quiz, QuizResult } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { Check, X, RotateCcw, Plus, Trophy, Target } from "lucide-react";

interface QuizResultsProps {
  quiz: Quiz;
  results: QuizResult[];
  onRetry: () => void;
  onNewQuiz: () => void;
}

export function QuizResults({ quiz, results, onRetry, onNewQuiz }: QuizResultsProps) {
  const correctCount = results.filter(r => r.isCorrect).length;
  const totalQuestions = quiz.questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const getScoreMessage = () => {
    if (percentage === 100) return "Perfect Score! 🎉";
    if (percentage >= 80) return "Excellent Work! 🌟";
    if (percentage >= 60) return "Good Job! 👍";
    if (percentage >= 40) return "Keep Practicing! 💪";
    return "Don't Give Up! 📚";
  };

  const getScoreColor = () => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-primary";
    if (percentage >= 40) return "text-accent";
    return "text-destructive";
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Score Card */}
      <div className="text-center p-8 rounded-2xl gradient-card border border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-primary animate-float" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
            {getScoreMessage()}
          </h2>
          <p className="text-muted-foreground mb-6">{quiz.title}</p>
          
          <div className={cn("text-6xl md:text-7xl font-display font-bold mb-2", getScoreColor())}>
            {percentage}%
          </div>
          <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
            <Target className="h-5 w-5" />
            <span>{correctCount} of {totalQuestions} correct</span>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h3 className="text-xl font-display font-semibold">Review Your Answers</h3>
        
        {quiz.questions.map((question, qIndex) => {
          const result = results.find(r => r.questionId === question.id);
          const selectedAnswer = question.answers.find(a => a.id === result?.selectedAnswerId);
          const correctAnswer = question.answers.find(a => a.isCorrect);

          return (
            <div 
              key={question.id}
              className={cn(
                "p-5 rounded-xl border-2 transition-all animate-scale-in",
                result?.isCorrect 
                  ? "bg-success/5 border-success/30" 
                  : "bg-destructive/5 border-destructive/30"
              )}
              style={{ animationDelay: `${qIndex * 0.1}s` }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  result?.isCorrect ? "bg-success" : "bg-destructive"
                )}>
                  {result?.isCorrect ? (
                    <Check className="h-5 w-5 text-success-foreground" />
                  ) : (
                    <X className="h-5 w-5 text-destructive-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-lg">{question.text}</p>
                </div>
              </div>

              <div className="space-y-2 ml-11">
                {!result?.isCorrect && selectedAnswer && (
                  <div className="flex items-center gap-2 text-destructive">
                    <X className="h-4 w-4 shrink-0" />
                    <span className="text-sm">Your answer: {selectedAnswer.text}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-success">
                  <Check className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">Correct answer: {correctAnswer?.text}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={onRetry}
          className="flex-1"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Retry Quiz
        </Button>
        <Button
          variant="hero"
          onClick={onNewQuiz}
          className="flex-1"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Quiz
        </Button>
      </div>
    </div>
  );
}
