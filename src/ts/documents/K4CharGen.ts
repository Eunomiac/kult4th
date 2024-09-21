/* eslint-disable @typescript-eslint/no-extraneous-class */
// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import C, {K4Attribute, StabilityConditions, K4ConditionType, K4Stability, K4Archetype, ArchetypeTier, Archetypes, K4GamePhase} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import {Dragger, InertiaPlugin, CustomEase, CustomWiggle} from "../libraries.js";
import K4Actor, {K4ActorType, K4AttributeData} from "./K4Actor.js";
import K4Item, {K4ItemType} from "./K4Item.js";
import K4Dialog, {PromptInputType} from "./K4Dialog.js";
import K4ActiveEffect from "./K4ActiveEffect.js";
import K4Roll from "./K4Roll.js";
import {gsap} from "../libraries.js";
import K4GMTracker from "./K4GMTracker.js";
import K4Alert, {AlertType} from "./K4Alert.js";
import K4DebugDisplay from "./K4DebugDisplay.js";
import {UserTargetRef} from "./K4Socket.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

namespace Archetype {
  export interface TraitData {
    name: string,
    img: string,
    tooltip: string,
    isSelected: boolean,
    isMandatory: boolean
  }

  export interface StringData {
    value: string,
    examples?: string
  }

  export interface ArchetypeData<T extends ArchetypeTier = ArchetypeTier> {
    label: K4Archetype & string,
    img: string,
    tier: T,
    [K4ItemType.advantage]: Partial<Record<K4Attribute, Record<string, TraitData>>>,
    selStringAdvantage: Maybe<string>,
    [K4ItemType.disadvantage]: Record<string, TraitData>,
    selStringDisadvantage: Maybe<string>,
    [K4ItemType.darksecret]: Record<string, TraitData>,
    selStringDarkSecret: Maybe<string>,
    isSelected: boolean
  }

  export type Data = Partial<Record<K4Archetype, ArchetypeData>>;
}

interface ChargenContext {
  archetypeCarousel: Archetype.Data,
  selectedArchetype: Maybe<K4Archetype>,
  attributes: K4AttributeData[],
  // archetypeAdvantages: Maybe<Partial<Record<K4Attribute, Record<string, Archetype.TraitData>>>>,
  // archetypeDisadvantages: Maybe<Record<string, Archetype.TraitData>>,
  // archetypeDarkSecrets: Maybe<Record<string, Archetype.TraitData>>,
  description: Archetype.StringData,
  occupation: Archetype.StringData,
  looks: {
    clothes: Archetype.StringData,
    face: Archetype.StringData,
    eyes: Archetype.StringData,
    body: Archetype.StringData
  },
  otherPlayerData: Record<IDString, K4Actor["summaryData"]>
}


const PIXELS_PER_ROTATION = 1000;
const VALID_ARCHETYPE_TIERS: ArchetypeTier[] = ["aware" as ArchetypeTier];

function getValidArchetypes() {
  return Object.fromEntries(
    Object.entries(Archetypes)
      .filter(([_, archetype]) => VALID_ARCHETYPE_TIERS.includes(archetype.tier))
  );
}
function getArchetypeCount() {
  return Object.keys(getValidArchetypes()).length;
}
function getArchetypeFromIndex(index: number) {
  return Object.keys(getValidArchetypes())[index] as K4Archetype;
}
function getIndexOfArchetype(archetype: K4Archetype) {
  return Object.keys(getValidArchetypes())
    .findIndex((arch) => arch as K4Archetype === archetype);
}
function wrapIndex(index: number) {
  const total = getArchetypeCount();
  return ((index % total) + total) % total;
}

function wrapRotation(rotation: number) {
  return (((rotation) % 360) + 360) % 360;
}

function wrapXPos(x: number) {
  const totalWidth = PIXELS_PER_ROTATION;
  const minX = -totalWidth / 2;
  const maxX = totalWidth / 2;
  return U.gsap.utils.wrap(minX, maxX)(x);
}

function getNormalizedRotation(rotation: number, offset = 0): number {
  return wrapRotation(rotation + offset) / 360;
}
function getNormalizedXPos(x: number, offset = 500): number {
  return wrapXPos(x + offset) / PIXELS_PER_ROTATION;
}

function revealAndReturn(elem$: JQuery) {
  elem$.css({
    opacity: 0,
    visibility: "visible"
  });
  return elem$;
}

function hideAndReturn(elem$: JQuery) {
  elem$.css({
    opacity: 0,
    visibility: "hidden"
  });
  return elem$;
}

Object.assign(globalThis, {wrapIndex, wrapRotation, wrapXPos,
  getArchetypeCount,
  getArchetypeFromIndex,
  getIndexFromYRot,
  getYRotFromXPos,
  getXPosFromYRot,
  getXPosFromIndex,
  getIndexFromXPos,
  getNormalizedDistanceFromSelected,
  revealAndReturn,
  hideAndReturn
});

export function getYRotFromIndex(index: number) {
  const boundIndex = wrapIndex(index);
  return U.gsap.utils.mapRange(0, getArchetypeCount(), 0, 360, boundIndex);
}

export function getIndexFromYRot(rotationY: number) {
  const total = getArchetypeCount();
  return U.pInt(U.gsap.utils.mapRange(0, 360, 0, total, wrapRotation(rotationY)));
}

export function getYRotFromXPos(x: number) {
  const max = PIXELS_PER_ROTATION / 2;
  return U.gsap.utils.mapRange(-max, max, 0, 360, wrapXPos(x));
}

export function getXPosFromYRot(rotationY: number) {
  const max = PIXELS_PER_ROTATION / 2;
  return U.gsap.utils.mapRange(0, 360, -max, max, wrapRotation(rotationY));
}

export function getXPosFromIndex(index: number) {
  const max = PIXELS_PER_ROTATION / 2;
  const boundIndex = wrapIndex(index);
  return U.gsap.utils.mapRange(0, getArchetypeCount(), -max, max, boundIndex);
}

export function getIndexFromXPos(x: number) {
  const total = getArchetypeCount();
  const max = PIXELS_PER_ROTATION / 2;
  return U.pInt(U.gsap.utils.mapRange(-max, max, 0, total, wrapXPos(x)));
}

export function getNormalizedDistanceFromSelected(index: number, selected: number) {
  const boundIndex = wrapIndex(index);
  const boundSelected = wrapIndex(selected);
  const total = getArchetypeCount();
  // Distance is symmetrical, so we halve the number of items to get the maximum distance.
  const halfTotal = total / 2;

  // Calculate the distance between the given index and the selected index
  const rawDistance = Math.abs(boundIndex - boundSelected);
  // If the raw distance is greater than half the total, we "count from the opposite direction"
  // by subtracting the raw distance from the total.
  const distance = rawDistance > halfTotal
    ? total - rawDistance
    : rawDistance;

  // Normalize the distance
  const normalizedDistance = distance / halfTotal;
  return U.clampNum(normalizedDistance, [0, 1]);
}

function getDistanceStyles(index: number, selected: number): Record<Key, string|number> {
  const scaleFactor = getNormalizedDistanceFromSelected(index, selected);

  const maxBlur = 5; const minBlur = 0;
  const maxBright = 0.8; const minBright = 0.5;
  const maxOpacity = 1; const minOpacity = 1;
  const maxScale = 1; const minScale = 1;
  const maxSaturate = 0.8; const minSaturate = 0.25;

  const blur = U.gsap.utils.mapRange(0, 1, minBlur, maxBlur, scaleFactor);
  const brightness = U.gsap.utils.mapRange(0, 1, minBright, maxBright, scaleFactor);
  const opacity = U.gsap.utils.mapRange(0, 1, minOpacity, maxOpacity, scaleFactor);
  const scale = U.gsap.utils.mapRange(0, 1, minScale, maxScale, scaleFactor);
  const saturate = U.gsap.utils.mapRange(0, 1,minSaturate, maxSaturate, scaleFactor);

  return {
    filter: `blur(${blur}px) brightness(${brightness}) saturate(${saturate})`,
    opacity: U.pFloat(opacity, 2),
    scale: U.pFloat(scale, 2)
  };
}

function getElementFromArchetype(context$: JQuery, archetype: K4Archetype) {
  return context$.find(`[data-archetype=${archetype}]`);
}

function getElementFromIndex(context$: JQuery, index: number) {
  const archetype = getArchetypeFromIndex(index);
  return getElementFromArchetype(context$, archetype);
}

const updateDebugInfo = (carousel$: JQuery, x: number) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!K4DebugDisplay.IS_DEBUGGING) { return; }
  const newIndex = getIndexFromXPos(x);
  const archetype = getArchetypeFromIndex(newIndex);
  const elementIndex = carousel$.find(`[data-archetype=${archetype}]`).data("index") as number;
  const selArchetypeIndex = getIndexOfArchetype(archetype);

  K4DebugDisplay.updateArchetypeInfo(archetype, selArchetypeIndex, newIndex, elementIndex);
};

/**
 * Top-level flow of control class that conducts the character generation process.
 */
class K4CharGen {


