import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
    
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className="mr-4 p-2 rounded-sm cursor-pointer hover:bg-gray-100"
      aria-label="Go back"
    >
      <FaArrowLeft className="text-gray-600" />
    </button>
  );
};

export default BackButton;
