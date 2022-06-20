import { CopyBlock, dracula } from "react-code-blocks";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import clsx from "clsx";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { IconButton, Tooltip } from "@mui/material";
import copy from "copy-to-clipboard";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CustomCodeBlock(props: CodeBlockProps) {
  const showLineNumbers = true;
  const wrapLines = true;

  return (
    <CopyBlock
      {...{ showLineNumbers, wrapLines }}
      theme={dracula}
      text={props.code}
      language={props.language}
      customStyle={{
        height: "250px",
        overflowY: "scroll",
        margin: "0px 0.75rem",
        borderRadius: "5px",
        fontSize: "0.75rem",
      }}
    />
  );
}

export const CodeHighlight = (props: { content: string; lang?: string }) => {
  const { content, lang } = props;

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (isCopied) {
      return;
    }
    copy(content);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const highlighted = lang
    ? hljs.highlight(lang, content)
    : hljs.highlightAuto(content);

  return (
    <pre className={clsx("hljs", "code-block")}>
      <code
        className="hljs"
        dangerouslySetInnerHTML={{ __html: highlighted.value }}
      />
      <div className="copy-btn-container">
        <Tooltip title={isCopied ? "Copied!" : "Copy"} placement="top" arrow>
          <IconButton size="small" onClick={handleCopy}>
            {isCopied ? (
              <CheckIcon fontSize="small" />
            ) : (
              <ContentCopyIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </div>
    </pre>
  );
};

export const InlineCode = (props: { children?: any }) => {
  return <code className="hljs inline-code">{props.children}</code>;
};