  static PreInitialize() {
    // Create chargen intro overlay via JQuery and append it to the DOM
    // const content = await renderTemplate(U.getTemplatePath("chargen", "chargen-intro-overlay"), {});
    // this._introOverlay$ = $("<div style='position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); z-index: 10000;'></div>").appendTo("body");

    // // Immediately animate it in
    // U.gsap.to(this._introOverlay$, {
    //   autoAlpha: 1,
    //   duration: 1,
    //   ease: "power2.inOut"
    // });

    // Preload video/webm element "cloud-bg.webm"
  }

  private static FindUserCharacter(user: User): Maybe<K4Actor<K4ActorType.pc>> {
    const userID: IDString = user.id as IDString;
    const pcs: Array<K4Actor<K4ActorType.pc>> = getGame().actors.filter((actor: K4Actor): actor is K4Actor<K4ActorType.pc> => actor.is(K4ActorType.pc));
    const userPC = pcs.find((pc: K4Actor<K4ActorType.pc>) => pc.ownership[userID] === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);
    return userPC;
  }


  static async PostInitialize() {
    const gmTracker = await K4GMTracker.Get();
    if (gmTracker.phase !== K4GamePhase.chargen) {
      return;
    }
    const user = getUser();
    const userPC = this.FindUserCharacter(user);
    if (!userPC) {
      void K4Alert.Alert({
        type: AlertType.simple,
        target: UserTargetRef.gm,
        skipQueue: false,
        header: `User ${user.name} Owns No Character!`,
        body: "You must create a template PC character, and set this user as its owner before character generation can begin."
      });
      return;
    }

    const charGenHandler = new K4CharGen(user, userPC);

    return charGenHandler;
  }

  archetypeData: Map<K4Archetype, Archetype.Data> = new Map<K4Archetype, Archetype.Data>();
  _user: User;
  _userPC: K4Actor<K4ActorType.pc>;
  constructor(user: User, userPC: K4Actor<K4ActorType.pc>) {
    this._user = user;
    this._userPC = userPC;
  }

  get actor(): K4Actor<K4ActorType.pc> {
    return this._userPC;
  }

  get user(): User {
    return this._user;
  }

  getTraitData(traitName: string, traitType: K4ItemType, archetype?: K4Archetype|false): Maybe<Archetype.TraitData> {
    // kLog.log("getTraitData", traitName, traitType, archetype);
    // Strip "!" prefix (marking mandatory trait) so traitName can retrieve item
    traitName = traitName.replace(/^!/g, "");
    const traitItem = getGame().items.getName(traitName);
    if (!traitItem) {
      throw new Error(`Trait item "${traitName}" not found`);
    }

    const tData: Archetype.TraitData = {
      name: traitName,
      img: (traitItem.img ?? "").replace(/\(|\)/g, ""),
      tooltip: traitItem.shortDesc,
      isSelected: this.actor.isCharGenSelected(traitName),
      isMandatory: false
    };

    if (archetype !== false) {
      archetype = archetype ?? this.actor.archetype;
      if (!archetype) { return undefined; }

      const archetypeData = Archetypes[archetype];

      if (!(traitType in archetypeData)) {
        throw new Error(`Archetype ${archetype} does not have a ${traitType} section`);
      }

      const archetypeTraits = archetypeData[traitType as KeyOf<typeof archetypeData>] as string[];

      // Check whether trait is mandatory for this archetype. If so, set isMandatory.
      const nameIfMandatory = `!${traitName}`;

      if (archetypeTraits.includes(nameIfMandatory)) {
        tData.isMandatory = true;
        tData.isSelected = true;
      }
    }

    return tData;
  }

  getArchetypeTraitData(traitType: K4ItemType & KeyOf<typeof Archetypes[K4Archetype]>, archetype: K4Archetype, attribute?: K4Attribute) {
    if (![
      K4ItemType.advantage,
      K4ItemType.disadvantage,
      K4ItemType.darksecret
    ].includes(traitType)) {
      throw new Error(`Invalid trait type ${traitType} for getArchetypeTraitData`);
    }
    const archetypeTData = Archetypes[archetype][traitType];

    // If an attribute was passed, filter the archetypeTData by that attribute, then convert to Record<name, data>
    if (attribute) {
      return Object.fromEntries(archetypeTData
        .filter((traitName) => this.getTraitAttribute(traitName) === attribute)
        .map((traitName) => [traitName.replace(/^!/g, ""), this.getTraitData(traitName, traitType, archetype)])
      ) as Record<string, Archetype.TraitData>;
    }

    // For advantages, we need to group each data object by attribute
    if (traitType === K4ItemType.advantage) {
      return Object.fromEntries(
        (Object.keys(K4Attribute) as K4Attribute[])
          .map((attrName): [K4Attribute, Record<string, Archetype.TraitData>] => [attrName, this.getArchetypeTraitData(traitType, archetype, attrName)] as [K4Attribute, Record<string, Archetype.TraitData>])
          .filter(([_, data]) => !U.isEmpty(data))) as Partial<Record<K4Attribute, Record<string, Archetype.TraitData>>>;
    }

    // Otherwise, we just return the Record<string, TraitData> object
    return Object.fromEntries([
      ...archetypeTData
        .map((traitName) => [traitName.replace(/^!/g, ""), this.getTraitData(traitName, traitType, archetype)]),
      // For disadvantages and dark secrets, we need to append any off-archetype selections made via the more menu
      ...this.actor.system.charGen[
        traitType === K4ItemType.disadvantage ? "extraDisadvantages" : "extraDarkSecrets"
      ].map((traitName) => [traitName, this.getTraitData(traitName, traitType, false)])
    ]) as Record<string, Archetype.TraitData>;
  }

  getStringData(dotKey: string, archetype?: K4Archetype): Archetype.StringData {
    // If no archetype provided, try passing dotKey to actor's system data
    if (!archetype) {
      const sData = U.getProp<string>(
        this.actor.system,
        dotKey.replace(/^system\./, "")
      );
      if (sData) {
        return {value: sData};
      }
    }
    archetype = archetype ?? this.actor.archetype;
    if (!archetype) { return {value: ""}; }

    const examples = U.getProp<string[]>(Archetypes[archetype], dotKey) ?? [];

    const sData: Archetype.StringData = {
      value: "",
      examples: Array.isArray(examples) ? examples.join(", ") : ""
    };

    return sData;
  }

  getTraitAttribute (traitName: string): K4Attribute {
    const traitItem = getGame().items.getName(traitName);
    if (!traitItem) {
      throw new Error(`Trait item "${traitName}" not found`);
    }
    if ("attribute" in traitItem.system) {
      return traitItem.system.attribute;
    }
    return K4Attribute.zero;
  }

  getArchetypeCarouselData(): Archetype.Data {
    // First filter Archetypes for those tiers allowed in settings
    /**
     * @todo Implement settings to allow multiple Archetype Tiers
     * (currently defaulting to "aware" only)
     */
    const allowedTiers: ArchetypeTier[] = [ArchetypeTier.aware];
    return Object.fromEntries(
      (Object.entries(Archetypes) as Array<Tuple<K4Archetype, ValOf<typeof Archetypes>>>)
        .filter(([_archetype, {tier}]) => allowedTiers.includes(tier))
        // Map data to match Archetype.Data
        .map(([archetype, data]: [K4Archetype, ValOf<typeof Archetypes>]) => {
          const advTraitData = this.getArchetypeTraitData(K4ItemType.advantage, archetype) as Partial<Record<K4Attribute, Record<string, Archetype.TraitData>>>;
          const advTraitDataArray = Object.values(advTraitData).flatMap(Object.values) as Archetype.TraitData[];
          const advSelected = advTraitDataArray.filter((traitData) => traitData.isMandatory || traitData.isSelected);
          let selStringAdvantage: Maybe<string> = undefined;
          if (advSelected.length > 3) {
            selStringAdvantage = "<span class='neon-glow-animated-red'>Too Many Advantages!</span> <br> (max: #>text-keyword>THREE<#)";
          } else if (advSelected.length === 0) {
            selStringAdvantage = "Choose #>text-keyword>THREE<# from the list below:";
          } else if (advSelected.length < 3) {
            selStringAdvantage = `Choose #>text-keyword>${U.uCase(U.verbalizeNum(3 - advSelected.length))}<# more:`;
          }

          const disTraitData = this.getArchetypeTraitData(K4ItemType.disadvantage, archetype) as Record<string, Archetype.TraitData>;
          const disTraitDataArray: Archetype.TraitData[] = Object.values(disTraitData);
          const disSelected = disTraitDataArray.filter((traitData) => traitData.isMandatory || traitData.isSelected);
          let selStringDisadvantage: Maybe<string> = undefined;
          if (disSelected.length > 2) {
            selStringDisadvantage = "<span class='neon-glow-animated-red'>Too Many Disadvantages!</span> <br> (max: #>text-keyword>TWO<#)";
          } else if (disSelected.length === 0) {
            selStringDisadvantage = "Choose #>text-keyword>TWO<#. Suggestions:";
          } else if (disSelected.length < 2) {
            selStringDisadvantage = `Choose #>text-keyword>${U.uCase(U.verbalizeNum(2 - disSelected.length))}<# more. Suggestions:`;
          }

          const darkSecretTraitData = this.getArchetypeTraitData(K4ItemType.darksecret, archetype) as Record<string, Archetype.TraitData>;
          const darkSecretTraitDataArray: Archetype.TraitData[] = Object.values(darkSecretTraitData);
          const darkSecretSelected = darkSecretTraitDataArray.filter((traitData) => traitData.isMandatory || traitData.isSelected);
          let selStringDarkSecret: Maybe<string> = undefined;
          if (darkSecretSelected.length === 0) {
            selStringDarkSecret = "Choose #>text-keyword>AT LEAST ONE<#. Suggestions:";
          } else {
            selStringDarkSecret = "(You #>text-keyword>MAY<# choose more.)";
          }
          return [
            archetype,
            {
              label: data.label,
              tier: data.tier,
              img: `systems/kult4th/assets/archetypes/${archetype}.png`,
              [K4ItemType.advantage]: this.getArchetypeTraitData(K4ItemType.advantage, archetype),
              selStringAdvantage,
              [K4ItemType.disadvantage]: this.getArchetypeTraitData(K4ItemType.disadvantage, archetype),
              selStringDisadvantage,
              [K4ItemType.darksecret]: this.getArchetypeTraitData(K4ItemType.darksecret, archetype),
              selStringDarkSecret,
              description: data.description,
              occupation: this.getStringData("occupation", archetype),
              looks: {
                clothes: this.getStringData("looks.clothes", archetype),
                face: this.getStringData("looks.face", archetype),
                eyes: this.getStringData("looks.eyes", archetype),
                body: this.getStringData("looks.body", archetype)
              },
              isSelected: this.actor.archetype === archetype
            }
          ];
      })
    );
  }

