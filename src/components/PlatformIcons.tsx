import { PLATFORM } from "@prisma/client";
import type { HTMLAttributes } from "react";

// external imports
import { GrWindows } from "react-icons/gr";
import { IoLogoPlaystation, IoLogoXbox } from "react-icons/io5";
import { SiNintendoswitch } from "react-icons/si";

type PlatformIconsProps = {
  platforms: PLATFORM[];
  size?: number;
  sizeAlt?: number;
} & HTMLAttributes<HTMLDivElement>;

const PlatformIcons = ({
  platforms,
  size = 20,
  sizeAlt = 24,
  className,
  ...props
}: PlatformIconsProps) => {
  const uniquePlatforms = [...new Set(platforms)];

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}
      {...props}
    >
      {uniquePlatforms.map((platform) => {
        switch (platform) {
          case PLATFORM.PC:
            return (
              <GrWindows key={platform} className="text-white" size={size} />
            );
          case PLATFORM.PLAYSTATION:
            return (
              <IoLogoPlaystation
                key={platform}
                className="text-white"
                size={sizeAlt}
              />
            );
          case PLATFORM.XBOX:
            return (
              <IoLogoXbox key={platform} className="text-white" size={size} />
            );
          case PLATFORM.NINTENDO:
            return (
              <SiNintendoswitch
                key={platform}
                className="text-white"
                size={size}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default PlatformIcons;
