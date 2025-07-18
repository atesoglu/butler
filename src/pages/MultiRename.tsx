import React, { useState, useCallback } from 'react';
import { 
  Button, 
  TextInput, 
  Toggle, 
  Select, 
  SelectItem, 
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  TableBatchActions,
  TableBatchAction,
  InlineNotification,
  Stack,
  Tile,
  ProgressBar,
  Tag,
  Grid,
  Column
} from '@carbon/react';
import { 
  Upload, 
  Download, 
  TrashCan, 
  Edit, 
  Review, 
  Checkmark,
  Warning,
  Information
} from '@carbon/icons-react';

interface FileItem {
  id: string;
  originalName: string;
  newName: string;
  path: string;
  size: number;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

const MultiRename: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [renamePattern, setRenamePattern] = useState('{name}_{counter}');
  const [startCounter, setStartCounter] = useState(1);
  const [preserveExtension, setPreserveExtension] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [notification, setNotification] = useState<{
    kind: 'success' | 'error' | 'warning' | 'info';
    title: string;
    subtitle: string;
  } | null>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    const newFiles: FileItem[] = uploadedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      originalName: file.name,
      newName: generateNewName(file.name, index),
      path: file.webkitRelativePath || file.name,
      size: file.size,
      type: file.type || 'unknown',
      status: 'pending'
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    setNotification({
      kind: 'success',
      title: 'Files uploaded successfully',
      subtitle: `${uploadedFiles.length} files added to the queue`
    });
    
