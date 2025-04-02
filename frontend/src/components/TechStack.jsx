import { FaReact, FaNodeJs, FaDatabase, FaHtml5, FaCss3Alt, FaJs } from "react-icons/fa";
import TailwindIcon from "../assets/tailwind.svg"; // Ensure this file exists

const TechStack = () => {
  return (
    <div className="flex flex-col items-center w-full px-4">
      <h1 className="text-3xl text-gray-500 font-bold mb-6 text-center">Tech Stack</h1>

      <div className="bg-gray-800 py-8 rounded-lg w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 place-items-center">
        {/* Icons */}
        <div className="flex flex-col items-center rounded p-4 hover:bg-gray-700 cursor-pointer" onClick={() => window.open("https://react.dev/", "_blank")}>
          <FaReact className="text-7xl sm:text-8xl md:text-9xl text-white" />
          <p className="mt-2 text-sm sm:text-base">React</p>
        </div>

        <div className="flex flex-col items-center rounded p-4 hover:bg-gray-700 cursor-pointer" onClick={() => window.open("https://nodejs.org/", "_blank")}>
          <FaNodeJs className="text-7xl sm:text-8xl md:text-9xl text-white" />
          <p className="mt-2 text-sm sm:text-base">Node.js</p>
        </div>

        <div className="flex flex-col items-center rounded p-4 hover:bg-gray-700 cursor-pointer" onClick={() => window.open("https://www.mongodb.com/", "_blank")}>
          <FaDatabase className="text-7xl sm:text-8xl md:text-9xl text-white" />
          <p className="mt-2 text-sm sm:text-base">MongoDB</p>
        </div>

        <div className="flex flex-col items-center rounded p-4 hover:bg-gray-700 cursor-pointer" onClick={() => window.open("https://developer.mozilla.org/en-US/docs/Web/HTML", "_blank")}>
          <FaHtml5 className="text-7xl sm:text-8xl md:text-9xl text-white" />
          <p className="mt-2 text-sm sm:text-base">HTML5</p>
        </div>

        <div className="flex flex-col items-center rounded p-4 hover:bg-gray-700 cursor-pointer" onClick={() => window.open("https://developer.mozilla.org/en-US/docs/Web/CSS", "_blank")}>
          <FaCss3Alt className="text-7xl sm:text-8xl md:text-9xl text-white" />
          <p className="mt-2 text-sm sm:text-base">CSS3</p>
        </div>

        <div className="flex flex-col items-center rounded p-4 hover:bg-gray-700 cursor-pointer" onClick={() => window.open("https://developer.mozilla.org/en-US/docs/Web/JavaScript", "_blank")}>
          <FaJs className="text-7xl sm:text-8xl md:text-9xl text-white" />
          <p className="mt-2 text-sm sm:text-base">JavaScript</p>
        </div>

        <div className="flex flex-col items-center rounded p-4 hover:bg-gray-700 cursor-pointer" onClick={() => window.open("https://tailwindcss.com/", "_blank")}>
          <img src={TailwindIcon} alt="Tailwind CSS" className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24" />
          <p className="mt-2 text-sm sm:text-base">Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default TechStack;
