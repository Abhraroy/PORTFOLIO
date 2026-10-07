"use client";

import React, { useState } from "react";
import { FiCopy, FiCheck, FiExternalLink } from "react-icons/fi";

type MarkdownViewerProps = {
  content: string;
};

/**
 * Custom dark-theme Markdown renderer for blankdev case studies.
 */
export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="space-y-6 font-sans text-zinc-300 leading-relaxed">
      {blocks.map((block, idx) => (
        <RenderBlock key={idx} block={block} />
      ))}
    </div>
  );
}

type BlockType =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" }
  | { type: "paragraph"; text: string };

function parseMarkdownBlocks(raw: string): BlockType[] {
  const lines = raw.split("\n");
  const blocks: BlockType[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trim().startsWith("```")) {
      const language = line.trim().replace(/^```/, "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", language, code: codeLines.join("\n") });
      i++;
      continue;
    }

    // HR
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.replace(/^#\s+/, "") });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.replace(/^##\s+/, "") });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.replace(/^###\s+/, "") });
      i++;
      continue;
    }
    if (line.startsWith("#### ")) {
      blocks.push({ type: "h4", text: line.replace(/^####\s+/, "") });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].replace(/^>\s*/, ""));
        i++;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join("\n") });
      continue;
    }

    // Unordered List
    if (/^[\*\-]\s+/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[\*\-]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[\*\-]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered List
    if (/^\d+\.\s+/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && lines[i + 1].includes("---")) {
      const headers = line
        .split("|")
        .map((s) => s.trim())
        .filter((s, idx, arr) => idx > 0 && idx < arr.length - 1);
      i += 2; // skip header line and separator line
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        const row = lines[i]
          .split("|")
          .map((s) => s.trim())
          .filter((s, idx, arr) => idx > 0 && idx < arr.length - 1);
        if (row.length > 0) rows.push(row);
        i++;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    // Paragraph or empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Accumulate multiline paragraph
    const pLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("> ") &&
      !/^[\*\-]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^(\*{3,}|-{3,}|_{3,})$/.test(lines[i].trim())
    ) {
      pLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", text: pLines.join(" ") });
  }

  return blocks;
}

function RenderBlock({ block }: { block: BlockType }) {
  switch (block.type) {
    case "h1":
      return (
        <h1 className="font-mono text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl pt-4 pb-2 border-b border-white/10">
          <RenderInline text={block.text} />
        </h1>
      );
    case "h2":
      return (
        <h2 className="font-mono text-xl font-medium tracking-tight text-zinc-100 sm:text-2xl pt-6 pb-2 border-b border-white/10">
          <RenderInline text={block.text} />
        </h2>
      );
    case "h3":
      return (
        <h3 className="font-mono text-lg font-medium text-zinc-200 pt-4">
          <RenderInline text={block.text} />
        </h3>
      );
    case "h4":
      return (
        <h4 className="font-mono text-base font-medium text-zinc-300 pt-2">
          <RenderInline text={block.text} />
        </h4>
      );
    case "blockquote":
      return (
        <blockquote className="rounded-xl border-l-2 border-white/30 bg-white/[0.04] p-4 text-sm italic text-zinc-300 my-4 shadow-inner">
          <RenderInline text={block.text} />
        </blockquote>
      );
    case "code":
      return <CodeBlock language={block.language} code={block.code} />;
    case "ul":
      return (
        <ul className="space-y-2 my-3 pl-2">
          {block.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-300">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
              <span>
                <RenderInline text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-2 my-3 pl-2">
          {block.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
              <span className="font-mono text-xs text-zinc-400 font-semibold">{idx + 1}.</span>
              <span>
                <RenderInline text={item} />
              </span>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="overflow-x-auto my-6 rounded-xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="border-b border-white/10 bg-white/5 font-mono text-xs uppercase text-zinc-400">
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="px-4 py-3">
                    <RenderInline text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3">
                      <RenderInline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "hr":
      return <hr className="my-8 border-white/10" />;
    case "paragraph":
      return (
        <p className="text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
          <RenderInline text={block.text} />
        </p>
      );
  }
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-5 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
        <span className="font-mono text-xs tracking-wider text-zinc-400 uppercase">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-400 transition hover:bg-white/10 hover:text-zinc-200"
        >
          {copied ? (
            <>
              <FiCheck className="text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <FiCopy />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function RenderInline({ text }: { text: string }) {
  // Regex pattern for bold (**text**), italic (*text*), inline code (`code`), link ([text](url))
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Link: [label](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [full, label, url] = linkMatch;
      const isExternal = url.startsWith("http");
      parts.push(
        <a
          key={keyIdx++}
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="inline-flex items-center gap-1 font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white transition-colors"
        >
          {label}
          {isExternal && <FiExternalLink className="inline h-3 w-3 opacity-70" />}
        </a>
      );
      remaining = remaining.slice(full.length);
      continue;
    }

    // Bold: **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      const [full, boldText] = boldMatch;
      parts.push(
        <strong key={keyIdx++} className="font-semibold text-zinc-100">
          {boldText}
        </strong>
      );
      remaining = remaining.slice(full.length);
      continue;
    }

    // Italic: *text*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      const [full, italicText] = italicMatch;
      parts.push(
        <em key={keyIdx++} className="italic text-zinc-200">
          {italicText}
        </em>
      );
      remaining = remaining.slice(full.length);
      continue;
    }

    // Code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      const [full, codeText] = codeMatch;
      parts.push(
        <code
          key={keyIdx++}
          className="rounded border border-white/10 bg-white/10 px-1.5 py-0.5 font-mono text-xs text-zinc-200"
        >
          {codeText}
        </code>
      );
      remaining = remaining.slice(full.length);
      continue;
    }

    // Plain text character
    const nextSpecial = remaining.search(/\[|\*\*|\*|`/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      // Fallback for unmatched syntax char
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return <>{parts}</>;
}
