"use client";
import { CandidateTask } from "@/lib/api";

interface Props {
  candidateTask: CandidateTask;
  onStart: () => void;
  error?: string;
}

export default function WelcomeScreen({ candidateTask, onStart, error }: Props) {
  const hours = Math.floor(candidateTask.duration / 60);
  const minutes = candidateTask.duration % 60;
  const extensionHours = Math.floor(candidateTask.extraTime / 60);
  const extensionMinutes = candidateTask.extraTime % 60;

  return (
    <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Handys Company Evaluation</h1>
      <p className="text-xl text-gray-700 mb-6">Hello, {candidateTask.firstName} {candidateTask.lastName}.</p>
      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-left mb-6">
        <p className="text-gray-800">
          You have
          <strong>
            {hours > 0 && `${hours} hour${hours > 1 ? 's' : ''}`}
            {hours > 0 && minutes > 0 && ' and '}
            {minutes > 0 && `${minutes} minute${minutes > 1 ? 's' : ''}`}
          </strong> for this test, with a possible
          <strong>
            +{extensionHours > 0 && `${extensionHours} hour${extensionHours > 1 ? 's' : ''}`}
            {extensionHours > 0 && extensionMinutes > 0 && ' and '}
            {extensionMinutes > 0 && `${extensionMinutes} minute${extensionMinutes > 1 ? 's' : ''}`} extension
          </strong> if needed.
        </p>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={onStart}
        className="w-full px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Start Test
      </button>
    </div>
  );
}
