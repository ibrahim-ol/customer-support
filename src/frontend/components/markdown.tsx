import { marked } from "marked";

interface MarkdownProps {
  content: string;
  className?: string;
}
export function Markdown({ content, className = "" }: MarkdownProps) {
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert line breaks to <br>
  });
  const htmlContent = marked(content) as string;
  return (
    <div
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{
        // Basic styling for markdown elements
        lineHeight: "1.6",
      }}
    />
  );
}
