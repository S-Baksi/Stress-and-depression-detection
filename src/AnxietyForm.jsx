import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";

export default function AnxietyForm({ onBack, onComplete }) {
  const [formData, setFormData] = useState({
    BMI_index: "",
    Age: "",
    skin_type: "",
    A365: "",
    M: "",
    T: "",
    A460: "",
    Anadn: "",
    delta: "",
    Kv100: "",
    Gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const numericData = {};
      for (const key in formData) {
        if (!formData[key]) {
          setError("Please fill in all required fields.");
          setLoading(false);
          return;
        }
        numericData[key] = parseFloat(formData[key]);
      }

      const response = await fetch(
        "http://localhost:9091/PredictStressByHealth",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(numericData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      onComplete?.(data, "anxiety");
      onBack();
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-10">
        {/* Left Step Panel */}
        <aside className="hidden lg:block w-64">
          <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Assessment Steps
            </h3>

            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-2 text-blue-600 font-medium">
                ● Personal Metrics
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                ○ Physical Indicators
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                ○ Demographics
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                ○ Review & Submit
              </li>
            </ul>

            <p className="mt-6 text-xs text-gray-500 leading-relaxed">
              This structured assessment helps our AI understand stress
              indicators more accurately.
            </p>
          </div>
        </aside>

        {/* Main Form */}
        <main className="flex-1">
          {/* Back */}
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Assistant
          </button>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="px-10 py-8 border-b border-gray-200">
              <h2 className="text-2xl font-semibold">
                Anxiety & Stress Assessment
              </h2>
              <p className="mt-2 text-sm text-gray-600 max-w-3xl">
                Please provide the following clinical and physiological details.
                These values help our AI model assess anxiety-related patterns.
              </p>
            </div>

            {/* Body */}
            <div className="px-10 py-10 space-y-12">
              {error && (
                <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Section 1 */}
              <section>
                <h3 className="text-lg font-semibold mb-1">
                  Personal & Demographic Data
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Basic demographic indicators influence stress patterns.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age */}
                  <Field
                    label="Age"
                    name="Age"
                    value={formData.Age}
                    onChange={handleInputChange}
                    placeholder="30"
                  />

                  {/* Gender */}
                  <SelectField
                    label="Gender"
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleInputChange}
                    options={[
                      ["", "Select gender"],
                      ["0", "Male"],
                      ["1", "Female"],
                    ]}
                  />

                  {/* BMI */}
                  <Field
                    label="BMI Index"
                    name="BMI_index"
                    value={formData.BMI_index}
                    onChange={handleInputChange}
                    placeholder="23.5"
                  />

                  {/* Skin */}
                  <SelectField
                    label="Skin Type"
                    name="skin_type"
                    value={formData.skin_type}
                    onChange={handleInputChange}
                    options={[
                      ["", "Select skin type"],
                      ["0", "Dry"],
                      ["1", "Normal"],
                      ["2", "Oily"],
                      ["3", "Combination"],
                      ["4", "Sensitive"],
                    ]}
                  />
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <h3 className="text-lg font-semibold mb-1">
                  Physiological Indicators
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  These parameters are used for advanced anxiety prediction.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    "A365",
                    "A460",
                    "Anadn",
                    "M",
                    "T",
                    "delta",
                    "Kv100",
                  ].map((key) => (
                    <Field
                      key={key}
                      label={key}
                      name={key}
                      value={formData[key]}
                      onChange={handleInputChange}
                    />
                  ))}
                </div>
              </section>

              {/* Submit */}
              <div className="pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center gap-3 rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
                >
                  {loading ? "Submitting…" : <>
                    <Send size={16} /> Submit Assessment
                  </>}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ------------------ Reusable Fields ------------------ */

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="number"
        step="0.1"
        {...props}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        {...props}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
