import React, { useState } from "react";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Copy,
  RefreshCw,
  Code,
  Zap,
  FileText,
  Moon,
  Sun,
} from "lucide-react";

const CodeReviewer = () => {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("issues");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sample code
  const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    if (items[i].price) {
      total = total + items[i].price;
    }
  }
  return total;
}

const user = {
  name: "Renuka",
  age: 25,
  email: "john@email.com"
};

function validateUser(user) {
  if (user.name == "" || user.age < 18) {
    return false;
  }
  return true;
}`;

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Code analysis engine
  const analyzeCode = (codeInput) => {
    const issues = [];
    const suggestions = [];
    const metrics = {
      lines: 0,
      functions: 0,
      complexity: 0,
      maintainability: 85,
    };

    const lines = codeInput.split("\n");
    metrics.lines = lines.length;

    // Detect common issues
    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for var usage
      if (line.includes("var ")) {
        issues.push({
          type: "warning",
          line: lineNum,
          message: 'Use "let" or "const" instead of "var"',
          code: line.trim(),
          severity: "medium",
        });
      }

      // Check for == instead of ===
      if (line.includes(" == ") && !line.includes(" === ")) {
        issues.push({
          type: "error",
          line: lineNum,
          message: "Use strict equality (===) instead of loose equality (==)",
          code: line.trim(),
          severity: "high",
        });
      }

      // Check for missing semicolons
      if (
        line.trim().length > 0 &&
        !line.trim().endsWith(";") &&
        !line.trim().endsWith("{") &&
        !line.trim().endsWith("}") &&
        !line.includes("//") &&
        line.includes("return ")
      ) {
        issues.push({
          type: "warning",
          line: lineNum,
          message: "Missing semicolon",
          code: line.trim(),
          severity: "low",
        });
      }

      // Count functions
      if (line.includes("function ") || line.includes("=> ")) {
        metrics.functions++;
      }
    });

    // Generate suggestions
    if (codeInput.includes("for (")) {
      suggestions.push({
        category: "Modern JavaScript",
        title: "Use Array Methods",
        description:
          "Consider using forEach, map, or reduce instead of traditional for loops",
        example: `// Instead of:
for (let i = 0; i < items.length; i++) {
  total += items[i].price;
}

// Use:
const total = items.reduce((sum, item) => sum + item.price, 0);`,
      });
    }

    if (codeInput.includes("var ")) {
      suggestions.push({
        category: "ES6+",
        title: "Use Modern Variable Declarations",
        description: "Replace var with let or const for better scoping",
        example: `// Instead of:
var total = 0;

