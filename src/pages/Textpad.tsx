import React, { useState } from 'react';
import {
  TextArea,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TextInput,
  Select,
  SelectItem,
  Stack,
  InlineNotification
} from '@carbon/react';
import { Save, Download, Copy, TrashCan, Add } from '@carbon/icons-react';

interface Document {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'markdown' | 'json' | 'code';
  language?: string;
}

const Textpad: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', title: 'Untitled Document', content: '', type: 'text' }
  ]);
  const [activeDocument, setActiveDocument] = useState('1');
  const [activeTab, setActiveTab] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDocData, setNewDocData] = useState({ title: '', type: 'text' as const, language: 'javascript' });

  const getCurrentDocument = () => documents.find(doc => doc.id === activeDocument) || documents[0];

  const handleSave = async () => {
    const doc = getCurrentDocument();
    if (window.electronAPI) {
      await window.electronAPI.invoke('log-message', `Document saved: ${doc.title}`);
    }
    // In a real app, this would save to file system
  };

  const handleDownload = async () => {
    const doc = getCurrentDocument();
    if (window.electronAPI) {
      await window.electronAPI.invoke('log-message', `Document downloaded: ${doc.title}`);
    }
    // In a real app, this would trigger file download
  };

  const handleCopy = async () => {
    const doc = getCurrentDocument();
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(doc.content);
      if (window.electronAPI) {
        await window.electronAPI.invoke('log-message', `Content copied to clipboard: ${doc.title}`);
      }
    }
  };

  const handleDelete = async () => {
    const doc = getCurrentDocument();
    if (documents.length > 1) {
      setDocuments(docs => docs.filter(d => d.id !== activeDocument));
      setActiveDocument(documents[0].id);
      if (window.electronAPI) {
        await window.electronAPI.invoke('log-message', `Document deleted: ${doc.title}`);
      }
    }
  };

  const handleContentChange = (content: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === activeDocument
          ? { ...doc, content }
          : doc
      )
    );
  };

  const handleCreateDocument = () => {
    setShowCreateModal(true);
  };
  const handleCreateDocumentConfirm = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: newDocData.title || 'Untitled Document',
      content: '',
      type: newDocData.type,
      language: newDocData.type === 'code' as any ? newDocData.language : undefined
    };
    setDocuments(docs => [...docs, newDoc]);
    setActiveDocument(newDoc.id);
    setShowCreateModal(false);
    setNewDocData({ title: '', type: 'text', language: 'javascript' });
  };

  const getLanguageOptions = () => [
    { value: 'javascript', text: 'JavaScript' },
    { value: 'typescript', text: 'TypeScript' },
    { value: 'python', text: 'Python' },
    { value: 'java', text: 'Java' },
    { value: 'cpp', text: 'C++' },
    { value: 'csharp', text: 'C#' },
    { value: 'php', text: 'PHP' },
    { value: 'ruby', text: 'Ruby' },
    { value: 'go', text: 'Go' },
    { value: 'rust', text: 'Rust' }
  ];

  const currentDoc = getCurrentDocument();

  if (showCreateModal) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <h2>Create New Document</h2>
        <Stack gap={6}>
          <h3>Select Document Type</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { type: 'text', label: 'Plain Text', desc: 'Simple text document' },
              { type: 'markdown', label: 'Markdown', desc: 'Rich text with formatting' },
              { type: 'json', label: 'JSON', desc: 'Structured data format' },
              { type: 'code', label: 'Code', desc: 'Source code with syntax highlighting' }
            ].map(option => (
              <Button
                key={option.type}
                kind={newDocData.type === option.type ? 'primary' : 'secondary'}
                onClick={() => setNewDocData(prev => ({ ...prev, type: option.type as any }))}
                style={{ height: 80, flexDirection: 'column', justifyContent: 'center' }}
              >
                <div style={{ fontWeight: 'bold' }}>{option.label}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{option.desc}</div>
              </Button>
            ))}
          </div>
          
          <h3>Document Details</h3>
          <TextInput
            id="title"
            labelText="Document Title"
            value={newDocData.title}
            onChange={(e) => setNewDocData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter document title"
          />
          {newDocData.type === 'code' as any && (
            <Select
              id="language"
              labelText="Programming Language"
              value={newDocData.language}
              onChange={(e) => setNewDocData(prev => ({ ...prev, language: e.target.value }))}
            >
              {getLanguageOptions().map(option => (
                <SelectItem key={option.value} value={option.value} text={option.text} />
              ))}
            </Select>
          )}
          
          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <Button kind="primary" onClick={handleCreateDocumentConfirm}>
              Create Document
            </Button>
            <Button kind="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
          </div>
        </Stack>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 16, borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2>Textpad</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button kind="primary" renderIcon={Add} onClick={handleCreateDocument}>
              New Document
            </Button>
            <Button kind="secondary" renderIcon={Save} onClick={handleSave}>
              Save
            </Button>
            <Button kind="secondary" renderIcon={Download} onClick={handleDownload}>
              Download
            </Button>
            <Button kind="secondary" renderIcon={Copy} onClick={handleCopy}>
              Copy
            </Button>
            <Button kind="danger" renderIcon={TrashCan} onClick={handleDelete} disabled={documents.length <= 1}>
              Delete
            </Button>
          </div>
        </div>

        <Tabs selectedIndex={activeTab} onChange={({ selectedIndex }) => setActiveTab(selectedIndex)}>
          <TabList aria-label="Document tabs">
            {documents.map(doc => (
              <Tab key={doc.id} onClick={() => setActiveDocument(doc.id)}>
                {doc.title}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {documents.map(doc => (
              <TabPanel key={doc.id}>
                <div style={{ padding: 16 }}>
                  <TextInput
                    id="doc-title"
                    labelText="Document Title"
                    value={doc.title}
                    onChange={(e) => setDocuments(docs =>
                      docs.map(d => d.id === doc.id ? { ...d, title: e.target.value } : d)
                    )}
                    style={{ marginBottom: 16 }}
                  />
                  <TextArea
                    id="content"
                    labelText="Content"
                    value={doc.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    rows={20}
                    placeholder={`Start typing your ${doc.type} content...`}
                  />
                </div>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default Textpad; 