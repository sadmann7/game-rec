import { IoLogoPlaystation, IoLogoXbox } from "react-icons/io5";
import {
  SiActivision,
  SiEpicgames,
  SiGogdotcom,
  SiNintendoswitch,
  SiRiotgames,
  SiSteam,
} from "react-icons/si";

const StoreIcon = ({ name }: { name: string }) => {
  switch (
    name.match(
      /steam|epic|gog|riot|gog|activision|playstation|xbox|switch/
    )?.[0]
  ) {
    case "steam":
      return <SiSteam className="text-white" size={20} />;
    case "epic":
      return <SiEpicgames className="text-white" size={20} />;
    case "gog":
      return <SiGogdotcom className="text-white" size={20} />;
    case "riot":
      return <SiRiotgames className="text-white" size={20} />;
    case "activision":
      return <SiActivision className="text-white" size={20} />;
    case "playstation":
      return <IoLogoPlaystation className="text-white" size={20} />;
    case "xbox":
      return <IoLogoXbox className="text-white" size={20} />;
    case "switch":
      return <SiNintendoswitch className="text-white" size={20} />;
    default:
      return null;
  }
};

export default StoreIcon;
