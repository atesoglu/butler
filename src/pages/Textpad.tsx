import React from 'react';
import { Grid, Column, Form, Button, TextArea, TextInput, Toggle, Select, SelectItem } from '@carbon/react';
import { useState } from 'react';

const Textpad: React.FC = () => {
  const [logSent, setLogSent] = useState(false);
  const handleLog = async () => {
    if (window.electronAPI) {
      await window.electronAPI.invoke('log-message', 'Textpad: Remove Empty Lines clicked');
      setLogSent(true);
      setTimeout(() => setLogSent(false), 2000);
    }
  };
  return (
    <Grid condensed>
      <Column sm={4} md={4} lg={6}>
        <Form>
          <h3>Remove Lines</h3>
          <Button size="sm" kind="secondary" style={{ marginBottom: 8 }} onClick={handleLog}>Remove Empty Lines</Button>
          {logSent && <span style={{ color: 'green', marginLeft: 12 }}>Log sent!</span>}
          <Button size="sm" kind="secondary" style={{ marginLeft: 8, marginBottom: 8 }}>Remove Duplicate Lines</Button>
          <h3>Remove Lines by Content</h3>
          <TextInput id="remove-lines" labelText="Remove lines containing..." placeholder="Enter text or regex" style={{ marginBottom: 8 }} />
          <Button size="sm" kind="secondary" style={{ marginBottom: 16 }}>Remove Lines</Button>
          <h3>Prefix / Suffix</h3>
          <TextInput id="prefix" labelText="Prefix" placeholder="Add prefix" style={{ marginBottom: 8 }} />
          <TextInput id="suffix" labelText="Suffix" placeholder="Add suffix" style={{ marginBottom: 8 }} />
          <Button size="sm" kind="secondary" style={{ marginBottom: 16 }}>Apply Prefix/Suffix</Button>
          <h3>Sort Lines</h3>
          <Button size="sm" kind="secondary" style={{ marginBottom: 8 }}>Sort Ascending</Button>
          <Button size="sm" kind="secondary" style={{ marginLeft: 8, marginBottom: 8 }}>Sort Descending</Button>
          <h3>Change Letter Case</h3>
          <Button size="sm" kind="secondary" style={{ marginBottom: 8 }}>UPPERCASE</Button>
          <Button size="sm" kind="secondary" style={{ marginLeft: 8, marginBottom: 8 }}>lowercase</Button>
          <Button size="sm" kind="secondary" style={{ marginLeft: 8, marginBottom: 8 }}>Title Case</Button>
          <h3>Add / Remove Line Breaks</h3>
          <Button size="sm" kind="secondary" style={{ marginBottom: 8 }}>Add Line Breaks</Button>
          <Button size="sm" kind="secondary" style={{ marginLeft: 8, marginBottom: 8 }}>Remove Line Breaks</Button>
        </Form>
      </Column>
      <Column sm={4} md={4} lg={10}>
        <TextArea labelText="Textpad" placeholder="Paste or type your text here..." style={{ minHeight: 500, width: '100%' }} />
      </Column>
    </Grid>
  );
};

export default Textpad; 