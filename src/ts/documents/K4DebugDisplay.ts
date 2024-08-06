import { Dragger, InertiaPlugin } from "../libraries.js";
import { getDistanceFromSelected, getXPosFromIndex,getYRotFromIndex, getIndexFromYRot, getYRotFromXPos, getXPosFromYRot,getIndexFromXPos } from "./K4PCSheet.js";
import U from "../scripts/utilities.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";


// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const IS_DEBUGGING: boolean = false;
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class K4DebugDisplay {
  private static displays = new Map<string, JQuery>();

  static Initialize(): void {
    if (!IS_DEBUGGING) { return };
    this.createDisplay("archetypeInfo", "Archetype Info");
    this.createDisplay("draggerInfo", "Dragger Info");
  }

  private static createDisplay(id: string, title: string): void {
    if (!IS_DEBUGGING) { return };

    this.displays.set(id, $("<span />"));

    const display = $(`<div id="${id}" class="k4-debug-display">
      <h3>${title}</h3>
      <pre></pre>
    </div>`).css({
      position: "fixed",
      top: `${this.displays.size * 120}px`,
      left: "10px",
      width: "300px",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      zIndex: "9999",
      fontSize: "12px",
      fontFamily: "monospace",
      pointerEvents: "none"
    });
    this.displays.set(id, display);

    $("body").css({"position": "relative"}).append(display);
  }

  static updateArchetypeInfo(archetype: string, selectedIndex: number, arrayIndex: number, elementIndex: number): void {
    if (!IS_DEBUGGING) { return };
    const display = this.displays.get("archetypeInfo");
    if (display) {
      // if (archetype) {
        display.find("pre").text(
          `Name: ${archetype}\n` +
          `Selected Index: ${selectedIndex}\n` +
          `Array Index: ${arrayIndex}\n` +
          `Element Index: ${elementIndex}`
        );
      // }
    }
  }

  static updateDraggerInfo(dragger: Maybe<Dragger>, actor: K4Actor): void {
    if (!IS_DEBUGGING) { return };
    if (!dragger) return;
    const dragger$ = $(dragger.target);
    const container$ = dragger$.closest(".pc-initialization");
    const carousel$ = container$.find(".archetype-carousel");
    const items$ = carousel$.find(".archetype-carousel-item");
    const dragContainer$ = dragger$.closest(".archetype-carousel-dragger");
    const dragWidth = dragContainer$.width()!;
    const xMin = -0.5 * dragWidth;
    const xMax = 0.5 * dragWidth;

    const xPos = U.pFloat(dragger.x, 2);
    const yRot = U.pFloat(U.get(carousel$[0], "rotationY"), 0);
    const chosenArchetype = actor.archetype;
    const chosenArchetypeIndex = U.pInt(carousel$.find(`[data-archetype="${chosenArchetype}"]`).attr("data-index"));
    const isSelectedArchetype = carousel$.find(`[data-is-selected="true"]`).attr("data-archetype")!;
    const isSelectedArchetypeIndex = U.pInt(carousel$.find(`[data-is-selected="true"]`).attr("data-index"));
    const usingArchetypeIndex = getIndexFromYRot(yRot, items$.length);
    const usingArchetype = carousel$.find(`[data-index="${usingArchetypeIndex}"]`).attr("data-archetype")!;
    const lines: string[] = [
      `XPOS: ${U.padNum(xPos, 2)} (min: ${xMin}, max: ${xMax})`,
      `YROT: ${U.padNum(yRot, 0)}`,
      `INDEX - CHOSEN: ${chosenArchetypeIndex} (${chosenArchetype})`,
      `INDEX - USING: ${usingArchetypeIndex} (${usingArchetype})`,
      `DISTANCE: ${U.pFloat(getDistanceFromSelected(usingArchetypeIndex, chosenArchetypeIndex, items$.length), 2)}`,
      `TOTAL: ${items$.length}`,
      " ",
      `getYRotFromIndex: ${U.pInt(getYRotFromIndex(usingArchetypeIndex, items$.length),)}`,
      `getIndexFromYRot: ${getIndexFromYRot(yRot, items$.length)}`,
      `getYRotFromXPos: ${U.pInt(getYRotFromXPos(xPos, items$.length, xMax))}`,
      `getXPosFromYRot: ${U.pFloat(getXPosFromYRot(yRot, items$.length, xMax), 2)}`,
      `getIndexFromXPos: ${getIndexFromXPos(xPos, items$.length, xMax)}`,
      `getXPosFromIndex: ${U.pFloat(getXPosFromIndex(usingArchetypeIndex, items$.length, xMax), 2)}`,
      `Velocity: ${InertiaPlugin.getVelocity(dragger.target, "x").toFixed(2)}`,
      `Is Dragging: ${dragger.isDragging}`,
      `Is Pressed: ${dragger.isPressed}`
    ];

    const display = this.displays.get("draggerInfo");
    if (display) {
      display.find("pre").text(
        lines.join("\n")
      );
    }
  }
}

export default K4DebugDisplay;