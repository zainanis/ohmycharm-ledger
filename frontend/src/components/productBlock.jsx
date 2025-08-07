export const ProdcutBlock = ({ name, price, description, status }) => {
  return (
    <>
      <div className="border-1 border-solid rounded-md pr-10 pl-5 border-pink-100 hover:shadow-pink-300/50 shadow-lg max-w-xs">
        <p>
          <b> {name}</b>
        </p>
        <p>Price: {price}</p>
        <p>Status: {status}</p>
        {description && <p>Description: {description}</p>}
      </div>
    </>
  );
};
