import React, { useState, useEffect, useCallback } from 'react';
import {
  Select,
  SelectItem,
  Button,
  Tag,
  Pagination,
  Search,
  ContentSwitcher,
  Switch,
  Grid,
  Column,
  Layer,
  Tile,
  Loading,
  InlineLoading,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from '@carbon/react';
import { 
  TrashCan, 
  Download, 
  Information,
  Close,
  Renew,
} from '@carbon/icons-react';
import { logService, LogEntry, LogFilter } from '../services/logService';
import loggerService from '../services/loggerService';

interface LogViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogViewer: React.FC<LogViewerProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<LogFilter>({
    level: '',
    search: '',
    limit: 100
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [logCount, setLogCount] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'list'>('list');

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const recentLogs = await logService.getRecentLogs(filter.limit || 100);
      setLogs(recentLogs);
      
      const count = await logService.getLogCount();
      setLogCount(count);
      
      loggerService.info('Logs loaded successfully', {
        count: recentLogs.length,
        total: count
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load logs';
      setError(errorMsg);
      loggerService.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  }, [filter.limit]);

  const refreshLogs = useCallback(async () => {
    setRefreshing(true);
    await loadLogs();
    setRefreshing(false);
  }, [loadLogs]);

  const clearLogs = useCallback(async () => {
    try {
      await logService.clearLogs();
      setLogs([]);
      setFilteredLogs([]);
      setLogCount(0);
      loggerService.info('Logs cleared successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to clear logs';
      setError(errorMsg);
      loggerService.error('Failed to clear logs');
    }
  }, []);

  const applyFilters = useCallback(() => {
    const filtered = logService.filterLogs(logs, filter);
    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [logs, filter]);

  // Apply filters when logs or filter changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Load logs on mount
  useEffect(() => {
    if (isOpen) {
      loadLogs();
    }
  }, [isOpen, loadLogs]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && isOpen) {
      const interval = setInterval(() => {
        refreshLogs();
      }, 5000); // Refresh every 5 seconds
      setAutoRefreshInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      setAutoRefreshInterval(null);
    }
  }, [autoRefresh, isOpen, refreshLogs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
      }
    };
  }, [autoRefreshInterval]);

  const handleFilterChange = (key: keyof LogFilter, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchChange = (value: string) => {
    handleFilterChange('search', value);
  };

  const handleLevelChange = (value: string) => {
    handleFilterChange('level', value);
  };

  const handleLimitChange = (value: string) => {
    handleFilterChange('limit', parseInt(value) || 100);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value) || 50);
    setCurrentPage(1);
  };

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredLogs.length / pageSize);

  const getLogLevelTag = (level: string) => {
    return (
      <Tag type={level === 'ERROR' ? 'red' : level === 'WARN' ? 'warm-gray' : 'green'} size="sm">
        {level}
      </Tag>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const exportLogs = () => {
    const csvContent = [
      'Timestamp,Level,Message,Target,CorrelationId,UserId,File,Line',
      ...filteredLogs.map(log => 
        `"${log.timestamp}","${log.level}","${log.message.replace(/"/g, '""')}","${log.target}","${log.correlation_id || ''}","${log.user_id || ''}","${log.file || ''}","${log.line || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `butler-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <Layer level={1}>
      <div className="log-viewer" style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        width: '600px', 
        height: '100vh', 
        backgroundColor: 'var(--cds-ui-background)',
        borderLeft: '1px solid var(--cds-ui-03)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '1rem', 
          borderBottom: '1px solid var(--cds-ui-03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>Application Logs</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              kind="ghost"
              size="sm"
              iconDescription="Refresh"
              hasIconOnly
              onClick={refreshLogs}
              disabled={refreshing}
            >
              <Renew />
            </Button>
            <Button
              kind="ghost"
              size="sm"
              iconDescription="Clear logs"
              hasIconOnly
              onClick={clearLogs}
            >
              <TrashCan />
            </Button>
            <Button
              kind="ghost"
              size="sm"
              iconDescription="Export logs"
              hasIconOnly
              onClick={exportLogs}
            >
              <Download />
            </Button>
            <Button
              kind="ghost"
              size="sm"
              iconDescription="Close"
              hasIconOnly
              onClick={onClose}
            >
              <Close />
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--cds-ui-03)' }}>
          <Grid narrow>
            <Column lg={16} md={8} sm={4}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <Search
                  size="sm"
                  labelText="Search logs"
                  placeholder="Search logs..."
                  value={filter.search || ''}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  style={{ minWidth: '200px' }}
                />
                
                <Select
                  id="level-filter"
                  size="sm"
                  labelText="Log Level"
                  value={filter.level || ''}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  style={{ minWidth: '120px' }}
                >
                  <SelectItem value="" text="All Levels" />
                  <SelectItem value="ERROR" text="Error" />
                  <SelectItem value="WARN" text="Warning" />
                  <SelectItem value="INFO" text="Info" />
                  <SelectItem value="DEBUG" text="Debug" />
                  <SelectItem value="TRACE" text="Trace" />
                </Select>

                <Select
                  id="limit-filter"
                  size="sm"
                  labelText="Log Limit"
                  value={filter.limit?.toString() || '100'}
                  onChange={(e) => handleLimitChange(e.target.value)}
                  style={{ minWidth: '100px' }}
                >
                  <SelectItem value="50" text="50 logs" />
                  <SelectItem value="100" text="100 logs" />
                  <SelectItem value="200" text="200 logs" />
                  <SelectItem value="500" text="500 logs" />
                </Select>

                <ContentSwitcher 
                  size="sm" 
                  selectedIndex={viewMode === 'table' ? 0 : 1}
                  onChange={(e) => setViewMode(e.name as 'table' | 'list')}
                >
                  <Switch name="table" text="Table" />
                  <Switch name="list" text="List" />
                </ContentSwitcher>

                <Button
                  size="sm"
                  kind={autoRefresh ? 'primary' : 'secondary'}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                </Button>
              </div>
            </Column>
          </Grid>
        </div>

        {/* Status Bar */}
        <div style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: 'var(--cds-ui-01)',
          borderBottom: '1px solid var(--cds-ui-03)',
          fontSize: '0.875rem',
          color: 'var(--cds-text-secondary)'
        }}>
          {refreshing ? (
            <InlineLoading description="Refreshing logs..." />
          ) : (
            <span>
              Showing {filteredLogs.length} of {logCount} logs
              {filter.search && ` (filtered by "${filter.search}")`}
              {filter.level && ` (level: ${filter.level})`}
            </span>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: 'var(--cds-error-01)', 
            color: 'var(--cds-error-01)',
            borderBottom: '1px solid var(--cds-error-01)'
          }}>
            Error: {error}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <Loading description="Loading logs..." />
            </div>
          ) : filteredLogs.length === 0 ? (
            <Tile style={{ textAlign: 'center', padding: '2rem' }}>
              <Information size={32} />
              <p>No logs found</p>
              <Button size="sm" onClick={refreshLogs}>
                Refresh
              </Button>
            </Tile>
          ) : (
            <>
              <StructuredListWrapper>
                <StructuredListHead>
                  <StructuredListRow head>
                    <StructuredListCell head>Timestamp</StructuredListCell>
                    <StructuredListCell head>Level</StructuredListCell>
                    <StructuredListCell head>Message</StructuredListCell>
                  </StructuredListRow>
                </StructuredListHead>
                <StructuredListBody>
                  {paginatedLogs.map((log, index) => (
                    <StructuredListRow key={index}>
                      <StructuredListCell>
                        <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </StructuredListCell>
                      <StructuredListCell>
                        {getLogLevelTag(log.level)}
                      </StructuredListCell>
                      <StructuredListCell>
                        <div>
                          <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                            {log.message}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
                            {log.target}
                            {log.correlation_id && ` • CorrelationId: ${log.correlation_id}`}
                            {log.file && log.line && ` • ${log.file}:${log.line}`}
                          </div>
                        </div>
                      </StructuredListCell>
                    </StructuredListRow>
                  ))}
                </StructuredListBody>
              </StructuredListWrapper>

              {totalPages > 1 && (
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Select
                    id="page-size-select"
                    size="sm"
                    labelText="Page Size"
                    value={pageSize.toString()}
                    onChange={(e) => handlePageSizeChange(e.target.value)}
                    style={{ width: '120px' }}
                  >
                    <SelectItem value="25" text="25 per page" />
                    <SelectItem value="50" text="50 per page" />
                    <SelectItem value="100" text="100 per page" />
                  </Select>
                  
                  <Pagination
                    size="sm"
                    page={currentPage}
                    pageSize={pageSize}
                    pageSizes={[25, 50, 100]}
                    totalItems={filteredLogs.length}
                    onChange={({ page, pageSize }) => {
                      setCurrentPage(page);
                      setPageSize(pageSize);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layer>
  );
};

export default LogViewer; 