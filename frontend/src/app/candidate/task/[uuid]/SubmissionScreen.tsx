"use client";
import { useState } from "react";

interface Props {
  onSubmit: (submissionLink: string, comments: string) => void;
  error?: string;
}

export default function SubmissionScreen({ onSubmit, error }: Props) {
  const [submissionLink, setSubmissionLink] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(submissionLink, comments);
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Submit Your Work</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="submissionLink" className="block text-sm font-medium text-gray-700">
            Git Repository Link
          </label>
          <input
            type="url"
            name="submissionLink"
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            placeholder="https://github.com/your-username/your-repo"
          />
        </div>
        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
            Comments (Optional)
          </label>
          <textarea
            name="comments"
            rows={5}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            placeholder="Any notes about your submission..."
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Final Submit
        </button>
      </form>
    </div>
  );
}
