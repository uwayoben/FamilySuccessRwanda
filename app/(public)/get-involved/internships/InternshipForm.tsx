"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

const departments = [
  "Programs & community development",
  "Education (Faina Jerusalem Village)",
  "Healthcare & community health",
  "Social work & child protection",
  "Finance & administration",
  "Communications, media & IT",
  "Monitoring & evaluation / research",
  "Other",
];

const levels = [
  "TVET / vocational school",
  "Diploma (A1)",
  "Bachelor's degree (A0)",
  "Master's degree",
  "Recent graduate",
  "Other",
];

const internshipTypes = [
  "Academic internship (required by my school)",
  "Professional internship (after graduation)",
  "Research / thesis project",
];

const durations = ["1 month", "2–3 months", "3–6 months", "6 months or more"];

const inputCls = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors";
const labelCls = "block text-sm font-bold text-gray-700 mb-1.5";

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="flex items-center gap-3 mb-5">
        <span className="w-8 h-8 bg-emerald-700 text-white rounded-full flex items-center justify-center text-sm font-bold">{step}</span>
        <span className="text-lg font-extrabold text-gray-900">{title}</span>
      </legend>
      <div className="space-y-5">{children}</div>
    </fieldset>
  );
}

export default function InternshipForm() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    institution: "",
    field_of_study: "",
    level: levels[2],
    year: "",
    department: departments[0],
    internship_type: internshipTypes[0],
    start_date: "",
    duration: durations[1],
    cv_link: "",
    skills: "",
    motivation: "",
    agree: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const field = (key: keyof typeof form) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    // Internship applications are stored with contact messages (Admin → Messages),
    // so the extra answers are written into the message body.
    const message = [
      `Location: ${form.location}`,
      "",
      "EDUCATION",
      `School / university: ${form.institution}`,
      `Field of study: ${form.field_of_study}`,
      `Level: ${form.level}`,
      `Year of study / graduation: ${form.year || "—"}`,
      "",
      "INTERNSHIP",
      `Department: ${form.department}`,
      `Type: ${form.internship_type}`,
      `Preferred start date: ${form.start_date || "—"}`,
      `Duration: ${form.duration}`,
      `CV / portfolio link: ${form.cv_link || "—"}`,
      "",
      "Skills:",
      form.skills || "—",
      "",
      "What I hope to learn and contribute:",
      form.motivation,
    ].join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          subject: `Internship application — ${form.department}`,
          message,
        }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Application Received!</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Thank you for applying for an internship with Family Success Rwanda. Our team will review your application and contact you by email or phone.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Section step={1} title="Personal Information">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Full Name *</label>
            <input type="text" required {...field("full_name")} className={inputCls} placeholder="Your full name" />
          </div>
          <div>
            <label className={labelCls}>Email Address *</label>
            <input type="email" required {...field("email")} className={inputCls} placeholder="your@email.com" />
          </div>
          <div>
            <label className={labelCls}>Phone Number *</label>
            <input type="tel" required {...field("phone")} className={inputCls} placeholder="+250 7XX XXX XXX" />
          </div>
          <div>
            <label className={labelCls}>Country & City *</label>
            <input type="text" required {...field("location")} className={inputCls} placeholder="e.g. Huye, Rwanda" />
          </div>
        </div>
      </Section>

      <Section step={2} title="Education">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>School / University *</label>
            <input type="text" required {...field("institution")} className={inputCls} placeholder="e.g. University of Rwanda" />
          </div>
          <div>
            <label className={labelCls}>Field of Study *</label>
            <input type="text" required {...field("field_of_study")} className={inputCls} placeholder="e.g. Social Work, Accounting" />
          </div>
          <div>
            <label className={labelCls}>Level of Study *</label>
            <select {...field("level")} className={`${inputCls} bg-white`}>
              {levels.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Year of Study / Graduation Year</label>
            <input type="text" {...field("year")} className={inputCls} placeholder="e.g. Year 3, or graduated 2025" />
          </div>
        </div>
      </Section>

      <Section step={3} title="Internship Details">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Department of Interest *</label>
            <select {...field("department")} className={`${inputCls} bg-white`}>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Type of Internship *</label>
            <select {...field("internship_type")} className={`${inputCls} bg-white`}>
              {internshipTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Preferred Start Date</label>
            <input type="date" {...field("start_date")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Duration *</label>
            <select {...field("duration")} className={`${inputCls} bg-white`}>
              {durations.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Link to Your CV or Portfolio</label>
          <input type="url" {...field("cv_link")} className={inputCls} placeholder="e.g. a Google Drive, Dropbox or LinkedIn link" />
          <p className="text-gray-400 text-xs mt-1.5">Optional. Make sure the link can be opened by anyone. We may also ask you to email your CV.</p>
        </div>
      </Section>

      <Section step={4} title="Skills & Motivation">
        <div>
          <label className={labelCls}>Skills</label>
          <textarea rows={4} {...field("skills")} className={`${inputCls} resize-none`} placeholder="e.g. computer skills, languages, report writing, photography..." />
        </div>
        <div>
          <label className={labelCls}>What Do You Hope to Learn and Contribute? *</label>
          <textarea rows={5} required {...field("motivation")} className={`${inputCls} resize-none`} placeholder="Tell us why you want to intern with Family Success Rwanda..." />
        </div>
      </Section>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          required
          checked={form.agree}
          onChange={(e) => setForm((f) => ({ ...f, agree: e.target.checked }))}
          className="w-4 h-4 mt-1 accent-emerald-700 flex-shrink-0"
        />
        <span className="text-sm text-gray-600">
          I confirm that the information above is correct and I agree to be contacted by Family Success Rwanda about my internship application.
        </span>
      </label>

      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{errorMsg}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold px-8 py-4 rounded-full transition-colors text-base shadow-lg"
      >
        {status === "loading" ? "Sending..." : "Submit Internship Application"}
      </button>
    </form>
  );
}
