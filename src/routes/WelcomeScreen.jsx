import { useNavigate } from "react-router-dom";

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-white max-w-sm mx-auto p-4 text-center">
      <div className="mb-6">
        <img
          src="https://my-birthday-bash.web.app/assets/jasper-C4fYkGLp.jpg"
          alt="A friendly cartoon character named Jasper"
          className="w-32 h-32 object-cover rounded-full mx-auto ring-4 ring-indigo-500/50 shadow-lg"
          // Fallback for image loading
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/128x128/4F46E5/FFFFFF?text=JASPER";
          }}
        />
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-400 mb-4 leading-tight">
        Hi there! 👋
      </h1>
      <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed">
        I’m <span className="text-indigo-400 font-bold">Jasper</span> — welcome
        to <span className="text-indigo-400 font-bold">Learn with Jasper</span>!
        <br className="hidden sm:inline" />
        Let’s explore, play, and grow together as we learn together!
      </p>
      <div className="mt-8">
        <button
          onClick={() => navigate("/login")}
          className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-150 transform hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
        >
          Get Started
        </button>
      </div>

      {/* SPONSORSHIP MESSAGE - NEW CONTENT */}
      <div className="pt-6 border-t border-gray-700/50">
        <p className="text-sm italic text-gray-400">
          A special shoutout to my awesome mum’s business {" "}
          <a
            href="https://instagram.com/reen_kids_store"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:underline font-bold"
          >
            @reen_kids_store
          </a>{" "}
          for sponsoring this app! 💚
        </p>
        <p className="text-xs text-gray-500 mt-2">
          She curates amazing event souvenirs and party packs for birthdays,
          school events, and celebrations of all kinds. Be sure to tell your
          parents to check it out and order something fun for your next party!
          🎁
        </p>
      </div>
    </div>
  );
}

export default WelcomeScreen;
