import { ArrowLeft, ShieldAlert } from "lucide-react";

function Unauthorized({
  title = "Access restricted",
  message = "Your account does not have permission to open this section.",
  setActivePage,
}) {
  return (
    <section className="unauthorizedPage">
      <div className="unauthorizedPanel">
        <div className="unauthorizedIcon">
          <ShieldAlert size={28} />
        </div>

        <p className="eyebrow">Permission required</p>
        <h2>{title}</h2>
        <p>{message}</p>

        <button
          className="primaryButton"
          type="button"
          onClick={() => setActivePage("dashboard")}
        >
          <ArrowLeft size={18} />
          Return to dashboard
        </button>
      </div>
    </section>
  );
}

export default Unauthorized;