    if (window.electronAPI) {
      window.electronAPI.invoke('log-message', `Files uploaded: ${uploadedFiles.length} files`);
    }
  }, []);

  const generateNewName = (originalName: string, index: number): string => {
    const extension = preserveExtension ? originalName.split('.').pop() : '';
    const nameWithoutExt = preserveExtension ? originalName.replace(/\.[^/.]+$/, '') : originalName;
    
    let newName = renamePattern
      .replace('{name}', nameWithoutExt)
      .replace('{counter}', String(startCounter + index))
      .replace('{date}', new Date().toISOString().split('T')[0])
      .replace('{time}', new Date().toTimeString().split(' ')[0]);
    
    if (preserveExtension && extension) {
      newName += `.${extension}`;
    }
    
    return caseSensitive ? newName : newName.toLowerCase();
  };

  const handlePreview = () => {
    setFiles(prev => prev.map((file, index) => ({
      ...file,
      newName: generateNewName(file.originalName, index)
    })));
    setPreviewMode(true);
  };

  const handleApplyRename = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    const totalFiles = files.length;
    let completed = 0;
    let errors = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'completed' }
            : f
        ));
        
        completed++;
        setProgress((completed / totalFiles) * 100);
        
        if (window.electronAPI) {
          await window.electronAPI.invoke('log-message', `Renamed: ${file.originalName} → ${file.newName}`);
        }
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
            : f
        ));
        errors++;
      }
    }
    
    setIsProcessing(false);
    setNotification({
      kind: errors > 0 ? 'warning' : 'success',
      title: errors > 0 ? 'Rename completed with errors' : 'Rename completed successfully',
      subtitle: `Processed ${completed} files${errors > 0 ? `, ${errors} errors` : ''}`
    });
  };

  const handleDeleteFiles = () => {
    setFiles(prev => prev.filter(f => !selectedRows.includes(f.id)));
    setSelectedRows([]);
    setNotification({
      kind: 'info',
      title: 'Files removed',
      subtitle: `${selectedRows.length} files removed from the queue`
    });
  };

  const handleClearAll = () => {
    setFiles([]);
    setSelectedRows([]);
    setProgress(0);
    setNotification({
      kind: 'info',
      title: 'Queue cleared',
      subtitle: 'All files have been removed from the queue'
    });
  };

  const filteredFiles = files.filter(file => 
    file.originalName.toLowerCase().includes(filter.toLowerCase()) ||
    file.newName.toLowerCase().includes(filter.toLowerCase())
  );

  const headers = [
    { key: 'select', header: '' },
    { key: 'originalName', header: 'Original Name' },
    { key: 'newName', header: 'New Name' },
    { key: 'size', header: 'Size' },
    { key: 'type', header: 'Type' },
    { key: 'status', header: 'Status' }
  ];

  const getStatusIcon = (status: FileItem['status']) => {
    switch (status) {
      case 'completed': return <Checkmark size={16} style={{ color: 'var(--cds-support-success)' }} />;
      case 'error': return <Warning size={16} style={{ color: 'var(--cds-support-error)' }} />;
      case 'processing': return <Information size={16} style={{ color: 'var(--cds-support-info)' }} />;
      default: return null;
    }
  };

  const getStatusTag = (status: FileItem['status']) => {
    const kind = status === 'completed' ? 'green' : 
                 status === 'error' ? 'red' : 
                 status === 'processing' ? 'blue' : 'gray';
    return <Tag type={kind}>{status}</Tag>;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {notification && (
        <InlineNotification
          kind={notification.kind}
          title={notification.title}
          subtitle={notification.subtitle}
          lowContrast
          style={{ marginBottom: 16 }}
          onClose={() => setNotification(null)}
        />
      )}

      <Grid condensed>
        <Column sm={4} md={4} lg={6}>
          <Tile>
            <Stack gap={6}>
              <h3>Rename Settings</h3>
              
              <TextInput
                id="pattern"
                labelText="Rename Pattern"
                value={renamePattern}
                onChange={(e) => setRenamePattern(e.target.value)}
                helperText="Use {name}, {counter}, {date}, {time} as placeholders"
              />
              
              <TextInput
                id="startCounter"
                labelText="Start Counter"
                type="number"
                value={startCounter}
                onChange={(e) => setStartCounter(parseInt(e.target.value) || 1)}
                min={1}
              />
              
              <Toggle
                id="preserveExtension"
                labelText="Preserve File Extension"
                labelA="Off"
                labelB="On"
                toggled={preserveExtension}
                onChange={(e) => setPreserveExtension((e.target as HTMLInputElement).checked)}
              />
              
              <Toggle
                id="caseSensitive"
                labelText="Case Sensitive"
                labelA="Off"
                labelB="On"
                toggled={caseSensitive}
                onChange={(e) => setCaseSensitive((e.target as HTMLInputElement).checked)}
              />
              
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  kind="primary"
                  renderIcon={Review}
                  onClick={handlePreview}
                  disabled={files.length === 0}
                >
                  Preview
                </Button>
                <Button
                  kind="secondary"
                  renderIcon={Edit}
                  onClick={handleApplyRename}
                  disabled={files.length === 0 || isProcessing}
                >
                  Apply Rename
                </Button>
              </div>
            </Stack>
          </Tile>
        </Column>
        
        <Column sm={4} md={4} lg={10}>
          <Tile>
            <Stack gap={6}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Files ({files.length})</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    kind="secondary"
                    renderIcon={Upload}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Add Files
                  </Button>
                  <Button
                    kind="tertiary"
                    renderIcon={TrashCan}
                    onClick={handleClearAll}
                    disabled={files.length === 0}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              
              <input
                id="file-upload"
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              
              {isProcessing && (
                <div>
                  <ProgressBar value={progress} label="Processing progress" />
                  <p style={{ marginTop: 8, fontSize: 14 }}>
                    Processing... {Math.round(progress)}% complete
                  </p>
                </div>
              )}
              
              {files.length > 0 && (
                <DataTable
                  rows={filteredFiles}
                  headers={headers}
                  isSortable
                  useZebraStyles
                >
                  {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getSelectionProps, getBatchActionProps, onInputChange }) => (
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          <TableHeader />
                          {headers.map(header => (
                            <TableHeader {...getHeaderProps({ header })}>
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map(row => (
                          <TableRow {...getRowProps({ row })}>
                            <TableCell>
                              <input type="checkbox" {...getSelectionProps({ row })} />
                            </TableCell>
                            <TableCell>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {getStatusIcon(row.cells.find(cell => cell.id.includes('status'))?.value as FileItem['status'])}
                                {row.cells.find(cell => cell.id.includes('originalName'))?.value}
                              </div>
                            </TableCell>
                            <TableCell>
                              {row.cells.find(cell => cell.id.includes('newName'))?.value}
                            </TableCell>
                            <TableCell>
                              {formatFileSize(row.cells.find(cell => cell.id.includes('size'))?.value as number)}
                            </TableCell>
                            <TableCell>
                              {row.cells.find(cell => cell.id.includes('type'))?.value}
                            </TableCell>
                            <TableCell>
                              {getStatusTag(row.cells.find(cell => cell.id.includes('status'))?.value as FileItem['status'])}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </DataTable>
              )}
              
              {files.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: 48, 
                  color: 'var(--cds-text-secondary)',
                  border: '2px dashed var(--cds-ui-03)',
                  borderRadius: 8
                }}>
                  <Upload size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                  <p>No files selected</p>
                  <p>Click "Add Files" to get started</p>
                </div>
              )}
            </Stack>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
};

export default MultiRename; 