// Use:
let total = 0; // or const if value doesn't change`,
      });
    }

    // Calculate complexity score
    const complexityFactors = [
      codeInput.split("if ").length - 1,
      codeInput.split("for ").length - 1,
      codeInput.split("while ").length - 1,
      codeInput.split("switch ").length - 1,
    ];
    metrics.complexity = complexityFactors.reduce((a, b) => a + b, 0);

    return { issues, suggestions, metrics };
  };

  const handleAnalyze = () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);

    // Simulate API call delay
    setTimeout(() => {
      const result = analyzeCode(code);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  const loadSample = () => {
    setCode(sampleCode);
  };

  const clearCode = () => {
    setCode("");
    setAnalysis(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getSeverityColor = (severity) => {
    if (isDarkMode) {
      switch (severity) {
        case "high":
          return "text-red-300 bg-red-900/30 border-red-700/50";
        case "medium":
          return "text-yellow-300 bg-yellow-900/30 border-yellow-700/50";
        case "low":
          return "text-blue-300 bg-blue-900/30 border-blue-700/50";
        default:
          return "text-gray-300 bg-gray-800/30 border-gray-600/50";
      }
    } else {
      switch (severity) {
        case "high":
          return "text-red-600 bg-red-50 border-red-200";
        case "medium":
          return "text-yellow-600 bg-yellow-50 border-yellow-200";
        case "low":
          return "text-blue-600 bg-blue-50 border-blue-200";
        default:
          return "text-gray-600 bg-gray-50 border-gray-200";
      }
    }
  };

  const getIssueIcon = (type) => {
    switch (type) {
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b shadow-sm transition-colors duration-300 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  AI Code Reviewer
                </h1>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Analyze JavaScript code quality & get smart suggestions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? "text-yellow-400 bg-gray-700 hover:bg-gray-600"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
                title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={loadSample}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                  isDarkMode
                    ? "text-indigo-400 bg-indigo-900/30 hover:bg-indigo-800/40"
                    : "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                }`}
              >
                Load Sample
              </button>
              <button
                onClick={clearCode}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                  isDarkMode
                    ? "text-gray-300 bg-gray-700 hover:bg-gray-600"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Input Section */}
          <div
            className={`rounded-xl shadow-sm border transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`p-6 border-b transition-colors duration-300 ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2
                  className={`text-lg font-semibold transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  JavaScript Code
                </h2>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {code.split("\n").length} lines
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your JavaScript code here..."
                className={`w-full h-80 p-4 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
              <div className="mt-4 flex justify-between items-center">
                <div
                  className={`flex items-center space-x-2 text-sm transition-colors duration-300 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Supports ES6+ JavaScript</span>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!code.trim() || isAnalyzing}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Results Section */}
          <div
            className={`rounded-xl shadow-sm border transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {!analysis ? (
              <div className="flex items-center justify-center h-full py-20">
                <div className="text-center">
                  <Search
                    className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${
                      isDarkMode ? "text-gray-600" : "text-gray-300"
                    }`}
                  />
                  <h3
                    className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Ready to Review
                  </h3>
                  <p
                    className={`transition-colors duration-300 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Paste your JavaScript code and click "Analyze Code" to get
                    started
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {/* Results Header */}
                <div
                  className={`p-6 border-b transition-colors duration-300 ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h2
                      className={`text-lg font-semibold transition-colors duration-300 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Analysis Results
                    </h2>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span
                          className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {
                            analysis.issues.filter((i) => i.severity === "high")
                              .length
                          }{" "}
                          High
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span
                          className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {
                            analysis.issues.filter(
                              (i) => i.severity === "medium"
                            ).length
                          }{" "}
                          Medium
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span
                          className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {
                            analysis.issues.filter((i) => i.severity === "low")
                              .length
                          }{" "}
                          Low
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div
                  className={`p-6 border-b transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-900/50 border-gray-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold transition-colors duration-300 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {analysis.metrics.lines}
                      </div>
                      <div
                        className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Lines
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold transition-colors duration-300 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {analysis.metrics.functions}
                      </div>
                      <div
                        className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Functions
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold transition-colors duration-300 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {analysis.metrics.complexity}
                      </div>
                      <div
                        className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Complexity
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {analysis.metrics.maintainability}%
                      </div>
                      <div
                        className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Maintainability
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div
                  className={`border-b transition-colors duration-300 ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab("issues")}
                      className={`py-4 text-sm font-medium border-b-2 transition-colors duration-300 ${
                        activeTab === "issues"
                          ? "border-indigo-500 text-indigo-600"
                          : isDarkMode
                          ? "border-transparent text-gray-400 hover:text-gray-200"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Issues ({analysis.issues.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("suggestions")}
                      className={`py-4 text-sm font-medium border-b-2 transition-colors duration-300 ${
                        activeTab === "suggestions"
                          ? "border-indigo-500 text-indigo-600"
                          : isDarkMode
                          ? "border-transparent text-gray-400 hover:text-gray-200"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Suggestions ({analysis.suggestions.length})
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                  {activeTab === "issues" && (
                    <div className="space-y-4">
                      {analysis.issues.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                          <p
                            className={`transition-colors duration-300 ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            No issues found! Your code looks great.
                          </p>
                        </div>
                      ) : (
                        analysis.issues.map((issue, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border transition-colors duration-300 ${getSeverityColor(
                              issue.severity
                            )}`}
                          >
                            <div className="flex items-start space-x-3">
                              {getIssueIcon(issue.type)}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">
                                    {issue.message}
                                  </p>
                                  <span
                                    className={`text-xs px-2 py-1 rounded transition-colors duration-300 ${
                                      isDarkMode
                                        ? "bg-gray-700 text-gray-300"
                                        : "bg-white text-gray-700"
                                    }`}
                                  >
                                    Line {issue.line}
                                  </span>
                                </div>
                                <code
                                  className={`mt-2 block text-xs p-2 rounded font-mono transition-colors duration-300 ${
                                    isDarkMode
                                      ? "bg-gray-700/50 text-gray-300"
                                      : "bg-white bg-opacity-50 text-gray-800"
                                  }`}
                                >
                                  {issue.code}
                                </code>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "suggestions" && (
                    <div className="space-y-6">
                      {analysis.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border transition-colors duration-300 ${
                            isDarkMode
                              ? "bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-700/50"
                              : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium transition-colors duration-300 ${
                                    isDarkMode
                                      ? "bg-blue-900/50 text-blue-300"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {suggestion.category}
                                </span>
                              </div>
                              <h4
                                className={`font-semibold mb-2 transition-colors duration-300 ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {suggestion.title}
                              </h4>
                              <p
                                className={`text-sm mb-3 transition-colors duration-300 ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {suggestion.description}
                              </p>
                              <div
                                className={`p-3 rounded border transition-colors duration-300 ${
                                  isDarkMode
                                    ? "bg-gray-800 border-gray-600"
                                    : "bg-white border-gray-200"
                                }`}
                              >
                                <pre
                                  className={`text-xs font-mono whitespace-pre-wrap transition-colors duration-300 ${
                                    isDarkMode
                                      ? "text-gray-300"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {suggestion.example}
                                </pre>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                copyToClipboard(suggestion.example)
                              }
                              className={`ml-4 p-2 transition-colors duration-300 ${
                                isDarkMode
                                  ? "text-gray-400 hover:text-gray-200"
                                  : "text-gray-400 hover:text-gray-600"
                              }`}
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeReviewer;
