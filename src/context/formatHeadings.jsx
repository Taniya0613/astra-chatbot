import React from 'react';
import CodeBlock from '../components/CodeBlock';

function formatHeadings(text) {
  // Split code blocks and normal text
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let elements = [];
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index);
      elements.push(...formatTextBlocks(before));
    }
    // Add code block
    const language = match[1] ? match[1].toLowerCase() : 'text';
    const code = match[2];
    elements.push(<CodeBlock key={elements.length} code={code} language={language} />);
    lastIndex = codeBlockRegex.lastIndex;
  }
  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(...formatTextBlocks(text.slice(lastIndex)));
  }
  return elements;
}

function formatTextBlocks(text) {
  // Split by double newlines for paragraphs
  return text.split(/\n{2,}/).map((block, i) => {
    let html = block
      // Headings
      .replace(/^#{1,6} (.*)$/gm, '<strong style="font-size:1.1em;color:#2c3e50;">$1</strong>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code style="background:#23272f;padding:2px 6px;border-radius:4px;">$1</code>');
    return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export default formatHeadings; 