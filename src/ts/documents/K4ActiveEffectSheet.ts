// #region IMPORTS ~
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4ActiveEffect from "./K4ActiveEffect.js";
// #endregion

// #region TYPES ~
namespace K4ActiveEffectSheet {

}
// #endregion

// #region === K4MODIFIER CLASS ===
class K4ActiveEffectSheet extends ActiveEffectConfig {
  // #region INITIALIZATION ~
  static async Initialize() {

  }
  // #endregion
  static override get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes:   [C.SYSTEM_ID, "sheet", "k4-sheet", "k4-active-effect-sheet"],
      template:  "systems/kult4th/templates/sheets/active-effect-sheet.hbs",
      height:    "auto",
      width:     560
    }) as DocumentSheetOptions;
  }
  // #region CONSTRUCTOR ~
  constructor(object: K4ActiveEffect, options: Partial<DocumentSheetOptions>) {
    super(object, options)
  }
  // #endregion

  // #region GETTERS & SETTERS ~

  // #endregion

}
// #ENDREGION

// #region EXPORTS ~
export default K4ActiveEffectSheet;
// #endregion

/* Custom K4ActiveEffects can have multiple changes that apply simultaneously.
   Each Change has a 'key' and a 'value' that can be set, containing the data for executing a CUSTOMFUNC

  == KEY (Function Name) ==


  == VALUE (Function Data) ==
  A string definition of a data object that will be passed to the function. Each function must define how to handle this data object.
  String is comma-delimited with key-value pairs separated by colons.
    The last key-value pair may contain commas, as long as there are no colons after the last comma.
   */

