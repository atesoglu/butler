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
  InlineLoading,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Modal,
  InlineNotification,
  Dropdown,
  DatePicker,
  DatePickerInput,
  Slider,
  SkeletonText,
  SkeletonPlaceholder,
  Loading,
  TableBatchActions,
  TableBatchAction,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  Pagination
} from '@carbon/react';
import {
  Add,
  CheckmarkFilled,
  WarningAlt,
  User,
  Settings,
  Search,
  Calendar,
  Download,
  Edit,
  TrashCan,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Star,
  StarFilled
} from '@carbon/icons-react';

const initialRows = [
  { id: 'a', name: 'Alice', role: 'Admin' },
  { id: 'b', name: 'Bob', role: 'User' },
  { id: 'c', name: 'Charlie', role: 'User' },
  { id: 'd', name: 'Diana', role: 'Admin' },
  { id: 'e', name: 'Eve', role: 'User' },
  { id: 'f', name: 'Frank', role: 'User' },
];
const headers = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
];

const Home: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(initialRows);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  // Filtering
  const filteredRows = rows.filter(row =>
    row.name.toLowerCase().includes(filter.toLowerCase()) ||
    row.role.toLowerCase().includes(filter.toLowerCase())
  );
  // Pagination
  const pagedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  // Batch actions
  const handleDelete = (selectedRows: string[]) => {
    setRows(rows.filter(row => !selectedRows.includes(row.id)));
  };
  const handleExport = (selectedRows: string[]) => {
    const exportData = rows.filter(row => selectedRows.includes(row.id));
    alert('Exported: ' + JSON.stringify(exportData));
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Welcome to Butler</h1>
      <p>This page showcases Carbon Design System components for future use.</p>
      <div style={{ margin: '2rem 0' }}>
        <Button renderIcon={Add}>Primary Button</Button>
        <Button kind="secondary" style={{ marginLeft: 8 }}>Secondary</Button>
        <Button kind="danger" renderIcon={WarningAlt} style={{ marginLeft: 8 }}>Danger</Button>
        <Button kind="ghost" renderIcon={Download} style={{ marginLeft: 8 }}>Ghost</Button>
        <Button kind="tertiary" renderIcon={Edit} style={{ marginLeft: 8 }}>Tertiary</Button>
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
        <Tag type="warm-gray" style={{ marginLeft: 8 }}>Neutral</Tag>
      </div>
      <div style={{ margin: '2rem 0' }}>
        <ProgressBar label="Progress" value={60} max={100} />
      </div>
      <div style={{ margin: '2rem 0' }}>
        <InlineLoading description="Loading animation" status="active" />
        <CheckmarkFilled style={{ marginLeft: 16, fill: 'green', verticalAlign: 'middle' }} />
      </div>
      <div style={{ margin: '2rem 0' }}>
        <Button onClick={() => setModalOpen(true)} renderIcon={Settings}>Open Modal</Button>
        <Modal open={modalOpen} onRequestClose={() => setModalOpen(false)} modalHeading="Sample Modal" primaryButtonText="OK" secondaryButtonText="Cancel" onRequestSubmit={() => setModalOpen(false)}>
          <p>This is a Carbon modal dialog.</p>
        </Modal>
      </div>
      <div style={{ margin: '2rem 0' }}>
        <InlineNotification title="Sample Notification" subtitle="This is a notification." kind="info" lowContrast />
      </div>
      <div style={{ margin: '2rem 0' }}>
        <Dropdown id="dropdown-example" label="Dropdown" titleText="Dropdown Example" items={["Option 1", "Option 2", "Option 3"]} />
      </div>
      <div style={{ margin: '2rem 0' }}>
        <DatePicker datePickerType="single">
          <DatePickerInput id="date-picker-input-id" placeholder="mm/dd/yyyy" labelText="Date Picker" />
        </DatePicker>
      </div>
      <div style={{ margin: '2rem 0' }}>
        <Slider min={0} max={100} value={50} labelText="Slider" step={1} />
      </div>
      <div style={{ margin: '2rem 0' }}>
        <SkeletonText width="30%" />
        <span style={{ display: 'inline-block', width: 100, height: 40, marginLeft: 16 }}><SkeletonPlaceholder /></span>
      </div>
      <div style={{ margin: '2rem 0' }}>
        <Button onClick={() => setLoading(true)} renderIcon={ArrowRight}>Show Loading</Button>
        {loading && <Loading description="Active loading indicator" withOverlay={false} style={{ marginLeft: 16 }} />}
      </div>
      <div style={{ margin: '2rem 0' }}>
        <DataTable
          rows={pagedRows}
          headers={headers}
          isSortable
          render={(
            {
              rows,
              headers,
              getHeaderProps,
              getRowProps,
              getSelectionProps,
              getBatchActionProps,
              selectedRows,
              getTableProps,
              getToolbarProps,
              onInputChange,
              getTableContainerProps,
            }
          ) => (
            <>
              <TableToolbar {...getToolbarProps()}>
                <TableBatchActions {...getBatchActionProps()}>
                  <TableBatchAction onClick={() => handleDelete(selectedRows.map(r => r.id))}>Delete</TableBatchAction>
                  <TableBatchAction onClick={() => handleExport(selectedRows.map(r => r.id))}>Export</TableBatchAction>
                </TableBatchActions>
                <TableToolbarContent>
                  <TableToolbarSearch
                    persistent
                    onChange={(e) => {
                      if (typeof e === 'string') {
                        setFilter(e);
                      } else {
                        setFilter(e.target.value);
                      }
                    }}
                    value={filter}
                  />
                  <TableToolbarMenu>
                    <button onClick={() => setPageSize(3)}>Show 3</button>
                    <button onClick={() => setPageSize(5)}>Show 5</button>
                    <button onClick={() => setPageSize(10)}>Show 10</button>
                  </TableToolbarMenu>
                </TableToolbarContent>
              </TableToolbar>
              <div style={{ minWidth: 300 }}>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      <TableHeader />
                      {headers.map(header => (
                        <TableHeader {...getHeaderProps({ header })} key={header.key}>{header.header}</TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        <TableCell>
                          <input type="checkbox" {...getSelectionProps({ row })} />
                        </TableCell>
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Pagination
                page={page}
                pageSize={pageSize}
                pageSizes={[3, 5, 10]}
                totalItems={filteredRows.length}
                onChange={({ page, pageSize }) => { setPage(page); setPageSize(pageSize); }}
              />
            </>
          )}
        />
      </div>
      <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <User style={{ marginRight: 16 }} />
        <Settings style={{ marginRight: 16 }} />
        <Search style={{ marginRight: 16 }} />
        <Calendar style={{ marginRight: 16 }} />
        <Download style={{ marginRight: 16 }} />
        <Edit style={{ marginRight: 16 }} />
        <TrashCan style={{ marginRight: 16 }} />
        <ArrowRight style={{ marginRight: 16 }} />
        <ArrowDown style={{ marginRight: 16 }} />
        <ArrowUp style={{ marginRight: 16 }} />
        <Star style={{ marginRight: 16 }} />
        <StarFilled style={{ marginRight: 16, fill: 'gold' }} />
      </div>
    </div>
  );
};

export default Home; 