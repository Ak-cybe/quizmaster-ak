import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
    text: string;
    className?: string;
    as?: "span" | "p" | "div" | "h2";
}

/**
 * Renders text with inline math support using KaTeX.
 *
 * Supported math formats:
 * - LaTeX inline: $...$  or  \(...\)
 * - LaTeX display: $$...$$ or \[...\]
 * - Unicode math symbols render natively (√, ², ³, π, etc.)
 *
 * Examples:
 * - "$\sqrt{16}$"          → rendered square root symbol
 * - "$x^2 + y^2$"         → superscripts
 * - "$\frac{a}{b}$"       → fraction
 * - "$$E = mc^2$$"        → display-mode equation
 * - "√16 ka value kya?"   → Unicode passes through as-is
 */
export function MathText({ text, className = "", as: Tag = "span" }: MathTextProps) {
    const htmlContent = useMemo(() => renderMathText(text), [text]);

    return (
        <Tag
            className={`math-text-container ${className}`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}

// ─── Segment types ──────────────────────────────────────────────

interface TextSegment {
    type: "text";
    value: string;
}

interface MathSegment {
    type: "math";
    value: string;
    displayMode: boolean;
}

type Segment = TextSegment | MathSegment;

// ─── Core renderer ──────────────────────────────────────────────

function renderMathText(text: string): string {
    if (!text) return "";

    const segments = tokenize(text);

    return segments
        .map((seg) => {
            if (seg.type === "text") {
                return escapeHtml(seg.value);
            }
            // seg.type === "math"
            return renderKatexSafe(seg.value, seg.displayMode);
        })
        .join("");
}

// ─── Tokenizer ──────────────────────────────────────────────────

/**
 * Splits input into alternating text / math segments.
 *
 * Scan order matters — we check display-mode delimiters first
 * ($$…$$ and \[…\]) before inline ones ($…$ and \(…\)).
 */
function tokenize(input: string): Segment[] {
    const segments: Segment[] = [];
    let remaining = input;

    while (remaining.length > 0) {
        // Find the earliest math delimiter
        const match = findNextMath(remaining);

        if (!match) {
            // No more math — rest is plain text
            if (remaining.length > 0) {
                segments.push({ type: "text", value: remaining });
            }
            break;
        }

        // Push text before the math
        if (match.index > 0) {
            segments.push({ type: "text", value: remaining.slice(0, match.index) });
        }

        // Push the math segment
        segments.push({
            type: "math",
            value: match.latex,
            displayMode: match.displayMode,
        });

        // Advance past the matched portion
        remaining = remaining.slice(match.index + match.fullMatch.length);
    }

    return segments;
}

interface MathMatch {
    index: number;
    fullMatch: string;
    latex: string;
    displayMode: boolean;
}

/**
 * Finds the first math delimiter in the string.
 * Checks $$…$$, \[…\], $…$, \(…\) in priority order.
 */
function findNextMath(text: string): MathMatch | null {
    const patterns: {
        regex: RegExp;
        displayMode: boolean;
        latexGroup: number;
    }[] = [
            // Display math: $$...$$
            { regex: /\$\$([^$]+?)\$\$/g, displayMode: true, latexGroup: 1 },
            // Display math: \[...\]
            { regex: /\\\[(.+?)\\\]/gs, displayMode: true, latexGroup: 1 },
            // Inline math: $...$  (single $, not preceded by \)
            { regex: /(?<!\\)\$([^$\n]+?)\$(?!\$)/g, displayMode: false, latexGroup: 1 },
            // Inline math: \(...\)
            { regex: /\\\((.+?)\\\)/g, displayMode: false, latexGroup: 1 },
        ];

    let earliest: MathMatch | null = null;

    for (const { regex, displayMode, latexGroup } of patterns) {
        regex.lastIndex = 0; // reset for re-use
        const m = regex.exec(text);
        if (m && (earliest === null || m.index < earliest.index)) {
            earliest = {
                index: m.index,
                fullMatch: m[0],
                latex: m[latexGroup],
                displayMode,
            };
        }
    }

    return earliest;
}

// ─── KaTeX rendering ────────────────────────────────────────────

function renderKatexSafe(latex: string, displayMode: boolean): string {
    try {
        return katex.renderToString(latex.trim(), {
            displayMode,
            throwOnError: false,
            errorColor: "#ef4444",
            strict: false,
            trust: true,
            macros: {
                "\\R": "\\mathbb{R}",
                "\\N": "\\mathbb{N}",
                "\\Z": "\\mathbb{Z}",
                "\\Q": "\\mathbb{Q}",
            },
        });
    } catch {
        // Fallback: show raw LaTeX in a styled code block
        return `<code style="color:#f97316;background:#fef3c7;padding:0 4px;border-radius:4px;">${escapeHtml(latex)}</code>`;
    }
}

// ─── HTML escaping ──────────────────────────────────────────────

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
