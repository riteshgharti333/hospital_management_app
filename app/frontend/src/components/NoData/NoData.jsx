import React from "react";
import { useNavigate } from "react-router-dom";

const NoData = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-10 h-[80vh] flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold text-gray-800">No Data Found</h3>
      <p className="text-gray-500 mt-2 text-sm">
        It looks like there's no data to display at the moment.
      </p>
      <p className="text-gray-500 text-sm">
        Please check your internet connection or try refreshing the page.
      </p>
      <div className="mt-4 flex gap-3">
        <button onClick={() => window.location.reload()} className="btn-edit">
          Refresh Page
        </button>
        <button onClick={() => navigate(-1)} className="btn-cancel">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NoData;
