import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className=" max-w-4xl mx-auto   text-center mt-10">
      <div>
        <h1 className=" font-bold text-2xl tracking-wide mb-3 ">
          Know When You Can Bunk — and When You Can’t.
        </h1>
        <p className=" font-semibold text-xl w-2/4 mx-auto ">
          Track attendance, analyze risk, and avoid last-minute panic.
        </p>
      </div>
      
    {/* //section for features */}

      <section className="flex justify-center px-4 mb-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="p-4 card w-80">
            <h3 className="font-semibold">Attendance Tracker</h3>
            <p className="text-sm bw-muted mt-2">
              Log class presence, view trends and per-subject stats.
            </p>
          </article>

          <article className="p-4 card w-80">
            <h3 className="font-semibold">Bunk Risk Analyzer</h3>
            <p className="text-sm bw-muted mt-2">
              See how close you are to policy thresholds and get recovery
              advice.
            </p>
          </article>
        </div>
      </section>

      <div className="flex justify-center gap-4 mt-4">
        <Link to="/dashboard">
          <button className=" border p-2 rounded-md cursor-pointer bw-btn-outline ">
            View Dashboard
          </button>
        </Link>
        <Link to="/subjects">
          <button className=" border p-2 rounded-md cursor-pointer bw-btn-outline ">
            Add Subject
          </button>
        </Link>
      </div>
      <div></div>
    </div>
  );
};

export default Home;
