// Import Tagify from its development-time location
import Tagify from "@yaireo/tagify";
// Import GSAP and its plugins from Foundry's provided path
import {gsap, RoughEase, ExpoScaleEase, SlowMo, CustomEase, CustomWiggle, Flip, Observer, Draggable, MotionPathPlugin, PixiPlugin, TextPlugin, MorphSVGPlugin, SplitText, GSDevTools} from "gsap/all";

// Import type data from third-party modules


export default function InitializeLibraries() {
  gsap.registerPlugin(RoughEase, ExpoScaleEase, SlowMo, CustomEase, CustomWiggle, Flip, Observer, Draggable, MotionPathPlugin, PixiPlugin, TextPlugin, MorphSVGPlugin, SplitText, GSDevTools);
  gsap.config({nullTargetWarn: false});
}

// Export Tagify
export {Tagify};
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