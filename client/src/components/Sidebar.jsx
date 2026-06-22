import { useState } from "react";
import {
  BrainCircuit,
  Building2,
  Camera,
  ClipboardList,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MapPin,
  Menu,
  Route,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

const SIDEBAR_STORAGE_KEY =
  "roadrakshak-sidebar-collapsed";

function Sidebar({
  activePage,
  setActivePage,
  user,
}) {
  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false);

  const [isCollapsed, setIsCollapsed] =
    useState(() => {
      return (
        localStorage.getItem(
          SIDEBAR_STORAGE_KEY
        ) === "true"
      );
    });

  const canAccessAdmin = [
    "moderator",
    "authority",
    "admin",
  ].includes(user?.role);

  const isAdministrator =
    user?.role === "admin";

  const toggleSidebar = () => {
    if (
      window.matchMedia(
        "(max-width: 760px)"
      ).matches
    ) {
      setIsMobileMenuOpen(
        (current) => !current
      );

      return;
    }

    setIsCollapsed((current) => {
      const nextValue = !current;

      localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        String(nextValue)
      );

      return nextValue;
    });
  };

  const openPage = (page) => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
  };

  const navigation = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Route,
      visible: true,
    },
    {
      id: "new-report",
      label: "New Report",
      icon: Camera,
      visible: true,
    },
    {
      id: "my-reports",
      label: "My Reports",
      icon: FolderKanban,
      visible: Boolean(user),
    },
    {
      id: "ai-detection",
      label: "AI Detection",
      icon: BrainCircuit,
      visible: true,
    },
    {
      id: "issue-map",
      label: "Issue Map",
      icon: MapPin,
      visible: true,
    },
    {
      id: "complaints",
      label: "Complaints",
      icon: FileText,
      visible: true,
    },
    {
      id: "authorities",
      label: "Authorities",
      icon: Building2,
      visible: true,
    },
    {
      id: "status",
      label: "Status",
      icon: ClipboardList,
      visible: true,
    },
    {
      id: "admin",
      label: "Report Admin",
      icon: LayoutDashboard,
      visible: canAccessAdmin,
    },
    {
      id: "authority-admin",
      label: "Authority Admin",
      icon: Settings,
      visible: isAdministrator,
    },
    {
      id: "profile",
      label: "Profile",
      icon: UserRound,
      visible: true,
    },
  ];

  return (
    <>
      <aside
        className={`sidebar ${
          isCollapsed
            ? "sidebarCollapsed"
            : ""
        } ${
          isMobileMenuOpen
            ? "sidebarMobileOpen"
            : ""
        }`}
      >
        <div className="sidebarHeader">
          <div className="brand">
            <div className="brandIcon">
              <ShieldCheck size={23} />
            </div>

            <div className="brandText">
              <h1>RoadRakshak</h1>
              <p>
                India road issue intelligence
              </p>
            </div>
          </div>

          <button
            className="sidebarToggleButton"
            type="button"
            onClick={toggleSidebar}
            aria-label={
              isMobileMenuOpen ||
              !isCollapsed
                ? "Close navigation"
                : "Open navigation"
            }
            title={
              isCollapsed
                ? "Open navigation"
                : "Close navigation"
            }
          >
            {isMobileMenuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>

        <nav className="nav">
          {navigation
            .filter(
              (item) => item.visible
            )
            .map((item) => {
              const Icon = item.icon;

              return (
                <button
                  className={`navItem ${
                    activePage === item.id
                      ? "active"
                      : ""
                  }`}
                  type="button"
                  key={item.id}
                  onClick={() =>
                    openPage(item.id)
                  }
                  title={
                    isCollapsed
                      ? item.label
                      : undefined
                  }
                  aria-label={item.label}
                >
                  <Icon size={19} />

                  <span className="navLabel">
                    {item.label}
                  </span>
                </button>
              );
            })}
        </nav>

        {user && (
          <div className="sidebarAccount">
            <UserRound size={18} />

            <div className="sidebarAccountText">
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
          </div>
        )}
      </aside>

      {isMobileMenuOpen && (
        <button
          className="sidebarBackdrop"
          type="button"
          onClick={() =>
            setIsMobileMenuOpen(false)
          }
          aria-label="Close navigation"
        />
      )}

      <button
        className="mobileFloatingMenu"
        type="button"
        onClick={toggleSidebar}
        aria-label="Open navigation"
        title="Open navigation"
      >
        <Menu size={22} />
      </button>
    </>
  );
}

export default Sidebar;