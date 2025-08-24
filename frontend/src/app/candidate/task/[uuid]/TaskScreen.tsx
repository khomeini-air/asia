"use client";
import { useEffect, useState } from "react";
import { CandidateTask, getTaskDetails, Task } from "@/lib/api";

interface Props {
  candidateTask: CandidateTask;
  onNext: () => void;
}

export default function TaskScreen({ candidateTask, onNext }: Props) {
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [timeLeft, setTimeLeft] = useState("Calculating...");

  useEffect(() => {
    getTaskDetails(candidateTask.taskId).then(setTaskDetails);

    // Ensure startedAt is a valid number before starting the timer
    if (!candidateTask.startedAt || isNaN(Number(candidateTask.startedAt))) {
      return;
    }

    const startTime = Number(candidateTask.startedAt);
    const totalDurationInMillis = (candidateTask.duration + candidateTask.extraTime) * 60 * 1000;
    const endTime = startTime + totalDurationInMillis;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        setTimeLeft("Time's up!");
        clearInterval(interval);
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [candidateTask]);

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">{taskDetails?.title || "Loading task..."}</h1>
        <div className="text-xl font-semibold text-red-600 bg-red-100 px-4 py-2 rounded-md">
          Time Left: {timeLeft}
        </div>
      </div>
      <div className="prose max-w-none">
        <p>{taskDetails?.description || "Loading description..."}</p>
      </div>
      <div className="mt-8 text-right">
        <button
          onClick={onNext}
          className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}