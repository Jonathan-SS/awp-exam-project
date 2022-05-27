import { Link } from "react-router-dom";
import Logo from "../../icons/Logo";

export default function CreateUser(params) {
  return (
    <div className="flex flex-col items-center">
      <Logo />
      <div className="text-center mt-4 flex flex-col gap-4 ">
        <h1 className=" text-4xl font-bold mb-4 ">Welcome to Cnnect!</h1>
        <p>
          We are here to create the perfect match, <br />
          between candidates and recruiter.
        </p>
        <p>
          First of all, we need to know whether you are a recruiter or a
          candidate.
        </p>
        <div className="flex gap-4 center justify-center">
          <Link
            className="bg-green-400 px-3 py-2 rounded-full font-semibold hover:bg-green-300 shadow-md hover:shadow"
            to="/create-user/candidate"
          >
            I am a candidate
          </Link>
          <Link
            className="bg-green-400 px-3 py-2 rounded-full font-semibold hover:bg-green-300 shadow-md hover:shadow "
            to="/create-user/recruiter"
          >
            I am a recruiter
          </Link>
        </div>
      </div>
    </div>
  );
}