  chargenContext(): ChargenContext {

    /**
     * flagSpace: {
     *   [arch: Archetype]: {
     *     isSelected: boolean,
     *     K4ItemType.advantage: Record<advantageName, boolean>,
     *     K4ItemType.disadvantage: Record<advantageName, boolean>,
     *     occupation: string,
     *     looks: {
     *       clothes: string,
     *       face: string,
     *       eyes: string,
     *       body: string
     *     }
     *   },
     *   locked: {
     *     K4ItemType.advantage: Record<advantageName, boolean> // (obviously will only appear if Archetype doesn't filter it out)
     *   }
     * }
     *
     *
     * (CONTEXT) {
     *   selectedArchetype: Archetype,
     *   K4ItemType.advantage: {
     *     K4Attribute.violence: {
     *       [advantageName]: {
     *          name: string,
     *          img: string,
     *          tooltip: string,
     *          isSelected: boolean,
     *          isSetByLock: boolean
     *       }
     *     }
     *   },
     *
     *
     *   occupation: {
     *     value: string,
     *     examples: string[],
     *     isValueAnExample: boolean,
     *     isSetByLock: boolean
     *   }
     *
     *
     * }
     */
    const selectedArchetype = this.actor.archetype;

    /** == COMPILE DATA FROM OTHER PLAYERS == **/
    const thisUser = getUser();
    const otherUsers = Array.from(getGame().users as Collection<User>)
      .filter((user) => user.id !== thisUser.id);
    const [
      _gmUsers,
      otherPlayerUsers
    ] = U.partition<User>(otherUsers, (user) => (user as User).isGM);
    const otherPlayerData = Object.fromEntries(otherPlayerUsers
      .map((user) => [user.id, (user.character as Maybe<K4Actor<K4ActorType.pc>>)?.summaryData])
      .filter(Boolean));

    return {
      archetypeCarousel: this.getArchetypeCarouselData(),
      selectedArchetype,
      attributes: this.actor.attributeData,
      // archetypeAdvantages: selectedArchetype
      //   ? this.getArchetypeTraitData(K4ItemType.advantage, selectedArchetype)
      //   : undefined,
      // archetypeDisadvantages: (selectedArchetype
      //   ? this.getArchetypeTraitData(K4ItemType.disadvantage, selectedArchetype)
      //   : undefined) as Maybe<Record<string, Archetype.TraitData>>,
      // archetypeDarkSecrets: (selectedArchetype
      //   ? this.getArchetypeTraitData(K4ItemType.darksecret, selectedArchetype)
      //   : undefined) as Maybe<Record<string, Archetype.TraitData>>,
      description: this.getStringData("description"),
      occupation: this.getStringData("occupation"),
      looks: {
        clothes: this.getStringData("looks.clothes", selectedArchetype),
        face: this.getStringData("looks.face", selectedArchetype),
        eyes: this.getStringData("looks.eyes", selectedArchetype),
        body: this.getStringData("looks.body", selectedArchetype)
      },
      otherPlayerData
    };
  }


  _minDistanceStyles: Maybe<Record<Key, string|number>> = undefined;
  _maxDistanceStyles: Maybe<Record<Key, string|number>> = undefined;

  get minDistanceStyles(): Record<Key, string|number> {
    if (!this._minDistanceStyles) {
      this._minDistanceStyles = getDistanceStyles(0, 0);
    }
    return this._minDistanceStyles;
  }
  get maxDistanceStyles(): Record<Key, string|number> {
    if (!this._maxDistanceStyles) {
      this._maxDistanceStyles = getDistanceStyles(0, Math.floor(getArchetypeCount() / 2));
    }
    return this._maxDistanceStyles;
  }

  _element: Maybe<JQuery>;
  get element(): Maybe<JQuery> {
    console.warn("K4CharGen.element getter called but not implemented");
    return this._element;
  }



  // For immediate user feedback, fade in the bg container and the sheet immediately.
  #getTimeline_revealCarouselBaseBackground(): gsap.core.Timeline {
    if (!this.element) {
      throw new Error("K4CharGen.element getter not implemented");
    }
    const sheet$ = $(this.element);
    const bgContainer$ = sheet$.find(".pc-initialization-bg");

