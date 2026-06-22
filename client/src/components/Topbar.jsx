import {
  Bell,
  Search,
  UserRound,
} from "lucide-react";

function Topbar({
  user,
  openAuthModal,
  setActivePage,
}) {
  const getInitials = () => {
    if (!user?.name) {
      return "";
    }

    return user.name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="minimalTopbar">
      <div className="minimalTopbarSpacer" />

      <nav className="minimalTopbarActions">
        <button
          className="topbarSearchText"
          type="button"
          title="Search"
        >
          <Search size={18} />
          <span>Search</span>
        </button>

        <button
          className="topbarNotification"
          type="button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={19} />
        </button>

        {user ? (
          <button
            className="topbarProfileCircle"
            type="button"
            onClick={() =>
              setActivePage("profile")
            }
            aria-label={`Open ${user.name} profile`}
            title={user.name}
          >
            {getInitials() || (
              <UserRound size={20} />
            )}
          </button>
        ) : (
          <button
            className="topbarLoginText"
            type="button"
            onClick={() =>
              openAuthModal("login")
            }
          >
            <UserRound size={18} />
            Sign in
          </button>
        )}
      </nav>
    </header>
  );
}

export default Topbar;