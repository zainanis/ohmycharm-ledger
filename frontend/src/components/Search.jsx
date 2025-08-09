export const Search = () => {
  return (
    <div className="border-2  w-screen  ">
      <form onSubmit={(e) => e.preventDefault()}>
        <input className=" " type="text" placeholder="placehlder" />
      </form>
    </div>
  );
};
