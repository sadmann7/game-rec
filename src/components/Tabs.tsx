import { Tab } from "@headlessui/react";
import { PLATFORM } from "@prisma/client";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

// external imports
import type { RouterOutputs } from "@/utils/api";

type TabsProps = {
  data: RouterOutputs["games"]["getPaginated"][];
  platform: PLATFORM | null;
  setPlatform: Dispatch<SetStateAction<PLATFORM | null>>;
};

const Tabs = ({ data, platform, setPlatform }: TabsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useMemo(() => {
    if (platform === PLATFORM.PC) {
      setSelectedIndex(1);
    } else if (platform === PLATFORM.PLAYSTATION) {
      setSelectedIndex(2);
    } else if (platform === PLATFORM.XBOX) {
      setSelectedIndex(3);
    } else if (platform === PLATFORM.NINTENDO) {
      setSelectedIndex(4);
    } else {
      setSelectedIndex(0);
    }
  }, [platform]);

  const tabs = [
    {
      name: "All",
      onClick: () => {
        setPlatform(null);
        setSelectedIndex(0);
      },
    },
    {
      name: "PC",
      onClick: () => {
        setPlatform(PLATFORM.PC);
        setSelectedIndex(1);
      },
    },
    {
      name: "Playstation",
      onClick: () => {
        setPlatform(PLATFORM.PLAYSTATION);
        setSelectedIndex(2);
      },
    },
    {
      name: "Xbox",
      onClick: () => {
        setPlatform(PLATFORM.XBOX);
        setSelectedIndex(3);
      },
    },
    {
      name: "Nintendo",
      onClick: () => {
        setPlatform(PLATFORM.NINTENDO);
        setSelectedIndex(4);
      },
    },
  ];

  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className="mx-auto flex w-full gap-2 overflow-x-auto whitespace-nowrap rounded-xl bg-blue-900/80 p-1 sm:max-w-md">
        {tabs.map((tab) => (
          <Tab
            key={tab.name}
            onClick={tab.onClick}
            className={twMerge(
              "w-full rounded-lg py-2.5 px-4 text-sm font-medium leading-5 text-blue-700",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
              "ui-selected:bg-white ui-selected:shadow",
              "ui-not-selected:text-blue-100 ui-not-selected:hover:bg-white/[0.12] ui-not-selected:hover:text-white"
            )}
          >
            {tab.name}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="text-lg text-white">
        <Tab.Panel>Panel 1</Tab.Panel>
        <Tab.Panel>Panel 2</Tab.Panel>
        <Tab.Panel>Panel 3</Tab.Panel>
        <Tab.Panel>Panel 4</Tab.Panel>
        <Tab.Panel>Panel 5</Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Tabs;
