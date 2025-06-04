import React, { useMemo } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const ReadOnlyDocument = ({ initialValue }: { initialValue: Descendant[] }) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable readOnly placeholder="Enter some plain text..." />
    </Slate>
  );
};

export default ReadOnlyDocument;
