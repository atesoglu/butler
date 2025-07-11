import React, { useState } from 'react';
import {
  Button,
  TextInput,
  Accordion,
  AccordionItem,
  Tabs,
  Tab,
  Tag,
  ProgressBar,
  InlineLoading
} from '@carbon/react';
import { Add, CheckmarkFilled, WarningAlt } from '@carbon/icons-react';

const Home: React.FC = () => {
  const [logSent, setLogSent] = useState(false);
  const handleLog = async () => {
    if (window.electronAPI) {
      await window.electronAPI.invoke('log-message', 'Sample log triggered from Home page');
      setLogSent(true);
      setTimeout(() => setLogSent(false), 2000);
    }
  };
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>Welcome to Butler</h1>
      <p>This page showcases Carbon Design System components for future use.</p>
      <Button kind="primary" onClick={handleLog} style={{ marginBottom: 16 }}>Trigger Sample Log</Button>
      {logSent && <span style={{ color: 'green', marginLeft: 12 }}>Log sent!</span>}
      <div style={{ margin: '2rem 0' }}>
        <Button renderIcon={Add}>Primary Button</Button>
        <Button kind="secondary" style={{ marginLeft: 8 }}>Secondary</Button>
        <Button kind="danger" renderIcon={WarningAlt} style={{ marginLeft: 8 }}>Danger</Button>
      </div>
      <TextInput id="sample-input" labelText="Sample Text Input" placeholder="Type here..." style={{ marginBottom: 24 }} />
      <Accordion>
        <AccordionItem title="Accordion Item 1">Content for item 1</AccordionItem>
        <AccordionItem title="Accordion Item 2">Content for item 2</AccordionItem>
      </Accordion>
      <div style={{ margin: '2rem 0' }}>
        <Tabs>
          <Tab title="Tab 1">Tab 1 content</Tab>
          <Tab title="Tab 2">Tab 2 content</Tab>
        </Tabs>
      </div>
      <div style={{ margin: '2rem 0' }}>
        <Tag type="green">Success</Tag>
        <Tag type="red" style={{ marginLeft: 8 }}>Error</Tag>
        <Tag type="blue" style={{ marginLeft: 8 }}>Info</Tag>
      </div>
      <div style={{ margin: '2rem 0' }}>
        <ProgressBar label="Progress" value={60} max={100} />
      </div>
      <div style={{ margin: '2rem 0' }}>
        <InlineLoading description="Loading animation" status="active" />
        <CheckmarkFilled style={{ marginLeft: 16, fill: 'green', verticalAlign: 'middle' }} />
      </div>
    </div>
  );
};

export default Home; 