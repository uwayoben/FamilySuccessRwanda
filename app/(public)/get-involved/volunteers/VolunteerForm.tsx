"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

const areas = [
  "Education & tutoring",
  "Faina Jerusalem Village (TVET training)",
  "Healthcare outreach",
  "Women & community empowerment",
  "Children & youth activities",
  "Fundraising & communications",
  "Other",
];

const availabilities = [
  "Full-time",
  "Part-time (weekdays)",
  "Weekends",
  "School holidays",
  "Remote / online",
];

const durations = [
  "Less than 1 month",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "More than 1 year",
];

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

export default function VolunteerForm() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    occupation: "",
    languages: "",
    area: areas[0],
    availability: availabilities[0],
    start_date: "",
    duration: durations[1],
    skills: "",
    experience: "",
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

    // Volunteer applications are stored with contact messages (Admin → Messages),
    // so the extra answers are written into the message body.
    const message = [
      `Location: ${form.location}`,
      `Occupation: ${form.occupation || "—"}`,
      `Languages: ${form.languages || "—"}`,
      `Area of interest: ${form.area}`,
      `Availability: ${form.availability}`,
      `Preferred start date: ${form.start_date || "—"}`,
      `Duration: ${form.duration}`,
      "",
      "Skills & qualifications:",
      form.skills || "—",
      "",
      "Previous volunteer experience:",
      form.experience || "—",
      "",
      "Why I want to volunteer:",
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
          subject: `Volunteer application — ${form.area}`,
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
        <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Thank You!</h3>
        <p className="text-gray-600">
          Your volunteer application has been received. We will contact you shortly.
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
          <div>
            <label className={labelCls}>Occupation / Profession</label>
            <input type="text" {...field("occupation")} className={inputCls} placeholder="e.g. Teacher, Nurse, Student" />
          </div>
          <div>
            <label className={labelCls}>Languages You Speak</label>
            <input type="text" {...field("languages")} className={inputCls} placeholder="e.g. Kinyarwanda, English, French" />
          </div>
        </div>
      </Section>

      <Section step={2} title="Volunteering Preferences">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Area of Interest *</label>
            <select {...field("area")} className={`${inputCls} bg-white`}>
              {areas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Availability *</label>
            <select {...field("availability")} className={`${inputCls} bg-white`}>
              {availabilities.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Preferred Start Date</label>
            <input type="date" {...field("start_date")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>How Long Can You Volunteer? *</label>
            <select {...field("duration")} className={`${inputCls} bg-white`}>
              {durations.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      <Section step={3} title="Skills & Motivation">
        <div>
          <label className={labelCls}>Skills & Qualifications</label>
          <textarea rows={4} {...field("skills")} className={`${inputCls} resize-none`} placeholder="Your education, training, and skills you would like to share..." />
        </div>
        <div>
          <label className={labelCls}>Previous Volunteer Experience</label>
          <textarea rows={4} {...field("experience")} className={`${inputCls} resize-none`} placeholder="Organisations you have volunteered with and what you did..." />
        </div>
        <div>
          <label className={labelCls}>Why Do You Want to Volunteer With Us? *</label>
          <textarea rows={5} required {...field("motivation")} className={`${inputCls} resize-none`} placeholder="Tell us what motivates you..." />
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
          I confirm that the information above is correct and I agree to be contacted by Family Success Rwanda about volunteering.
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
        {status === "loading" ? "Sending..." : "Submit Volunteer Application"}
      </button>
    </form>
  );
}
