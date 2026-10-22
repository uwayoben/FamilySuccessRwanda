"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold, Italic, Underline, Heading3, Heading4, Pilcrow, List, ListOrdered, Quote,
  Link as LinkIcon, Unlink, RemoveFormatting, Undo2, Redo2, type LucideIcon,
} from "lucide-react";
import { htmlToText, toRichHtml } from "@/lib/richText";

type Tool = {
  label: string;
  icon: LucideIcon;
  run: () => void;
  active?: (s: ActiveState) => boolean;
};

type ActiveState = { bold: boolean; italic: boolean; underline: boolean; ul: boolean; ol: boolean; block: string };
const NO_ACTIVE: ActiveState = { bold: false, italic: false, underline: false, ul: false, ol: false, block: "" };

// A small formatting editor: bold, italic, underline, headings, lists, quotes and links.
// Produces simple HTML; the website cleans it with sanitizeHtml before showing it.
export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 220,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtml = useRef<string | null>(null);
  const [active, setActive] = useState<ActiveState>(NO_ACTIVE);
  const empty = !htmlToText(value) && !/<li\b/i.test(value);

  // Load the value into the editor, unless it's what the user just typed (keeps the cursor in place).
  useEffect(() => {
    const el = editorRef.current;
    if (!el || value === lastHtml.current) return;
    el.innerHTML = toRichHtml(value);
    lastHtml.current = value;
  }, [value]);

  const emit = () => {
    const el = editorRef.current;
    if (!el) return;
    const text = el.textContent?.trim() ?? "";
    const html = text || el.querySelector("li") ? el.innerHTML : "";
    lastHtml.current = html;
    onChange(html);
  };

  // Highlights the toolbar buttons that match the formatting where the cursor is.
  const refreshActive = useCallback(() => {
    const el = editorRef.current;
    const sel = document.getSelection();
    if (!el || !sel?.anchorNode || !el.contains(sel.anchorNode)) return;
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      ul: document.queryCommandState("insertUnorderedList"),
      ol: document.queryCommandState("insertOrderedList"),
      block: String(document.queryCommandValue("formatBlock") || "").toLowerCase(),
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", refreshActive);
    return () => document.removeEventListener("selectionchange", refreshActive);
  }, [refreshActive]);

  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emit();
    refreshActive();
  };

  // Clicking a heading button again turns the line back into normal text.
  const toggleBlock = (tag: string) => exec("formatBlock", active.block === tag ? "<p>" : `<${tag}>`);

  const addLink = () => {
    const url = window.prompt("Link address (e.g. https://example.com):", "https://");
    if (!url || url === "https://") return;
    const sel = document.getSelection();
    if (sel && sel.isCollapsed) {
      const safe = url.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
      exec("insertHTML", `<a href="${safe}">${safe}</a>`);
    } else {
      exec("createLink", url);
    }
  };

  const groups: Tool[][] = [
    [
      { label: "Normal text", icon: Pilcrow, run: () => exec("formatBlock", "<p>"), active: (s) => s.block === "p" || s.block === "div" },
      { label: "Heading", icon: Heading3, run: () => toggleBlock("h3"), active: (s) => s.block === "h3" },
      { label: "Subheading", icon: Heading4, run: () => toggleBlock("h4"), active: (s) => s.block === "h4" },
    ],
    [
      { label: "Bold (Ctrl+B)", icon: Bold, run: () => exec("bold"), active: (s) => s.bold },
      { label: "Italic (Ctrl+I)", icon: Italic, run: () => exec("italic"), active: (s) => s.italic },
      { label: "Underline (Ctrl+U)", icon: Underline, run: () => exec("underline"), active: (s) => s.underline },
    ],
    [
      { label: "Bullet list", icon: List, run: () => exec("insertUnorderedList"), active: (s) => s.ul },
      { label: "Numbered list", icon: ListOrdered, run: () => exec("insertOrderedList"), active: (s) => s.ol },
      { label: "Quote", icon: Quote, run: () => toggleBlock("blockquote"), active: (s) => s.block === "blockquote" },
    ],
    [
      { label: "Add link", icon: LinkIcon, run: addLink },
      { label: "Remove link", icon: Unlink, run: () => exec("unlink") },
      { label: "Clear formatting", icon: RemoveFormatting, run: () => exec("removeFormat") },
    ],
    [
      { label: "Undo (Ctrl+Z)", icon: Undo2, run: () => exec("undo") },
      { label: "Redo (Ctrl+Y)", icon: Redo2, run: () => exec("redo") },
    ],
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100 transition-all">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        {groups.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5 pr-1 mr-1 border-r border-slate-200 last:border-r-0">
            {group.map((tool) => {
              const on = tool.active?.(active) ?? false;
              return (
                <button
                  key={tool.label}
                  type="button"
                  title={tool.label}
                  aria-label={tool.label}
                  aria-pressed={tool.active ? on : undefined}
                  // Keep the text selection in the editor when a button is clicked.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={tool.run}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    on ? "bg-orange-500 text-white shadow-sm" : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  <tool.icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="relative">
        {empty && placeholder && (
          <p className="pointer-events-none absolute left-4 top-3 text-sm text-slate-400">{placeholder}</p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          onFocus={() => document.execCommand("defaultParagraphSeparator", false, "p")}
          onInput={emit}
          onKeyUp={refreshActive}
          onMouseUp={refreshActive}
          onPaste={(e) => {
            // Paste as plain text so formatting from Word or websites doesn't come along.
            e.preventDefault();
            document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
          }}
          className="rich-text px-4 py-3 text-sm text-slate-700 leading-relaxed focus:outline-none overflow-y-auto"
          style={{ minHeight, maxHeight: 520 }}
        />
      </div>
    </div>
  );
}
