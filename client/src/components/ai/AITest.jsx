import { useState } from "react";
import { testAI } from "@/services/aiService";

function AITest() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResponse(null);

      const result = await testAI(message);

      setResponse(result.data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">

      <h1 className="text-3xl font-bold">
        VAZHO AI Test
      </h1>

      <p className="mt-2 text-neutral-600">
        Test the connection between React, Express and Gemini.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4"
      >

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask VAZHO about travel..."
          rows={5}
          className="w-full rounded-xl border border-neutral-300 p-4 outline-none focus:border-neutral-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask VAZHO"}
        </button>

      </form>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-8 rounded-2xl border border-neutral-200 p-6">

          <h2 className="text-xl font-semibold">
            VAZHO says
          </h2>

          <p className="mt-3 text-neutral-700">
            {response.message}
          </p>

          {Array.isArray(response.suggestions) &&
            response.suggestions.length > 0 && (
              <div className="mt-6">

                <h3 className="font-semibold">
                  Suggestions
                </h3>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-600">
                  {response.suggestions.map(
                    (suggestion, index) => (
                      <li key={index}>
                        {suggestion}
                      </li>
                    )
                  )}
                </ul>

              </div>
            )}

        </div>
      )}

    </div>
  );
}

export default AITest;