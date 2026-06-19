import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import bgImage from "../../assets/sports-bg 2.png";
import { mockUsers } from "../../data/mockUsers";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../constants/roles";

const LoginPage = () => {
  const [view, setView] = useState<"login" | "forgot" | "otp" | "reset-password">("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotValue, setForgotValue] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    forgotValue: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
const navigate = useNavigate();
  const validateEmailOrMobile = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "Email or Mobile Number is required";

    const containsLetter = /[a-zA-Z]/.test(trimmed);
    const containsAt = trimmed.includes("@");

    if (containsLetter || containsAt) {
      if (trimmed.includes(" ")) return "Spaces are not allowed in email";

      const atCount = (trimmed.match(/@/g) || []).length;
      if (atCount > 1) return "Invalid email format";
      if (!containsAt) return "Email address must contain @";
      if (trimmed.startsWith("@")) return "Email username is missing";
      if (trimmed.endsWith("@")) return "Email domain is missing";

      const [user, domain] = trimmed.split("@");
      if (!user) return "Email username is missing";
      if (!domain) return "Email domain is missing";
      if (!domain.includes(".")) return "Email domain extension is missing";

      const extension = domain.split(".").pop() || "";
      if (extension.length < 2) return "Invalid email domain";

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(trimmed)) return "Please enter a valid email address";

      return "";
    }

    if (!/^\d+$/.test(trimmed)) return "Invalid mobile number";
    if (trimmed.length < 10) return "Mobile number must be 10 digits";
    if (trimmed.length > 10) return "Mobile number cannot exceed 10 digits";
    if (!/^[6-9]\d{9}$/.test(trimmed)) return "Please enter a valid mobile number";

    return "";
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const usernameError = validateEmailOrMobile(username);
    const passwordError = !password.trim() ? "Password is required" : "";

    setErrors((prev) => ({ ...prev, username: usernameError, password: passwordError }));
    if (usernameError || passwordError) return;

    const user = mockUsers.find(
      (u) =>
        (u.email.toLowerCase() === username.toLowerCase() || u.mobile === username) &&
        u.password === password
    );

    if (!user) {
      setErrors((prev) => ({ ...prev, password: "Invalid email/mobile number or password" }));
      return;
    }

    console.log("Login Success", user);
    localStorage.setItem("user", JSON.stringify(user));

alert(`Welcome ${user.name}`);

console.log("Login Success", user);

switch (user.role) {
  case ROLES.superadmin:
    navigate("/superadmin/dashboard");
    break;

  case ROLES.ADMIN:
    navigate("/admin/dashboard");
    break;

  case ROLES.COACH:
    navigate("/coach/dashboard");
    break;

  case ROLES.STUDENT:
    navigate("/student/dashboard");
    break;

  default:
    navigate("/");
}
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const forgotError = validateEmailOrMobile(forgotValue);
    setErrors((prev) => ({ ...prev, forgotValue: forgotError }));
    if (forgotError) return;

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);
    console.log("Generated OTP:", otpCode);
    setView("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      return;
    }

    if (otp !== generatedOtp) {
      setErrors((prev) => ({ ...prev, otp: "Invalid OTP" }));
      return;
    }

    setErrors((prev) => ({ ...prev, otp: "" }));
    setView("reset-password");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { ...errors, newPassword: "", confirmPassword: "" };

    if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      hasError = true;
    }

    if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    alert("Password reset successful (Mock)");
    setView("login");
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center lg:justify-end px-4 sm:px-6 md:px-10 lg:px-20 py-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <div className="rounded-2xl border border-yellow-500/40 bg-[#07162E]/85 backdrop-blur-md p-5 sm:p-6 md:p-8 shadow-2xl">

          {/* LOGIN VIEW */}
          {view === "login" && (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400">
                  Access Your Portal
                </h1>
                <p className="mt-2 text-sm text-gray-300">
                  Login using your registered email or mobile number
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Username */}
                <div>
                  <input
                    type="text"
                    value={username}
                    placeholder="Email or Mobile Number"
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
                    }}
                    onBlur={() => {
                      const error = validateEmailOrMobile(username);
                      setErrors((prev) => ({ ...prev, username: error }));
                    }}
                    className={`w-full rounded-lg bg-transparent px-4 py-3 text-white placeholder:text-gray-400 outline-none transition
                      ${errors.username
                        ? "border border-red-500"
                        : "border border-yellow-500/30 focus:border-yellow-400"
                      }`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="Password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      className={`w-full rounded-lg bg-transparent px-4 py-3 pr-12 text-white placeholder:text-gray-400 outline-none transition
                        ${errors.password
                          ? "border border-red-500"
                          : "border border-yellow-500/30 focus:border-yellow-400"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-yellow-400"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-sm font-medium text-yellow-400 hover:text-yellow-300 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-yellow-500 py-3 font-semibold text-black transition hover:bg-yellow-400"
                >
                  Login
                </button>
              </form>
            </>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === "forgot" && (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">
                  Forgot Password
                </h1>
                <p className="mt-2 text-sm text-gray-300">
                  Enter your registered email or mobile number to receive an OTP.
                </p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={forgotValue}
                    placeholder="Email or Mobile Number"
                    onChange={(e) => {
                      setForgotValue(e.target.value);
                      if (errors.forgotValue) setErrors((prev) => ({ ...prev, forgotValue: "" }));
                    }}
                    onBlur={() => {
                      const error = validateEmailOrMobile(forgotValue);
                      setErrors((prev) => ({ ...prev, forgotValue: error }));
                    }}
                    className={`w-full rounded-lg bg-transparent px-4 py-3 text-white placeholder:text-gray-400 outline-none transition
                      ${errors.forgotValue
                        ? "border border-red-500"
                        : "border border-yellow-500/30 focus:border-yellow-400"
                      }`}
                  />
                  {errors.forgotValue && (
                    <p className="mt-1 text-sm text-red-400">{errors.forgotValue}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-yellow-500 py-3 font-semibold text-black transition hover:bg-yellow-400"
                >
                  Send OTP
                </button>

                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="w-full text-yellow-400 hover:underline"
                >
                  Back to Login
                </button>
              </form>
            </>
          )}

          {/* OTP VIEW */}
          {view === "otp" && (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">
                  Verify OTP
                </h1>
                <p className="mt-2 text-sm text-gray-300">
                  Enter the OTP sent to your registered email or mobile number.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={otp}
                    placeholder="Enter OTP"
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
                    }}
                    className={`w-full rounded-lg bg-transparent px-4 py-3 text-white placeholder:text-gray-400 outline-none transition
                      ${errors.otp
                        ? "border border-red-500"
                        : "border border-yellow-500/30 focus:border-yellow-400"
                      }`}
                  />
                  {errors.otp && (
                    <p className="mt-1 text-sm text-red-400">{errors.otp}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-yellow-500 py-3 font-semibold text-black transition hover:bg-yellow-400"
                >
                  Verify OTP
                </button>

                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="w-full text-yellow-400 hover:underline"
                >
                  Back
                </button>
              </form>
            </>
          )}

          {/* RESET PASSWORD VIEW */}
          {view === "reset-password" && (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">
                  Reset Password
                </h1>
                <p className="mt-2 text-sm text-gray-300">
                  Enter your new password below.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* New Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      placeholder="New Password"
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }));
                      }}
                      className={`w-full rounded-lg bg-transparent px-4 py-3 pr-12 text-white placeholder:text-gray-400 outline-none transition
                        ${errors.newPassword
                          ? "border border-red-500"
                          : "border border-yellow-500/30 focus:border-yellow-400"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-yellow-400"
                    >
                      {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-400">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      placeholder="Confirm Password"
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }}
                      className={`w-full rounded-lg bg-transparent px-4 py-3 pr-12 text-white placeholder:text-gray-400 outline-none transition
                        ${errors.confirmPassword
                          ? "border border-red-500"
                          : "border border-yellow-500/30 focus:border-yellow-400"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-yellow-400"
                    >
                      {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-yellow-500 py-3 font-semibold text-black transition hover:bg-yellow-400"
                >
                  Reset Password
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;