import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";
import type { MetaArgs } from "react-router";
import { useEffect } from "react";

export function meta({ }: MetaArgs) {
  return [
    { title: "Resumind AI | LOGIN" },
    { name: "description", content: "Login into your account" },
  ];
}

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);
  return (
    <>
      <main className='relative flex justify-center items-center overflow-hidden'>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-purple/20 via-dark-bg to-dark-bg -z-10" />
        <div className="relative z-10 p-[1px] bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)]">
          <section className="flex flex-col gap-10 bg-dark-bg/90 backdrop-blur-xl rounded-2xl p-16 w-full max-w-2xl items-center">
            <div className="flex flex-col gap-4 items-center text-center">
              <h1 className="!text-5xl">Welcome</h1>
              <h2 className="!text-xl font-light text-gray-400">Log in to continue your journey</h2>
            </div>
            <div className="w-full flex justify-center">
              {isLoading ? (
                <button className="auth-button animate-pulse opacity-80 cursor-wait">
                  Signing you In...
                </button>
              ) : (
                <>
                  {auth.isAuthenticated ? (
                    <button className="auth-button" onClick={auth.signOut}>
                      Log Out
                    </button>
                  ) : (
                    <button className="auth-button group" onClick={auth.signIn}>
                      Log In <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Auth;