/** ITEM-SOURCE EFFECTS -- These effects are attached to items, and transferred to Actor owners. They generally apply a permanent effect that persists until the item is removed. Schema-wise, they go into the item's system.rules.effectFunctions array, and are generated as ActiveEffects when the item is embedded into an Actor. */
const CUSTOMFUNCEXAMPLES = {
  "Analyst": [
    {ModifyMove: "filter:Investigate,target:system.lists.questions.items,effect:PushElement,value:Which organizations, groups, or people of interest may be connected to this? #>text-sourceref>(from <##>text-keyword>Analyst<##>text-sourceref>)<#"},
    {ModifyMove: "filter:Investigate,target:system.lists.questions.items,effect:PushElement,value:Is there a connection between this and another event? #>text-sourceref>(from <##>text-keyword>Analyst<##>text-sourceref>)<#"},
    {ModifyMove: "filter:Investigate,target:system.lists.questions.items,effect:PushElement,value:What could a plausible motive be? #>text-sourceref>(from <##>text-keyword>Analyst<##>text-sourceref>)<#"},
  ],
  "Condemned": [
    {CreateTracker: "name:Time,imgFolder:systems/kult4th/assets/icons/trackers/condemned/,key:flags.kult4th.tracker,value:0,min:0,max:10,fromText:#>text-keyword>Condemned<#"}
  ],
  "Rage": [
    {CreateTracker: "name:Rage,imgFolder:systems/kult4th/assets/icons/trackers/rage/,key:flags.kult4th.tracker,value:0,min:0,max:3,fromText:#>text-keyword>Rage<#"}
  ],
  "Dead Shot": [
    {ModifyAttack: "filter:firearm,target:harm,effect:Add,value:1,fromText:#>text-keyword>Dead Shot<#"}
  ],
  "Extortionist": [
    {ModifyMove: "filter:Read a Person,target:system.lists.questions.items,effect:PushElement,value:What are you afraid of? #>text-sourceref>(from <##>text-keyword>Extortionist<##>text-sourceref>)<#"},
    {ModifyMove: "filter:Read a Person,target:system.lists.questions.items,effect:PushElement,value:What is precious to you? #>text-sourceref>(from <##>text-keyword>Extortionist<##>text-sourceref>)<#"}
  ],
  "Elite Sport (Athletics)": [
    {ModifyRoll: "filter:Endure Injury,effect:Add,value:1,duration:ongoing,defaultState:false,canToggle:true,icon:systems/kult4th/assets/icons/advantage/elite-sport-(athletics).svg,shortLabel:Run/Catch/Throw,fromText:#>text-keyword>Elite Sport (Athletics)<#,tooltip:Applies to all rolls relevant to running, throwing, or catching objects. #>text-sourceref>(from <##>text-keyword>Elite Sport (Athletics)<##>text-sourceref>)<#"}
  ],
  "Elite Sport (Fencing)": [
    {CreateAttack: "filter:sword,name:Riposte,range:arm,harm:3,fromText:#>text-keyword>Elite Sport (Fencing)<#,special:You can make this attack immediately after parrying."}
  ],
  "Elite Sport (Contact)": [
    {ModifyRoll: "filter:Endure Injury,effect:Add,value:1,duration:ongoing,defaultState:false,canToggle:true,icon:systems/kult4th/assets/icons/move/endure-injury.svg,shortLabel:in Close Combat,fromText:#>text-keyword>Elite Sport (Contact)<#,tooltip:Applies to all #>text-keyword>Endure Injury<# rolls against close combat attacks. #>text-sourceref>(from <##>text-keyword>Elite Sport (Contact)<##>text-sourceref>)<#"}
  ],
  "Endure Injury": [
    {ModifyRoll: "filter:Endure Injury,effect:Add,value:actor.armor,inStatusBar:false"},
    {ModifyRoll: "filter:Endure Injury,effect:Subtract,value:prompt,title:How much Harm?,input:numberButtons,inputMin:1,inputMax:4,inStatusBar:false"},
  ],
  "Expert": [
    {PromptForData: "title:What is your first Field of Expertise?,key:flags.kult4th.field_1,input:text,bodyText:You may choose any sufficiently-broad area of academic study. #>text-posmod>Examples:<# Archaeology, Economics, History, Comparative Literature, Psychology, Sociology, Theology"},
    {PromptForData: "title:What is your second Field of Expertise?,key:flags.kult4th.field_2,input:text,bodyText:You may choose any sufficiently-broad area of academic study. #>text-posmod>Examples:<# Archaeology, Economics, History, Comparative Literature, Psychology, Sociology, Theology"},
    {ModifyMove: "filter:Investigate,target:system.results.completeSuccess.result,effect:AppendText,text:%insert.break%If the subject of your inquiry is associated with #>text-keyword>%insert.flags.kult4th.field_1%<# or #>text-keyword>%insert.flags.kult4th.field_2%<#, you may ask an additional question, any question you want. #>text-sourceref>(from <##>text-keyword>Expert<##>text-sourceref>)<#"},
    {ModifyMove: "filter:Read a Person,target:system.results.partialSuccess.result,effect:AppendText,text:%insert.break%If the subject of your inquiry is associated with #>text-keyword>%insert.flags.kult4th.field_1%<# or #>text-keyword>%insert.flags.kult4th.field_2%<#, you may ask an additional question, any question you want. #>text-sourceref>(from <##>text-keyword>Expert<##>text-sourceref>)<#"},
    {ModifyMove: "filter:Read a Person,target:system.results.failure.result,effect:AppendText,text:%insert.break%Despite your failure, if the subject of your inquiry is associated with #>text-keyword>%insert.flags.kult4th.field_1%<# or #>text-keyword>%insert.flags.kult4th.field_2%<#, you may still ask any one question you want. #>text-sourceref>(from <##>text-keyword>Expert<##>text-sourceref>)<#"}
  ],
  "Gritted Teeth": [
    {ModifyProperty: "filter:actor,effect:Set,target:system.modifiers.wounds_critical.1.all,value:0"},
    {ModifyProperty: "filter:actor,effect:Set,target:system.modifiers.wounds_serious.1.all,value:0"},
    {ModifyProperty: "filter:actor,effect:Set,target:system.modifiers.wounds_serious.2.all,value:0"},
    {ModifyProperty: "filter:actor,effect:Set,target:system.modifiers.wounds_serious.3.all,value:0"},
    {ModifyProperty: "filter:actor,effect:Set,target:system.modifiers.wounds_serious.4.all,value:0"},
    {ModifyProperty: "filter:actor,effect:Set,target:system.modifiers.wounds_seriouscritical.1.all,value:0"}
  ],
  "Broken": [
    {ModifyProperty: "filter:actor,effect:Set,target:system.stability.max,value:6"}
  ],
  "Hardened": [
    {ModifyRoll: "filter:Endure Injury,effect:Add,value:1,duration:ongoing,defaultState:true,canToggle:false,icon:systems/kult4th/assets/icons/move/endure-injury.svg,shortLabel: ,fromText:#>text-keyword>Hardened<#,tooltip:Applies to all #>text-keyword>Endure Injury<# rolls. #>text-sourceref>(from <##>text-keyword>Hardened<##>text-sourceref>)<#"}
  ],
  "Jaded": [
    {ModifyMove: "filter:Keep It Together,target:system.results.partialSuccess.result,effect:AppendText,text:%insert.break%You may suppress your emotions, postponing their effects until the next scene. #>text-sourceref>(from <##>text-keyword>Jaded<##>text-sourceref>)<#"}
  ],
  "Keen-Eyed": [
    {ModifyMove: "filter:Observe a Situation,target:system.lists.questions.items,effect:PushElement,value:What weaknesses do they have I can use to my advantage? #>text-sourceref>(from <##>text-keyword>Keen-Eyed<##>text-sourceref>)<#"},
    {ModifyMove: "filter:Observe a Situation,target:system.lists.questions.items,effect:PushElement,value:What strengths do they have I should watch out for? #>text-sourceref>(from <##>text-keyword>Keen-Eyed<##>text-sourceref>)<#"}
  ],
  "Observant": [
    {ModifyMove: "filter:Read a Person,target:system.lists.questions.items,effect:PushElement,value:What sort of person are you? #>text-sourceref>(from <##>text-keyword>Observant<##>text-sourceref>)<#"},
    {ModifyMove: "filter:Read a Person,target:system.lists.questions.items,effect:PushElement,value:Is there anything odd about you? #>text-sourceref>(from <##>text-keyword>Observant<##>text-sourceref>)<#"}
  ],
  "Instinct": [
    {ModifyMove: "filter:Observe a Situation,target:system.results.completeSuccess.result,effect:AppendText,text:%insert.break%Take #>text-posmod>+2<# instead of #>text-posmod>+1<# for acting on the GM's answers. #>text-sourceref>(from <##>text-keyword>Instinct<##>text-sourceref>)<#"},
    {ModifyMove: "filter:Observe a Situation,target:system.results.partialSuccess.result,effect:AppendText,text:%insert.break%Take #>text-posmod>+2<# instead of #>text-posmod>+1<# for acting on the GM's answers. #>text-sourceref>(from <##>text-keyword>Instinct<##>text-sourceref>)<#"},
    {ModifyMove: "filter:Observe a Situation,target:system.results.completeSuccess.effects,effect:ModifyEffect,effectFilter:Act On Observations,effectProperty:value,effectValue:2,fromText:#>text-keyword>Instinct<#"},
    {ModifyMove: "filter:Observe a Situation,target:system.results.partialSuccess.effects,effect:ModifyEffect,effectFilter:Act On Observations,effectProperty:value,effectValue:2,fromText:#>text-keyword>Instinct<#"}
  ],
  "Intuitive": [
    {ModifyMove: "filter:Read a Person,target:system.results.completeSuccess.result,effect:AppendText,text:%insert.break%You may ask one additional question (3 total). #>text-sourceref>(from <##>text-keyword>Intuitive<##>text-sourceref>)<#"},
    {ModifyMove: "filter:Read a Person,target:system.results.partialSuccess.result,effect:AppendText,text:%insert.break%You may ask one additional question (2 total). #>text-sourceref>(from <##>text-keyword>Intuitive<##>text-sourceref>)<#"},
    {ModifyMove: "filter:Read a Person,target:system.results.failure.result,effect:AppendText,text:%insert.break%Despite your failure, you may ask one question from the list below any time you are in conversation with the subject of your scrutiny during this scene. #>text-sourceref>(from <##>text-keyword>Intuitive<##>text-sourceref>)<#"},
    {ModifyMove: "filter:Read a Person,target:system.results.failure.listRefs,effect:PushElement,value:questions"}
  ],
  "Sealed Fate": [
    {RequireItem: "filter:Condemned"}
  ],
  "To the Last Breath": [
    {RequireItem: "filter:Condemned"}
  ],
  "Vigilant": [
    {ModifyMove: "filter:Read a Person,target:system.lists.questions.items,effect:PushElement,value:Are you hiding anything from me? #>text-sourceref>(from <##>text-keyword>Vigilant<##>text-sourceref>)<#"},
    {ModifyMove: "filter:Read a Person,target:system.lists.questions.items,effect:PushElement,value:How do you really feel about me? #>text-sourceref>(from <##>text-keyword>Vigilant<##>text-sourceref>)<#"}
  ]
}

