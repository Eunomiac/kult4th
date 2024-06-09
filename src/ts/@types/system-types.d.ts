import SVGDATA from "../scripts/svgdata.ts";
import {K4ItemType} from "../documents/K4Item.ts";
import {K4WoundType} from "../documents/K4Actor.ts";


declare global {
  interface StripButtonData {
    icon: KeyOf<typeof SVGDATA>,
    dataset: Record<string, string>,
    buttonClasses?: string[],
    tooltip?: string
  }
  interface HoverStripData {
    id: string,
    type: K4ItemType | K4WoundType | "edge",
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