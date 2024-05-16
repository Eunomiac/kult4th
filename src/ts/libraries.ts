// Import Tagify from its development-time location
import Tagify from "@yaireo/tagify";
export {Tagify};

// Import GSAP and its plugins from Foundry's provided path
import {gsap, RoughEase, ExpoScaleEase, SlowMo, Flip, Observer, Draggable, MotionPathPlugin, PixiPlugin, TextPlugin, MorphSVGPlugin, GSDevTools} from "gsap/all";

gsap.registerPlugin(RoughEase, ExpoScaleEase, SlowMo, Flip, Observer, Draggable, MotionPathPlugin, PixiPlugin, TextPlugin, MorphSVGPlugin, GSDevTools);

// Export GSAP and its plugins
export {gsap};
export {RoughEase, ExpoScaleEase, SlowMo};
export {Flip};
export {Observer};
export {Draggable};
export {MotionPathPlugin};
export {PixiPlugin};
export {TextPlugin};
export {MorphSVGPlugin};
export {GSDevTools};