/** ROLL-SOURCE EFFECTS -- These are applied as the result of a roll OR a triggered static effect (like an edge), and are transferred to the rolling Actor. They must define their own removal logic. Schema-wise, they go into the effectFunctions array within each roll result, and are created as ActiveEffects on the rolling actor after a roll has been made. */
const CUSTOMROLLFUNCEXAMPLES = {
  "Observe a Situation/completeSuccess": [
    {ModifyRoll: "filter:all,effect:Add,value:1,duration:ongoing,usageMax:1,defaultState:true,canToggle:true,icon:systems/kult4th/assets/icons/move/observe-a-situation.svg,shortLabel:Act On Observations,fromText:an #>text-keyword>Observe a Situation<# roll,tooltip:Applies once to the next roll made to act on the GM's answers. #>text-sourceref>(from an <##>text-keyword>Observe a Situation<##>text-sourceref> roll)<#"}
  ],
  "Observe a Situation/partialSuccess": [
    {ModifyRoll: "filter:all,effect:Add,value:1,duration:ongoing,usageMax:1,defaultState:true,canToggle:true,icon:systems/kult4th/assets/icons/move/observe-a-situation.svg,shortLabel:Act On Observations,fromText:an #>text-keyword>Observe a Situation<# roll,tooltip:Applies once to the next roll made to act on the GM's answers. #>text-sourceref>(from an <##>text-keyword>Observe a Situation<##>text-sourceref> roll)<#"}
  ]
}

const CUSTOMTRIGGERFUNCEXAMPLES = {
  "Draw an Ace/Reveal a Weapon": [
    {PromptForData: "... name of weapon ..."},
    {PromptForData: "... class of weapon - select, stab/slash/crush/..."},
    {CreateWeapon: "name:flags.kult4th.weaponName,range:arm,harm:1,class:flags.kult4th.weaponClass,duration:scene,fromText:#>text-keyword>Draw an Ace<#"},
  ],
  "Draw an Ace/Spot a Weakness": [],
  "Draw an Ace/Find an Exit": []
}