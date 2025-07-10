import React, { useState, useCallback } from "react";
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
import { Upload } from "@carbon/icons-react";

interface FileInfo {
  name: string;
  path: string;
  size: number;
}

export default function MultiRenamePage() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);
  const [renamePattern, setRenamePattern] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [startNumber, setStartNumber] = useState(1);
  const [caseType, setCaseType] = useState("lowercase");
  const [previewText, setPreviewText] = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const fileInfos: FileInfo[] = droppedFiles.map(file => ({
      name: file.name,
      path: file.webkitRelativePath || file.name,
      size: file.size
    }));
    setFiles(prev => [...prev, ...fileInfos]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = (selectedItems: FileInfo[]) => {
    setSelectedFiles(selectedItems);
  };
  const handleFileToggle = (file: FileInfo, checked: boolean) => {
    if (checked) {
      setSelectedFiles(prev => [...prev, file]);
    } else {
      setSelectedFiles(prev => prev.filter(f => f !== file));
    }
  };

  const generatePreview = () => {
    if (selectedFiles.length === 0) {
      setPreviewText("No files selected for preview");
      return;
    }

    const previewLines = selectedFiles.map((file, index) => {
      let newName = file.name;
      
      // Apply case changes
      switch (caseType) {
        case 'lowercase':
          newName = newName.toLowerCase();
          break;
        case 'uppercase':
          newName = newName.toUpperCase();
          break;
        case 'titlecase':
          newName = newName.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
          break;
      }

      // Apply prefix
      if (prefix) {
        newName = prefix + newName;
      }

      // Apply suffix
      if (suffix) {
        const lastDotIndex = newName.lastIndexOf('.');
        if (lastDotIndex !== -1) {
          newName = newName.substring(0, lastDotIndex) + suffix + newName.substring(lastDotIndex);
        } else {
          newName = newName + suffix;
        }
      }

      // Apply numbering
      if (renamePattern.includes('{n}')) {
        newName = newName.replace('{n}', (startNumber + index).toString());
      }

      return `${file.name} → ${newName}`;
    });

    setPreviewText(previewLines.join('\n'));
  };

  const handleSubmit = () => {
    // Handle the actual renaming logic here
    console.log("Renaming files:", selectedFiles);
    console.log("Preview:", previewText);
  };

  const clearFiles = () => {
    setFiles([]);
    setSelectedFiles([]);
    setPreviewText("");
  };

  return (
    <Grid fullWidth>
      <Column lg={6} md={6} sm={4}>
        <Section>
          <h3>File Selection</h3>
          
          {/* File Drop Zone */}
          <div
            style={{
              border: '2px dashed #8d8d8d',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1rem',
              backgroundColor: '#f4f4f4',
              cursor: 'pointer'
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload size={32} style={{ marginBottom: '1rem' }} />
            <p>Drag and drop files here</p>
            <p style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
              or click to browse files
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4>Selected Files ({files.length})</h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '8px' }}>
                {files.map((file, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Checkbox
                      id={`file-${index}`}
                      labelText=""
                      checked={selectedFiles.includes(file)}
                      onChange={(e) => handleFileToggle(file, e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{file.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                        {file.path} ({(file.size / 1024).toFixed(1)} KB)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rename Form */}
          <Form>
            <FormGroup legendText="Rename Pattern">
              <TextArea
                id="rename-pattern"
                labelText="Rename pattern (use {n} for numbering)"
                value={renamePattern}
                onChange={(e) => setRenamePattern(e.target.value)}
                placeholder="Enter rename pattern..."
                rows={3}
              />
            </FormGroup>

            <FormGroup legendText="Prefix & Suffix">
              <TextInput
                id="prefix"
                labelText="Prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="Enter prefix"
              />
              <TextInput
                id="suffix"
                labelText="Suffix"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder="Enter suffix"
              />
            </FormGroup>

            <FormGroup legendText="Numbering">
              <TextInput
                id="start-number"
                labelText="Start number"
                value={startNumber.toString()}
                onChange={(e) => setStartNumber(Number(e.target.value) || 1)}
                type="number"
                min={1}
              />
            </FormGroup>

            <FormGroup legendText="Case">
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
            </FormGroup>

            <FormGroup legendText="Actions">
              <Button kind="secondary" onClick={generatePreview} style={{ marginRight: '8px' }}>
                Generate Preview
              </Button>
              <Button kind="primary" onClick={handleSubmit} style={{ marginRight: '8px' }}>
                Rename Files
              </Button>
              <Button kind="ghost" onClick={clearFiles}>
                Clear All
              </Button>
            </FormGroup>
          </Form>
        </Section>
      </Column>

      <Column lg={6} md={6} sm={4}>
        <Section>
          <h3>Preview</h3>
          <TextArea
            id="preview-area"
            labelText="Rename Preview"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            placeholder="Preview will appear here after generating..."
            style={{ height: 'calc(100vh - 300px)', minHeight: '400px' }}
          />
        </Section>
      </Column>
    </Grid>
  );
} 