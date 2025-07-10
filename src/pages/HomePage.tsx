import React, { useState } from "react";
import {
  Grid,
  Column,
  Button,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  Checkbox,
  Toggle,
  NumberInput,
  Slider,
  DatePicker,
  DatePickerInput,
  TimePicker,
  TimePickerSelect,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Accordion,
  AccordionItem,
  Tile,
  Tag,
  SkeletonText,
  SkeletonPlaceholder,
  InlineLoading,
  InlineNotification,
  ToastNotification,
  ActionableNotification,
  Modal,
  Form,
  FormGroup,
  RadioButtonGroup,
  RadioButton,
  Search,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  Pagination,
  ProgressBar,
  ProgressStep,
  ProgressIndicator,
  Loading,
  SkeletonPlaceholder as SkeletonPlaceholderComponent,
} from "@carbon/react";
import {
  Add,
  Home,
  Calendar,
  Time,
  Phone,
  Email,
  ArrowRight,
} from "@carbon/icons-react";
import DatabaseTest from '../components/DatabaseTest';
import LoggerTest from '../components/LoggerTest';
import TauriTest from '../components/TauriTest';

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    email: "",
    number: 0,
    date: "",
    time: "",
    slider: 50,
    checkbox: false,
    toggle: false,
    radio: "option1",
    select: "option1",
    search: "",
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Carbon Design System Showcase</h1>
      <p>Explore the various components available in the Carbon Design System.</p>

      <Tabs selectedIndex={selectedTab} onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}>
        <TabList aria-label="Carbon Components">
          <Tab>Tauri Test</Tab>
          <Tab>Database Test</Tab>
          <Tab>Logger Test</Tab>
          <Tab>Basic Components</Tab>
          <Tab>Form Components</Tab>
          <Tab>Layout Components</Tab>
          <Tab>Feedback Components</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid fullWidth>
              <Column lg={8} md={4} sm={4}>
                <TauriTest />
              </Column>
              <Column lg={4} md={4} sm={4}>
                <Tile>
                  <h3>Tauri Integration</h3>
                  <p>This tab tests the Tauri integration and connectivity.</p>
                  <p>It checks if Tauri is available, database service is working, and log service is functional.</p>
                  <p>Use this to diagnose connection issues between frontend and backend.</p>
                </Tile>
              </Column>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid fullWidth>
              <Column lg={8} md={4} sm={4}>
                <DatabaseTest />
              </Column>
              <Column lg={4} md={4} sm={4}>
                <Tile>
                  <h3>SQLite Integration</h3>
                  <p>This tab tests the SQLite database integration with the settings system.</p>
                  <p>Click the test buttons to verify that settings are being saved to and loaded from the database.</p>
                </Tile>
              </Column>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid fullWidth>
              <Column lg={8} md={4} sm={4}>
                <LoggerTest />
              </Column>
              <Column lg={4} md={4} sm={4}>
                <Tile>
                  <h3>Logging System</h3>
                  <p>This tab tests the comprehensive logging system integration.</p>
                  <p>Click the test buttons to verify that logging is working correctly across all levels and types.</p>
                  <p>Check the browser console and backend logs for output.</p>
                </Tile>
              </Column>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid fullWidth>
              <Column lg={8} md={4} sm={4}>
                <h2>Basic Components</h2>
                
                <Tile style={{ marginBottom: "2rem" }}>
                  <h3>Buttons</h3>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <Button>Primary Button</Button>
                    <Button kind="secondary">Secondary Button</Button>
                    <Button kind="tertiary">Tertiary Button</Button>
                    <Button kind="ghost">Ghost Button</Button>
                    <Button kind="danger">Danger Button</Button>
                    <Button renderIcon={Add}>Button with Icon</Button>
                  </div>
                </Tile>

                <Tile style={{ marginBottom: "2rem" }}>
                  <h3>Tags</h3>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <Tag type="red">Red Tag</Tag>
                    <Tag type="magenta">Magenta Tag</Tag>
                    <Tag type="purple">Purple Tag</Tag>
                    <Tag type="blue">Blue Tag</Tag>
                    <Tag type="cyan">Cyan Tag</Tag>
                    <Tag type="teal">Teal Tag</Tag>
                    <Tag type="green">Green Tag</Tag>
                    <Tag type="gray">Gray Tag</Tag>
                    <Tag type="cool-gray">Cool Gray Tag</Tag>
                    <Tag type="warm-gray">Warm Gray Tag</Tag>
                  </div>
                </Tile>

                <Tile style={{ marginBottom: "2rem" }}>
                  <h3>Links</h3>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <Link href="#">Regular Link</Link>
                    <Link href="#" renderIcon={ArrowRight}>Link with Icon</Link>
                  </div>
                </Tile>
              </Column>

              <Column lg={4} md={4} sm={4}>
                <Tile>
                  <h3>Icons</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                    <div style={{ textAlign: "center" }}>
                      <Home size={24} />
                      <p>Home</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <Calendar size={24} />
                      <p>Calendar</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <Time size={24} />
                      <p>Time</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <Phone size={24} />
                      <p>Phone</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <Email size={24} />
                      <p>Email</p>
                    </div>
                  </div>
                </Tile>
              </Column>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid fullWidth>
              <Column lg={8} md={4} sm={4}>
                <h2>Form Components</h2>
                
                <Form>
                  <Tile style={{ marginBottom: "2rem" }}>
                    <h3>Text Inputs</h3>
                    <FormGroup legendText="Text Inputs">
                      <TextInput
                        id="text-input"
                        labelText="Text Input"
                        placeholder="Enter text..."
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      />
                      <TextInput
                        id="email-input"
                        labelText="Email Input"
                        type="email"
                        placeholder="Enter email..."
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      <NumberInput
                        id="number-input"
                        label="Number Input"
                        value={formData.number}
                        onChange={(e) => {
                          const target = e.target as HTMLInputElement;
                          setFormData({ ...formData, number: Number(target.value) });
                        }}
                      />
                    </FormGroup>
                  </Tile>

                  <Tile style={{ marginBottom: "2rem" }}>
                    <h3>Date and Time</h3>
                    <FormGroup legendText="Date and Time">
                      <DatePicker dateFormat="m/d/Y" datePickerType="single">
                        <DatePickerInput
                          id="date-picker"
                          placeholder="mm/dd/yyyy"
                          labelText="Date Picker"
                        />
                      </DatePicker>
                      <TimePicker id="time-picker" labelText="Time Picker">
                        <TimePickerSelect
                          id="time-picker-select-1"
                          aria-label="Hours"
                        >
                          <SelectItem value="00" text="00" />
                          <SelectItem value="01" text="01" />
                          <SelectItem value="02" text="02" />
                        </TimePickerSelect>
                        <TimePickerSelect
                          id="time-picker-select-2"
                          aria-label="Minutes"
                        >
                          <SelectItem value="00" text="00" />
                          <SelectItem value="01" text="01" />
                          <SelectItem value="02" text="02" />
                        </TimePickerSelect>
                      </TimePicker>
                    </FormGroup>
                  </Tile>

                  <Tile style={{ marginBottom: "2rem" }}>
                    <h3>Controls</h3>
                    <FormGroup legendText="Controls">
                      <Slider
                        id="slider"
                        labelText="Slider"
                        value={formData.slider}
                        min={0}
                        max={100}
                        step={1}
                        onChange={({ value }) => setFormData({ ...formData, slider: value })}
                      />
                      <Checkbox
                        id="checkbox"
                        labelText="Checkbox"
                        checked={formData.checkbox}
                        onChange={(_, { checked }) => setFormData({ ...formData, checkbox: checked })}
                      />
                      <Toggle
                        id="toggle"
                        labelText="Toggle"
                        labelA="Off"
                        labelB="On"
                        toggled={formData.toggle}
                        onChange={() => setFormData({ ...formData, toggle: !formData.toggle })}
                      />
                      <RadioButtonGroup
                        name="radio-group"
                        legendText="Radio Button Group"
                        valueSelected={formData.radio}
                        onChange={(value) => setFormData({ ...formData, radio: value as string })}
                      >
                        <RadioButton value="option1" labelText="Option 1" />
                        <RadioButton value="option2" labelText="Option 2" />
                        <RadioButton value="option3" labelText="Option 3" />
                      </RadioButtonGroup>
                    </FormGroup>
                  </Tile>
                </Form>
              </Column>

              <Column lg={4} md={4} sm={4}>
                <Tile>
                  <h3>Search</h3>
                  <Search
                    id="search"
                    labelText="Search"
                    placeholder="Search..."
                    value={formData.search}
                    onChange={(e) => setFormData({ ...formData, search: e.target.value })}
                  />
                </Tile>

                <Tile style={{ marginTop: "2rem" }}>
                  <h3>Dropdown</h3>
                  <Select
                    id="select"
                    labelText="Select"
                    value={formData.select}
                    onChange={(e) => setFormData({ ...formData, select: e.target.value })}
                  >
                    <SelectItem value="option1" text="Option 1" />
                    <SelectItem value="option2" text="Option 2" />
                    <SelectItem value="option3" text="Option 3" />
                  </Select>
                </Tile>
              </Column>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid fullWidth>
              <Column lg={8} md={4} sm={4}>
                <h2>Layout Components</h2>
                
                <Tile style={{ marginBottom: "2rem" }}>
                  <h3>Accordion</h3>
                  <Accordion>
                    <AccordionItem title="Accordion Item 1">
                      <p>This is the content of accordion item 1.</p>
                    </AccordionItem>
                    <AccordionItem title="Accordion Item 2">
                      <p>This is the content of accordion item 2.</p>
                    </AccordionItem>
                    <AccordionItem title="Accordion Item 3">
                      <p>This is the content of accordion item 3.</p>
                    </AccordionItem>
                  </Accordion>
                </Tile>

                <Tile style={{ marginBottom: "2rem" }}>
                  <h3>Progress Indicators</h3>
                  <div style={{ marginBottom: "1rem" }}>
                    <ProgressBar value={75} label="Progress" />
                  </div>
                  <ProgressIndicator currentIndex={2}>
                    <ProgressStep label="Step 1" />
                    <ProgressStep label="Step 2" />
                    <ProgressStep label="Step 3" />
                  </ProgressIndicator>
                </Tile>
              </Column>

              <Column lg={4} md={4} sm={4}>
                <Tile>
                  <h3>Skeleton Components</h3>
                  <SkeletonText paragraph lineCount={3} />
                  <SkeletonPlaceholderComponent />
                </Tile>
              </Column>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid fullWidth>
              <Column lg={8} md={4} sm={4}>
                <h2>Feedback Components</h2>
                
                <Tile style={{ marginBottom: "2rem" }}>
                  <h3>Notifications</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <InlineNotification
                      kind="info"
                      title="Information"
                      subtitle="This is an information notification."
                    />
                    <InlineNotification
                      kind="success"
                      title="Success"
                      subtitle="This is a success notification."
                    />
                    <InlineNotification
                      kind="warning"
                      title="Warning"
                      subtitle="This is a warning notification."
                    />
                    <InlineNotification
                      kind="error"
                      title="Error"
                      subtitle="This is an error notification."
                    />
                  </div>
                </Tile>

                <Tile style={{ marginBottom: "2rem" }}>
                  <h3>Loading States</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <InlineLoading description="Loading..." />
                    <Loading description="Loading..." />
                  </div>
                </Tile>
              </Column>

              <Column lg={4} md={4} sm={4}>
                <Tile>
                  <h3>Modal</h3>
                  <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
                  {modalOpen && (
                    <Modal
                      open={modalOpen}
                      onRequestClose={() => setModalOpen(false)}
                      modalHeading="Modal Title"
                      primaryButtonText="Primary Button"
                      secondaryButtonText="Secondary Button"
                    >
                      <p>This is the modal content.</p>
                    </Modal>
                  )}
                </Tile>
              </Column>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
} 