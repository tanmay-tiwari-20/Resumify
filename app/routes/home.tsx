import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import SplitText from "~/components/SplitText";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumify | AI-Powered Resume Analyzer & Job Matcher" },
    {
      name: "description",
      content:
        "Analyze, store, and match your resumes to job listings with AI. Get custom ATS scores, smart feedback, and track applications seamlessly—all in a modern UI.",
    },

    {
      name: "keywords",
      content:
        "resume analyzer, AI resume feedback, ATS score, job matcher, resume storage, Puter.js, React, Tailwind CSS, resume tracking",
    },
    { name: "author", content: "Tanmay Tiwari" },

    // Open Graph metadata for better link previews
    { property: "og:title", content: "Resumify – AI Resume Analyzer" },
    {
      property: "og:description",
      content:
        "Upload resumes, match with jobs, and get ATS-optimized feedback using AI. Built with React, Puter.js, and Tailwind CSS.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://resumify-silk.vercel.app/" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    loadResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <SplitText
            text="Stay on Top of Applications & Resume Ratings"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center flex flex-col items-center gap-6 sm:gap-8 max-w-4xl px-4 break-keep whitespace-normal"
            delay={150}
            duration={0.6}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />

          {!loadingResumes && resumes?.length === 0 ? (
            <h2>Start by uploading a resume to see your feedback.</h2>
          ) : (
            <h2>Analyze Submissions and Access Intelligent AI Feedback</h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
