import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumify | Resume Review & ATS Feedback" },
  {
    name: "description",
    content:
      "Get a detailed review of your resume with ATS score, suggestions, and professional feedback to improve your chances of getting hired.",
  },
  {
    name: "keywords",
    content:
      "resume review, ATS score, resume feedback, job application, resume analysis, resumify",
  },
  { name: "author", content: "Tanmay Tiwari" },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>();
  const [isResumeLoading, setIsResumeLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadResume = async () => {
      try {
        setIsResumeLoading(true);
        setError(null);

        const resume = await kv.get(`resume:${id}`);

        if (!resume) {
          setError("Resume not found");
          return;
        }

        const data = JSON.parse(resume);

        const resumeBlob = await fs.read(data.resumePath);
        if (!resumeBlob) {
          setError("Unable to load resume file");
          return;
        }

        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
        const resumeUrl = URL.createObjectURL(pdfBlob);
        setResumeUrl(resumeUrl);

        const imageBlob = await fs.read(data.imagePath);
        if (!imageBlob) {
          setError("Unable to load resume preview");
          return;
        }
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageUrl);

        setFeedback(data.feedback);
        console.log({ resumeUrl, imageUrl, feedback: data.feedback });
      } catch (err) {
        setError("Failed to load resume data");
        console.error("Error loading resume:", err);
      } finally {
        setIsResumeLoading(false);
      }
    };

    loadResume();
  }, [id, fs, kv]);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`auth?next=/resume/${id}`);
  }, [isLoading, auth.isAuthenticated, navigate, id]);

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
        <div className="h-40 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Resume
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link
                to="/"
                className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors group"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>
                <span className="font-medium">Back to Homepage</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
              <span className="font-medium">Back to Homepage</span>
            </Link>

            {/* Status indicator */}
            {feedback && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Analysis Complete</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-120px)]">
          {/* Resume Preview Section */}
          <section className="order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <h3 className="text-white font-semibold text-lg">
                    Resume Preview
                  </h3>
                </div>

                <div className="p-6">
                  {isResumeLoading ? (
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-gray-600 text-sm">
                        Loading your resume...
                      </p>
                    </div>
                  ) : imageUrl && resumeUrl ? (
                    <div className="group relative">
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
                      >
                        <img
                          src={imageUrl}
                          className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                          alt="Resume preview"
                        />
                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300 flex items-center justify-center">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg
                              className="w-6 h-6 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Click to open full PDF
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                      <svg
                        className="w-16 h-16 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p>Resume preview not available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Section */}
          <section className="order-1 lg:order-2 space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Resume Analysis
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Comprehensive feedback to help you land your dream job
              </p>
            </div>

            {isResumeLoading ? (
              <LoadingSkeleton />
            ) : feedback ? (
              <div className="space-y-8">
                {/* Main Content */}
                <div className="space-y-8 animate-in fade-in duration-1000">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <Summary feedback={feedback} />
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <ATS
                      score={feedback.ATS?.score || 0}
                      suggestions={feedback.ATS?.tips || []}
                    />
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <Details feedback={feedback} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <Link
                    to="/"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Analyze Another Resume
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                    <svg
                      className="w-10 h-10 text-blue-600 animate-pulse"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Analyzing Your Resume
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Our AI is carefully reviewing your resume to provide
                    detailed feedback and suggestions.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">
                    This usually takes 30-60 seconds
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Resume;
