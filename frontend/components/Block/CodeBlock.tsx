import { CopyBlock, dracula } from "react-code-blocks";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import clsx from "clsx";

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
  const highlighted = lang
    ? hljs.highlight(lang, content)
    : hljs.highlightAuto(content);
  return (
    <pre className={clsx("hljs")}>
      <code
        className="hljs"
        dangerouslySetInnerHTML={{ __html: highlighted.value }}
      />
    </pre>
  );
};
