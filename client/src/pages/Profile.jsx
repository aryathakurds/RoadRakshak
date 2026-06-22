import { useMemo, useState } from "react";
import {
  Activity,
  AtSign,
  BadgeCheck,
  Check,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  LockKeyhole,
  LogIn,
  LogOut,
  MapPin,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react";

const roleDetails = {
  citizen: {
    title: "Citizen account",
    description:
      "Submit road reports, track complaints and review your reporting history.",
  },

  authority: {
    title: "Authority account",
    description:
      "Review assigned reports and publish official complaint updates.",
  },

  moderator: {
    title: "Moderator account",
    description:
      "Review reports, manage their status and moderate platform activity.",
  },

  admin: {
    title: "Administrator account",
    description:
      "Manage reports, authorities and platform-level operations.",
  },
};

function Profile({
  user,
  authLoading,
  signup,
  login,
  logout,
  showNotification,
}) {
  const [mode, setMode] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const initials = useMemo(() => {
    if (!user?.name) return "RR";

    return user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [user]);

  const passwordChecks = {
    length: form.password.length >= 8,
    letter: /[A-Za-z]/.test(form.password),
    number: /\d/.test(form.password),
  };

  const role =
    roleDetails[user?.role] || roleDetails.citizen;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setShowPassword(false);

    setForm({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      showNotification(
        "Email and password are required."
      );
      return;
    }

    if (
      mode === "signup" &&
      !form.name.trim()
    ) {
      showNotification("Name is required.");
      return;
    }

    if (form.password.length < 8) {
      showNotification(
        "Password must contain at least 8 characters."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      if (mode === "signup") {
        await signup({
          name: form.name.trim(),
          email: form.email
            .trim()
            .toLowerCase(),
          password: form.password,
        });

        showNotification(
          "Your RoadRakshak account was created."
        );
      } else {
        await login({
          email: form.email
            .trim()
            .toLowerCase(),
          password: form.password,
        });

        showNotification("Login successful.");
      }

      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      showNotification(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    showNotification("You have signed out.");
  };

  if (authLoading) {
    return (
      <main className="accountPage">
        <style>{styles}</style>

        <section className="accountLoading">
          <span className="accountLoadingMark">
            <ShieldCheck size={25} />
          </span>

          <strong>
            Verifying your RoadRakshak account
          </strong>

          <p>
            Checking your secure session...
          </p>

          <div className="accountLoadingLine">
            <span />
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="accountPage">
        <style>{styles}</style>

        <section className="accountAccess">
          <div className="accountAccessStory">
            <div className="accountGridBackground" />

            <div className="accountSignal">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="accountAccessContent">
              <span className="accountEyebrow">
                Citizen identity
              </span>

              <h1>
                Your reports.
                <br />
                <span>Your progress.</span>
              </h1>

              <p>
                Sign in to create verified road
                reports, follow official complaint
                activity and keep your civic
                reporting history together.
              </p>

              <div className="accountAccessRoute">
                <div>
                  <FileText size={19} />
                  <span>
                    <strong>Create evidence</strong>
                    <small>
                      Submit structured road reports
                    </small>
                  </span>
                </div>

                <i />

                <div>
                  <MapPin size={19} />
                  <span>
                    <strong>Match authority</strong>
                    <small>
                      Connect reports to jurisdiction
                    </small>
                  </span>
                </div>

                <i />

                <div>
                  <Activity size={19} />
                  <span>
                    <strong>Track action</strong>
                    <small>
                      Follow complaint progress
                    </small>
                  </span>
                </div>
              </div>

              <div className="accountSecurityNote">
                <LockKeyhole size={17} />

                <span>
                  Passwords are securely hashed and
                  account requests require an
                  authenticated session.
                </span>
              </div>
            </div>
          </div>

          <section className="accountFormPanel">
            <header className="accountFormHeader">
              <span>
                {mode === "login"
                  ? "Welcome back"
                  : "Citizen registration"}
              </span>

              <h2>
                {mode === "login"
                  ? "Sign in to RoadRakshak"
                  : "Create your account"}
              </h2>

              <p>
                {mode === "login"
                  ? "Continue managing your reports and complaints."
                  : "Create one secure identity for your road reports."}
              </p>
            </header>

            <div className="accountModeControl">
              <button
                type="button"
                className={
                  mode === "login" ? "active" : ""
                }
                onClick={() =>
                  changeMode("login")
                }
              >
                Sign in
              </button>

              <button
                type="button"
                className={
                  mode === "signup" ? "active" : ""
                }
                onClick={() =>
                  changeMode("signup")
                }
              >
                Create account
              </button>
            </div>

            <form
              className="accountForm"
              onSubmit={handleSubmit}
            >
              {mode === "signup" && (
                <label className="accountField">
                  <span>Full name</span>

                  <div>
                    <UserRound size={18} />

                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      placeholder="Enter your full name"
                    />
                  </div>
                </label>
              )}

              <label className="accountField">
                <span>Email address</span>

                <div>
                  <AtSign size={18} />

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <label className="accountField">
                <span>Password</span>

                <div>
                  <KeyRound size={18} />

                  <input
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.password}
                    onChange={handleChange}
                    autoComplete={
                      mode === "signup"
                        ? "new-password"
                        : "current-password"
                    }
                    placeholder="Minimum 8 characters"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    title={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              {mode === "signup" && (
                <div className="accountPasswordChecks">
                  <span
                    className={
                      passwordChecks.length
                        ? "complete"
                        : ""
                    }
                  >
                    <Check size={13} />
                    At least 8 characters
                  </span>

                  <span
                    className={
                      passwordChecks.letter
                        ? "complete"
                        : ""
                    }
                  >
                    <Check size={13} />
                    Contains a letter
                  </span>

                  <span
                    className={
                      passwordChecks.number
                        ? "complete"
                        : ""
                    }
                  >
                    <Check size={13} />
                    Contains a number
                  </span>
                </div>
              )}

              <button
                className="accountSubmit"
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
                    ? "Create secure account"
                    : "Sign in securely"}
              </button>
            </form>

            <footer className="accountFormFooter">
              <ShieldCheck size={16} />

              <span>
                Protected using JWT authentication
                and role-based access.
              </span>
            </footer>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="accountPage">
      <style>{styles}</style>

      <section className="profileHero">
        <div className="profileHeroGrid" />

        <div className="profileIdentity">
          <span className="profileAvatar">
            {initials}
          </span>

          <div>
            <span className="accountEyebrow">
              RoadRakshak account
            </span>

            <h1>{user.name}</h1>

            <p>{user.email}</p>
          </div>
        </div>

        <div className="profileSession">
          <span>
            <i />
            Active session
          </span>

          <button
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </section>

      <section className="profileAccountGrid">
        <article className="profilePrimary">
          <header className="profileSectionHeader">
            <div>
              <span>Account overview</span>
              <h2>Your citizen identity</h2>
            </div>

            <UserRound size={21} />
          </header>

          <dl className="profileDetails">
            <div>
              <dt>Full name</dt>
              <dd>{user.name}</dd>
            </div>

            <div>
              <dt>Email address</dt>
              <dd>{user.email}</dd>
            </div>

            <div>
              <dt>Account role</dt>
              <dd className="profileRole">
                <BadgeCheck size={16} />
                {role.title}
              </dd>
            </div>

            <div>
              <dt>Verification</dt>
              <dd>
                {user.isVerified
                  ? "Identity verified"
                  : "Standard account"}
              </dd>
            </div>
          </dl>

          <div className="profileRoleDescription">
            <ShieldCheck size={21} />

            <div>
              <strong>{role.title}</strong>
              <p>{role.description}</p>
            </div>
          </div>
        </article>

        <aside className="profileSecurity">
          <header className="profileSectionHeader">
            <div>
              <span>Security</span>
              <h2>Account protection</h2>
            </div>

            <LockKeyhole size={21} />
          </header>

          <div className="profileSecurityList">
            <div>
              <span>
                <Check size={15} />
              </span>

              <div>
                <strong>Protected password</strong>
                <p>
                  Your password is hashed before
                  storage.
                </p>
              </div>
            </div>

            <div>
              <span>
                <Check size={15} />
              </span>

              <div>
                <strong>Secure session</strong>
                <p>
                  Protected requests require a valid
                  login token.
                </p>
              </div>
            </div>

            <div>
              <span>
                <Check size={15} />
              </span>

              <div>
                <strong>Private information</strong>
                <p>
                  Your email and account details are
                  not displayed publicly.
                </p>
              </div>
            </div>

            <div>
              <span>
                <Check size={15} />
              </span>

              <div>
                <strong>Controlled permissions</strong>
                <p>
                  Platform actions follow your
                  assigned account role.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="profileCapabilities">
        <header>
          <span>Account capabilities</span>
          <h2>What your account can do</h2>
        </header>

        <div>
          <article>
            <FileText size={21} />
            <span>01</span>
            <h3>Submit reports</h3>
            <p>
              Upload evidence and create structured
              road-issue reports.
            </p>
          </article>

          <article>
            <MapPin size={21} />
            <span>02</span>
            <h3>Verify locations</h3>
            <p>
              Add road locations and connect reports
              with relevant authorities.
            </p>
          </article>

          <article>
            <Activity size={21} />
            <span>03</span>
            <h3>Track progress</h3>
            <p>
              Follow complaint numbers, inspection
              updates and repair status.
            </p>
          </article>

          <article>
            <ShieldCheck size={21} />
            <span>04</span>
            <h3>Maintain history</h3>
            <p>
              Keep your submitted evidence and
              complaint activity together.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

const styles = `
  .accountPage,
  .accountPage * {
    box-sizing: border-box;
  }

  .accountPage {
    width: min(1380px, 100%);
    min-height: 100vh;
    margin: 0 auto;
    padding: 28px 30px 70px;
    color: #171b18;
    background: #f3f5f3;
  }

  .accountAccess {
    min-height: calc(100vh - 130px);
    display: grid;
    grid-template-columns:
      minmax(0, 1.15fr)
      minmax(390px, 0.85fr);
    overflow: hidden;
    border: 1px solid #cdd3cf;
    background: #ffffff;
  }

  .accountAccessStory {
    position: relative;
    min-height: 660px;
    overflow: hidden;
    padding: clamp(45px, 6vw, 90px);
    color: #ffffff;
    background: #080c0a;
    isolation: isolate;
  }

  .accountGridBackground {
    position: absolute;
    inset: 0;
    z-index: -3;
    opacity: 0.22;
    background-image:
      linear-gradient(
        rgba(255, 255, 255, 0.07) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.07) 1px,
        transparent 1px
      );
    background-size: 75px 75px;
    mask-image: linear-gradient(
      to bottom,
      transparent,
      black 18%,
      black 82%,
      transparent
    );
  }

  .accountAccessStory::before {
    position: absolute;
    top: -170px;
    right: -10%;
    left: -10%;
    z-index: -2;
    height: 250px;
    content: "";
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.9),
      rgba(111, 180, 164, 0.38),
      transparent
    );
    filter: blur(30px);
    animation: accountGlow 7s ease-in-out infinite;
  }

  .accountAccessStory::after {
    position: absolute;
    right: -15%;
    bottom: -220px;
    left: -15%;
    z-index: -2;
    height: 300px;
    content: "";
    background: linear-gradient(
      to top,
      rgba(120, 154, 255, 0.37),
      transparent
    );
    filter: blur(45px);
  }

  .accountSignal {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }

  .accountSignal span {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 0 15px #ffffff;
    animation: accountSignal 4s ease-in-out infinite;
  }

  .accountSignal span:nth-child(1) {
    top: 19%;
    left: 15%;
  }

  .accountSignal span:nth-child(2) {
    top: 36%;
    right: 18%;
    animation-delay: -1s;
  }

  .accountSignal span:nth-child(3) {
    bottom: 25%;
    left: 28%;
    animation-delay: -2s;
  }

  .accountSignal span:nth-child(4) {
    right: 12%;
    bottom: 17%;
    animation-delay: -3s;
  }

  .accountSignal span:nth-child(5) {
    top: 57%;
    left: 7%;
    animation-delay: -1.5s;
  }

  .accountAccessContent {
    position: relative;
    z-index: 2;
    max-width: 720px;
  }

  .accountEyebrow {
    display: block;
    color: #747e77;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .accountAccessContent .accountEyebrow {
    color: rgba(255, 255, 255, 0.66);
  }

  .accountAccessContent h1 {
    margin: 20px 0 0;
    font-size: clamp(48px, 6vw, 83px);
    font-weight: 600;
    line-height: 0.98;
    letter-spacing: 0;
  }

  .accountAccessContent h1 span {
    color: #989e9a;
  }

  .accountAccessContent > p {
    max-width: 640px;
    margin: 28px 0 0;
    color: rgba(255, 255, 255, 0.67);
    font-size: 16px;
    line-height: 1.75;
  }

  .accountAccessRoute {
    display: grid;
    grid-template-columns:
      auto minmax(20px, 1fr)
      auto minmax(20px, 1fr)
      auto;
    align-items: center;
    gap: 16px;
    margin-top: 52px;
    padding: 25px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.17);
    border-bottom: 1px solid rgba(255, 255, 255, 0.17);
  }

  .accountAccessRoute > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .accountAccessRoute strong,
  .accountAccessRoute small {
    display: block;
  }

  .accountAccessRoute strong {
    font-size: 11px;
  }

  .accountAccessRoute small {
    max-width: 120px;
    margin-top: 4px;
    color: rgba(255, 255, 255, 0.48);
    font-size: 8px;
    line-height: 1.4;
  }

  .accountAccessRoute i {
    height: 1px;
    background: rgba(255, 255, 255, 0.25);
  }

  .accountSecurityNote {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 29px;
    color: rgba(255, 255, 255, 0.58);
    font-size: 9px;
    line-height: 1.6;
  }

  .accountFormPanel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(35px, 5vw, 72px);
    background: #ffffff;
  }

  .accountFormHeader > span {
    color: #707973;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .accountFormHeader h2 {
    margin: 9px 0 0;
    font-size: clamp(27px, 3vw, 40px);
    font-weight: 600;
    line-height: 1.08;
  }

  .accountFormHeader p {
    margin: 12px 0 0;
    color: #6e7771;
    font-size: 11px;
    line-height: 1.6;
  }

  .accountModeControl {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 30px;
    border-bottom: 1px solid #cbd2cd;
  }

  .accountModeControl button {
    min-height: 45px;
    border: 0;
    border-bottom: 2px solid transparent;
    color: #7b847e;
    background: transparent;
    font: inherit;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .accountModeControl button.active {
    color: #171b18;
    border-bottom-color: #171b18;
  }

  .accountForm {
    display: grid;
    gap: 17px;
    margin-top: 26px;
  }

  .accountField {
    display: grid;
    gap: 8px;
  }

  .accountField > span {
    font-size: 10px;
    font-weight: 700;
  }

  .accountField > div {
    min-height: 47px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 12px;
    border: 1px solid #b9c2bc;
    background: #ffffff;
  }

  .accountField > div:focus-within {
    border-color: #171b18;
    box-shadow: 0 0 0 2px rgba(23, 27, 24, 0.08);
  }

  .accountField svg {
    flex: 0 0 auto;
    color: #6e7771;
  }

  .accountField input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    color: #171b18;
    background: transparent;
    font: inherit;
    font-size: 11px;
  }

  .accountField button {
    width: 30px;
    height: 30px;
    display: grid;
    flex: 0 0 30px;
    place-items: center;
    border: 0;
    color: #5f6862;
    background: transparent;
    cursor: pointer;
  }

  .accountPasswordChecks {
    display: flex;
    flex-wrap: wrap;
    gap: 7px 12px;
  }

  .accountPasswordChecks span {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #929994;
    font-size: 8px;
  }

  .accountPasswordChecks span.complete {
    color: #24633f;
  }

  .accountSubmit {
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-top: 5px;
    border: 1px solid #171b18;
    color: #ffffff;
    background: #171b18;
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition:
      background 180ms ease,
      transform 180ms ease;
  }

  .accountSubmit:hover:not(:disabled) {
    background: #303732;
    transform: translateY(-1px);
  }

  .accountSubmit:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .accountFormFooter {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 24px;
    padding-top: 18px;
    border-top: 1px solid #d8ddda;
    color: #78817b;
    font-size: 8px;
    line-height: 1.5;
  }

  .profileHero {
    position: relative;
    min-height: 260px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 25px;
    overflow: hidden;
    padding: 42px;
    color: #ffffff;
    background: #080c0a;
    isolation: isolate;
  }

  .profileHero::before {
    position: absolute;
    top: -180px;
    right: -10%;
    left: -10%;
    z-index: -2;
    height: 250px;
    content: "";
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.85),
      rgba(100, 171, 156, 0.35),
      transparent
    );
    filter: blur(34px);
    animation: accountGlow 7s ease-in-out infinite;
  }

  .profileHero::after {
    position: absolute;
    right: -15%;
    bottom: -200px;
    left: 20%;
    z-index: -2;
    height: 250px;
    content: "";
    background: rgba(100, 123, 210, 0.26);
    filter: blur(70px);
  }

  .profileHeroGrid {
    position: absolute;
    inset: 0;
    z-index: -3;
    opacity: 0.17;
    background-image:
      linear-gradient(
        rgba(255, 255, 255, 0.08) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.08) 1px,
        transparent 1px
      );
    background-size: 75px 75px;
  }

  .profileIdentity {
    display: flex;
    align-items: center;
    gap: 21px;
  }

  .profileAvatar {
    width: 88px;
    height: 88px;
    display: grid;
    flex: 0 0 88px;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: 50%;
    color: #080c0a;
    background: #ffffff;
    font-size: 24px;
    font-weight: 700;
  }

  .profileIdentity .accountEyebrow {
    color: rgba(255, 255, 255, 0.55);
  }

  .profileIdentity h1 {
    margin: 8px 0 0;
    font-size: clamp(32px, 5vw, 54px);
    font-weight: 600;
    line-height: 1;
  }

  .profileIdentity p {
    margin: 9px 0 0;
    color: rgba(255, 255, 255, 0.65);
    font-size: 11px;
  }

  .profileSession {
    display: flex;
    align-items: center;
    gap: 17px;
  }

  .profileSession > span {
    display: flex;
    align-items: center;
    gap: 7px;
    color: rgba(255, 255, 255, 0.68);
    font-size: 9px;
  }

  .profileSession i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #6ddd98;
    box-shadow: 0 0 12px rgba(109, 221, 152, 0.8);
    animation: accountSignal 2s ease-in-out infinite;
  }

  .profileSession button {
    min-height: 41px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 15px;
    border: 1px solid rgba(255, 255, 255, 0.45);
    color: #ffffff;
    background: transparent;
    font: inherit;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .profileSession button:hover {
    color: #171b18;
    background: #ffffff;
  }

  .profileAccountGrid {
    display: grid;
    grid-template-columns: 1.3fr 0.7fr;
    gap: 1px;
    margin-top: 1px;
    background: #cfd5d1;
  }

  .profilePrimary,
  .profileSecurity {
    padding: 30px;
    background: #ffffff;
  }

  .profileSectionHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 15px;
    padding-bottom: 20px;
    border-bottom: 1px solid #d7dcd9;
  }

  .profileSectionHeader span {
    color: #78817b;
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .profileSectionHeader h2 {
    margin: 6px 0 0;
    font-size: 19px;
    font-weight: 600;
  }

  .profileDetails {
    margin: 0;
  }

  .profileDetails > div {
    display: grid;
    grid-template-columns: 170px 1fr;
    gap: 20px;
    padding: 16px 0;
    border-bottom: 1px solid #e0e4e1;
  }

  .profileDetails dt {
    color: #737c76;
    font-size: 9px;
  }

  .profileDetails dd {
    margin: 0;
    overflow-wrap: anywhere;
    font-size: 11px;
    font-weight: 600;
  }

  .profileRole {
    display: flex;
    align-items: center;
    gap: 6px;
    text-transform: capitalize;
  }

  .profileRoleDescription {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-top: 22px;
    padding: 17px;
    border-left: 3px solid #171b18;
    background: #f4f6f4;
  }

  .profileRoleDescription strong {
    font-size: 11px;
  }

  .profileRoleDescription p {
    margin: 5px 0 0;
    color: #68716b;
    font-size: 9px;
    line-height: 1.6;
  }

  .profileSecurityList {
    display: grid;
  }

  .profileSecurityList > div {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 11px;
    padding: 16px 0;
    border-bottom: 1px solid #e0e4e1;
  }

  .profileSecurityList > div:last-child {
    border-bottom: 0;
  }

  .profileSecurityList > div > span {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border: 1px solid #aeb7b1;
    border-radius: 50%;
  }

  .profileSecurityList strong {
    font-size: 10px;
  }

  .profileSecurityList p {
    margin: 5px 0 0;
    color: #707973;
    font-size: 8px;
    line-height: 1.5;
  }

  .profileCapabilities {
    margin-top: 22px;
    padding: 31px;
    border: 1px solid #cfd5d1;
    background: #ffffff;
  }

  .profileCapabilities > header span {
    color: #78817b;
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .profileCapabilities > header h2 {
    margin: 7px 0 0;
    font-size: 21px;
    font-weight: 600;
  }

  .profileCapabilities > div {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin-top: 25px;
    border-top: 1px solid #d7dcd9;
    border-left: 1px solid #d7dcd9;
  }

  .profileCapabilities article {
    position: relative;
    min-height: 190px;
    padding: 22px;
    border-right: 1px solid #d7dcd9;
    border-bottom: 1px solid #d7dcd9;
  }

  .profileCapabilities article > span {
    position: absolute;
    top: 19px;
    right: 19px;
    color: #959c98;
    font-size: 9px;
  }

  .profileCapabilities h3 {
    margin: 28px 0 0;
    font-size: 14px;
    font-weight: 600;
  }

  .profileCapabilities p {
    margin: 9px 0 0;
    color: #6d7670;
    font-size: 9px;
    line-height: 1.6;
  }

  .accountLoading {
    min-height: 430px;
    display: grid;
    align-content: center;
    justify-items: center;
    padding: 40px;
    border: 1px solid #cfd5d1;
    background: #ffffff;
    text-align: center;
  }

  .accountLoadingMark {
    width: 58px;
    height: 58px;
    display: grid;
    place-items: center;
    border: 1px solid #aeb7b1;
    border-radius: 50%;
  }

  .accountLoading strong {
    margin-top: 17px;
    font-size: 15px;
  }

  .accountLoading p {
    margin: 6px 0 0;
    color: #737c76;
    font-size: 10px;
  }

  .accountLoadingLine {
    width: 230px;
    height: 2px;
    margin-top: 22px;
    overflow: hidden;
    background: #d7dcd9;
  }

  .accountLoadingLine span {
    width: 35%;
    height: 100%;
    display: block;
    background: #171b18;
    animation: accountLoading 1.4s ease-in-out infinite;
  }

  @keyframes accountGlow {
    0%,
    100% {
      opacity: 0.62;
      transform: translateX(-3%);
    }

    50% {
      opacity: 0.95;
      transform: translateX(3%);
    }
  }

  @keyframes accountSignal {
    0%,
    100% {
      opacity: 0.25;
      transform: scale(0.7);
    }

    50% {
      opacity: 1;
      transform: scale(1.3);
    }
  }

  @keyframes accountLoading {
    from {
      transform: translateX(-110%);
    }

    to {
      transform: translateX(290%);
    }
  }

  @media (max-width: 1050px) {
    .accountAccess {
      grid-template-columns: 1fr;
    }

    .accountAccessStory {
      min-height: 550px;
    }

    .profileAccountGrid {
      grid-template-columns: 1fr;
    }

    .profileCapabilities > div {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 760px) {
    .accountPage {
      padding: 18px 15px 55px;
    }

    .accountAccessStory {
      min-height: 520px;
      padding: 45px 28px;
    }

    .accountAccessRoute {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .accountAccessRoute i {
      width: 1px;
      height: 24px;
      margin-left: 9px;
    }

    .accountAccessRoute > div {
      min-height: 52px;
    }

    .accountAccessRoute small {
      max-width: none;
    }

    .accountFormPanel {
      padding: 42px 28px;
    }

    .profileHero {
      min-height: 360px;
      align-items: flex-start;
      flex-direction: column;
      justify-content: flex-end;
      padding: 30px;
    }

    .profileIdentity {
      align-items: flex-start;
      flex-direction: column;
    }

    .profileSession {
      width: 100%;
      justify-content: space-between;
    }

    .profilePrimary,
    .profileSecurity {
      padding: 23px;
    }
  }

  @media (max-width: 520px) {
    .accountAccessContent h1 {
      font-size: 46px;
    }

    .profileAvatar {
      width: 72px;
      height: 72px;
      flex-basis: 72px;
      font-size: 20px;
    }

    .profileIdentity h1 {
      font-size: 36px;
    }

    .profileSession {
      align-items: stretch;
      flex-direction: column;
    }

    .profileSession button {
      justify-content: center;
    }

    .profileDetails > div {
      grid-template-columns: 1fr;
      gap: 6px;
    }

    .profileCapabilities {
      padding: 22px;
    }

    .profileCapabilities > div {
      grid-template-columns: 1fr;
    }

    .profileCapabilities article {
      min-height: 165px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .accountAccessStory::before,
    .accountSignal span,
    .profileHero::before,
    .profileSession i,
    .accountLoadingLine span {
      animation: none;
    }

    .accountSubmit {
      transition: none;
    }
  }
`;

export default Profile;