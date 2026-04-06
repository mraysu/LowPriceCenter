import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "src/components/Header";
import { FirebaseContext } from "src/utils/FirebaseProvider";

const buttonStyles =
  "text-gray-400 text-lg border-2 shadow-md py-2 px-4 rounded-full hover:bg-gray-200 transition-colors w-full sm:w-fit flex items-center justify-center";

export function Home() {
  const { user, openGoogleAuthentication } = useContext(FirebaseContext);

  if (user) {
    return <Navigate to="/products" />;
  }

  return (
    <div>
      <Header />
      <section className="bg-white font-rubik rounded-xl mx-12 px-8 py-4 shadow-md shadow-ucsd-blue">
        <div className="font-bold text-5xl pb-16">
          <span className="text-ucsd-blue">Low </span>
          <span className="text-ucsd-gold">Price Center</span>
        </div>
        <div className="flex flex-col justify-center items-center mb-7 mx-auto sm:mx-0 p-1 gap-4 ">
          <div className="text-3xl">Log in to sell on Low Price Center</div>
          <button className={buttonStyles} onClick={openGoogleAuthentication}>
            Log In
          </button>
        </div>
      </section>
    </div>
  );
}
