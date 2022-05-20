import { useLoaderData, Link, Form } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";

export async function loader() {
  const db = await connectDb();
  const cadidates = await db.models.Candidate.find();
  return cadidates;
}
//make the search and filter work

export default function Candidates() {
  const candidates = useLoaderData();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">All of our IT cadidates</h1>
      <div className="flex items-center gap-4">
        <Form>
          <input
            className=" p-2 rounded-full mr-2"
            type="text"
            placeholder="Search..."
          />
          <button
            type="submit"
            className=" bg-green-400 px-3 py-2 rounded-full"
          >
            Search
          </button>
        </Form>
        <Form method="post" className="flex">
          <select name="tag" id="" className="  p-2 rounded-full mr-2">
            <option value="">All</option>
            <option value="react">React</option>
            <option value="vue">Vue</option>
          </select>

          <button
            type="submit"
            className=" bg-green-400 px-3 py-2 rounded-full"
          >
            Filter
          </button>
        </Form>
      </div>
      <ul className="flex py-2 pt-4 gap-4">
        {candidates.map((candidate) => (
          <li key={candidate._id} className=" w-72 bg-white p-4 rounded-xl">
            <Link to="">
              <div className="">
                <img
                  src="/403017_avatar_default_head_person_unknown_icon.png"
                  alt=""
                />
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <h2 className="text-xl font-semibold">
                  {`${candidate.firstname} ${candidate.lastname}`}
                </h2>

                <p>{candidate.description}</p>
                <div className="flex gap-2">
                  <div className="flex gap-2">
                    {candidate.tags.length > 0
                      ? candidate.tags?.map((tag) => (
                          <p
                            key={tag}
                            className=" bg-green-400 rounded-full px-2 hover:bg-green-300"
                          >
                            {tag}
                          </p>
                        ))
                      : " Looks like you haven't added any tags to your profile. Go To Edit profile to add some."}
                  </div>
                </div>
                <p className=" text-slate-400 text-sm">
                  {"Created: " +
                    candidate.createdAt.slice(8, 10) +
                    candidate.createdAt.slice(4, 8) +
                    candidate.createdAt.slice(0, 4)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
