import React from 'react';
import { Grid, Column, FileUploader, Form, TextArea, TextInput, Button } from '@carbon/react';
import { useState } from 'react';

const files = [
  { id: 1, name: 'file1.txt', path: '/path/to/file1.txt' },
  { id: 2, name: 'file2.txt', path: '/path/to/file2.txt' },
];

const MultiRename: React.FC = () => {
  const [logSent, setLogSent] = useState(false);
  const handleLog = async () => {
    if (window.electronAPI) {
      await window.electronAPI.invoke('log-message', 'MultiRename: Submit clicked');
      setLogSent(true);
      setTimeout(() => setLogSent(false), 2000);
    }
  };
  return (
    <Grid condensed>
      <Column sm={4} md={4} lg={6}>
        <Form>
          <h3>File Drop Zone</h3>
          <FileUploader labelTitle="Upload files" buttonLabel="Add files" multiple accept={[".txt", ".csv"]} filenameStatus="edit" />
          <h3>Files</h3>
          <ul style={{ paddingLeft: 16, marginBottom: 16 }}>
            {files.map(file => (
              <li key={file.id} style={{ marginBottom: 4 }}>
                <strong>{file.name}</strong> <span style={{ color: '#888', fontSize: 12 }}>({file.path})</span>
              </li>
            ))}
          </ul>
          <h3>Rename Options</h3>
          <TextArea labelText="Rename pattern" placeholder="Enter rename pattern or rules..." style={{ marginBottom: 8 }} />
          <TextInput id="additional-field" labelText="Additional Field" placeholder="Optional" style={{ marginBottom: 8 }} />
          <Button kind="primary" onClick={handleLog}>Submit</Button>
          {logSent && <span style={{ color: 'green', marginLeft: 12 }}>Log sent!</span>}
        </Form>
      </Column>
      <Column sm={4} md={4} lg={10}>
        <TextArea labelText="Preview" placeholder="Preview renamed files here..." style={{ minHeight: 500, width: '100%' }} />
      </Column>
    </Grid>
  );
};

export default MultiRename; 