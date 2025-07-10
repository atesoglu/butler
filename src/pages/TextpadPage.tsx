import React, { useState } from "react";
import {
  Form,
  FormGroup,
  TextInput,
  Button,
  TextArea,
  Select,
  SelectItem,
  Checkbox,
  Grid,
  Column,
  Section,
} from "@carbon/react";

export default function TextpadPage() {
  const [text, setText] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [removeText, setRemoveText] = useState("");
  const [caseType, setCaseType] = useState("lowercase");

  const removeEmptyLines = () => {
    const lines = text.split('\n');
    const filteredLines = lines.filter(line => line.trim() !== '');
    setText(filteredLines.join('\n'));
  };

  const removeDuplicateLines = () => {
    const lines = text.split('\n');
    const uniqueLines = [...new Set(lines)];
    setText(uniqueLines.join('\n'));
  };

  const removeLines = () => {
    if (!removeText) return;
    const lines = text.split('\n');
    const filteredLines = lines.filter(line => !line.includes(removeText));
    setText(filteredLines.join('\n'));
  };

  const addPrefix = () => {
    if (!prefix) return;
    const lines = text.split('\n');
    const prefixedLines = lines.map(line => prefix + line);
    setText(prefixedLines.join('\n'));
  };

  const addSuffix = () => {
    if (!suffix) return;
    const lines = text.split('\n');
    const suffixedLines = lines.map(line => line + suffix);
    setText(suffixedLines.join('\n'));
  };

  const sortLines = () => {
    const lines = text.split('\n');
    const sortedLines = lines.sort();
    setText(sortedLines.join('\n'));
  };

  const changeCase = () => {
    switch (caseType) {
      case 'lowercase':
        setText(text.toLowerCase());
        break;
      case 'uppercase':
        setText(text.toUpperCase());
        break;
      case 'titlecase':
        setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
        break;
      default:
        break;
    }
  };

  const addLineBreaks = () => {
    setText(text.replace(/\n/g, '\n\n'));
  };

  const removeLineBreaks = () => {
    setText(text.replace(/\n+/g, '\n'));
  };

  return (
    <Grid fullWidth>
      <Column lg={4} md={4} sm={4}>
        <Form>
          <Section>
            <h3>Remove Empty Or Duplicate Lines</h3>
            <div>
              <Button kind="secondary" onClick={removeEmptyLines} style={{ marginRight: '8px' }}>
                Remove Empty Lines
              </Button>
              <Button kind="secondary" onClick={removeDuplicateLines}>
                Remove Duplicates
              </Button>
            </div>
          </Section>

          <Section>
            <h3>Remove Lines</h3>
            <div>
              <TextInput
                id="remove-text"
                labelText="Text to remove from lines"
                value={removeText}
                onChange={(e) => setRemoveText(e.target.value)}
                placeholder="Enter text to remove"
              />
              <Button kind="secondary" onClick={removeLines} style={{ marginTop: '8px' }}>
                Remove Lines
              </Button>
            </div>
          </Section>

          <Section>
            <h3>Prefix / Suffix Lines</h3>
            <div>
              <TextInput
                id="prefix"
                labelText="Prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="Enter prefix"
              />
              <Button kind="secondary" onClick={addPrefix} style={{ marginRight: '8px', marginTop: '8px' }}>
                Add Prefix
              </Button>
            </div>
            <div>
              <TextInput
                id="suffix"
                labelText="Suffix"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder="Enter suffix"
              />
              <Button kind="secondary" onClick={addSuffix} style={{ marginTop: '8px' }}>
                Add Suffix
              </Button>
            </div>
          </Section>

          <Section>
            <h3>Sort Lines</h3>
            <div>
              <Button kind="secondary" onClick={sortLines}>
                Sort Lines Alphabetically
              </Button>
            </div>
          </Section>

          <Section>
            <h3>Change Letter Case</h3>
            <div>
              <Select
                id="case-type"
                labelText="Case type"
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
              >
                <SelectItem value="lowercase" text="Lowercase" />
                <SelectItem value="uppercase" text="Uppercase" />
                <SelectItem value="titlecase" text="Title Case" />
              </Select>
              <Button kind="secondary" onClick={changeCase} style={{ marginTop: '8px' }}>
                Change Case
              </Button>
            </div>
          </Section>

          <Section>
            <h3>Add / Remove Line Breaks</h3>
            <div>
              <Button kind="secondary" onClick={addLineBreaks} style={{ marginRight: '8px' }}>
                Add Line Breaks
              </Button>
              <Button kind="secondary" onClick={removeLineBreaks}>
                Remove Extra Breaks
              </Button>
            </div>
          </Section>
        </Form>
      </Column>

      <Column lg={8} md={8} sm={8}>
        <TextArea
          id="text-area"
          labelText="Text Editor"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter or paste your text here..."
          style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}
        />
      </Column>
    </Grid>
  );
} 