    return U.gsap.timeline()
      .to([sheet$, bgContainer$], {
        autoAlpha: 1,
        duration: 0.25,
        ease: "power2.out"
      });
  }

  #getTimeline_revealCarouselBackground(): gsap.core.Timeline {
    if (!this.element) {
      throw new Error("K4CharGen.element getter not implemented");
    }
    const sheet$ = $(this.element);
    const container$ = sheet$.find(".pc-initialization-bg");
    const mid$ = container$.find(".cityscape-mid");
    const clouds$ = container$.find(".cloud-bg");
    const fore$ = container$.find(".cityscape-fore");

    // Construct timeline for revealing the background buildings & clouds.
    return U.gsap.timeline({defaults: {ease: "power2.inOut"}})
      .to(clouds$, {opacity: 0.75, ease: "power2.in", duration: 1}, 0)
      .fromTo(fore$, {autoAlpha: 0}, {autoAlpha: 1, duration: 2}, 1)
      .fromTo(mid$, {autoAlpha: 0}, {autoAlpha: 1, duration: 2}, 2)
      .fromTo(fore$, {filter: "blur(20px) brightness(0)"}, {filter: "blur(1px) brightness(0.8)", duration: 6}, 0)
      .fromTo(fore$, {y: 250, scale: 1}, {y: 150, scale: 1.15, ease: "expoScale(1, 1.15, power2.inOut)", duration: 6}, 0)
      .fromTo(mid$, {y: 200, scale: 0.85}, {y: 150, scale: 1, ease: "expoScale(0.85, 1, power2.inOut)", duration: 6}, 0)
      .fromTo(mid$, {filter: "blur(40px) brightness(0)"}, {filter: "blur(2px) brightness(1)", duration: 6}, 0);
  }

  #getTimeline_revealCarouselScene(carouselStaggerDuration = 1): gsap.core.Timeline {
    if (!this.element) {
      throw new Error("K4CharGen.element getter not implemented");
    }
    const sheet$ = $(this.element);
    const container$ = sheet$.find(".pc-initialization");
    const carouselScene$ = sheet$.find(".archetype-staging");

    const selArchetype = this.actor.archetype ?? K4Archetype.academic;
    const selIndex = getIndexOfArchetype(selArchetype);

    const attributesPanel$ = container$.find(".archetype-panel.attributes");
    const notesPanel$ = container$.find(".archetype-panel.notes");
    const namePanel$ = container$.find(".archetype-panel.actor-name");
    const items$ = carouselScene$.find(".archetype-carousel-item");

    const MAX_DELAY = carouselStaggerDuration;
    const STAGGER_SHIFT = MAX_DELAY / getArchetypeCount() / 2;
    function getDelayFromIndex(index: number) {
      const nextDistRatio = 1 - getNormalizedDistanceFromSelected(wrapIndex(index + 1), selIndex);
      const thisDistRatio = 1 - getNormalizedDistanceFromSelected(index, selIndex);
      const distRatio = thisDistRatio + (nextDistRatio > thisDistRatio ? STAGGER_SHIFT : 0);
      const delay = U.gsap.utils.mapRange(0, 1, 0, MAX_DELAY, distRatio);
      // kLog.log(`[K4PCSheet] Delay (MAX: ${MAX_DELAY}): index '${index}' -> ${nextDistRatio > thisDistRatio ? `[STAGGER: '${STAGGER_SHIFT}']` : ""} distRatio '${distRatio}' -> delay '${delay}'`);
      return delay;
    }

    return U.gsap.timeline()
      .call(() => {
        void this.updateArchetypeExamples(container$);
      })
      .from(carouselScene$, {
        autoAlpha: 0,
        y: 0,
        scale: 0.7,
        filter: "blur(100px)",
        ease: "power3.in",
        duration: 1
      }, 0)
      .from(container$, {
        autoAlpha: 0,
        filter: "blur(10px)",
        backgroundPosition: "50% 620px, 50% 630px",
        duration: 0.5,
        ease: "none"
      }, 0)
      .from(items$, {
        autoAlpha: 0,
        y: 0,
        scale: 1,
        ease: "power2",
        duration: 1,
        delay: getDelayFromIndex
      })
      .from([
        attributesPanel$,
        namePanel$,
        notesPanel$
      ], {
        autoAlpha: 0,
        y: 200,
        ease: "power2",
        duration: 1,
        stagger: 0.2
      }, 0);

  }

  #getTimeline_archetypeStyle(archetype$: JQuery): gsap.core.Timeline {

    if (archetype$.data("archetypeStyleTimeline")) {
      return archetype$.data("archetypeStyleTimeline");
    }

    const archetype = archetype$.attr("data-archetype") as Maybe<K4Archetype>;
    if (!archetype) {
      throw new Error(`No archetype found for K4PCSheet: ${String(archetype$)}`);
    }

    const self = this;

    const archetypeImg$ = archetype$.find(".archetype-carousel-img");

    const archetypePanels$ = archetype$.closest(".pc-initialization").find(`.archetype-panels[data-archetype="${archetype}"]`);
    const archetypeNamePanel$ = archetypePanels$.find(".archetype-panel-name");
    const archetypeThe$ = archetypeNamePanel$.find(".archetype-carousel-the");
    const archetypeName$ = archetypeNamePanel$.find(".archetype-carousel-name");
    const archetypeDescription$ = archetypePanels$.find(".archetype-panel-description");
    const archetypeAdvantages$ = archetypePanels$.find(".archetype-panel-advantages");
    const archetypeDisadvantages$ = archetypePanels$.find(".archetype-panel-disadvantages");
    const archetypeDarkSecrets$ = archetypePanels$.find(".archetype-panel-darksecrets");

    // If not done already, split the description into individual lines
    let splitDescription = archetype$.data("splitDescription");
    if (!splitDescription) {
      // revealAndReturn(archetypeDescription$);
      splitDescription = new SplitText(archetypeDescription$, { type: "lines" });
      archetype$.data("splitDescription", splitDescription);
      // hideAndReturn(archetypeDescription$);
    }


    const tl = U.gsap.timeline({
      paused: true
    })
      .addLabel("dark")
      .fromTo(archetype$, {
        opacity: this.maxDistanceStyles.opacity,
        filter: this.maxDistanceStyles.filter,
      }, {
        opacity: this.minDistanceStyles.opacity,
        filter: this.minDistanceStyles.filter,
        duration: 1,
        ease: "none"
      })
      .addLabel("light")
      .set(archetype$, {filter: "none"})
      .set(archetypeImg$, {filter: "brightness(1) contrast(1)"})
      .call(() => {
        CONFIG.K4.charGenIsShowing = archetype;
        void self.updateArchetypeExamples(undefined, archetype);
      })
      .fromTo(archetype$, {
        scale: 1,
        opacity: 1
      }, {
        scale: 1.15,
        opacity: 1,
        duration: 2,
        ease: "power2"
      })
      .fromTo(archetypeImg$, {
      }, {
        filter: "brightness(1.25) saturate(1)",
        duration: 2,
        ease: "power2"
      }, "<")
      .set([archetypeNamePanel$, archetypeDescription$], {
        visibility: "visible",
        opacity: 1
      })
      .fromTo([
        archetypeThe$,
        archetypeName$,
        ...splitDescription.lines
      ], {
        autoAlpha: 0,
        x: -100,
        // skewX: -65,
        filter: "blur(15px)"
      }, {
        autoAlpha: 1,
        // skewX: 0,
        x(this: gsap.core.Timeline, index: number) {
          index = Math.max(0, index - 2);
          return gsap.utils.random(0, index * 5);
          // return index * 5 + gsap.utils.random(-10, 10);
        },
        filter: "blur(0px)",
        ease: "power2",
        duration: 2,
        stagger: {
          each: 0.25
        }
      }, "<")
      .fromTo([
        archetypeAdvantages$,
        archetypeDisadvantages$,
        archetypeDarkSecrets$
      ], {
        autoAlpha: 0,
        y: 200
      }, {
        autoAlpha: 1,
        y: 0,
        ease: "power2",
        onStart() {
          const archetypeData = self.getArchetypeCarouselData()[archetype];
          if (!archetypeData) {
            throw new Error(`No archetype data found for archetype: ${archetype}`);
          }
          void self.#reRenderTraitPanel(archetype$, archetypeData);
        },
        duration: 2,
        stagger: {
          amount: 0.25
        }
      }, "<")
      .addLabel("selected")

      // tl.seek("light");

      return tl;
  }

