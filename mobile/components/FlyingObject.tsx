import { Dimensions, Image } from "react-native";
import {MotiView} from "moti"

const { width, height } = Dimensions.get('window');



// This is where your Cart Icon usually sits in the Tab Bar

const CART_ICON_X = width / 2;

const CART_ICON_Y = height - 50;
export const FlyingImage = ({ uri, x, y, onComplete }: any) => {
  // Guard clause: if x or y are missing, don't render anything
  if (x === undefined || y === undefined) return null;

  return (
    <MotiView
      from={{ 
        left: x - 25, // Subtracting 25 centers the 50px image on the click
        top: y - 25, 
        opacity: 1, 
        scale: 1 
      }}
      animate={{ 
        left: CART_ICON_X, 
        top: CART_ICON_Y, 
        opacity: 0.5, 
        scale: 0.2 
      }}
      transition={{ type: 'timing', duration: 800 }}
      onDidAnimate={() => onComplete()}
      style={{ position: 'absolute', width: 50, height: 50, zIndex: 9999 }}
    >
      <Image 
        source={{ uri: uri }} 
        style={{ width: '100%', height: '100%', borderRadius: 25 }} 
      />
    </MotiView>
  );
};