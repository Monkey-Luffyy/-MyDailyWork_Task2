import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Check, Sparkles } from "lucide-react";
import { Quiz, Question, Answer } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizCreatorProps {
  onQuizCreate: (quiz: Quiz) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const createEmptyAnswer = (): Answer => ({
  id: generateId(),
  text: "",
  isCorrect: false,
});

const createEmptyQuestion = (): Question => ({
  id: generateId(),
  text: "",
  answers: [createEmptyAnswer(), createEmptyAnswer(), createEmptyAnswer(), createEmptyAnswer()],
});

export function QuizCreator({ onQuizCreate }: QuizCreatorProps) {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([createEmptyQuestion()]);

  const updateQuestion = (questionId: string, text: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, text } : q
    ));
  };

  const updateAnswer = (questionId: string, answerId: string, text: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, answers: q.answers.map(a => a.id === answerId ? { ...a, text } : a) }
        : q
    ));
  };

  const setCorrectAnswer = (questionId: string, answerId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, answers: q.answers.map(a => ({ ...a, isCorrect: a.id === answerId })) }
        : q
    ));
  };

  const addQuestion = () => {
    setQuestions([...questions, createEmptyQuestion()]);
  };

  const removeQuestion = (questionId: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  const handleSubmit = () => {
    const validQuestions = questions.filter(q => 
      q.text.trim() && 
      q.answers.some(a => a.text.trim() && a.isCorrect) &&
      q.answers.filter(a => a.text.trim()).length >= 2
    );

    if (!title.trim() || validQuestions.length === 0) {
      return;
    }

    onQuizCreate({
      id: generateId(),
      title: title.trim(),
      questions: validQuestions.map(q => ({
        ...q,
        answers: q.answers.filter(a => a.text.trim())
      })),
    });
  };

  const isValid = title.trim() && questions.some(q => 
    q.text.trim() && 
    q.answers.some(a => a.text.trim() && a.isCorrect) &&
    q.answers.filter(a => a.text.trim()).length >= 2
  );

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Quiz Title
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your quiz title..."
          className="text-xl font-display h-14 bg-secondary border-2 border-transparent focus:border-primary/50 transition-all"
        />
      </div>

      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div 
            key={question.id} 
            className="p-6 rounded-2xl gradient-card border border-border/50 space-y-5 animate-scale-in"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                {qIndex + 1}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, e.target.value)}
                  placeholder="Enter your question..."
                  className="text-lg font-medium bg-secondary/50 border-2 border-transparent focus:border-primary/50 transition-all"
                />
              </div>
              {questions.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(question.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-14">
              {question.answers.map((answer, aIndex) => (
                <div 
                  key={answer.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
                    answer.isCorrect 
                      ? "bg-success/10 border-success" 
                      : "bg-secondary/30 border-transparent hover:border-muted-foreground/30"
                  )}
                  onClick={() => setCorrectAnswer(question.id, answer.id)}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-medium text-sm shrink-0 transition-all",
                    answer.isCorrect 
                      ? "bg-success text-success-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {answer.isCorrect ? <Check className="h-4 w-4" /> : String.fromCharCode(65 + aIndex)}
                  </div>
                  <Input
                    value={answer.text}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateAnswer(question.id, answer.id, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`Answer ${String.fromCharCode(65 + aIndex)}`}
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground pl-14">
              Click on an answer to mark it as correct
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={addQuestion}
          className="flex-1"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Question
        </Button>
        <Button
          variant="hero"
          size="lg"
          onClick={handleSubmit}
          disabled={!isValid}
          className="flex-1"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Create Quiz
        </Button>
      </div>
    </div>
  );
}
