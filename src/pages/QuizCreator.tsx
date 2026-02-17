import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, BookOpen, FileText, AlertCircle, CheckCircle2, Bot, Sparkles, ExternalLink } from "lucide-react";
import { QuizCategory, QuizQuestion } from "@/types/quiz";
import { MathText } from "@/components/ui/MathText";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface QuizCreatorProps {
  onSaveQuiz: (category: QuizCategory) => void;
  onClose: () => void;
}

export function QuizCreator({ onSaveQuiz, onClose }: QuizCreatorProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [bulkInput, setBulkInput] = useState("");
  const [parsedQuestions, setParsedQuestions] = useState<QuizQuestion[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  const parseQuestions = (text: string): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];

    // Split by question patterns - handles multiple formats
    // Matches: Q1. Q1: Q1) 1. 1: 1) Question 1: — at the start of a line
    const questionBlocks = text
      .split(/(?=^[ \t]*(?:Q?\d+[\.\:\)]|Question\s*\d+[\.\:\s]))/gim)
      .filter((block) => block.trim());

    for (let blockIdx = 0; blockIdx < questionBlocks.length; blockIdx++) {
      const block = questionBlocks[blockIdx].trim();
      if (!block) continue;

      try {
        const lines = block
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l);
        if (lines.length < 2) continue;

        // ── Extract question text ────────────────────────────
        // Remove leading Q1. / 1) / Question 1: prefix
        const questionText = lines[0]
          .replace(
            /^(?:\*{0,2})(?:Q?\d+[\.\:\)]\s*|Question\s*\d+[\.\:\s])(?:\*{0,2})\s*/i,
            ""
          )
          .trim();

        if (!questionText) continue;

        // ── Parse options & answer markers ────────────────────
        const options: { id: string; text: string }[] = [];
        let correctAnswer = "";
        let explanation = "";

        for (let j = 1; j < lines.length; j++) {
          const line = lines[j];

          // --- Check for option: A) / A. / A: / (A) / [A] / *A* etc. ---
          const optionMatch = line.match(
            /^(?:\*{0,2})[\(\[]?([A-Da-d])[\)\]\.:\-](?:\*{0,2})\s*(.+)/
          );
          if (optionMatch) {
            const optionId = optionMatch[1].toUpperCase();
            let optionText = optionMatch[2].trim();

            // Check if marked correct with ✓ ✔ √ or explicit (correct) / [correct]
            // ❌ Do NOT match lone * (used in markdown bold)
            // ❌ Do NOT match the English word "correct" if it's part of the question content
            const correctMarkerRegex =
              /(?:^|\s)[✓✔√]|(?:^|\s)\(correct\)|\[correct\]/i;
            const isMarkedCorrect = correctMarkerRegex.test(optionText);

            if (isMarkedCorrect) {
              correctAnswer = optionId;
              // Clean marker from option text
              optionText = optionText
                .replace(/[✓✔√]/g, "")
                .replace(/\s*\(?correct\)?\s*/gi, "")
                .replace(/\s*\[?correct\]?\s*/gi, "")
                .trim();
            }

            // Remove trailing ** markdown bold that wraps the entire option
            optionText = optionText.replace(/^\*{1,2}|\*{1,2}$/g, "").trim();

            options.push({ id: optionId, text: optionText });
            continue;
          }

          // --- Check for standalone answer line ---
          // Handles: Answer: B, Ans: B, Ans. B, Correct: B, Correct Answer: B,
          //          Answer - B, **Answer: B**, Answer: B) Delhi, ans:b,
          //          सही उत्तर: B, उत्तर: C
          const answerLineRegex =
            /^[\s*]*(?:Answer|Correct\s*Answer|Correct|Ans|सही\s*उत्तर|उत्तर)[\s.\-:]+(?:[\(\[]?([A-Da-d])[\)\]]?)/i;
          const answerMatch = line.match(answerLineRegex);
          if (answerMatch && answerMatch[1]) {
            correctAnswer = answerMatch[1].toUpperCase();
            continue;
          }

          // --- Check for explanation ---
          const explanationMatch = line.match(
            /^(?:\*{0,2})(?:Explanation|Explain|Reason|Why|Note|व्याख्या)[\s.\-:]+(.+)/i
          );
          if (explanationMatch) {
            explanation = explanationMatch[1].trim();
            // Collect remaining lines as part of explanation
            for (let k = j + 1; k < lines.length; k++) {
              const nextLine = lines[k];
              // Stop if we hit what looks like a new option or answer line
              if (/^[\(\[]?[A-Da-d][\)\]\.:\-]\s/.test(nextLine)) break;
              if (answerLineRegex.test(nextLine)) break;
              explanation += " " + nextLine;
            }
            break;
          }
        }

        // ── Validate & save ──────────────────────────────────
        if (questionText && options.length >= 2 && correctAnswer) {
          // Pad to 4 options if needed
          while (options.length < 4) {
            const nextId = String.fromCharCode(65 + options.length);
            options.push({ id: nextId, text: "-" });
          }

          questions.push({
            id: questions.length + 1,
            question: questionText,
            options: options.slice(0, 4),
            correctAnswer,
            explanation: explanation || "No explanation provided.",
          });
        }
      } catch (e) {
        console.error("Error parsing question block:", block, e);
      }
    }

    return questions;
  };

  const handleBulkInputChange = (text: string) => {
    setBulkInput(text);

    if (text.trim().length > 20) {
      const parsed = parseQuestions(text);
      setParsedQuestions(parsed);

      if (parsed.length === 0 && text.trim().length > 50) {
        setParseError("Could not parse any questions. Please check the format.");
      } else {
        setParseError(null);
      }
    } else {
      setParsedQuestions([]);
      setParseError(null);
    }
  };

  const handleSave = () => {
    // Validation
    if (!categoryName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz name",
        variant: "destructive",
      });
      return;
    }

    if (parsedQuestions.length === 0) {
      toast({
        title: "Error",
        description: "No valid questions found. Please check your input format.",
        variant: "destructive",
      });
      return;
    }

    const newCategory: QuizCategory = {
      id: `custom-${Date.now()}`,
      name: categoryName.trim(),
      description: categoryDescription.trim() || `Custom quiz with ${parsedQuestions.length} questions`,
      icon: "BookOpen",
      color: "from-indigo-500 to-purple-400",
      timePerQuestion,
      questions: parsedQuestions,
    };

    onSaveQuiz(newCategory);
    toast({
      title: "Quiz Created! 🎉",
      description: `"${categoryName}" with ${parsedQuestions.length} questions has been added.`,
    });
  };

  const exampleFormat = `1. What is the capital of India?
A) Mumbai
B) Delhi ✓
C) Kolkata
D) Chennai
Explanation: Delhi is the capital of India.

2. Which planet is known as Red Planet?
A) Venus
B) Mars ✓
C) Jupiter
D) Saturn

Q3. What is 2+2?
A. 3
B. 4 (correct)
C. 5
D. 6
Answer: B`;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/60">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create New Quiz</h1>
              <p className="text-muted-foreground">Paste all your questions at once</p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>

        {/* AI Helper Section */}
        <Card className="mb-6 border-violet-500/30 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-purple-500/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-foreground">AI-Powered Quiz Creation</h3>
                  <Badge variant="secondary" className="bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Pro Tip
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-3">
                  Use AI tools to generate MCQs instantly! Simply ask any AI assistant for questions in the supported format.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://chat.openai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                  >
                    ChatGPT <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href="https://gemini.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                  >
                    Gemini <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href="https://claude.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium hover:bg-orange-500/20 transition-colors border border-orange-500/20"
                  >
                    Claude <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href="https://perplexity.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors border border-cyan-500/20"
                  >
                    Perplexity <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-muted-foreground text-xs mt-3 italic">
                  💡 Try: "Give me 10 MCQs on [topic] with options A, B, C, D and mark the correct answer"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Quiz Name *</Label>
                <Input
                  id="categoryName"
                  placeholder="e.g., Science Quiz, GK Questions"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timePerQuestion">Time per Question (seconds)</Label>
                <Input
                  id="timePerQuestion"
                  type="number"
                  min={10}
                  max={120}
                  value={timePerQuestion}
                  onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryDescription">Description (optional)</Label>
              <Input
                id="categoryDescription"
                placeholder="Brief description of this quiz"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bulk Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Paste Your Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription id="format-instructions">
                <strong>Supported formats:</strong> Number your questions (1. or Q1.), add options (A, B, C, D),
                mark correct answer with ✓ or (correct) or write "Answer: B" on separate line.
                <br />
                <strong>✨ Math support:</strong> Use LaTeX notation like <code>{"$\\sqrt{16}$"}</code>, <code>{"$x^2$"}</code>, <code>{"$\\frac{a}{b}$"}</code> for math expressions.
                Unicode symbols (√, ², ³, π, etc.) also work!
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="bulk-questions">Paste Your Questions</Label>
              <Textarea
                id="bulk-questions"
                placeholder={exampleFormat}
                value={bulkInput}
                onChange={(e) => handleBulkInputChange(e.target.value)}
                rows={15}
                className="font-mono text-sm"
                aria-label="Paste quiz questions in supported format"
                aria-describedby="format-instructions parse-status"
              />
            </div>

            {/* Parse Status */}
            {parsedQuestions.length > 0 && (
              <Alert className="border-success/50 bg-success/10" id="parse-status">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  <strong>{parsedQuestions.length} questions</strong> parsed successfully!
                </AlertDescription>
              </Alert>
            )}

            {parseError && (
              <Alert variant="destructive" id="parse-status">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}

            {/* Preview of parsed questions */}
            {parsedQuestions.length > 0 && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg max-h-60 overflow-y-auto">
                <h4 className="font-semibold mb-3 text-foreground">Preview:</h4>
                <div className="space-y-3">
                  {parsedQuestions.slice(0, 5).map((q, idx) => (
                    <div key={idx} className="text-sm border-b border-border/50 pb-2">
                      <p className="font-medium text-foreground">
                        {idx + 1}. <MathText text={q.question} />
                      </p>
                      <p className="text-muted-foreground">
                        Options: {q.options.map(o => o.id).join(", ")} |
                        Correct: <span className="text-success font-medium">{q.correctAnswer}</span>
                      </p>
                    </div>
                  ))}
                  {parsedQuestions.length > 5 && (
                    <p className="text-muted-foreground text-sm">
                      ... and {parsedQuestions.length - 5} more questions
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Example Format */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Example Format</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono">
              {exampleFormat}
            </pre>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          size="lg"
          className="w-full gradient-primary text-white border-0"
          disabled={parsedQuestions.length === 0}
        >
          <Save className="h-5 w-5 mr-2" />
          Save Quiz ({parsedQuestions.length} Questions)
        </Button>
      </div>
    </div>
  );
}
