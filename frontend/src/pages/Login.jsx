import logo from "../assets/ohmycharm.jpg";

const Login = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Decorative background orbs */}
      <div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(139,34,82,0.18) 0%, transparent 70%)",
          top: "-200px", right: "-200px",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(201,151,107,0.12) 0%, transparent 70%)",
          bottom: "-100px", left: "-100px",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        className="relative flex flex-col items-center gap-7 w-full max-w-sm mx-4 rounded-3xl p-10"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ padding: 3, background: "linear-gradient(135deg, var(--rose-deep), var(--gold))" }}
          >
            <img
              src={logo}
              alt="OhMyCharm"
              className="w-20 h-20 rounded-xl object-cover block"
            />
          </div>

          <div className="text-center">
            <h1
              className="text-4xl font-semibold"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f5dde8", letterSpacing: "-0.02em" }}
            >
              OhMyCharm
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--sidebar-text)" }}>
              Your jewellery business ledger
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Sign in */}
        <div className="flex flex-col items-center gap-4 w-full">
          <p className="text-sm text-center" style={{ color: "var(--sidebar-text)" }}>
            Sign in to access your dashboard
          </p>
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl font-medium text-sm transition-all duration-200"
            style={{
              background: "var(--rose-deep)",
              color: "white",
              boxShadow: "0 4px 16px rgba(139,34,82,0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--rose-mid)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(139,34,82,0.5)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--rose-deep)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(139,34,82,0.4)";
              e.currentTarget.style.transform = "";
            }}
          >
            <GoogleIcon />
            Continue with Google
          </a>
        </div>

        <p className="text-xs text-center" style={{ color: "rgba(184,154,168,0.5)" }}>
          Access is restricted to authorized accounts
        </p>
      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default Login;
