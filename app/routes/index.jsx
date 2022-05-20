import { useLoaderData, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";

export async function loader() {
  const db = await connectDb();
  const books = await db.models.Book.find();
  return books;
}

export default function Index() {
  const books = useLoaderData();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">All of our IT cadidates</h1>
      <ul className="flex p-4">
        <li className=" w-72 bg-white p-4 rounded-xl">
          <Link to="">
            <div className="">
              <img
                src="/403017_avatar_default_head_person_unknown_icon.png"
                alt=""
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Jens Hansen</h2>
              <div>
                <h3 className=" text-lg font-semibold">Bio:</h3>
                <p> Her skal der står en masse tekst, men max 4 linjer</p>
              </div>

              <div className="flex gap-2">
                <p className=" bg-green-400 rounded-full px-2 hover:bg-green-300">
                  tag1
                </p>
                <p>tag2</p>
              </div>
              <p>20/02/2022</p>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
