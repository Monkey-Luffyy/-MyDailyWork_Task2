import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuizCreator } from "@/components/QuizCreator";
import { QuizPlayer } from "@/components/QuizPlayer";
import { QuizResults } from "@/components/QuizResults";
import { Quiz, QuizResult } from "@/types/quiz";
import { Sparkles, Brain, Play, Plus } from "lucide-react";

type AppState = "home" | "create" | "play" | "results";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("home");
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  const handleQuizCreate = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setAppState("play");
  };

  const handleQuizComplete = (results: QuizResult[]) => {
    setQuizResults(results);
    setAppState("results");
  };

  const handleRetry = () => {
    setAppState("play");
  };

  const handleNewQuiz = () => {
    setCurrentQuiz(null);
    setQuizResults([]);
    setAppState("create");
  };

  const handleBackToHome = () => {
    setCurrentQuiz(null);
    setQuizResults([]);
    setAppState("home");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container max-w-4xl py-8 px-4">
        {/* Header */}
        <header className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-2 cursor-pointer group"
            onClick={handleBackToHome}
          >
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center animate-pulse-glow group-hover:scale-110 transition-transform">
              <Brain className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gradient">
              QuizCraft
            </h1>
          </div>
          {appState === "home" && (
            <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
              Create engaging quizzes in seconds and test your knowledge
            </p>
          )}
        </header>

        {/* Main Content */}
        <main>
          {appState === "home" && (
            <div className="space-y-8 animate-slide-up">
              <div className="grid md:grid-cols-2 gap-6">
                <div 
                  className="group p-8 rounded-2xl gradient-card border border-border/50 cursor-pointer hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
                  onClick={() => setAppState("create")}
                >
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Plus className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-2">Create Quiz</h2>
                  <p className="text-muted-foreground">
                    Build custom quizzes with multiple choice questions and instant feedback
                  </p>
                </div>

                <div 
                  className={`group p-8 rounded-2xl gradient-card border border-border/50 transition-all ${
                    currentQuiz 
                      ? "cursor-pointer hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5" 
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => currentQuiz && setAppState("play")}
                >
                  <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Play className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-2">Play Quiz</h2>
                  <p className="text-muted-foreground">
                    {currentQuiz 
                      ? `Continue with "${currentQuiz.title}"` 
                      : "Create a quiz first to start playing"
                    }
                  </p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                {[
                  { icon: "⚡", title: "Quick Setup", desc: "Create in minutes" },
                  { icon: "🎯", title: "Instant Results", desc: "See correct answers" },
                  { icon: "🔄", title: "Retry Anytime", desc: "Practice makes perfect" },
                ].map((feature, i) => (
                  <div key={i} className="text-center p-4">
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {appState === "create" && (
            <div>
              <Button
                variant="ghost"
                onClick={handleBackToHome}
                className="mb-6"
              >
                ← Back to Menu
              </Button>
              <QuizCreator onQuizCreate={handleQuizCreate} />
            </div>
          )}

          {appState === "play" && currentQuiz && (
            <QuizPlayer 
              quiz={currentQuiz} 
              onComplete={handleQuizComplete}
              onBack={handleBackToHome}
            />
          )}

          {appState === "results" && currentQuiz && (
            <QuizResults 
              quiz={currentQuiz}
              results={quizResults}
              onRetry={handleRetry}
              onNewQuiz={handleNewQuiz}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
