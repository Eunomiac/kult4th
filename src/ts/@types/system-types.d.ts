import SVGDATA from "../scripts/svgdata.ts";
import {K4WoundType, K4ConditionType} from "../scripts/constants.js";
import {K4ItemType} from "../documents/K4Item.ts";


declare global {
  interface StripButtonData {
    icon: KeyOf<typeof SVGDATA>,
    dataset: Record<string, string>,
    buttonClasses?: string[],
    tooltip?: string
  }
  interface HoverStripData {
    id: string,
    type: K4ItemType | K4WoundType | K4ConditionType | "edge",
    display: string,
    icon: string,
    isGlowing?: "red"|"blue"|"gold"|false,
    stripClasses: string[],
    buttons: StripButtonData[],
    dataset?: Record<string, string>,
    dataTarget?: string,
    placeholder?: string,
    tooltip?: string
  }
}