import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import { IMAGE_URL_DARK, IMAGE_URL_LIGHT } from "../config/urls";


function Logo() {

  const { theme } = useContext(ThemeContext);

  const imageUrl = theme === "dark" ? IMAGE_URL_DARK : IMAGE_URL_LIGHT;

  return (
    <img
      src={imageUrl}
      alt="WorkInHarmony Logo"
      className="absolute top-6 left-6 w-32 md:top-8 md:left-8 md:w-40"
    />
  );
}

export default Logo;
