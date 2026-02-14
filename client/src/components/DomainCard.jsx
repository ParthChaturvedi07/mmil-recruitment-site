import { useNavigate } from "react-router-dom";

const DomainCard = ({ title, count, gradient }) => {

    const navigate = useNavigate()
    const handleClick =() => {
         navigate(`/admin/${title.toLowerCase()
}`)
    }
  return (
    <div
    onClick={handleClick}
      className={`
        ${gradient}
        rounded-2xl
        shadow-xl
        hover:scale-105
        transition-all
        duration-300
        flex flex-col
        justify-center
        items-center
        p-8
        text-white
        backdrop-blur-md
      `}
    >
      <h3 className="text-lg font-medium opacity-90">{title}</h3>
      <p className="text-4xl font-bold mt-2">{count}</p>
    </div>
  );
};

export default DomainCard