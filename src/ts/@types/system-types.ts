import SVGDATA from "../scripts/svgdata";
import {K4ItemType} from "../documents/K4Item";
import {K4WoundType} from "../documents/K4Actor";

declare global {
  interface StripButtonData {
    icon: KeyOf<typeof SVGDATA>,
    dataset: Record<string, string>,
    buttonClasses?: string[],
    tooltip?: string
  }
  interface HoverStripData {
    id: string,
    type: K4ItemType | K4WoundType,
    display: string,
    icon: string,
    stripClasses: string[],
    buttons: StripButtonData[],
    dataset?: Record<string, string>,
    dataTarget?: string,
    placeholder?: string,
    tooltip?: string
  }
}