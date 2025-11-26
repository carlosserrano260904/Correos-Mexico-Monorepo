import React from "react";

interface TabsSwitcherProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabsSwitcher: React.FC<TabsSwitcherProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex border-b">
      {["Favoritos", "Listas"].map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 font-semibold ${
            activeTab === tab ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
