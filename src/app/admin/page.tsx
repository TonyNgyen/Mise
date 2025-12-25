"use client";

import React, { useState, useEffect } from "react";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  created_at: string;
  resolved_at: string | null;
};

function AdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<"all" | "resolved" | "unresolved">(
    "unresolved"
  );
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/contact?status=${filter}`);
      const result = await response.json();

      if (result.success) {
        setMessages(result.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleResolved = async (id: string, currentlyResolved: boolean) => {
    try {
      const response = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, resolved: !currentlyResolved }),
      });

      const result = await response.json();

      if (result.success) {
        fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      general:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
      feedback:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      bug: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
      support:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
      business:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
      other: "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Contact Messages
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage and respond to contact form submissions
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("unresolved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "unresolved"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Unresolved ({messages.length})
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "resolved"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            All Messages
          </button>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <p className="text-zinc-600 dark:text-zinc-400">
              No {filter !== "all" && filter} messages found
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {msg.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeColor(
                          msg.category
                        )}`}
                      >
                        {msg.category}
                      </span>
                      {msg.resolved_at && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          ✓ Resolved
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      {msg.email}
                    </a>
                  </div>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {formatDate(msg.created_at)}
                  </span>
                </div>

                <p className="text-zinc-700 dark:text-zinc-300 mb-4 whitespace-pre-wrap">
                  {selectedMessage?.id === msg.id
                    ? msg.message
                    : msg.message.length > 200
                    ? msg.message.substring(0, 200) + "..."
                    : msg.message}
                </p>

                <div className="flex gap-2">
                  {msg.message.length > 200 && (
                    <button
                      onClick={() =>
                        setSelectedMessage(
                          selectedMessage?.id === msg.id ? null : msg
                        )
                      }
                      className="px-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                    >
                      {selectedMessage?.id === msg.id
                        ? "Show Less"
                        : "Read More"}
                    </button>
                  )}
                  <button
                    onClick={() => toggleResolved(msg.id, !!msg.resolved_at)}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      msg.resolved_at
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                        : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                    }`}
                  >
                    {msg.resolved_at
                      ? "Mark as Unresolved"
                      : "Mark as Resolved"}
                  </button>
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${msg.category} inquiry`}
                    className="px-4 py-2 text-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                  >
                    Reply via Email
                  </a>
                </div>

                {msg.resolved_at && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
                    Resolved on {formatDate(msg.resolved_at)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
