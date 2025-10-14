import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
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
      <main className='bg-[url("/images/bg-main.svg")] bg-cover flex justify-center items-center'>
        <div className="gradient-border shadow-lg">
          <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
            <div className="flex flex-col gap-2 items-center text-center">
              <h1>Welcome</h1>
              <h2>Log in to Continue your Journey</h2>
            </div>
            <div>
              {isLoading ? (
                <button className="auth-button animate-pulse">
                  Signing you In...
                </button>
              ) : (
                <>
                  {auth.isAuthenticated ? (
                    <button className="auth-button" onClick={auth.signOut}>
                      Log Out
                    </button>
                  ) : (
                    <button className="auth-button" onClick={auth.signIn}>
                      Log In
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
