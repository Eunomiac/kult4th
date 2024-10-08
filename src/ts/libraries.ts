// Import Tagify from its development-time location
import Tagify from "@yaireo/tagify";
// Import GSAP and its plugins from Foundry's provided path
import {gsap, Draggable as Dragger, InertiaPlugin, RoughEase, CustomEase, CustomWiggle, ExpoScaleEase, SlowMo, EasePack, Flip, Observer, MotionPathPlugin, PixiPlugin, TextPlugin, MorphSVGPlugin, SplitText, GSDevTools} from "gsap/all";

// Import type data from third-party modules


export default function InitializeLibraries() {
  gsap.registerPlugin(RoughEase, Dragger, InertiaPlugin, ExpoScaleEase, CustomEase, CustomWiggle, SlowMo, EasePack, Flip, Observer, MotionPathPlugin, PixiPlugin, TextPlugin, MorphSVGPlugin, SplitText, GSDevTools);
  gsap.config({nullTargetWarn: false});
  Object.assign(globalThis, {
    CustomEase,
    gsap,
    RoughEase,
    CustomWiggle,
    ExpoScaleEase,
    SlowMo,
    Flip,
    Observer,
    Dragger,
    MotionPathPlugin,
    PixiPlugin,
    TextPlugin,
    MorphSVGPlugin,
    SplitText,
    GSDevTools
  });
}

// Export Tagify
export {Tagify};
// Export GSAP and its plugins
export {gsap};
export {RoughEase, ExpoScaleEase, SlowMo, CustomEase, CustomWiggle};
export {Flip};
export {Observer};
export {Dragger};
export {InertiaPlugin};
export {MotionPathPlugin};
export {PixiPlugin};
export {TextPlugin};
export {MorphSVGPlugin};
export {GSDevTools};