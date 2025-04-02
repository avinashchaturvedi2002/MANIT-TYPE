import { FaReact, FaNodeJs, FaDatabase, FaHtml5, FaCss3Alt, FaJs } from "react-icons/fa";
import TailwindIcon from "../assets/tailwind.svg"; // Save Tailwind SVG in assets

const TechStack = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-3xl text-gray-500 font-bold mb-6">Tech Stack</h1>

      <div className="text-lg w-2/3 bg-gray-800 py-12 rounded-lg grid grid-cols-4 gap-6 place-items-center">
        
        {/* Row 1 - 4 Icons */}
        <div className="flex flex-col justify-center items-center rounded p-4 hover:bg-gray-500 cursor-pointer" onClick={() => window.open("https://react.dev/", "_blank")}>
          <FaReact className="text-9xl text-white" />
          <p>React</p>
        </div>

        <div className="flex flex-col justify-center items-center rounded p-4 hover:bg-gray-500 cursor-pointer" onClick={() => window.open("https://nodejs.org/", "_blank")}>
          <FaNodeJs className="text-9xl text-white" />
          <p>Node.js</p>
        </div>

        <div className="flex flex-col justify-center items-center rounded p-4 hover:bg-gray-500 cursor-pointer" onClick={() => window.open("https://www.mongodb.com/", "_blank")}>
          <FaDatabase className="text-9xl text-white" />
          <p>MongoDB</p>
        </div>

        <div className="flex flex-col justify-center items-center rounded p-4 hover:bg-gray-500 cursor-pointer" onClick={() => window.open("https://developer.mozilla.org/en-US/docs/Web/HTML", "_blank")}>
          <FaHtml5 className="text-9xl text-white" />
          <p>HTML5</p>
        </div>

        {/* Row 2 - 3 Icons (Centered) */}
        <div className="col-span-4 flex justify-center gap-28">
          <div className="flex flex-col justify-center items-center rounded p-4 hover:bg-gray-500 cursor-pointer" onClick={() => window.open("https://developer.mozilla.org/en-US/docs/Web/CSS", "_blank")}>
            <FaCss3Alt className="text-9xl text-white" />
            <p>CSS3</p>
          </div>

          <div className="flex flex-col justify-center items-center rounded p-4 hover:bg-gray-500 cursor-pointer" onClick={() => window.open("https://developer.mozilla.org/en-US/docs/Web/JavaScript", "_blank")}>
            <FaJs className="text-9xl text-white" />
            <p>JavaScript</p>
          </div>

          <div className="flex flex-col justify-center items-center rounded p-4 hover:bg-gray-500 cursor-pointer" onClick={() => window.open("https://tailwindcss.com/", "_blank")}>
            <img src={TailwindIcon} alt="Tailwind CSS" className="w-24 h-24" />
            <p className="mt-6">Tailwind CSS</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TechStack;
