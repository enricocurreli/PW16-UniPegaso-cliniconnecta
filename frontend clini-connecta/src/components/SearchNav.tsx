import Button from "./Button";

type SearchNavProps = {
  options: string[];
};

const SearchNav = ({ options }: SearchNavProps) => {
  return (
    <div className="border-4 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all flex md:w-1/2 w-3/4 md:h-16">
      <select
        defaultValue="Doctors"
        className="select select-neutral w-27 md:w-56 border-0 rounded-r-none shadow-none select_1 md:h-full"
      >
        {options &&
          options.map((option, index) => <option key={index}>{option}</option>)}
      </select>
      <input
        type="text"
        placeholder="Search doctors, clinics and specializzations"
        className="input input-bordered w-32 md:w-full border-0 shadow-none md:h-full rounded-none"
      />
      <Button classes="btn bg-primary text-white flex items-center justify-center font-medium hover:bg-blue-600 cursor-pointer transition rounded-no w-12 h-10 md:h-full md:w-14 p-2 rounded-l-none">
        {" "}
        <svg className="" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </Button>
    </div>
  );
};

export default SearchNav;
