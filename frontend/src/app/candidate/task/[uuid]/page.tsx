"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CandidateTask, getCandidateTaskByUuid, startCandidateTask, submitCandidateTask } from "@/lib/api";
import WelcomeScreen from "./WelcomeScreen";
import TaskScreen from "./TaskScreen";
import SubmissionScreen from "./SubmissionScreen";
import CompletionScreen from "./CompletionScreen";

type Screen = "welcome" | "task" | "submission" | "completion" | "expired" | "loading" | "error";

export default function CandidateTaskPage() {
  const params = useParams();
  const uuid = params.uuid as string;

  const [candidateTask, setCandidateTask] = useState<CandidateTask | null>(null);
  const [screen, setScreen] = useState<Screen>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uuid) return;

    getCandidateTaskByUuid(uuid)
      .then(data => {
        setCandidateTask(data);
        // Determine initial screen based on task status
        if (data.submittedAt) {
          setScreen("completion");
        } else if (data.startedAt) {
          // Check for expiry on already started tasks
          const startTime = new Date(data.startedAt).getTime();
          const endTime = startTime + (data.duration + data.extraTime) * 60 * 1000;
          if (new Date().getTime() > endTime) {
            setScreen("expired");
          } else {
            setScreen("task");
          }
        } else {
          // Check for expiry on tasks not yet started (assuming created time is tracked by backend)
          // For now, let's assume if it's not started and not completed, it's the welcome screen.
          // The backend will handle expiry on the "start" call.
          setScreen("welcome");
        }
      })
      .catch(err => {
        setError(err.message);
        setScreen("error");
      });
  }, [uuid]);

  const handleStart = async () => {
    try {
      await startCandidateTask(uuid);
      // Refetch data to get the startedAt timestamp
      const updatedData = await getCandidateTaskByUuid(uuid);
      setCandidateTask(updatedData);
      setScreen("task");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (submissionLink: string, comments: string) => {
    try {
        const submissionBody = {
            submissionLink,
            comments,
            submittedAt: new Date().getTime(),
        };
        await submitCandidateTask(uuid, submissionBody);
        setScreen("completion");
    } catch (err: any) {
        setError(err.message);
    }
  };

  if (screen === "loading") return <div className="text-center my-10"><p>Loading your task...</p></div>;
  if (screen === "error") return <div className="text-center my-10 p-6 bg-red-100 text-red-700 rounded-md max-w-md mx-auto"><p>{error}</p></div>;
  if (screen === "expired") return <div className="text-center my-10 p-6 bg-yellow-100 text-yellow-800 rounded-md max-w-md mx-auto"><p>This task has expired and is no longer available.</p></div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {screen === "welcome" && candidateTask && <WelcomeScreen candidateTask={candidateTask} onStart={handleStart} error={error || undefined} />}
      {screen === "task" && candidateTask && <TaskScreen candidateTask={candidateTask} onNext={() => setScreen("submission")} />}
      {screen === "submission" && <SubmissionScreen onSubmit={handleSubmit} error={error || undefined} />}
      {screen === "completion" && <CompletionScreen />}
    </div>
  );
}