/*
  #getTimeline_focusArchetype(archetype$: JQuery, duration: number): gsap.core.Timeline {
    const halfDuration = 0.5 * duration;
    const self = this;
    const archetype = archetype$.attr("data-archetype") as Maybe<K4Archetype>;
    if (!archetype) {
      throw new Error(`No archetype found for K4PCSheet: ${String(archetype$)}`);
    }
    const archetypeImg$ = archetype$.find(".archetype-carousel-img");

    const archetypePanels$ = archetype$.closest(".pc-initialization")
      .find(`.archetype-panels[data-archetype="${archetype}"]`);
    const archetypeNamePanel$ = archetypePanels$.find(".archetype-panel-name");
    const archetypeThe$ = archetypeNamePanel$.find(".archetype-carousel-the");
    const archetypeName$ = archetypeNamePanel$.find(".archetype-carousel-name");
    const archetypeDescription$ = archetypePanels$.find(".archetype-panel-description");
    const archetypeAdvantages$ = archetypePanels$.find(".archetype-panel-advantages");
    const archetypeDisadvantages$ = archetypePanels$.find(".archetype-panel-disadvantages");
    const archetypeDarkSecrets$ = archetypePanels$.find(".archetype-panel-darksecrets");

    // If not done already, split the description into individual lines
    let splitDescription = archetype$.data("splitDescription");
    if (!splitDescription) {
      splitDescription = new SplitText(archetypeDescription$, { type: "lines" });
      archetype$.data("splitDescription", splitDescription);
    }

    const tl = U.gsap.timeline({paused: true, repeat: 1, yoyo: true});

    tl
      .fromTo(archetype$, {
        scale: 1,
        opacity: 1
      }, {
        scale: 1.15,
        opacity: 1,
        duration: halfDuration / 2,
        ease: "power2"
      })
      .fromTo(archetypeImg$, {
      }, {
        filter: "brightness(1.25) saturate(1)",
        duration: halfDuration / 2,
        ease: "power2"
      }, "<")
      // .set([archetypeNamePanel$, archetypeDescription$], {
      //   visibility: "visible",
      //   opacity: 1
      // })
      .fromTo([
        archetypeThe$,
        archetypeName$,
        ...splitDescription.lines
      ], {
        autoAlpha: 0,
        x: -100,
        filter: "blur(15px)"
      }, {
        autoAlpha: 1,
        x(this: gsap.core.Timeline, index: number) {
          index = Math.max(0, index - 2);
          return gsap.utils.random(0, index * 5);
        },
        filter: "blur(0px)",
        ease: "power2",
        duration: halfDuration,
        stagger: {
          each: 0.25
        }
      }, "<")
      .fromTo([
        archetypeAdvantages$,
        archetypeDisadvantages$,
        archetypeDarkSecrets$
      ], {
        autoAlpha: 0,
        y: 200
      }, {
        autoAlpha: 1,
        y: 0,
        ease: "power2",
        duration: halfDuration / 2,
        stagger: {
          amount: 0.25
        }
      }, halfDuration / 4)
      .call(() => {
        if (!tl.reversed()) {
          CONFIG.K4.charGenIsShowing = archetype;
          void self.updateArchetypeExamples(undefined, archetype);
          const archetypeData = this.getArchetypeCarouselData()[archetype];
          void this.#reRenderTraitPanel(archetype$, archetypeData);
        }
      });

    return tl;
  }

  #getTimeline_rotateArchetype(archetype$: JQuery, timePerArchetype: number, minDistanceStyles: Record<Key, string|number>, maxDistanceStyles: Record<Key, string|number>): gsap.core.Timeline {
    let tl = archetype$.data("rotateTimeline") as Maybe<gsap.core.Timeline>;
    if (!tl) {
      tl = U.gsap.timeline({repeat: -1});

      // For a 10s total timeline, we construct only the first half then yoyo it
      const fadeInDuration = 5 - 0.5 * timePerArchetype;

      tl
        .fromTo(archetype$, {
          opacity: maxDistanceStyles.opacity,
          filter: maxDistanceStyles.filter,
        }, {
          opacity: minDistanceStyles.opacity,
          filter: minDistanceStyles.filter,
          duration: fadeInDuration,
          ease: "none"
        })
        .add(this.#getTimeline_focusArchetype(archetype$, timePerArchetype))
        .fromTo(archetype$, {
          opacity: minDistanceStyles.opacity,
          filter: minDistanceStyles.filter,
        }, {
          opacity: maxDistanceStyles.opacity,
          filter: maxDistanceStyles.filter,
          duration: fadeInDuration,
          ease: "none"
        });

      archetype$.data("rotateTimeline", tl);
    }
    return tl;
  }

  #getTimeline_rotateCarousel(carouselScene$: JQuery): gsap.core.Timeline {
    const carousel$ = carouselScene$.find(".archetype-carousel");

    let tl = carousel$.data("carouselRotationTimeline") as Maybe<gsap.core.Timeline>;
    if (!tl) {
      const archetypeItems$ = carousel$.find(".archetype-carousel-item");
      const itemImages$ = carousel$.find(".archetype-carousel-item .archetype-carousel-img");

      tl = U.gsap.timeline({paused: true, repeat: -1})
        .to(carousel$, {
          rotationY: "+=360",
          duration: 10,
          repeat: -1,
          ease: "none"
        })
        .fromTo(itemImages$, {
          xPercent: -50,
          yPercent: -50
        }, {
          rotationY: "-=360",
          duration: 10,
          repeat: -1,
          ease: "none"
        }, 0);

      // For each archetype, retrieve the looping timeline and add it to the carousel, offsetting each to spread their focus moment around the carousel.
      // Get total number of archetypes to determine how much of the 10s timeline they will be focused for
      const totalArchetypes = getArchetypeCount();
      const timePerArchetype = 10 / totalArchetypes;

      // Determine minimum and maximum values for distance-based styles
      const minDistanceStyles = getDistanceStyles(0, 0);
      const maxDistanceStyles = getDistanceStyles(0, Math.floor(getArchetypeCount() / 2));

      archetypeItems$.each((i, archetypeItem) => {
        const archetype$ = $(archetypeItem);
        const archetypeTimeline = this.#getTimeline_rotateArchetype(archetype$, timePerArchetype, maxDistanceStyles, minDistanceStyles);
        tl!.add(archetypeTimeline, i * timePerArchetype);
      });

      // To account for all of the overlapping archetype timelines, we'll be running the carousel rotation after a full repeat -- i.e. from
      // 10s to 20s, then back to 10s.
      tl.seek(10);
      tl.call(() => {
        tl!.seek(10);
      }, [], 20);

      carousel$.data("carouselRotationTimeline", tl);
    }
    return tl;
  }

  #constructCarousel(carouselScene$: JQuery) {
    const carousel$ = carouselScene$.find(".archetype-carousel");
    const items$ = carousel$.find(".archetype-carousel-item");

    const totalItems = getArchetypeCount();
    const radius = Math.round((this.itemWidth / 2) / Math.tan(Math.PI / totalItems));

    void U.gsap.set(carousel$, {z: -1 * radius});

    void Promise.all(items$.map((i, item) => {
      U.gsap.set(item, {
        transform: `rotateY(${-1 * getYRotFromIndex(i)}deg) translateZ(${radius}px)`
      });
      U.gsap.set($(item).find(".archetype-carousel-img")[0], {
        xPercent: -50,
        yPercent: -50,
        top: "50%",
        left: "50%",
        rotationY: getYRotFromIndex(i)
      });
    }));
  }

  async initializeCarouselScene(): Promise<void> {

    void this.#getTimeline_revealCarouselBaseBackground().play();

    const timeStamp = U.getTimeStamp();

    kLog.log(`${timeStamp()} - Initializing Carousel Scene`);

    const sheet$ = $(this.element);
    sheet$.find(".window-header, .window-resizable-handle")
      .css("display", "none");

    // Construct the carousel by positioning and rotating all elements
    const carouselScene$ = sheet$.find(".archetype-staging");
    this.#constructCarousel(carouselScene$);
    kLog.log(`${timeStamp()} - Carousel Scene Constructed`);

    // Get the master carousel rotation timeline and attach it to the carousel
    const carouselRotationTimeline = this.#getTimeline_rotateCarousel(carouselScene$);
    Object.assign(globalThis, {carouselRotationTimeline});
    // carouselRotationTimeline.play();
    kLog.log(`${timeStamp()} - Carousel Rotation Timeline Attached`);

    kLog.log(`${timeStamp()} - Carousel Rendered, Awaiting Video`);
    const cloudVideo = (sheet$.find(".cloud-bg") as JQuery<Maybe<HTMLVideoElement>>)[0];
    if (cloudVideo) {
      if (cloudVideo.readyState >= 3) {
        kLog.log(`${timeStamp()} - Video Ready, Animating Carousel`);
        this.#animateCarousel(cloudVideo);
      } else {
        kLog.log(`${timeStamp()} - Video Not Ready, Waiting for Video`);
        // this.#animateCarousel(cloudVideo);
        // Wait for the video to be ready
        cloudVideo.addEventListener('canplay', () => { this.#animateCarousel(cloudVideo); }, { once: true });
        // Fallback in case the video fails to load
        cloudVideo.addEventListener('error', () => { this.#animateCarousel(cloudVideo); }, { once: true });
      }
    }


    return;

    // Add the carousel drag controller
    this.#constructCarouselDragger(sheet$);
    kLog.log(`${timeStamp()} - Carousel Dragger Constructed`);


    // Attach archetype timelines and listeners to their associated elements
    sheet$.find(".archetype-carousel-item[data-archetype]").each((_i, archetypeElem) => {
      const archetype$ = $(archetypeElem);
      this.#attachListeners_archetypePanels(archetype$);
      // const archetypeStyleTimeline = this.#getTimeline_archetypeStyle(archetype$);
      // archetype$.data("archetypeStyleTimeline", archetypeStyleTimeline);
    });
    kLog.log(`${timeStamp()} - Archetype Timelines Attached`);

    // Update the carousel to match the selected archetype
    await this.#updateCarouselFromDragger(getXPosFromIndex(this.selArchetypeIndex), false);
    kLog.log(`${timeStamp()} - Carousel Updated to Selected Archetype`);

    // Add panel listeners

    kLog.log(`${timeStamp()} - More Buttons Attached to Archetype Panels`);

    // if (CONFIG.K4.isCharGenInitialized) {
    //   kLog.log(`${timeStamp()} - Carousel Rendered, NOT Animating`);
    //   this.#renderCarousel();
    // } else {
      kLog.log(`${timeStamp()} - Carousel Rendered, Awaiting Video`);
      const orig_cloudVideo = (sheet$.find(".cloud-bg") as JQuery<Maybe<HTMLVideoElement>>)[0];
      if (orig_cloudVideo) {
        if (orig_cloudVideo.readyState >= 3) {
          kLog.log(`${timeStamp()} - Video Ready, Animating Carousel`);
          this.#animateCarousel(orig_cloudVideo);
        } else {
          kLog.log(`${timeStamp()} - Video Not Ready, Waiting for Video`);
          this.#animateCarousel(orig_cloudVideo);
          // Wait for the video to be ready
          // orig_cloudVideo.addEventListener('canplay', () => { this.#animateCarousel(orig_cloudVideo); }, { once: true });
          // Fallback in case the video fails to load
          // orig_cloudVideo.addEventListener('error', () => { this.#animateCarousel(orig_cloudVideo); }, { once: true });
        }
      }
    // }
  }
 */

  #getTimeline_revealCarousel(): gsap.core.Timeline {
    if (!this.element) {
      throw new Error("K4CharGen.element getter not implemented");
    }
    const sheet$ = $(this.element);
    const selectedArchetypeTimeline = this.#getTimeline_archetypeStyle(sheet$.find(`.archetype-carousel-item[data-archetype="${this.actor.archetype ?? K4Archetype.academic}"]`));
    return U.gsap.timeline({paused: true})
      .add(this.#getTimeline_revealCarouselBackground())
      .add(this.#getTimeline_revealCarouselScene())
      .add(selectedArchetypeTimeline.tweenTo(selectedArchetypeTimeline.duration(), {duration: 3}).play(), "-=1");
  }

  #getTimeline_traitSelection(traitContainer$: JQuery): gsap.core.Timeline {

    // Extracts path data string for an ease curve, converting into a simple list of x,y points
    function getEaseSVGData(easeCurve: gsap.EaseFunction) {
      return (CustomEase.getSVGData(easeCurve, {
        width: 1,
        height: 1,
        invertY: true // Keep this true to match SVG coordinate system
      }) as string)
        // The ease string starts with 'M' but contains nothing else except digits and commas:
        .replace(/C/g, "")
        .replace(/ /g, ",");
    }
    // Extracts point pairs of an ease curve
    function getEasePoints(easeCurve: gsap.EaseFunction, steps?: number): Array<Tuple<number>> {
      const points: Array<Tuple<number>> = [];
      if (typeof steps === 'number' && steps > 0) {
        // If steps is provided, sample the ease at regular intervals
        const easeFunc = typeof easeCurve === 'string' ? gsap.parseEase(easeCurve) : easeCurve;
        for (let i = 0; i <= steps; i++) {
          const progress = i / steps;
          points.push([progress, easeFunc(progress)]);
        }
        return points;
      } else {
        // If steps is not provided, use the original SVG data parsing method
        const easeData = getEaseSVGData(easeCurve);
        const allValues = easeData.split(/[M,]/).filter(v => v.trim()).map(Number);
        for (let i = 0; i < allValues.length; i += 2) {
          points.push([allValues[i], allValues[i + 1]]);
        }
        return points;
      }
    }
    // Given a list of point pairs, returns {minX, maxX, minY, maxY}
    function getMaxAndMin(points: Array<Tuple<number>>) {
      const xPoints = points.map((p) => p[0]);
      const yPoints = points.map((p) => p[1]);
      return {
        minX: Math.min(0, ...xPoints),
        maxX: Math.max(1, ...xPoints),
        minY: Math.min(0, ...yPoints),
        maxY: Math.max(1, ...yPoints)
      };
    }
    // Given a list of point pairs, will normalize the points to between 0 and 1
    function normalizePoints(points: Array<Tuple<number>>): Array<Tuple<number>> {
      const {minX, maxX, minY, maxY} = getMaxAndMin(points);
      const xMapper = gsap.utils.mapRange(minX, maxX, 0, 1);
      const yMapper = gsap.utils.mapRange(minY, maxY, 0, 1);
      return points.map(([xPoint, yPoint]) => [xMapper(xPoint), yMapper(yPoint)]);
    }
    // Converts point pairs back to string representation of an ease curve
    function getEaseStringFromPoints(points: Array<Tuple<number>>) {
      return `M${points.flat().join(",")}`;
    }

    // Function to create a wiggle ease
    function createWiggleEase(wiggles = 100) {
      const ease = CustomWiggle.create("my-wiggle", { //name
        wiggles,
        type: "random"
      });
      const points = getEasePoints(ease);
      const normalizedPoints = normalizePoints(points);
      const normalizedEaseString = getEaseStringFromPoints(normalizedPoints);
      const normalizedEase = CustomEase.create(`wiggle-${wiggles}`, normalizedEaseString);

      return normalizedEase;
    }

    function createControlledWiggleEase(controlEase: gsap.EaseFunction|string, steps = 100): gsap.EaseFunction {
      controlEase = typeof controlEase === "string" ? gsap.parseEase(controlEase) : controlEase;

      // Create the wiggle ease
      const wiggleEase = createWiggleEase(steps);

      // Extract the points from the wiggle ease
      const wigglePoints = getEasePoints(wiggleEase, steps);

      // Extract the points from the control ease
      const controlPoints = getEasePoints(controlEase, steps);

      // The control ease determines the threshold for the final ease to be 0 or 1:
      const controlledWigglePoints: Array<Tuple<number>> = wigglePoints.map(([wX, wY], i) => {
        const cY = controlPoints[i][1];
        if (cY >= wY) { return [wX, cY]; }
        return [wX, 0];
      });

      const controlledWiggleEase = CustomEase.create(`controlledWiggle-${steps}`, getEaseStringFromPoints(controlledWigglePoints));

      // console.log("CONTROLLED WIGGLE EASE", {wigglePoints, controlPoints, controlledWigglePoints});

      return controlledWiggleEase;
    }

    const glowColors: Partial<Record<K4ItemType, string>> = {
      [K4ItemType.advantage]: "neon-glow-animated-gold",
      [K4ItemType.disadvantage]: "neon-glow-animated-red",
      [K4ItemType.darksecret]: "neon-glow-animated-white"
    };
    const traitType = traitContainer$.attr("data-trait-type") as keyof typeof glowColors;
    const glowClass = glowColors[traitType] ?? "";

    let tl = traitContainer$.data("traitSelectionTimeline") as Maybe<gsap.core.Timeline>;
    if (!tl) {
      const traitName$ = traitContainer$.find(".archetype-trait-name");
      const splitTraitName = traitContainer$.data("splitTraitName") as Maybe<SplitText> ?? new SplitText(traitName$, {type: "chars"});
      traitContainer$.data("splitTraitName", splitTraitName);

      const actor = this.actor;
      const trait = traitContainer$.attr("data-trait")!;

      tl = U.gsap.timeline({
        paused: true,
        onReverseComplete() {
          void actor.charGenDeselect(trait);
          traitContainer$.attr("data-is-selected", "false");
          traitContainer$.removeClass(glowClass);
        }
      });
      tl
        .addLabel("unselected")
        .to(splitTraitName.chars, {
          color: "rgb(255, 255, 255)",
          fontWeight: 700,
          // textShadow: "0 0 3px rgb(255, 255, 255)",
          ease: createControlledWiggleEase("power2.in", 200),
          duration: 2,
          stagger: {
            each: 0.05,
            ease: "power3.out"
          },
          clearProps: "textShadow"
        })
        .call(() => {
          if (!tl!.reversed()) {
            void actor.charGenSelect(trait);
            traitContainer$.attr("data-is-selected", "true");
            traitContainer$.addClass(glowClass);
          }
        })
        .addLabel("selected");
    }

    traitContainer$.data("traitSelectionTimeline", tl);
    return tl;
  }

  #attachListeners_trait(traitContainer$: JQuery) {
    if (!this.element) {
      throw new Error("K4CharGen.element getter not implemented");
    }
    const sheet$ = $(this.element);
    const trait = traitContainer$.attr("data-trait");
    let clickTimer: NodeJS.Timeout | null = null;
    let longPressTriggered = false;
    const glowColors: Partial<Record<K4ItemType, string>> = {
      [K4ItemType.advantage]: "neon-glow-animated-gold",
      [K4ItemType.disadvantage]: "neon-glow-animated-red",
      [K4ItemType.darksecret]: "neon-glow-animated-white"
    };
    const traitType = traitContainer$.attr("data-trait-type") as keyof typeof glowColors;

    if (traitContainer$.attr("data-is-mandatory") === "true" || traitContainer$.attr("data-is-selected") === "true") {
      const tl = this.#getTimeline_traitSelection(traitContainer$);
      void tl.progress(1);
    }

    traitContainer$.on({
      mousedown: () => {
        const isMandatory = traitContainer$.attr("data-is-mandatory") === "true";
        if (isMandatory) { return; }
        const isSelected = traitContainer$.attr("data-is-selected") === "true";
        longPressTriggered = false;
        clickTimer = setTimeout(() => {
          longPressTriggered = true;
        }, 500);
        const tl = this.#getTimeline_traitSelection(traitContainer$);
        kLog.log("MOUSE DOWN", {tl, isSelected, isMandatory, trait, longPressTriggered, clickTimer});
        if (isSelected) {
          // traitContainer$.removeClass(glowClass);
          tl.timeScale(1).reverse();
        } else {
          tl.seek(0.5).timeScale(1).play();
        }
      },
      mouseup: () => {
        const isMandatory = traitContainer$.attr("data-is-mandatory") === "true";
        if (isMandatory) { return; }
        const tl = this.#getTimeline_traitSelection(traitContainer$);
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
        }
        if (tl.isActive()) {
          if (tl.reversed()) {
            tl.timeScale(3).play();
          } else {
            // traitContainer$.removeClass(glowClass);
            tl.timeScale(3).reverse();
          }
        }
      },
      click: async () => {
        if (longPressTriggered) { return; }
        const traitItem = getGame().items.getName(trait) as Maybe<K4Item>;
        if (!traitItem) { return; }
        // Scan the <body> element for all `.k4-item-sheet` elements and derive the highest z-index
        const highestZIndex = Math.max(...$("body").find(".k4-item-sheet").map((_i, sheet) =>
          U.pInt($(sheet).css("z-index"))
        ).toArray());
        sheet$.css("z-index", 100);
        if (!traitItem.sheet.rendered) {
          traitItem.sheet.render(true);
          await U.sleep(150);
        }
        traitItem.sheet.element.css("z-index", highestZIndex + 1);
        sheet$.css("z-index", 100);
      }
    });
  }

  #attachListeners_archetypePanels(archetype$: JQuery) {

    const archetype = archetype$.attr("data-archetype") as Maybe<K4Archetype>;
    if (!archetype) {
      throw new Error(`No archetype found for K4PCSheet: ${String(archetype$)}`);
    }
    const archetypePanels$ = archetype$.closest(".pc-initialization").find(`.archetype-panels[data-archetype="${archetype}"]`);
    const getUnlistedItemsOfType = (type: K4ItemType.disadvantage|K4ItemType.darksecret) => {
      const {archetype} = this.actor;
      if (!archetype) { return []; }
      const listedTraits: string[] = [];
      const cData = this.getArchetypeCarouselData();
      if (cData[archetype]?.[type]) {
        listedTraits.push(
          ...Object.keys(cData[archetype][type])
            .map((traitName) => traitName.replace(/^!/, ""))
        );
      }
      return getGame().items
        .filter((item: any): item is K4Item<K4ItemType.disadvantage|K4ItemType.darksecret> =>
          item.type === type && !listedTraits.includes(item.name)
        );
    };
    archetypePanels$.find(".archetype-panel-advantages, .archetype-panel-disadvantages, .archetype-panel-darksecrets")
      .each((_i, panel) => {
        const panel$ = $(panel);
        panel$.find(".archetype-trait-container")
          .each((_i, cont) => {
            this.#attachListeners_trait($(cont));
          });
      });
    // Add listeners to "more" buttons
    archetypePanels$.find("button.more-disadvantages").off("click.k4disadvantages").on("click.k4disadvantages", () => {
      void (async () => {
        const item = await K4Dialog.GetUserItemSelection<K4ItemType.disadvantage>({
          title: "Select a Disadvantage",
          bodyText: "(<strong>Click</strong> to View, <strong>Right</strong>-Click to Select, <strong>Escape</strong> to Cancel.)",
          itemList: getUnlistedItemsOfType(K4ItemType.disadvantage)
        });
        if (item) {
          await this.actor.charGenSelect(item.name, false);
        }
      })();
    });

    archetypePanels$.find("button.more-dark-secrets").off("click.k4darksecrets").on("click.k4darksecrets", () => {
      void (async () => {
        const item = await K4Dialog.GetUserItemSelection<K4ItemType.darksecret>({
          title: "Select a Dark Secret",
          bodyText: "(<strong>Click</strong> to View, <strong>Right</strong>-Click to Select, <strong>Escape</strong> to Cancel.)",
          itemList: getUnlistedItemsOfType(K4ItemType.darksecret)
        });
        if (item) {
          await this.actor.charGenSelect(item.name, false);
        }
      })();
    });
  }

  updateArchetypeItem(item$: JQuery, rotation: number, selIndex?: number) {
    const selArchetypeIndex = selIndex ?? getIndexFromYRot(rotation);
    const thisIndex = U.pInt(item$.attr("data-index"));
    U.gsap.set(item$[0], { rotationY: -rotation });
    if (thisIndex === selArchetypeIndex) { return; }
    const thisTimeline = this.#getTimeline_archetypeStyle(item$);
    // kLog.log(`Updating Seeking Archetype Item '${item$.attr("data-archetype")}' ($${thisIndex}) to ${1 - getNormalizedDistanceFromSelected(thisIndex, selArchetypeIndex)}`);
    thisTimeline.seek(1 - getNormalizedDistanceFromSelected(thisIndex, selArchetypeIndex), true).pause();
  }

  async #updateCarouselFromDragger(x: number, isTweening = false) {
    if (!this.element) {
      throw new Error("K4CharGen.element getter not implemented");
    }
    const html$ = $(this.element);
    const carousel$ = html$.find(".archetype-carousel");
    const dragger$ = html$.find(".archetype-carousel-drag-handle");
    const items$ = carousel$.find(".archetype-carousel-item");
    const wrappedX = wrapXPos(x);
    const thisIndex = getIndexFromXPos(wrappedX);
    const rotation = isTweening
      ? getYRotFromIndex(thisIndex)
      : getYRotFromXPos(wrappedX);
    let tl: gsap.core.Tween;
    if (isTweening) {
      tl = U.gsap.to(carousel$, {rotationY: rotation, duration: 0.5, ease: "back.inOut"});
    } else {
      tl = U.gsap.set(carousel$, { rotationY: rotation });
    }
    U.gsap.set(dragger$[0], { x: wrappedX, duration: 0 });
    items$.each((_i, item) => {
      this.updateArchetypeItem($(item), rotation, isTweening ? thisIndex : undefined);
    });
    await tl;
  }

  selArchetypeIndex = getIndexOfArchetype(this.actor.archetype ?? K4Archetype.academic);
  #constructCarouselDragger(html$: JQuery) {
    const draggerContainer$ = html$.find(".archetype-carousel-dragger");
    const dragger$ = draggerContainer$.find(".archetype-carousel-drag-handle");
    const carousel$ = html$.find(".archetype-carousel");
    const items$ = carousel$.find(".archetype-carousel-item");
    const self = this;

    const getSnappedXPos = (x: number) => {
      const newIndex = getIndexFromXPos(wrapXPos(x));
      return getXPosFromIndex(newIndex);
    }

    const snapToNearestArchetype = async (x: number, isCompleting = false, isUpdating = true) => {
      const newIndex = getIndexFromXPos(wrapXPos(x));
      this.actor.archetype = getArchetypeFromIndex(newIndex);
      this.selArchetypeIndex = newIndex;
      if (isUpdating) {
        await this.#updateCarouselFromDragger(getXPosFromIndex(newIndex), isCompleting);
      }
      K4DebugDisplay.updateArchetypeInfo(this.actor.archetype, this.selArchetypeIndex, newIndex, newIndex);
      if (isCompleting) {
        focusOn();
      }
      return getXPosFromIndex(newIndex);
    };

    const focusOn = (index = this.selArchetypeIndex) => {
      dragger$.css("pointer-events", "none");
      const selectedArchetype = getElementFromIndex(carousel$, index);
      const archetype = getArchetypeFromIndex(index);
      const selectedArchetypeTimeline = this.#getTimeline_archetypeStyle($(selectedArchetype));
      U.gsap.timeline()
        .add(selectedArchetypeTimeline.tweenTo("selected", {duration: 2}))
        .add(() => { void this.reRenderTraitPanels(archetype); }, 1)
        .add(() => { dragger$.css("pointer-events", "auto"); });
    }
    const focusOff = (index = this.selArchetypeIndex) => {
      const selectedArchetype = getElementFromIndex(carousel$, index);
      const selectedArchetypeTimeline = this.#getTimeline_archetypeStyle($(selectedArchetype));
      void selectedArchetypeTimeline.seek("light", true).pause();
    }

    const dragger = Dragger.create(dragger$, {
      type: "x",
      inertia: true,
      dragResistance: 0.5,
      maxDuration: 0.25,
      // startX: getXPosFromIndex(getIndexOfArchetype(this.actor.archetype ?? K4Archetype.academic)),
      snap: {
        x: function(this: Dragger, value: number) {
          if (!this.isThrowing) { return value; }
          return getSnappedXPos(value);
        }
      },
      onDragStart: function(this: Dragger) {
        focusOff();
      },
      onDrag: function(this: Dragger) {
        void self.#updateCarouselFromDragger(this.x, false);
        K4DebugDisplay.updateDraggerInfo(this, self.actor);
      },
      onDragEnd: function(this: Dragger) {
        if (this.isThrowing) { return; }
        // void self.#updateCarouselFromDragger(this.x, false);
        void snapToNearestArchetype(this.x, true);
      },
      onThrowUpdate: function(this: Dragger) {
        void self.#updateCarouselFromDragger(this.x, false);
        K4DebugDisplay.updateDraggerInfo(this, self.actor);
      },
      onThrowComplete: function(this: Dragger) {
        // void self.#updateCarouselFromDragger(this.x, false);
        void snapToNearestArchetype(this.x, true);
      }
    })[0];

    // void this.#updateCarouselFromDragger(dragger.x, false);

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (K4DebugDisplay.IS_DEBUGGING) {
      kLog.log("Dragger Created", {dragger, draggerContainer$, dragger$});

      // Update debug info on each frame
      gsap.ticker.add(() => {
        const x = gsap.getProperty(dragger$[0], "x") as number;
        updateDebugInfo(carousel$, x);
        K4DebugDisplay.updateDraggerInfo(Dragger.get(dragger$), this.actor);
      });
    }
  }

  itemWidth = 200;
  #constructCarousel(carouselScene$: JQuery) {
    const carousel$ = carouselScene$.find(".archetype-carousel");
    const items$ = carousel$.find(".archetype-carousel-item");

    const totalItems = getArchetypeCount();
    const radius = Math.round((this.itemWidth / 2) / Math.tan(Math.PI / totalItems));

    [carouselScene$, carousel$, items$].forEach(revealAndReturn);

    void U.gsap.set(carousel$, {z: -1 * radius});

    void Promise.all(items$.map((i, item) => {
      const item$ = $(item);
      const archTimeline = this.#getTimeline_archetypeStyle(item$);
      const distFromSelected = getNormalizedDistanceFromSelected(i, this.selArchetypeIndex);
      archTimeline.seek(1 - distFromSelected, true);
      return U.gsap.set(item, {
        transform: `rotateY(${-1 * getYRotFromIndex(i)}deg) translateZ(${radius}px) rotateY(${getYRotFromIndex(i)}deg)`
      });
    }));

    hideAndReturn(items$);

    U.gsap.set([carouselScene$, carousel$], { opacity: 1, visibility: "visible" });

    this.#constructCarouselDragger(carouselScene$);
  }

  async #reRenderTraitPanel(archetype$: JQuery, panelData: Archetype.ArchetypeData) {
    const htmlContent = await renderTemplate("systems/kult4th/templates/sheets/pc-initialization-archetype-trait-panels.hbs", {data: panelData});
    archetype$.find(".archetype-trait-panels-wrapper").html(htmlContent);
    this.#attachListeners_archetypePanels(archetype$);
  }

  async reRenderTraitPanels(archetype?: K4Archetype) {
    if (!this.element) {
      throw new Error("K4CharGen.element getter not implemented");
    }
    kLog.log("Re-rendering trait panels");
    const sheet$ = $(this.element);
    archetype ??= this.actor.archetype ?? K4Archetype.academic;
    // Use destructuring to separate carousel data into its archetype-specific and archetype-independent components
    const allCarouselData = this.getArchetypeCarouselData();
    const archetypeData = allCarouselData[archetype];
    if (!archetypeData) {
      throw new Error(`No archetype data found for archetype: ${archetype}`);
    }
    const archetype$ = sheet$.find(`.archetype-panels[data-archetype="${archetype}"]`);
    await this.#reRenderTraitPanel(archetype$, archetypeData);

    // Use async/multithreading to render remaining panels without interrupting the main thread
    // void Promise.all((Object.keys(allCarouselData) as K4Archetype[])
    //   .filter((aType) => aType !== archetype)
    //   .map(async (aType) => {
    //     const panelData = allCarouselData[aType]!;
    //     const panel$ = sheet$.find(`.archetype-panels[data-archetype="${aType}"]`);
    //     await this.#reRenderTraitPanel(panel$, panelData);
    //   }));
  }

  #animateCarousel(videoElem: HTMLVideoElement) {
    void videoElem.play();
    CONFIG.K4.isCharGenInitialized = true;
    return this.#getTimeline_revealCarousel().play();
  }

  // #renderCarousel() {
  // if (!this.element) {
  //   throw new Error("K4CharGen.element getter not implemented");
  // }
  //   const sheet$ = $(this.element);
  //   const container$ = sheet$.find(".pc-initialization");
  //   const bgContainer$ = sheet$.find(".pc-initialization-bg");
  //   const mid$ = bgContainer$.find(".cityscape-mid");
  //   const clouds$ = bgContainer$.find(".cloud-bg");
  //   const cloudsVideo = clouds$[0] as Maybe<HTMLVideoElement>;
  //   void cloudsVideo?.play();
  //   const fore$ = bgContainer$.find(".cityscape-fore");
  //   const carouselScene$ = container$.find(".archetype-staging");
  //   const attributesPanel$ = container$.find(".archetype-panel.attributes");
  //   const notesPanel$ = container$.find(".archetype-panel-notes");
  //   const namePanel$ = container$.find(".archetype-panel.actor-name");
  //   const items$ = carouselScene$.find(".archetype-carousel-item");

  //   U.gsap.set([
  //     sheet$,
  //     container$,
  //     carouselScene$,
  //     bgContainer$,
  //     mid$,
  //     fore$,
  //     attributesPanel$,
  //     notesPanel$,
  //     namePanel$,
  //     items$
  //   ], {
  //     autoAlpha: 1,
  //     opacity: 1
  //   });

  //   U.gsap.set(clouds$, {
  //     autoAlpha: 0.5,
  //     opacity: 0.5
  //   });

  //   const selArchetypeIndex = getIndexOfArchetype(this.actor.archetype ?? K4Archetype.academic);
  //   const draggerXPos = getXPosFromIndex(selArchetypeIndex);
  //   // U.gsap.set([sheet$, container$, bgContainer$, mid$, fore$, carouselScene$, attributesPanel$, notesPanel$, namePanel$, items$], {autoAlpha: 1, opacity: 1});
  //   // U.gsap.set(clouds$, {autoAlpha: 1, opacity: 0.5});
  //   void this.#updateCarouselFromDragger(draggerXPos, false);
  //   void this.actor.sheet.updateArchetypeExamples(container$);
  //     //       $([
  //     //         sheet$,
  //     //         container$,
  //     //         carouselScene$,
  //     //         archetypeExamples$,
  //     //         items$,
  //     //         attributesPanel$,
  //     //         namePanel$,
  //     //         descriptionPanel$
  //     //       ]).css("visibility", "visible");
  //     //       void ANIMATIONS.revealBackground(carouselScene$);
  //     //       this.actor.sheet.updateArchetypeExamples(container$);
  //     //       return;
  // }
  get awaitElement(): Promise<JQuery> {
    return new Promise((resolve, reject) => {
      const maxAttempts = 100; // 10 seconds with 100ms interval
      let attempts = 0;

      const checkElement = () => {
        if (this.element) {
          resolve(this.element);
        } else if (attempts >= maxAttempts) {
          reject(new Error("No element found for K4PCSheet after 10 seconds"));
        } else {
          attempts++;
          setTimeout(checkElement, 100);
        }
      };

      checkElement();
    });
  }
  async updateArchetypeExamples(html?: JQuery, archetype?: K4Archetype) {
    html = html ?? await this.awaitElement;

    archetype = archetype ?? this.actor.archetype;
    if (!archetype) { return; }

    // Prepare the example strings for the selected archetype.
    const archData = Archetypes[archetype];
    const archetypeExamples$ = html.find(".archetype-example-list");
    // kLog.log("[K4PCSheet] archetypeExamples$", {archetypeExamples$, archData});
    archetypeExamples$.each((_i, elem) => {
      const target = $(elem).attr("data-target") as Maybe<string>;
      // kLog.log("[K4PCSheet] archetypeExamples$", {elem, target, archData});
      if (target) {
        const example = U.getProp<string[]>(archData, target);
        // kLog.log("[K4PCSheet] archetypeExamples$", {elem, target, example});
        if (example) {
          $(elem).html(`<span class="archetype-example">${
            example.join("</span><span class='archetype-example-separator'>◆</span><span class='archetype-example'>")
          }</span>`);
        }
      }
    });
  }

  async initializeCarouselScene(): Promise<void> {

    const timeStamp = U.getTimeStamp();

    kLog.log(`${timeStamp()} - Initializing Carousel Scene`);

    if (!this.element) {
      throw new Error("K4CharGen.element getter not implemented");
    }
    const sheet$ = $(this.element);
    sheet$.find(".window-header, .window-resizable-handle").css("display", "none");
    void this.#getTimeline_revealCarouselBaseBackground().play();

    // Construct the carousel by positioning and rotating all elements
    const carouselScene$ = sheet$.find(".archetype-staging");
    this.#constructCarousel(carouselScene$);
    kLog.log(`${timeStamp()} - Carousel Scene Constructed`);

    // Add the carousel drag controller
    this.#constructCarouselDragger(sheet$);
    kLog.log(`${timeStamp()} - Carousel Dragger Constructed`);

    // Attach archetype timelines and listeners to their associated elements
    sheet$.find(".archetype-carousel-item[data-archetype]").each((_i, archetypeElem) => {
      const archetype$ = $(archetypeElem);
      this.#attachListeners_archetypePanels(archetype$);
    });
    kLog.log(`${timeStamp()} - Archetype Timelines Attached`);

    // Update the carousel to match the selected archetype
    await this.#updateCarouselFromDragger(getXPosFromIndex(this.selArchetypeIndex), false);
    kLog.log(`${timeStamp()} - Carousel Updated to Selected Archetype`);

    kLog.log(`${timeStamp()} - Carousel Rendered, Awaiting Video`);
    const cloudVideo = (sheet$.find(".cloud-bg") as JQuery<Maybe<HTMLVideoElement>>)[0];
    if (cloudVideo) {
      if (cloudVideo.readyState >= 3) {
        kLog.log(`${timeStamp()} - Video Ready, Animating Carousel`);
        this.#animateCarousel(cloudVideo);
      } else {
        kLog.log(`${timeStamp()} - Video Not Ready, Waiting for Video`);
        // this.#animateCarousel(cloudVideo);
        // Wait for the video to be ready
        cloudVideo.addEventListener('canplay', () => { this.#animateCarousel(cloudVideo); }, { once: true });
        // Fallback in case the video fails to load
        cloudVideo.addEventListener('error', () => { this.#animateCarousel(cloudVideo); }, { once: true });
      }
    }
    // }
  }


  // async revealCarousel(carouselScene$: JQuery) {


  //   if (isInstant) {
  //     if (CONFIG.K4.isCharGenInitialized) {
  //       $([
  //         sheet$,
  //         container$,
  //         carouselScene$,
  //         archetypeExamples$,
  //         items$,
  //         attributesPanel$,
  //         namePanel$,
  //         descriptionPanel$
  //       ]).css("visibility", "visible");
  //       void ANIMATIONS.revealBackground(carouselScene$);
  //       this.actor.sheet.updateArchetypeExamples(container$);
  //       return;
  //     }
  //   }


  // }

  // async archetypeCarouselTimeline(carouselScene$: JQuery, itemWidth: number, actor: K4Actor): Promise<gsap.core.Timeline> {











    // // Update rotation on window resize
    // window.addEventListener("resize", () => {
    //   const newMaxDistance = window.innerWidth / 2;
    //   const currentRotation = gsap.getProperty(carousel$[0], "rotationY") as number;
    //   const newX = (currentRotation / 180) * newMaxDistance;
    //   gsap.set(dragger$, { x: newX });
    //   updateRotation(newX);
    // });

    // void updateCarousel(getXPosFromIndex(selArchetypeIndex));

    // await ANIMATIONS.revealCarousel(carouselScene$);

    // // get currently selected archetype element, retrieve its timeline, and set it to "selected"
    // // const tl = gsap.timeline({ paused: true });
    // const selectedArchetype = getElementFromIndex(carousel$, selArchetypeIndex);
    // const selectedArchetypeTimeline = ($(selectedArchetype).data("archetypeStyleTimeline") as gsap.core.Timeline);

    // // If the selected archetype is the same as the one we're already showing, skip the tween
    // if (CONFIG.K4.charGenIsShowing === actor.archetype) {
    //   selectedArchetypeTimeline.seek("selected");
    // } else {
    //   void selectedArchetypeTimeline.tweenTo("selected", {duration: 2});
    // }

    // return U.gsap.timeline();
  // }

  // Function to start the animation
  // async #startAnimation_carousel(video: HTMLVideoElement, mainTL: gsap.core.Timeline, instantTimelines?: gsap.core.Timeline[]) {
  //   const isInstant = U.isDefined(instantTimelines) && !U.isEmpty(instantTimelines);
  //   void video.play();
  //   if (isInstant) {
  //     [mainTL, ...instantTimelines].forEach((tl) => tl.progress(1).pause());
  //     return;
  //   }
  //   await mainTL.play();
  // };











}

export default K4CharGen;