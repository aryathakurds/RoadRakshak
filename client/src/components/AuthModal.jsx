import { useEffect, useState } from "react";
import { LogIn, UserPlus, X } from "lucide-react";

function AuthModal({
  isOpen,
  initialMode,
  closeModal,
  signup,
  login,
  showNotification,
}) {
  const [mode, setMode] = useState(initialMode || "login");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || "login");
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      showNotification("Email and password are required.");
      return;
    }

    if (mode === "signup" && !form.name.trim()) {
      showNotification("Name is required.");
      return;
    }

    if (form.password.length < 8) {
      showNotification("Password must contain at least 8 characters.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (mode === "signup") {
        await signup({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });

        showNotification("Your account was created.");
      } else {
        await login({
          email: form.email.trim(),
          password: form.password,
        });

        showNotification("Login successful.");
      }

      setForm({
        name: "",
        email: "",
        password: "",
      });

      closeModal();
    } catch (error) {
      showNotification(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="authModalOverlay" onMouseDown={closeModal}>
      <section
        className="authModal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="authModalHeader">
          <div>
            <p className="eyebrow">RoadRakshak account</p>
            <h2>
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h2>
            <p>
              {mode === "signup"
                ? "Create an account to submit and track road reports."
                : "Sign in to continue managing your reports."}
            </p>
          </div>

          <button
            className="iconButton"
            type="button"
            onClick={closeModal}
            aria-label="Close authentication"
          >
            <X size={19} />
          </button>
        </header>

        <div className="authModeControl">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Sign in
          </button>

          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Create account
          </button>
        </div>

        <form className="authModalForm" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="fieldGroup">
              <label htmlFor="modal-name">Full name</label>
              <input
                id="modal-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Your full name"
              />
            </div>
          )}

          <div className="fieldGroup">
            <label htmlFor="modal-email">Email address</label>
            <input
              id="modal-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="fieldGroup">
            <label htmlFor="modal-password">Password</label>
            <input
              id="modal-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              placeholder="Minimum 8 characters"
            />
          </div>

          <button
            className="primaryButton authSubmitButton"
            type="submit"
            disabled={isSubmitting}
          >
            {mode === "signup" ? (
              <UserPlus size={18} />
            ) : (
              <LogIn size={18} />
            )}

            {isSubmitting
              ? "Please wait..."
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AuthModal;