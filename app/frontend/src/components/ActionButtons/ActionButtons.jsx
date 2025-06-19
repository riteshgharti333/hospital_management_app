import { FaEdit, FaTrash, FaTimes, FaSave } from "react-icons/fa";
import { Button } from "./Button";

export const EditButton = (props) => (
  <Button leftIcon={<FaEdit />} variant="primary" {...props}>
    Edit
  </Button>
);

export const DeleteButton = (props) => (
  <Button leftIcon={<FaTrash />} variant="danger" {...props}>
    Delete
  </Button>
);

export const CancelButton = (props) => (
  <Button leftIcon={<FaTimes />} variant="outline" {...props}>
    Cancel
  </Button>
);

export const SaveButton = ({ isLoading, ...props }) => (
  <Button
    leftIcon={isLoading ? undefined : <FaSave />}
    isLoading={isLoading}
    variant="primary"
    {...props}
  >
    {isLoading ? "Saving..." : "Save Changes"}
  </Button>
);