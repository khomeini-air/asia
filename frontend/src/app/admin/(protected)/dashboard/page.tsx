"use client";

import { useState } from "react";
import TaskManager from "@/components/TaskManager";

type Tab = "tasks" | "applicants";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("tasks");

  // Helper for tab styling
  const getTabClassName = (tabName: Tab) => {
    return `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
      activeTab === tabName
        ? "border-blue-500 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <div
            onClick={() => setActiveTab("tasks")}
            className={getTabClassName("tasks")}
          >
            Task Management
          </div>
          <div
            onClick={() => setActiveTab("applicants")}
            className={getTabClassName("applicants")}
          >
            Applicant Management
          </div>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "tasks" && <TaskManager />}

        {activeTab === "applicants" && (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">Add Candidates</h2>
            <p className="mt-4 text-gray-500">
              This feature is coming soon. You will be able to add and manage job applicants from this page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}