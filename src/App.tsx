import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuItem,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  SideNavLink,
  Content as CarbonContent,
  Layer,
  Button,
} from "@carbon/react";
import { Notification, UserAvatar, Switcher, Close, View } from "@carbon/icons-react";
import "@carbon/styles/css/styles.css";
import "./App.scss";
import { useState } from "react";
import HomePage from "./pages/HomePage.tsx";
import TextpadPage from "./pages/TextpadPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import MultiRenamePage from "./pages/MultiRenamePage.tsx";
import butlerLogo from "./assets/butler-logo.svg";
import EnvironmentBadge from "./components/EnvironmentBadge.tsx";
import LogViewer from "./components/LogViewer.tsx";

const pages = [
  { path: "/", name: "Home", element: <HomePage /> },
  { path: "/textpad", name: "Textpad", element: <TextpadPage /> },
  { path: "/multi-rename", name: "Multi Rename", element: <MultiRenamePage /> },
  { path: "/settings", name: "Settings", element: <SettingsPage /> },
];

function Layout({ children }: { children: React.ReactNode }) {
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [rightPanelType, setRightPanelType] = useState<'notifications' | 'logs'>('notifications');
  return (
    <>
      <Header aria-label="Butler App Header">
        <HeaderMenuButton
          aria-label="Open menu"
          onClick={() => {
            document.body.classList.toggle("side-nav-open");
          }}
        />
        <img src={butlerLogo} alt="Logo" style={{ height: 32, marginRight: 8 }} />
        <HeaderName prefix="Butler" href="/">
          App
        </HeaderName>
        <HeaderNavigation aria-label="Page navigation">
          <HeaderMenuItem as={Link} to="/">
            Home
          </HeaderMenuItem>
          <HeaderMenuItem as={Link} to="/textpad">
            Textpad
          </HeaderMenuItem>
          <HeaderMenuItem as={Link} to="/multi-rename">
            Multi Rename
          </HeaderMenuItem>
          <HeaderMenuItem as={Link} to="/settings">
            Settings
          </HeaderMenuItem>
          <HeaderMenu menuLinkName="More" aria-label="More options">
            <HeaderMenuItem href="#">Subitem 1</HeaderMenuItem>
            <HeaderMenuItem href="#">Subitem 2</HeaderMenuItem>
          </HeaderMenu>
        </HeaderNavigation>
        <HeaderGlobalBar>
          <EnvironmentBadge size="sm" />
          <HeaderGlobalAction 
            aria-label="View Logs" 
            onClick={() => {
              setRightPanelType('logs');
              setRightPanelOpen(true);
            }}
          >
            <View size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction 
            aria-label="Notifications" 
            onClick={() => {
              setRightPanelType('notifications');
              setRightPanelOpen(true);
            }}
          >
            <Notification size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="User" onClick={() => {}}>
            <UserAvatar size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="App Switcher" onClick={() => {}}>
            <Switcher size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      <SideNav isRail
        aria-label="Side navigation"
        expanded={document.body.classList.contains("side-nav-open")}
        onOverlayClick={() => document.body.classList.remove("side-nav-open")}
      >
        <SideNavItems>
          <SideNavLink as={Link} to="/">
            Home
          </SideNavLink>
          <SideNavLink as={Link} to="/textpad">
            Textpad
          </SideNavLink>
          <SideNavLink as={Link} to="/multi-rename">
            Multi Rename
          </SideNavLink>
          <SideNavLink as={Link} to="/settings">
            Settings
          </SideNavLink>
        </SideNavItems>
      </SideNav>
      <CarbonContent className="main-content">
        {children}
      </CarbonContent>
      {rightPanelOpen && rightPanelType === 'logs' && (
        <LogViewer 
          isOpen={rightPanelOpen} 
          onClose={() => setRightPanelOpen(false)} 
        />
      )}
      
      {rightPanelOpen && rightPanelType === 'notifications' && (
        <Layer>
          <div className="right-panel-overlay" onClick={() => setRightPanelOpen(false)} />
          <div className="right-panel">
            <Button
              kind="ghost"
              hasIconOnly
              iconDescription="Close right panel"
              onClick={() => setRightPanelOpen(false)}
              style={{ position: "absolute", top: 16, right: 16 }}
              size="lg"
              renderIcon={Close}
            />
            <div style={{ padding: "3rem 2rem 2rem 2rem" }}>
              <h3>Notifications</h3>
              <p>This is your right panel. You can put notifications or any other content here.</p>
            </div>
          </div>
        </Layer>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          {pages.map((page) => (
            <Route key={page.path} path={page.path} element={page.element} />
          ))}
        </Routes>
      </Layout>
    </Router>
  );
}
