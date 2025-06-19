import React from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const SidebarSection = React.memo(
  ({ data, prefix, activeItem, expandedItems, onItemClick, collapsed }) => {
    return data.map((item, index) => {
      const key = `${prefix}-${index}`;
      return (
        <div key={key} className="mb-1">
          <div
            className={`flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer group
            ${activeItem === key ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}
            ${collapsed ? "justify-center" : "justify-between"}`}
            onClick={() => onItemClick(key)}
          >
            <div className="flex items-center">
              <Link
                to={item.link}
                className={`${
                  activeItem === key ? "text-blue-600" : "text-gray-500"
                } group-hover:text-blue-500`}
              >
                <item.icon />
              </Link>
              {!collapsed && (
                <Link to={item.link} className="ml-3 text-sm font-medium">
                  {item.title}
                </Link>
              )}
            </div>
            {!collapsed && item.subItems && (
              <span className="text-gray-400 text-xs">
                {expandedItems[key] ? <FiChevronDown /> : <FiChevronRight />}
              </span>
            )}
          </div>

          {!collapsed && item.subItems && expandedItems[key] && (
            <div className="ml-8 mt-1 space-y-1 animate-fadeIn">
              {item.subItems.map((subItem, subIndex) => (
                <Link
                  to={subItem.link}
                  key={subIndex}
                  className="block p-2 pl-4 rounded-md text-xs text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150"
                >
                  {subItem.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    });
  }
);

export default SidebarSection;
