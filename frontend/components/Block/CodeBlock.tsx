import { CopyBlock, dracula } from "react-code-blocks";

interface CodeBlockProps {
    code: string;
    language: string;
};

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
          height: '250px',
          overflowY: 'scroll',
          margin: '0px 0.75rem',
          borderRadius: '5px',
          fontSize: '0.75rem',
        }}
      />
  );
}