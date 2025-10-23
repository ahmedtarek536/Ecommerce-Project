"use client";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import {
  loginAction,
  signupAction,
  googleLoginAction,
  facebookLoginAction,
} from "@/actions/authActions";

interface AuthModelProps {
  model: boolean;
  setModel: (value: boolean) => void;
}

interface FacebookResponse {
  accessToken: string;
  userID: string;
  name: string;
  email: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

// interface AuthResponse {
//   success: boolean;
//   message: string;
//   data: string;
// }

declare global {
  interface Window {
    FB: {
      init: (config: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: FacebookResponse) => void,
        options: { scope: string }
      ) => void;
    };
    fbAsyncInit: () => void;
  }
}

// const serverUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:44352";

export default function AuthModel({ model, setModel }: AuthModelProps) {
  const [isSignin, setIsSignin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { setUser, setToken } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setModel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setModel]);

  useEffect(() => {
    // Load Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
    };

    // Load Facebook SDK script
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isSignin) {
        const response = await loginAction({ email, password });
        if (response.success) {
          setToken(response.data);
          setSuccess("Login successful!");
          setTimeout(() => {
            setModel(false);
            router.push("/");
            router.refresh(); // Refresh to update server components
          }, 1500);
        } else {
          setError(response.message || "Login failed");
        }
      } else {
        const response = await signupAction({
          firstName,
          lastName,
          email,
          password,
        });
        if (response.success) {
          setUser(response.data);
          setSuccess("Account created successfully!");
          setTimeout(() => {
            setModel(false);
            router.push("/");
            router.refresh(); // Refresh to update server components
          }, 1500);
        } else {
          setError(response.message || "Signup failed");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      const result = await googleLoginAction(response.credential);
      if (result.success && result.data) {
        setUser(result.data.user);
        setModel(false);
        router.push("/");
        router.refresh(); // Refresh to update server components
      } else {
        setError(result.message || "Google sign in failed");
      }
    } catch (err: any) {
      setError(err.message || "Google sign in failed");
    }
  };

  const handleFacebookLogin = () => {
    window.FB.login(
      async (response: FacebookResponse) => {
        if (response.accessToken) {
          try {
            const result = await facebookLoginAction(
              response.accessToken,
              response.userID
            );
            if (result.success && result.data) {
              setUser(result.data.user);
              setModel(false);
              router.push("/");
              router.refresh(); // Refresh to update server components
            } else {
              setError(result.message || "Facebook sign in failed");
            }
          } catch (err: any) {
            setError(err.message || "Facebook sign in failed");
          }
        }
      },
      { scope: "email,public_profile" }
    );
  };

  if (!model) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl"
      >
        <button
          onClick={() => setModel(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          {isSignin ? "Welcome Back" : "Create Account"}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isSignin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : isSignin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google sign in failed")}
                useOneTap
              />
            </GoogleOAuthProvider>

            <button
              onClick={handleFacebookLogin}
              className="w-full flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166fe5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1660c2] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
              Facebook
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsSignin(!isSignin)}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            {isSignin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
