import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiPieChart,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import {
  MdLocalHospital,
  MdMedication,
  MdMedicalServices,
} from "react-icons/md";
import { FaRegSquarePlus } from "react-icons/fa6";
import { LuAmbulance, LuBaby } from "react-icons/lu";
import { LuHousePlus } from "react-icons/lu";
import { MdSingleBed } from "react-icons/md";
import { LuBedSingle } from "react-icons/lu";
import { PiBedDuotone } from "react-icons/pi";
import { MdOutlineEditCalendar } from "react-icons/md";
import { LiaUserNurseSolid } from "react-icons/lia";
import { FaStethoscope } from "react-icons/fa6";
import { GiMedicines } from "react-icons/gi";
import { BsPrescription2 } from "react-icons/bs";
import { LuScanFace } from "react-icons/lu";
import { RiSoundModuleFill } from "react-icons/ri";
import { LuNewspaper } from "react-icons/lu";
import { MdOutlineNoteAdd } from "react-icons/md";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { MdOutlinePayments } from "react-icons/md";
import { CgGirl } from "react-icons/cg";
import { IoMdBook } from "react-icons/io";
import { AiOutlineBank } from "react-icons/ai";
import { HiOutlineBanknotes } from "react-icons/hi2";

const ledgerTitles = [
  {
    title: "Patient Ledger",
    link: "ledger/patient-ledger",
  },
  {
    title: "Doctor Ledger",
    link: "ledger/doctor-ledger",
  },

  {
    title: "Cash Ledger",
    link: "ledger/cash-ledger",
  },
  {
    title: "Bank Ledger",
    link: "ledger/bank-ledger",
  },
];

export const sidebarData = [
  {
    title: "Dashboard",
    icon: FiHome,
    link: "/dashboard",
  },
  {
    title: "Admission Entry",
    icon: FaRegSquarePlus,
    link: "/admission-entries",
  },
  {
    title: "Patients Register",
    icon: FiUsers,
    link: "/patients-entries",
  },
  {
    title: "Birth Register",
    icon: LuBaby,
    link: "/birth-entries",
  },

  {
    title: "Departments",
    icon: LuHousePlus,
    link: "/departments",
  },

  {
    title: "Appointments",
    icon: MdOutlineEditCalendar,
    link: "/appointments",
  },
  {
    title: "Nurse Register",
    icon: LiaUserNurseSolid,
    link: "/nurses",
  },
  {
    title: "Doctor Register",
    icon: FaStethoscope,
    link: "/doctors",
  },

  {
    title: "Prescription Register",
    icon: BsPrescription2,
    link: "/prescriptions",
  },

   {
    title: "Bank Register",
    icon: AiOutlineBank,
    link: "/bank",
  },

   {
    title: "Cash Register",
    icon: HiOutlineBanknotes,
    link: "/cash",
  },

  {
    title: "Add Ledger",
    icon: MdOutlineNoteAdd,
    link: "/new-ledger",
  },
  {
    title: "All Ledgers",
    icon: LuNewspaper,
    subItems: ledgerTitles.map((item) => ({
      title: item.title,
      link: `/${item.link}`,
    })),
  },
];

export const sidebar2Data = [
  {
    title: "Billing",
    icon: LiaMoneyBillWaveSolid,
    subItems: [
      { title: "Bill Entry", link: "/bills" },
      { title: "Money Recepit Entry", link: "/money-receipts" },
    ],
  },
];

// export const sidebar3Data = [
//   {
//     title: "Reports",
//     icon: IoMdBook,
//     subItems: [
//       { title: "Purchase Report", link: "/purchase-report" },
//       {
//         title: "Provisional Invoice Report",
//         link: "/provisional-invoice-report",
//       },
//       { title: "Final Invoice Report", link: "/provisional-invoice-report" },
//       { title: "Due List Register", link: "/due-lists" },
//       { title: "Money Receipt Register", link: "/view-money-receipts" },
//       { title: "Discharge List Register", link: "/discharge-lists" },
//     ],
//   },
// ];
