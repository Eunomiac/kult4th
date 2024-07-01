
// #region Types & Enums ~
enum K4Attribute {
  ask = "ask",
  zero = "zero",
  fortitude = "fortitude",
  reflexes = "reflexes",
  willpower = "willpower",
  reason = "reason",
  intuition = "intuition",
  perception = "perception",
  coolness = "coolness",
  violence = "violence",
  charisma = "charisma",
  soul = "soul"
}
enum K4ItemType {
  advantage = "advantage",
  disadvantage = "disadvantage",
  move = "move",
  darksecret = "darksecret",
  relation = "relation",
  gear = "gear",
  weapon = "weapon",
  gmtracker = "gmtracker"
}
enum K4ItemSubType {
  activeRolled = "active-rolled",
  activeStatic = "active-static",
  passive = "passive"
}
namespace ITEM_DATA {
  export interface Schema<T extends K4ItemType = K4ItemType> {
    name: string;
    type: T;
    img: string;
    system: K4Item.Source<T>;
  }
}
// #endregion

const ITEM_DATA: {
  advantage: ITEM_DATA.Schema<K4ItemType.advantage>[],
  disadvantage: ITEM_DATA.Schema<K4ItemType.disadvantage>[],
  darksecret: ITEM_DATA.Schema<K4ItemType.darksecret>[],
  weapon: ITEM_DATA.Schema<K4ItemType.weapon>[],
  gear: ITEM_DATA.Schema<K4ItemType.gear>[],
  move: ITEM_DATA.Schema<K4ItemType.move>[],
  relation: ITEM_DATA.Schema<K4ItemType.relation>[]
} = {
  advantage: [
    {
      "name": "Worldly",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/worldly.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Recall this Place",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/worldly.svg",
            "system": {
              "chatName": "Recalls this Place",
              "parentItem": {
                "name": "Worldly",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you arrive at a new location in the mundane world,",
                "outro": "decide whether you have been here before, and if so, name some detail about the place significant to you. Also, decide if you met someone there and what you left behind. The GM will say what has changed since then."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Occult Studies",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/occult-studies.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "I know something about this (ask the GM what you know and take #>text-mod>+1 ongoing<# while acting on the answers during this scene).",
              "I know where I can find more information about this (ask the GM where)."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Encounter the Occult",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/occult-studies.svg",
            "system": {
              "parentItem": {
                "name": "Occult Studies",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Upon coming in contact with a magical discipline, entity, or phenomenon for the first time,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Take both options below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "You have a hazy memory of something like this, but can't say for sure if it's true or not. The GM explains what it is you remember."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
              "chatName": "Encounter the Occult"
            }
          }
        ],
        "rules": {
          "intro": "#>text-center>You are a student of the occult.<#",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "To the Last Breath",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/to-the-last-breath.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Refuse to Give In",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/to-the-last-breath.svg",
            "system": {
              "chatName": "Refuses to Give In",
              "parentItem": {
                "name": "To the Last Breath",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "When you refuse to give in even if the odds turn against you,",
                "outro": "mark 1 Time to reroll the dice."
              },
              "results": {
                "triggered": {
                  "result": "",
                  "edges": 0,
                  "hold": 0,
                  "effects": [
                    {
                      key: "ChangeCounter",
                      mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                      value: "filter:Time,value:1",
                      priority: undefined
                    }
                  ]
                }
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "RequireItem",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Condemned,for:To the Last Breath",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Extortionist",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/extortionist.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "What are you afraid of?",
              "What is precious to you?"
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "Whenever you #>item-button text-doclink&data-item-name='Read a Person'&data-action='open'>Read a Person<#, you may choose from these questions in addition to the usual ones:",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "questions"
          ],
          "effects": [
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Read a Person,target:system.lists.questions.items,effect:PushElement,value:What are you afraid of? #>text-sourceref>(from <##>text-itemlink>Extortionist<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Read a Person,target:system.lists.questions.items,effect:PushElement,value:What is precious to you? #>text-sourceref>(from <##>text-itemlink>Extortionist<##>text-sourceref>)<#",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Character Actor",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/character-actor.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Placate someone who is becoming suspicious.",
              "Get access to a place outsiders aren't allowed to go.",
              "Get someone to tell you about this place's secrets.",
              "Get someone's assistance with something here."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Blend In",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/character-actor.svg",
            "system": {
              "parentItem": {
                "name": "Character Actor",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you try to blend into a place or crowd by adapting your appearance and behavior to the others present,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below. You may save up to two for later.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two options from the list below. You may save one for later.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but things don't go according to plan. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.intuition,
              "chatName": "Blend In"
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Code of Honor",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/code-of-honor.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Follow the Code",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/code-of-honor.svg",
            "system": {
              "chatName": "Follows the Code",
              "parentItem": {
                "name": "Code of Honor",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you take risks or make sacrifices for your code of honor,",
                "outro": "gain #>text-posmod>+1<# #>text-keyword>Stability<#."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "You abide by a strict code of honor. Decide its nature when you take this Advantage.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Prepared",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/prepared.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Find or create a map of the location.",
              "Uncover any security systems and other obstacles.",
              "Pinpoint the location of something you're after."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Scout a Location",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/prepared.svg",
            "system": {
              "parentItem": {
                "name": "Prepared",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you investigate a location prior to visiting it,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold at any time to make a hard or soft Move for the location.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but you have missed or overlooked something crucial: #>text-gmtext>The GM takes 1 Hold<#.",
                  "listRefs": [
                    "options"
                  ],
                  "hold": 1
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
              "chatName": "Scout a Location"
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold at any time to make a hard or soft Move for the location."
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Good Samaritan",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/good-samaritan.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Sacrifice for Another",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/good-samaritan.svg",
            "system": {
              "chatName": "Sacrifices for Another",
              "parentItem": {
                "name": "Good Samaritan",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you help another at your own expense,",
                "outro": "gain #>text-posmod>+1<# #>text-keyword>Stability<#."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Artifact",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/artifact.svg",
      "system": {
        "lists": {
          "powers": {
            "name": "Powers",
            "items": [
              "Configure your artifact's powers with the help of the GM."
            ]
          },
          "examplepowers": {
            "name": "Example Powers",
            "items": [
              "See the true form of a creature or location.",
              "Receive a vision of what threatens you.",
              "Get yourself out of a bind.",
              "Call on the entity bound to the artifact and bargain with them."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Activate Artifact",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/artifact.svg",
            "system": {
              "parentItem": {
                "name": "Artifact",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you activate the object,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "powers"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose one power to invoke from the list below (the GM determines what happens).",
                  "listRefs": [
                    "powers"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one power to invoke from the list below (the GM determines what happens). However, the artifact also exacts an additional price (the GM determines what is required).",
                  "listRefs": [
                    "powers"
                  ]
                },
                "failure": {
                  "result": "The artifact does something unexpected, possibly dangerous. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
              "chatName": "Activate the Artifact"
            }
          }
        ],
        "rules": {
          "intro": "You own a seemingly mundane item, which actually possesses mystical powers.%insert.break%Its powers can be activated through certain methods, such as infusing it with blood or whispering forbidden words (you decide what is required).%insert.break%Work with the GM to devise a list of options appropriate to the artifact, using this list as an example: %list.examplepowers%",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Sixth Sense",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/sixth-sense.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Act first in a threatening situation. This can include even acting prior to a surprise attack.",
              "Sense whether someone wishes good or ill towards you.",
              "Discover or sense a clue or lead when you're off track."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Hone Their Instincts",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/sixth-sense.svg",
            "system": {
              "parentItem": {
                "name": "Sixth Sense",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "At the start of each game session,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below, useable any time during the session.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two options from the list below, useable any time during the session.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Your instincts will fail to trigger in a dangerous situation. #>text-gmtext>The GM makes a Move<# at some point during the session."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
              "chatName": "Hone Their Instincts"
            }
          }
        ],
        "rules": {
          "intro": "#>text-center>You have an intuition for things, both good and bad.<#",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Moles",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/moles.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "The mole has penetrated the organization's inner circle; however, their influence is limited.",
              "The mole owes you one; however, you must meet their demands to get what you want."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Contact a Mole",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/moles.svg",
            "system": {
              "parentItem": {
                "name": "Moles",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you make contact with one of your moles to acquire info or services,",
                "outro": "explain what group or organization the mole belongs to, name them, and then %insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "You receive both options below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one of the options below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "The mole's loyalties are questionable. Can you trust them? #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
              "chatName": "Contact a Mole"
            }
          }
        ],
        "rules": {
          "intro": "You have placed a number of moles in groups or organizations of interest to you, such as business competitors, governments, or cults.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Impostor",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/impostor.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Exploit a Rube",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/impostor.svg",
            "system": {
              "parentItem": {
                "name": "Impostor",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you need money, a safehouse, protection, or other help one of your victims can provide,",
                "outro": "describe who they are and %insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "They can provide you with whatever you require."
                },
                "partialSuccess": {
                  "result": "One of them might be able to help, but it will take some convincing."
                },
                "failure": {
                  "result": "You know someone who can help, but they have already seen through your game. If you want their assistance it will require threats or blackmail to get them to provide it."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
              "chatName": "Exploit a Rube"
            }
          }
        ],
        "rules": {
          "intro": "You maintain relationships with numerous people who all believe you are their soulmate, yet are unaware of each other.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Desperate",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/desperate.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Go Against the Odds",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/desperate.svg",
            "system": {
              "chatName": "Goes Against the Odds",
              "parentItem": {
                "name": "Desperate",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you try to make it through overwhelming odds,",
                "outro": "take #>text-mod>+1 ongoing<# on all rolls until you're clear of the threat."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Awe-Inspiring",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/awe-inspiring.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Project Authority",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/awe-inspiring.svg",
            "system": {
              "parentItem": {
                "name": "Awe-Inspiring",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you make a show of being the boss,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "People around you accept you as their leader and listen to you. Take #>text-mod>+1 ongoing<# against people in this scene."
                },
                "partialSuccess": {
                  "result": "People feel you're leadership material and show you respect. Choose one of them, in particular, who goes along with what you think. You have #>text-mod>+1 ongoing<# against them during this scene."
                },
                "failure": {
                  "result": "People feel like you're the leader, but one of them tries to challenge you for it. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
              "chatName": "Project Authority"
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Watchers",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/watchers.svg",
      "system": {
        "lists": {
          "watchers": {
            "name": "Watchers Gang",
            "items": [
              "Small Gang: #>text-keyword>2 Harm<#, #>text-keyword>5 Wounds<#",
              "Medium Gang: #>text-keyword>3 Harm<#, #>text-keyword>10 Wounds<#",
              "Large Gang: #>text-keyword>3 Harm<#, #>text-keyword>15 Wounds<#"
            ],
            "intro": "The GM determines the size of the gang that appears, based on the power of the threat you face."
          }
        },
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Invoke the Watchers",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/watchers.svg",
            "system": {
              "chatName": "Invokes the Watchers",
              "parentItem": {
                "name": "Watchers",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you are in mortal danger and choose to activate your Watchers,",
                "outro": "#>text-gmtext>the GM takes 1 Hold<# and introduces your Watchers to the scene. Their sole motivation is to keep you out of harm's reach.",
                "holdText": "The GM can spend Hold on the Watchers' behalf to let them make a Move against you.",
                "listRefs": [
                  "watchers"
                ]
              },
              "results": {
                "triggered": {
                  "result": "",
                  "edges": 0,
                  "hold": 1
                }
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "You are being watched over and protected by a group of mysterious people who intend on keeping you alive for their own obscure purposes.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold on the Watchers' behalf to let them make a Move against you."
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Academic Network",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/academic-network.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Contact an Academic",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/academic-network.svg",
            "system": {
              "parentItem": {
                "name": "Academic Network",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "When it would be useful to know someone at a university,",
                "outro": "provide the person's name, field of study, and how you got to know one another, then %insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "The person is a friend (#>text-keyword>Relation +1<#)."
                },
                "partialSuccess": {
                  "result": "The person is an acquaintance (#>text-keyword>Relation +0<#)."
                },
                "failure": {
                  "result": "You know one another, but there is an old enmity between the two of you (#>text-keyword>Relation +0<#)."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "You have academic contacts at universities around the world.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Implanted Messages",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/implanted-messages.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Implant an Order",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/implanted-messages.svg",
            "system": {
              "parentItem": {
                "name": "Implanted Messages",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you experiment on a human and wish to implant an order into them,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You hold 2 Power over them. For as long as you retain Power over them, they take 1 #>text-keyword>Serious Wound<# should they refuse or attempt to go against your order, but this loosens your grip over them by 1 Power. If they fulfill your order, all your remaining Power over them is removed."
                },
                "partialSuccess": {
                  "result": "You hold 1 Power over them. For as long as you retain Power over them, they take 1 #>text-keyword>Serious Wound<# should they refuse or attempt to go against your order, but this loosens your grip over them by 1 Power. If they fulfill your order, all your remaining Power over them is removed."
                },
                "failure": {
                  "result": "Something goes wrong, such as they get hurt in the process or the order's outcome is different than what you imagined. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "You know how to implant orders into the minds of your \"subjects\".",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Forbidden Inspiration",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/forbidden-inspiration.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Enticement: Entice an entity to come to you.",
              "Visions: #>item-button text-doclink&data-item-name='See Through the Illusion'&data-action='open'>See Through the Illusion<# into a specific place of your choice.",
              "Inspiration: Ask the GM if there is anything strange or supernatural about the situation you're in. The answer will be revealed through your art."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Seek Inspiration",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/forbidden-inspiration.svg",
            "system": {
              "parentItem": {
                "name": "Forbidden Inspiration",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you dive deep into your art and allow yourself to be inspired by the Truth,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose two options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "You have gazed too deeply into the abyss. Choose one option from the list below, but you also experience terrifying visions or encounter something horrible. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Inventor",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/inventor.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Durable: The construction can be used multiple times and doesn't break easily.",
              "Effective: The construction confers #>text-posmod>+1<# on rolls where it is used for its intended purpose.",
              "Lethal: The construction causes #>text-mod>+1 Harm<#.",
              "Protective: The construction confers #>text-posmod>+1<# armor."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Create or Repair",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/inventor.svg",
            "system": {
              "parentItem": {
                "name": "Inventor",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you are about to create or repair something,",
                "outro": "explain what you are about to do. The GM will tell you what you need to succeed, and once you have collected these materials, you may %insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "The construction is successful and you may pick two options from below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "The construction has minor flaws. You may choose one option from the list below from below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "You complete the construction or repair, but it has significant flaws, some of which are hidden. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "At Any Cost",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/at-any-cost.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Pay the Price",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/at-any-cost.svg",
            "system": {
              "chatName": "Will Pay Any Price",
              "parentItem": {
                "name": "At Any Cost",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you truly desire something,",
                "outro": "you may take #>text-posmod>+2<# to a roll by losing #>text-negmod>−2<# #>text-keyword>Stability<#."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Body Awareness",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/body-awareness.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Escape bindings or restraints.",
              "Get past an obstacle (creature or object).",
              "Get into or make it through a space you normally wouldn't be able to."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Perform Acrobatics",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/body-awareness.svg",
            "system": {
              "parentItem": {
                "name": "Body Awareness",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you perform acrobatic or agile feats,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below, but you expose yourself to danger or incur a cost.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but something goes very wrong. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.perception,
            }
          }
        ],
        "rules": {
          "intro": "#>text-center>Your body and mind are as one.<#",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Crafty",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/crafty.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "They become suspicious of someone else of your choosing.",
              "They view you as their ally, for as long as you don't betray them (#>text-posmod>+1<# to all rolls against them).",
              "They willingly do a favor for you."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Manipulate Someone",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/crafty.svg",
            "system": {
              "parentItem": {
                "name": "Crafty",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you manipulate an NPC in a longer conversation,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose two options from the list below. You may save one until later during this scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "They're on to you. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.intuition,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Enhanced Awareness",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/enhanced-awareness.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Focus Awareness",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/enhanced-awareness.svg",
            "system": {
              "parentItem": {
                "name": "Enhanced Awareness",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "When you focus your senses at a location where the Illusion is weak,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You can discern clear details regarding the location, and may be able to speak to entities tied to it."
                },
                "partialSuccess": {
                  "result": "You get some basic impressions regarding the location."
                },
                "failure": {
                  "result": "The Illusion tears. The veil is lifted temporarily, revealing an alternate dimension—the GM determines which one. The PC could be sucked into it or something may cross over into our reality. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Daredevil",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/daredevil.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>On a Swivel<# &mdash; Discover a threat before it discovers you.",
              "#>text-edgename>Not Today<# &mdash; Avoid an attack.",
              "#>text-edgename>Sucker Punch<# &mdash; Get the jump on them: Harm your opponent before they can react."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Confront Danger",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/daredevil.svg",
            "system": {
              "parentItem": {
                "name": "Daredevil",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you're entering a dangerous situation,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": ["edges"]
              },
              "results": {
                "completeSuccess": {
                  "result": "#>text-keyword>Gain 3 Edges<#. You may spend them anytime during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 3
                },
                "partialSuccess": {
                  "result": "#>text-keyword>Gain 2 Edges<#. You may spend them anytime during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 2
                },
                "failure": {
                  "result": "#>text-keyword>Gain 1 Edge<#, but you are in over your head. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 1
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.perception,
            }
          },
          {
            "name": "On a Swivel",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/daredevil.svg",
            "system": {
              "chatName": "On a Swivel",
              "parentItem": {
                "name": "Daredevil",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to discover a threat before it discovers you."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Not Today",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/daredevil.svg",
            "system": {
              "chatName": "Not Today",
              "parentItem": {
                "name": "Daredevil",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to avoid an attack."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Sucker Punch",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/daredevil.svg",
            "system": {
              "chatName": "Sucker Punch",
              "parentItem": {
                "name": "Daredevil",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to get the jump on them: Harm your opponent before they can react."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "edges"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Ice Cold",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/ice-cold.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>Easy Dodge<# &mdash; Avoid an attack.",
              "#>text-edgename>Opportunity Calls<# &mdash; Manage to snatch something.",
              "#>text-edgename>Patience, Patience<# &mdash; Maneuver into a better position.",
              "#>text-edgename>Clever Trick<# &mdash; Put someone in a bad position (everyone gets #>text-posmod>+2<# to any attack Moves)."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Stay Cool",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/ice-cold.svg",
            "system": {
              "parentItem": {
                "name": "Ice Cold",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you are in a violent conflict,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": ["edges"]
              },
              "results": {
                "completeSuccess": {
                  "result": "#>text-keyword>Gain 3 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 3
                },
                "partialSuccess": {
                  "result": "#>text-keyword>Gain 2 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 2
                },
                "failure": {
                  "result": "#>text-keyword>Gain 1 Edge<#, but you attract attention from the hostiles. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 1
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.coolness,
            }
          },
          {
            "name": "Easy Dodge",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/ice-cold.svg",
            "system": {
              "chatName": "Easy Dodge",
              "parentItem": {
                "name": "Ice Cold",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to avoid an attack."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Opportunity Calls",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/ice-cold.svg",
            "system": {
              "chatName": "Opportunity Calls",
              "parentItem": {
                "name": "Ice Cold",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to manage to snatch something."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Patience, Patience",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/ice-cold.svg",
            "system": {
              "chatName": "Patience, Patience",
              "parentItem": {
                "name": "Ice Cold",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to maneuver into a better position."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Clever Trick",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/ice-cold.svg",
            "system": {
              "chatName": "Clever Trick",
              "parentItem": {
                "name": "Ice Cold",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to put someone in a bad position (everyone gets #>text-posmod>+2<# to any attack Moves)."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "You keep your calm and cool, even in the midst of violence and chaos.",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "edges"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Dabbler in the Occult",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/dabbler-in-the-occult.svg",
      "system": {
        "lists": {
          "gmoptions": {
            "name": "GM Options",
            "items": [
              "You do not have working protection against the forces or entities the ritual summons.",
              "The effects of the ritual are slightly different than what you had imagined.",
              "The ritual summons unexpected entities or forces."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Perform Ritual",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/dabbler-in-the-occult.svg",
            "system": {
              "parentItem": {
                "name": "Dabbler in the Occult",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you attempt to perform a magical ritual from a set of instructions,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You perform every step correctly; the ritual works as intended."
                },
                "partialSuccess": {
                  "result": "You make a minor error. The GM chooses one: %list.gmoptions%"
                },
                "failure": {
                  "result": "You misunderstand the scripture and perform the ritual with no control whatsoever over the resulting outcome. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "You know a little of magical rituals, but have never gone beyond performing written instructions.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Bound",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/bound.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "See the true form of a creature or location.",
              "Disperse magic targeting you.",
              "Call on the entity."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Commune",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/bound.svg",
            "system": {
              "parentItem": {
                "name": "Bound",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "At the start of each game session,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "You may choose three options from the list below at any time during the session.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "You may choose one option from the list below at any time during the session.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "You may choose one option from the list below at any time during the session, but #>text-gmtext>the GM makes a Move<# for the entity at some point during the session.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "You are bound to an extradimensional entity whose powers you can draw upon. Explain what you think it is when you take this Advantage.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Animal Speaker",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/animal-speaker.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Make the animal go against its instincts.",
              "Make the animal follow you.",
              "Make the animal protect you against an attacker."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Control an Animal",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/animal-speaker.svg",
            "system": {
              "parentItem": {
                "name": "Animal Speaker",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you attempt to control an animal,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below. You may save up to two for later.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two options from the list below. You may save one for later.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but the animal is affected by your memories and Disadvantages. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.intuition,
            }
          }
        ],
        "rules": {
          "intro": "#>text-center>You are able to understand and control animals.<#",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Parkour",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/parkour.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Scale a seemingly impossible obstacle.",
              "Make a seemingly life-threatening leap without suffering #>text-keyword>Harm<#.",
              "Successfully avoid a threat."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Free-Run",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/parkour.svg",
            "system": {
              "parentItem": {
                "name": "Parkour",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you execute acrobatic maneuvers,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose two options from the list below. You may save one until later.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but a complication, cost, or new threat emerges. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.coolness,
            }
          }
        ],
        "rules": {
          "intro": "You are deft at running and jumping, even over difficult terrain.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Observant",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/observant.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "What sort of person are you?",
              "Is there anything odd about you?"
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "Whenever you #>item-button text-doclink&data-item-name='Read a Person'&data-action='open'>Read a Person<#, you may choose from these questions in addition to the usual ones: %list.questions%",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Read a Person,target:system.lists.questions.items,effect:PushElement,value:What sort of person are you? #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Observant'&data-action='open'>Observant<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Read a Person,target:system.lists.questions.items,effect:PushElement,value:Is there anything odd about you? #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Observant'&data-action='open'>Observant<##>text-sourceref>)<#",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Expert",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/expert.svg",
      "system": {
        "lists": {
          "expertise": {
            "name": "Fields of Expertise",
            "items": [
              "Archeology",
              "Economics",
              "History",
              "Comparative Literature",
              "Psychology",
              "Sociology",
              "Theology",
              "(Other)"
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "You are an expert in certain fields of knowledge. Choose two areas of expertise when you gain this Advantage: %list.expertise%",
          "trigger": "",
          "outro": "Whenever you #>item-button text-doclink&data-item-name='Investigate'&data-action='open'>Investigate<# something associated with one of your chosen fields, you always get to ask one additional question, regardless of the outcome, and may ask any questions you want.",
          "listRefs": [],
          "effects": [
            {
              key: "PromptForData",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "title:What is your first Field of Expertise?,default: ,key:flags.Expert.field_1,input:text,bodyText:You may choose any sufficiently-broad area of academic study.,subText:#>text-posmod>Examples:<# Archaeology, Economics, History, Comparative Literature, Psychology, Sociology, Theology",
              priority: undefined
            },
            {
              key: "PromptForData",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "title:What is your second Field of Expertise?,default: ,key:flags.Expert.field_2,input:text,bodyText:You may choose any sufficiently-broad area of academic study.,subText:#>text-posmod>Examples:<# Archaeology, Economics, History, Comparative Literature, Psychology, Sociology, Theology",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Investigate,target:system.results.completeSuccess.result,effect:AppendText,text:%insert.break%If the subject of your inquiry is associated with #>text-keyword>%insert.flags.Expert.field_1%<# or #>text-keyword>%insert.flags.Expert.field_2%<# you may ask an additional question, any question you want. #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Expert'&data-action='open'>Expert<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Investigate,target:system.results.partialSuccess.result,effect:AppendText,text:%insert.break%If the subject of your inquiry is associated with #>text-keyword>%insert.flags.Expert.field_1%<# or #>text-keyword>%insert.flags.Expert.field_2%<# you may ask an additional question, any question you want. #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Expert'&data-action='open'>Expert<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Investigate,target:system.results.failure.result,effect:AppendText,text:%insert.break%Despite your failure, if the subject of your inquiry is associated with #>text-keyword>%insert.flags.Expert.field_1%<# or #>text-keyword>%insert.flags.Expert.field_2%<# you may still ask any one question you want. #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Expert'&data-action='open'>Expert<##>text-sourceref>)<#",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Interrogator",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/interrogator.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "Whenever you #>item-button text-doclink&data-item-name='Read a Person'&data-action='open'>Read a Person<# and mention a name, person, or object, you may always ask \"Are you lying?\"%insert.break%This doesn't count towards the number of questions you're allowed to normally ask.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Read a Person,target:system.results.completeSuccess.result,effect:AppendText,text:%insert.break%If you mention a name, person, or object, you may always ask 'Are you lying?' in addition to your other questions. #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Interrogator'&data-action='open'>Interrogator<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Read a Person,target:system.results.partialSuccess.result,effect:AppendText,text:%insert.break%If you mention a name, person, or object, you may always ask 'Are you lying?' in addition to your other questions. #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Interrogator'&data-action='open'>Interrogator<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Read a Person,target:system.results.failure.result,effect:AppendText,text:%insert.break%Despite your failure, if you mention a name, person, or object, you may still ask 'Are you lying?' #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Interrogator'&data-action='open'>Interrogator<##>text-sourceref>)<#",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Thirst for Knowledge",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/thirst-for-knowledge.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Learn Something New",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/thirst-for-knowledge.svg",
            "system": {
              "chatName": "Learns Something New",
              "parentItem": {
                "name": "Thirst for Knowledge",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you learn new information about alternate planes of existence, a supernatural entity, or a Higher Power,",
                "outro": "gain #>text-posmod>+1<# #>text-keyword>Stability<#."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Sealed Fate",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/sealed-fate.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Defy Wound",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/sealed-fate.svg",
            "system": {
              "chatName": "Defies Injury",
              "parentItem": {
                "name": "Sealed Fate",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you are dealt a #>text-keyword>Critical Wound<#,",
                "outro": "you may mark 1 Time from Condemned to immediately stabilize the #>text-keyword>Wound<#."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Defy Death",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/sealed-fate.svg",
            "system": {
              "chatName": "Defies Death",
              "parentItem": {
                "name": "Sealed Fate",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you die,",
                "outro": "mark 2 Time from Condemned and reawaken, injured and weak, but alive, and with all of your #>text-keyword>Wounds<# stabilized."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "RequireItem",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Condemned,for:Sealed Fate",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Quick Thinker",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/quick-thinker.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Remember something that's advantageous in a negotiation. Ask the GM what it is.",
              "You possess some equipment you can use to get out of a sticky situation. Ask the GM what it is.",
              "You have special field training that would be useful in getting past one of your obstacles. Ask the GM what it is."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Plan Ahead",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/quick-thinker.svg",
            "system": {
              "parentItem": {
                "name": "Quick Thinker",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you commence a dangerous mission,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below, at any time during the mission.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two options from the list below, at any time during the mission.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "At any time during the mission, choose one option from the list below, but you've failed to account for something. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Exorcist",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/exorcist.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Nobody is harmed during the ritual.",
              "The entity will not reappear later.",
              "The entity will not become hostile toward you."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Perform an Exorcism",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/exorcist.svg",
            "system": {
              "parentItem": {
                "name": "Exorcist",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you perform an exorcism to banish a spirit or extradimensional creature,",
                "outro": "explain what the ritual looks like and %insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "The creature is banished. Choose two options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "The creature is banished. Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "The creature resists banishment and something goes terribly wrong, such as the creature possessing you. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Wanderer",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/wanderer.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Ask the GM one question about this place.",
              "You have a contact at this place who could help you, with a bit of convincing.",
              "You have a hideout here, where you can put your head down and get some rest.",
              "You know something about this place. Tell the others what."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Wander",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/wanderer.svg",
            "system": {
              "parentItem": {
                "name": "Wanderer",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you are heading out to a community or another part of the city,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "You have been here before. Choose two options from the list below any time during your visit.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "You have heard of this place. Choose one option from the list below any time during your visit.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "You have been here before, but something bad happened. Choose one option from the list below any time during your visit. The GM explains what kind of problem awaits you here. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.perception,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Hardened",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/hardened.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "You take #>text-mod>+1 ongoing<# to all #>item-button text-doclink&data-item-name='Endure Injury'&data-action='open'>Endure Injury<# rolls.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyRoll",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Endure Injury,effect:Add,value:1,duration:ongoing,icon:systems/kult4th/assets/icons/advantage/hardened.svg,label:Hardened,tooltip:Applies to all #>item-button text-doclink&data-item-name='Endure Injury'&data-action='open'>Endure Injury<# rolls. #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Hardened'&data-action='open'>Hardened<##>text-sourceref>)<#",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Hacker",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/hacker.svg",
      "system": {
        "lists": {
          "complications": {
            "name": "Complications",
            "items": [
              "Someone discovers the intrusion. You must take risks or compromise on how much you're able to accomplish.",
              "You leave traces of your intrusion."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Hack Something",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/hacker.svg",
            "system": {
              "parentItem": {
                "name": "Hacker",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you penetrate digital networks in the pursuit of confidential data, crack software, or disable security systems,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You accomplish your task without a problem."
                },
                "partialSuccess": {
                  "result": "Complications arise. Choose one option: %list.complications%"
                },
                "failure": {
                  "result": "Unbeknownst to you, your intrusion didn't work out as you wanted. Maybe you didn't succeed at your task as well as you imagined, or you may have been discovered by personal enemies, law enforcement, or something else lurking in the network. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Fascination",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/fascination.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "They are attracted to you.",
              "They forget their woes when experiencing your art.",
              "They are totally captivated by your art and forget all about their surrounding environment."
            ]
          },
          "gmoptions": {
            "name": "GM Options",
            "items": [
              "They become obsessed with you.",
              "They want you right now."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Seduce Someone",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/fascination.svg",
            "system": {
              "parentItem": {
                "name": "Fascination",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you use your art to seduce an NPC,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below, but the GM also chooses one of the following: %list.gmoptions%",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "They are affected by you in a way you didn't anticipate, or the attraction is uncomfortably strong—you choose. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Boss",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/boss.svg",
      "system": {
        "lists": {
          "gmoptions": {
            "name": "GM Options",
            "items": [
              "Someone got into trouble.",
              "The job isn't done, and needs something else to be completed.",
              "There will be repercussions later on."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Deploy Henchmen",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/boss.svg",
            "system": {
              "parentItem": {
                "name": "Boss",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you send your henchmen to do a risky job,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "They follow your orders and everything goes according to plan."
                },
                "partialSuccess": {
                  "result": "They follow your orders, but GM picks one option: %list.gmoptions%"
                },
                "failure": {
                  "result": "The GM decides what went wrong, and whether it's immediately evident or will become apparent later on. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.coolness,
            }
          }
        ],
        "rules": {
          "intro": "You have five to ten criminal henchmen who are loyal to you, usually for as long as you continue paying them.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Fast Talk",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/fast-talk.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Prevent the NPC from noticing something in her immediate vicinity.",
              "Get the NPC to disclose something important (the GM will provide the details).",
              "Distract the NPC. You take #>text-posmod>+1<# to your next roll against them."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Fast-Talk Someone",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/fast-talk.svg",
            "system": {
              "parentItem": {
                "name": "Fast Talk",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you talk to an NPC to get their attention,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose two options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but they grow suspicious of your motives. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.coolness,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Read a Crowd",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/read-a-crowd.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "Who here has information I want?",
              "Where can I find what I am looking for?",
              "Who is watching me?",
              "Is there anything else of interest?"
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Mingle",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/read-a-crowd.svg",
            "system": {
              "parentItem": {
                "name": "Read a Crowd",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you move through a small crowd to gather information,",
                "outro": "%insert.rollPrompt%.%insert.break%Examples of a 'small crowd' include a party, bar/restaurant, or an office.%insert.break%You decide what specific information you are looking for, as long as it makes sense for the crowd to possess such information.",
                "listRefs": [
                  "questions"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Ask three questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "partialSuccess": {
                  "result": "Ask two questions from the list below, but you also draw unwanted attention to yourself.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "failure": {
                  "result": "Ask one question from the list below, but you've blown your cover. Those who have what you're looking for will be expecting you. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "questions"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.perception,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Workaholic",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/workaholic.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Innovate",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/workaholic.svg",
            "system": {
              "chatName": "Innovates",
              "parentItem": {
                "name": "Workaholic",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you create something or carry out an experiment,",
                "outro": "gain #>text-posmod>+1<# #>text-keyword>Stability<#."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Stubborn",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/stubborn.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>Refuse to Give Up<# &mdash; Postpone the effects of a critical injury until you have made it out of the threat's reach.",
              "#>text-edgename>Will Over Skill<# &mdash; Roll #>text-rolltrait>+Willpower<# instead of the normal attribute whenever you avoid or fight whatever is threatening you.",
              "#>text-edgename>Steel Yourself<# &mdash; Break free from a supernatural effect."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Push the Limits",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/stubborn.svg",
            "system": {
              "parentItem": {
                "name": "Stubborn",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you push yourself to the limit to overcome a threat,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": ["edges"]
              },
              "results": {
                "completeSuccess": {
                  "result": "#>text-keyword>Gain 3 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 3
                },
                "partialSuccess": {
                  "result": "#>text-keyword>Gain 2 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 2
                },
                "failure": {
                  "result": "#>text-keyword>Gain 1 Edge<#, but you push yourself past your breaking point. Decrease #>text-negmod>−2<# #>text-keyword>Stability<#.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 1
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          },
          {
            "name": "Refuse to Give Up",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/stubborn.svg",
            "system": {
              "chatName": "Refuse to Give Up",
              "parentItem": {
                "name": "Stubborn",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to postpone the effects of a critical injury until you have made it out of the threat's reach."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Will Over Skill",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/stubborn.svg",
            "system": {
              "chatName": "Will Over Skill",
              "parentItem": {
                "name": "Stubborn",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to roll #>text-rolltrait>+Willpower<# instead of the normal attribute whenever you avoid or fight whatever is threatening you."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Steel Yourself",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/stubborn.svg",
            "system": {
              "chatName": "Steel Yourself",
              "parentItem": {
                "name": "Stubborn",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to break free from a supernatural effect."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "edges"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Elite Sport (Fencing)",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/elite-sport-(fencing).svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "#>text-center>You've competed professionally in fencing.<#%insert.break%You own a rapier at home and you know how to wield it. Add the following to the attacks available to you when fighting with a sword: #>text-negmod><strong>Riposte</strong> [<strong>3</strong>] [Distance: <strong>arm</strong>] You can make this attack immediately after parrying.<#",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "CreateAttack",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:sword,name:Riposte,range:arm,harm:3,fromText:#>item-button text-doclink&data-item-name='Elite Sport (Fencing)'&data-action='open'>Elite Sport (Fencing)<#,special:You can make this attack immediately after parrying.",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Eye for Detail",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/eye-for-detail.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "Where are you from?",
              "Are you capable of violence?",
              "How could I seduce or tempt you?",
              "Why are you here?",
              "What are you working on?"
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Study Someone",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/eye-for-detail.svg",
            "system": {
              "parentItem": {
                "name": "Eye for Detail",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you have had time to study somebody for a while,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "questions"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Ask three questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "partialSuccess": {
                  "result": "Ask two questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "failure": {
                  "result": "Ask one question from the list below, but you expose your inquisitiveness to the person you're observing. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "questions"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.perception,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Escape Artist",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/escape-artist.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Escape",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/escape-artist.svg",
            "system": {
              "parentItem": {
                "name": "Escape Artist",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you need to escape a dangerous situation,",
                "outro": "outline your plan and %insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You escape without complications."
                },
                "partialSuccess": {
                  "result": "You can choose to stay or escape at a cost, such as leaving something important behind or take something traceable with you. The GM decides what it is."
                },
                "failure": {
                  "result": "You are only half out the door when you're caught in a really bad spot. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.coolness,
            }
          }
        ],
        "rules": {
          "intro": "#>text-center>You are a master at slipping away when the shit hits the fan.<#",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Erotic",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/erotic.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "The person must have you, and will abandon their normally reasonable behavior to do so.",
              "The person is distracted by you for as long as you're in the vicinity, unable to concentrate on anything else.",
              "The person becomes jealous of anyone competing for your attention, and tries to dispose of them by any means necessary.",
              "You make them uncertain and confused. You take #>text-mod>+1 ongoing<# against them during this scene."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Attract an NPC",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/erotic.svg",
            "system": {
              "parentItem": {
                "name": "Erotic",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you make moves to attract an NPC to you,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below any time during this scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two options from the list below any time during this scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below any time during this scene, but the nature of the attraction is different than you had hoped. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Lay on Hands",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/lay-on-hands.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Heal Another",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/lay-on-hands.svg",
            "system": {
              "parentItem": {
                "name": "Lay on Hands",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you lay your hands on a seriously or critically wounded person and pray,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You fully heal the injured person, channeling the #>text-keyword>Wound<# onto yourself or a selected target."
                },
                "partialSuccess": {
                  "result": "You stabilize the injured, channeling the #>text-keyword>Wound<# onto yourself or a selected target."
                },
                "failure": {
                  "result": "You may choose to stabilize the injured, but if you do, the powers break free from your control."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "You are able to heal others' #>text-keyword>Wounds<# without using medicine or first aid, but you must channel the injuries onto yourself or another living victim.%insert.break%To transfer a #>text-keyword>Wound<#, you must be able to see the victim, but not touch them and they are not required to consent.%insert.break%The #>text-keyword>Wound<# transferred is of the same type, severity, and condition as the original.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Sneak",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/sneak.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Find a secure hiding spot for a while.",
              "Find an alternate route to avoid encountering people.",
              "Bypass a security system or other obstacle without being noticed."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Stay Hidden",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/sneak.svg",
            "system": {
              "parentItem": {
                "name": "Sneak",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you keep hidden and try to avoid drawing attention to yourself,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose two options from the list below. You may spend them any time during the scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below. You may spend them any time during the scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but you manage to attract someone's attention. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.coolness,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Survival Instinct",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/survival-instinct.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Viciousness — #>text-mod>+1 ongoing<# to #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# rolls for the remainder of the fight.",
              "Adrenaline Rush — #>text-mod>+1 ongoing<# to #>item-button text-doclink&data-item-name='Endure Injury'&data-action='open'>Endure Injury<# rolls for the remainder of the fight."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Refuse to Yield",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/survival-instinct.svg",
            "system": {
              "parentItem": {
                "name": "Survival Instinct",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you suffer a serious or critical injury yet refuse to yield,",
                "outro": "%insert.rollPrompt%.%insert.break%On a success, you may temporarily ignore the effects of the injuries, but you will need treatment to stabilize them as soon as the time limit expires."
              },
              "results": {
                "completeSuccess": {
                  "result": "You ignore your injuries until the conflict is over, and you may choose one option from the list below: %list.options%"
                },
                "partialSuccess": {
                  "result": "You ignore your injuries until the conflict is over."
                },
                "failure": {
                  "result": "You overexert yourself and after a few moments your injuries cause you to pass out and collapse. After your next action, the GM decides when and how you pass out."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.violence,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Wayfinder",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/wayfinder.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Find a Way",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/wayfinder.svg",
            "system": {
              "parentItem": {
                "name": "Wayfinder",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you travel between two places in the city and allow your madness to guide you through the alleys,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You discover a shortcut through the alleys, which takes you to your destination within a few minutes, regardless of how far the distance actually is."
                },
                "partialSuccess": {
                  "result": "You discover a shortcut, but there is also some sort of obstacle you will need to get past."
                },
                "failure": {
                  "result": "You discover a shortcut, but it leads you into a dangerous situation, such as the lair of some creature or an ambush set by some gang. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Street Contacts",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/street-contacts.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "What do you know about the [building / person / organization / event]?",
              "What rumors are circulating on the street at the moment?",
              "How can I get into [location]?",
              "Who in this city would know more about this supernatural thing?"
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Ask Street Contacts",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/street-contacts.svg",
            "system": {
              "parentItem": {
                "name": "Street Contacts",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you need to know something and check in with your contacts,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "questions"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Ask three questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "partialSuccess": {
                  "result": "Ask one question from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "failure": {
                  "result": "Ask one question from the list below, but someone becomes suspicious or aggressive. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "questions"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "You have contacts among the homeless, crazies, and other societal outsiders and outcasts.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Weapon Master (Melee)",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/weapon-master-(melee).svg",
      "system": {
        "lists": {
          "attacks": {
            "name": "Attacks (Melee)",
            "items": [
              "#>text-negmod><strong>Launching Attack</strong> [<strong>2</strong>] [Distance: <strong>room</strong>]<#",
              "#>text-negmod><strong>Precision Attack</strong> [<strong>2</strong>] [Distance: <strong>arm</strong>] Ignores armor<#",
              "#>text-negmod><strong>Tripping Attack</strong> [<strong>2</strong>] [Distance: <strong>arm</strong>] Target falls prone<#",
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "#>text-center>You are a master of armed melee combat.<#%insert.break%When you #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# in close quarters, with or without a weapon, roll #>text-rolltrait>+Coolness<# instead of #>text-rolltrait>+Violence<#, and add the following to your available attacks: %list.attacks%",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyAttack",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:close_combat,effect:ChangeAttribute,value:coolness",
              priority: undefined
            },
            {
              key: "CreateAttack",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:close_combat,name:Launching Attack,range:room,harm:2,fromText:#>item-button text-doclink&data-item-name='Weapon Master (Melee)'&data-action='open'>Weapon Master (Melee)<#",
              priority: undefined
            },
            {
              key: "CreateAttack",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:close_combat,name:Precision Attack,range:arm,harm:2,fromText:#>item-button text-doclink&data-item-name='Weapon Master (Melee)'&data-action='open'>Weapon Master (Melee)<#,special:Ignores armor.",
              priority: undefined
            },
            {
              key: "CreateAttack",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:close_combat,name:Tripping Attack,range:arm,harm:2,fromText:#>item-button text-doclink&data-item-name='Weapon Master (Melee)'&data-action='open'>Weapon Master (Melee)<#,special:Target falls prone.",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Authority",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/authority.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Automatically #>item-button text-doclink&data-item-name='Influence Other NPC'&data-action='open'>Influence<# someone who has heard of your authority in your academic field, as if you had rolled a #>text-resultlabel>(15+)<#.",
              "Gain access to a university's resources, such as their facilities, researchers, or scientific archives.",
              "Make a statement about something or someone in mass media.",
              "Gain access to people or places under the pretense of engaging in your research or studies."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Establish Authority",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/authority.svg",
            "system": {
              "parentItem": {
                "name": "Authority",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "At the beginning of each game session,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "During this game session, choose three options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "During this game session, choose two options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "During this game session you may choose one option from the list below, but you also attract unwanted attention like stalkers, professional adversaries, competitors, or hostile forces. #>text-gmtext>The GM makes a Move<# for them at some point during the session.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "You're an academic authority in your field and a well-known name in newspapers, debate shows, and scientific journals.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Genius",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/genius.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>Logical<# &mdash; You realize an effective way to dispose of the threat. Deal #>text-mod>+1 Harm<# whenever you exploit it.",
              "#>text-edgename>Quick Thinking<# &mdash; You realize how to protect yourself from harm. Treat it as if you'd rolled a #>text-resultlabel>(15+)<# on #>item-button text-doclink&data-item-name='Avoid Harm'&data-action='open'>Avoid Harm<# whenever you exploit it.",
              "#>text-edgename>Rational<# &mdash; You realize how to save yourself by sacrificing someone else. Pick the person you throw under the bus to escape the threat."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Use Your Brain",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/genius.svg",
            "system": {
              "chatName": "Use their Brain",
              "parentItem": {
                "name": "Genius",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you find yourself in a life-threatening situation,",
                "outro": "%insert.rollPrompt% to see if you can discover a way out.",
                "listRefs": ["edges"]
              },
              "results": {
                "completeSuccess": {
                  "result": "#>text-keyword>Gain 3 Edges<#, useable any time in the scene, while you're still in danger.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 3
                },
                "partialSuccess": {
                  "result": "#>text-keyword>Gain 2 Edges<#, useable any time in the scene, while you're still in danger.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 2
                },
                "failure": {
                  "result": "#>text-keyword>Gain 1 Edge<#, but you also attract unwanted attention. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 1
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          },
          {
            "name": "Logical",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/genius.svg",
            "system": {
              "chatName": "Logical",
              "parentItem": {
                "name": "Genius",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to realize an effective way to dispose of the threat. Deal #>text-mod>+1 Harm<# whenever you exploit it."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Quick Thinking",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/genius.svg",
            "system": {
              "chatName": "Quick Thinking",
              "parentItem": {
                "name": "Genius",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to realize how to protect yourself from harm. Treat it as if you'd rolled a #>text-resultlabel>(15+)<# on #>item-button text-doclink&data-item-name='Avoid Harm'&data-action='open'>Avoid Harm<# whenever you exploit it."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Rational",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/genius.svg",
            "system": {
              "chatName": "Rational",
              "parentItem": {
                "name": "Genius",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to realize how to save yourself by sacrificing someone else. Pick the person you throw under the bus to escape the threat."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "edges"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Driver",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/driver.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>Defensive Driving<# &mdash; Make a risky maneuver to get out of the way.",
              "#>text-edgename>Evasive Driving<# &mdash; Shake off one pursuing vehicle.",
              "#>text-edgename>Deadly Driving<# &mdash; Use your vehicle as a weapon against a pedestrian (#>text-keyword>2-4 Harm<# depending on speed).",
              "#>text-edgename>Reckless Driving<# &mdash; Sideswipe another vehicle off the road."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Drive Dangerously",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/driver.svg",
            "system": {
              "parentItem": {
                "name": "Driver",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you drive your vehicle under pressure and in dangerous situations,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": ["edges"]
              },
              "results": {
                "completeSuccess": {
                  "result": "#>text-keyword>Gain 3 Edges<#. You may spend them anytime during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 3
                },
                "partialSuccess": {
                  "result": "#>text-keyword>Gain 2 Edges<#. You may spend them anytime during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 2
                },
                "failure": {
                  "result": "#>text-keyword>Gain 1 Edge<# to spend any time during the scene, but the situation worsens somehow—maybe you speed past a police car, additional vehicles start pursuing you, or you or your vehicle is damaged. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 1
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.coolness,
            }
          },
          {
            "name": "Defensive Driving",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/driver.svg",
            "system": {
              "chatName": "Defensive Driving",
              "parentItem": {
                "name": "Driver",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to make a risky maneuver to get out of the way."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Evasive Driving",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/driver.svg",
            "system": {
              "chatName": "Evasive Driving",
              "parentItem": {
                "name": "Driver",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to shake off one pursuing vehicle."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Deadly Driving",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/driver.svg",
            "system": {
              "chatName": "Deadly Driving",
              "parentItem": {
                "name": "Driver",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to use your vehicle as a weapon against a pedestrian (#>text-keyword>2-4 Harm<# depending on speed)."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Reckless Driving",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/driver.svg",
            "system": {
              "chatName": "Reckless Driving",
              "parentItem": {
                "name": "Driver",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to sideswipe another vehicle off the road."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "You are a trained professional at operating motor vehicles (car or motorcycle).",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "edges"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Tracer",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/tracer.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "Where in the world was this seen last?",
              "What people have associated themselves with what I'm looking for lately?",
              "What tracks and marks has it left behind?",
              "Who else is trying to find what I'm looking for?"
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Trace",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/tracer.svg",
            "system": {
              "parentItem": {
                "name": "Tracer",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you utilize your intelligence networks to trace someone or something,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "questions"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Ask three questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "partialSuccess": {
                  "result": "Ask two questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "failure": {
                  "result": "Ask one question from the list below, but someone notices you snooping around. It might be someone you'd rather not be known by, or a traitor inside your network.",
                  "listRefs": [
                    "questions"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Battlefield Medicine",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/battlefield-medicine.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Improvisation: You stabilize one #>text-keyword>Wound<# without access to medical equipment.",
              "Effective: You stabilize two #>text-keyword>Wounds<# instead of one.",
              "Careful: The wound stabilizes and will heal much faster than normal."
            ]
          },
          "complications": {
            "name": "Complications",
            "items": [
              "You leave cosmetic scars or defects (the patient loses #>text-negmod>−2<# #>text-keyword>Stability<#.",
              "There are lingering side effects (#>text-negmod>−1<# to all rolls the wound could feasibly affect until it's fully healed).",
              "The patient remains knocked out until the GM determines that they awaken."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Stabilize Wound",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/battlefield-medicine.svg",
            "system": {
              "parentItem": {
                "name": "Battlefield Medicine",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you stabilize an injured person's wounds, even if you don't have access to medical equipment,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose two options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "You may choose one option from the list below, but you must also choose one complication: %list.complications%",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "You stabilize the wound, even without access to medical equipment, but there are also unexpected and potentially dangerous consequences, such as infections, healing deformities, or other serious side effects. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Elite Education",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/elite-education.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Gain a favor from a country's administration (e.g., released from jail, skip a customs check, or get help from the police).",
              "Gain access to a location unavailable to the public.",
              "Locate or track a hidden or missing person.",
              "Receive both the means to escape and a safe hiding spot."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Request a Favor",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/elite-education.svg",
            "system": {
              "parentItem": {
                "name": "Elite Education",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you ask your contacts for a favor,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but you've become indebted to someone. The debt can be called in at any time during the story, at the GM's discretion.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "You have attended one of the world's most prestigious institutes of higher learning and have acquired contacts with power and influence.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Sniper",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/sniper.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Deal #>text-mod>+1 Harm<#.",
              "Hit another target as well.",
              "Immobilize your target.",
              "Get the target to lose control of something.",
              "You don't reveal your position."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Take a Shot",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/sniper.svg",
            "system": {
              "parentItem": {
                "name": "Sniper",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you fire at a distant target utilizing a scoped rifle,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "The shot finds its target. Choose two options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "The shot finds its target. Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "The shot didn't go where you intended it to, or you reveal your position to the enemy—expect witnesses, opponents pursuing you as you leave the scene, or other problems. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.violence,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Streetfighter",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/streetfighter.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>Dodge<# &mdash; Avoid an attack.",
              "#>text-edgename>Flurry of Blows<# &mdash; Take #>text-posmod>+2<# on your roll to attack an opponent.",
              "#>text-edgename>Dirty Strike<# &mdash; Momentarily stun an opponent by striking them where it hurts."
            ]
          },
          "complications": {
            "name": "Complications",
            "items": [
              "You risk losing control during the fight (#>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<# to prevent it).",
              "You earn an enemy, who will try to get back at you later."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Fight in Close Combat",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/streetfighter.svg",
            "system": {
              "parentItem": {
                "name": "Streetfighter",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you fight in close combat,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": ["edges"]
              },
              "results": {
                "completeSuccess": {
                  "result": "#>text-keyword>Gain 3 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 3
                },
                "partialSuccess": {
                  "result": "#>text-keyword>Gain 2 Edges<#, but the GM also gets to pick one complication: %list.complications%",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 2
                },
                "failure": {
                  "result": "You're unfocused and lose control. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.violence,
            }
          },
          {
            "name": "Dodge",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/streetfighter.svg",
            "system": {
              "chatName": "Dodge",
              "parentItem": {
                "name": "Streetfighter",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to avoid an attack."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Flurry of Blows",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/streetfighter.svg",
            "system": {
              "chatName": "Flurry of Blows",
              "parentItem": {
                "name": "Streetfighter",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to take #>text-posmod>+2<# on your roll to attack an opponent."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Dirty Strike",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/streetfighter.svg",
            "system": {
              "chatName": "Dirty Strike",
              "parentItem": {
                "name": "Streetfighter",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to momentarily stun an opponent by striking them where it hurts."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "edges"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Shadow",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/shadow.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Shadow Someone",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/shadow.svg",
            "system": {
              "parentItem": {
                "name": "Shadow",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "When shadowing someone,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You avoid discovery, follow your target all the way to their final destination, and learn something about them you can use to your advantage later."
                },
                "partialSuccess": {
                  "result": "You avoid discovery and follow your target to their final destination."
                },
                "failure": {
                  "result": "You are spotted or encounter some sort of problem along the way. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.perception,
            }
          },
          {
            "name": "Evade a Shadow",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/shadow.svg",
            "system": {
              "parentItem": {
                "name": "Shadow",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you want to lose someone shadowing you,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You shake your pursuers and can choose to try to shadow them instead."
                },
                "partialSuccess": {
                  "result": "You shake your pursuers."
                },
                "failure": {
                  "result": "Your pursuers are still on your tail, and they can set up an ambush, disappear without a trace (only to show up when you least expect it), or refuse to go away. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.perception,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Burglar",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/burglar.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "You silently open a locked door within a few moments.",
              "You neutralize an alarm.",
              "You bust a lockbox or safe in less than two minutes.",
              "You avoid being discovered by someone.",
              "Trick someone into believing you belong here (e.g., pretend you're a security guard) for a limited time."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Break & Enter",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/burglar.svg",
            "system": {
              "parentItem": {
                "name": "Burglar",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you make use of your expertise in breaking and entering,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below. You may spend them any time during the scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two options from the list below. You may spend them any time during the scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but a problem arises. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.coolness,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Eye for an Eye",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/eye-for-an-eye.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Swear Vengeance",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/eye-for-an-eye.svg",
            "system": {
              "chatName": "Swears Vengeance",
              "parentItem": {
                "name": "Eye for an Eye",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you suffer a serious or critical injury, name the person you feel is responsible.",
                "outro": "You get #>text-mod>+2 ongoing<# to all rolls against them, forever. All rolls targeting the person count, but rolls targeting the person's family, friends, minions, and property only count if the GM feels they're applicable."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Gritted Teeth",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/gritted-teeth.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "Abuse, violence, self-harm, and assaults have become familiar, and the pain hardly affects you at all anymore.%insert.break%You suffer no penalties to your dice rolls from your #>text-keyword>Wounds<#.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyProperty",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:actor,effect:Set,target:system.modifiers.wounds_critical.1.all,value:0",
              priority: undefined
            },
            {
              key: "ModifyProperty",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:actor,effect:Set,target:system.modifiers.wounds_serious.1.all,value:0",
              priority: undefined
            },
            {
              key: "ModifyProperty",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:actor,effect:Set,target:system.modifiers.wounds_serious.2.all,value:0",
              priority: undefined
            },
            {
              key: "ModifyProperty",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:actor,effect:Set,target:system.modifiers.wounds_serious.3.all,value:0",
              priority: undefined
            },
            {
              key: "ModifyProperty",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:actor,effect:Set,target:system.modifiers.wounds_serious.4.all,value:0",
              priority: undefined
            },
            {
              key: "ModifyProperty",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:actor,effect:Set,target:system.modifiers.wounds_seriouscritical.1.all,value:0",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Manipulative",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/manipulative.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Take #>text-posmod>+2<# to #>item-button text-doclink&data-item-name='Influence Other NPC'&data-action='open'>Influence Other<# rolls made against them.",
              "Take #>text-posmod>+2<# to #>item-button text-doclink&data-item-name='Hinder Other'&data-action='open'>Hinder Other<# rolls made against them."
            ]
          }
        },
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Take Account",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/manipulative.svg",
            "system": {
              "chatName": "Takes Account",
              "parentItem": {
                "name": "Manipulative",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you do someone a favor or learn one of their secrets,",
                "outro": "you may later choose one of the options below, by reminding them of your prior services or hint at the secret you know: %list.options%"
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Death Drive",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/death-drive.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>Bring 'Em On<# &mdash; Engage an additional hostile in Combat.",
              "#>text-edgename>Savagery<# &mdash; Deal #>text-mod>+2 Harm<# with one attack.",
              "#>text-edgename>Charge<# &mdash; Get within reach to attack a hostile.",
              "#>text-edgename>Go Crazy<# &mdash; Frighten your opponents by laughing into the face of death (#>text-mod>+1 ongoing<# during the fight)."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Fight Recklessly",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/death-drive.svg",
            "system": {
              "parentItem": {
                "name": "Death Drive",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you fight with no regard for your personal safety,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": ["edges"]
              },
              "results": {
                "completeSuccess": {
                  "result": "#>text-keyword>Gain 3 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 3
                },
                "partialSuccess": {
                  "result": "#>text-keyword>Gain 2 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 2
                },
                "failure": {
                  "result": "#>text-keyword>Gain 1 Edge<#, but afterwards you discover you have been injured without noticing it (#>item-button text-doclink&data-item-name='Endure Injury'&data-action='open'>Endure Injury<#; the GM determines the amount of #>text-keyword>Harm<# based on who attacked you and how).",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 1
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.violence,
            }
          },
          {
            "name": "Bring 'Em On",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/death-drive.svg",
            "system": {
              "chatName": "Bring 'Em On",
              "parentItem": {
                "name": "Death Drive",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to engage an additional hostile in Combat."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Savagery",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/death-drive.svg",
            "system": {
              "chatName": "Savagery",
              "parentItem": {
                "name": "Death Drive",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to deal #>text-mod>+2 Harm<# with one attack."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Charge",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/death-drive.svg",
            "system": {
              "chatName": "Charge",
              "parentItem": {
                "name": "Death Drive",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to get within reach to attack a hostile."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Go Crazy",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/death-drive.svg",
            "system": {
              "chatName": "Go Crazy",
              "parentItem": {
                "name": "Death Drive",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to frighten your opponents by laughing into the face of death (#>text-mod>+1 ongoing<# during the fight)."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "edges"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Analyst",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/analyst.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "Which organizations, groups, or people of interest may be connected to this?",
              "Is there a connection between this and another event?",
              "What could a plausible motive be?"
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "When you #>item-button text-doclink&data-item-name='Investigate'&data-action='open'>Investigate<#, you may also choose from these additional questions: %list.questions%",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Investigate,target:system.lists.questions.items,effect:PushElement,value:Which organizations, groups, or people of interest may be connected to this? #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Analyst'&data-action='open'>Analyst<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Investigate,target:system.lists.questions.items,effect:PushElement,value:Is there a connection between this and another event? #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Analyst'&data-action='open'>Analyst<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Investigate,target:system.lists.questions.items,effect:PushElement,value:What could a plausible motive be? #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Analyst'&data-action='open'>Analyst<##>text-sourceref>)<#",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Gang Leader",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/gang-leader.svg",
      "system": {
        "lists": {
          "complications": {
            "name": "Complications",
            "items": [
              "One of them defies you in front of the others.",
              "They will all be disgruntled for some time."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Give Orders",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/gang-leader.svg",
            "system": {
              "parentItem": {
                "name": "Gang Leader",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you give your gang orders that are risky and/ or may result in them paying a high price,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "They enact your orders without question."
                },
                "partialSuccess": {
                  "result": "They do as you want, but there is a complication (choose one): %list.complications%"
                },
                "failure": {
                  "result": "Problems arise. Maybe something goes wrong when carrying out your orders, or they doubt your abilities as a leader. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.violence,
            }
          }
        ],
        "rules": {
          "intro": "#>text-center>You're the boss of a small gang of criminals.<#",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Streetwise",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/streetwise.svg",
      "system": {
        "lists": {
          "gmoptions": {
            "name": "GM Options",
            "items": [
              "It will cost you something extra, such as in-kind services, tasks, or an inflated price.",
              "You can get it handled, but only by dealing with someone you're already indebted to.",
              "\"Shit, I had one, but I just let it go to [insert name]—maybe you can buy it from her?\"",
              "\"Sorry, that's a bit outside of my area, but maybe this will work instead?\""
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Tap the Underworld",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/streetwise.svg",
            "system": {
              "parentItem": {
                "name": "Streetwise",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you want to acquire items or services from the criminal underworld,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "No problem—you get what you're after. Someone will fix you right up."
                },
                "partialSuccess": {
                  "result": "The GM chooses one option from the list below: %list.gmoptions%"
                },
                "failure": {
                  "result": "You think you find what you're looking for, but there will be costly stipulations, considerable flaws, or major complications. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Manhunter",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/manhunter.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "What is their background?",
              "What or who do they love most of all?",
              "Who do they surround themselves with, like, and/or trust?",
              "Where are they located right now?",
              "How can I best gain access to them?"
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Hunt Someone",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/manhunter.svg",
            "system": {
              "parentItem": {
                "name": "Manhunter",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you're out to get information about someone,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "questions"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Ask three questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "partialSuccess": {
                  "result": "Ask two questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "failure": {
                  "result": "Ask one question from the list below, but someone figures out you've been snooping around.",
                  "listRefs": [
                    "questions"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Elite Sport (Athletic)",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/elite-sport-(athletic).svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "You've competed professionally in an athletic sport (baseball, football, tennis, etc.), through which you have developed your physical capabilities.%insert.break%You take #>text-mod>+1 ongoing<# to all rolls relevant to running, throwing, or catching objects.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Deadly Stare",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/deadly-stare.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Unleash Stare",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/deadly-stare.svg",
            "system": {
              "parentItem": {
                "name": "Deadly Stare",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you find yourself in a charged situation,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You make eye contact with an NPC, causing them to freeze up and be unable to take any actions until you break eye contact. You also get #>text-mod>+2 ongoing<# against your target."
                },
                "partialSuccess": {
                  "result": "You make eye contact with an NPC, causing them to freeze up and be unable to take any actions until you break eye contact."
                },
                "failure": {
                  "result": "Your opponents see you as their primary threat."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.violence,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Ace Up the Sleeve",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/ace-up-the-sleeve.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>Reveal a Weapon<# &mdash; You have a small, concealed lethal weapon (stiletto or similar), which you can produce unnoticed.",
              "#>text-edgename>Spot a Weakness<# &mdash; You realize your opponent has a weakness you can exploit (take #>text-posmod>+2<# to your next roll, if it involves exploiting the weakness). Ask the GM what it is.",
              "#>text-edgename>Find an Exit<# &mdash; You spot a way out. Ask the GM what it is. Take #>text-posmod>+2<# to your next roll to make use of it."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Draw an Ace",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/ace-up-the-sleeve.svg",
            "system": {
              "parentItem": {
                "name": "Ace Up the Sleeve",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever someone's got you up against the wall or in a tight spot,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": ["edges"]
              },
              "results": {
                "completeSuccess": {
                  "result": "#>text-keyword>Gain 2 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 2
                },
                "partialSuccess": {
                  "result": "#>text-keyword>Gain 1 Edge<#. You may spend it at any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 1
                },
                "failure": {
                  "result": "#>text-keyword>Gain 1 Edge<#, but the situation is worse than you imagined. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 1
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.coolness,
            }
          },
          {
            "name": "Reveal a Weapon",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/ace-up-the-sleeve.svg",
            "system": {
              "chatName": "Reveal a Weapon",
              "parentItem": {
                "name": "Ace Up the Sleeve",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to have a small, concealed lethal weapon (stiletto or similar), which you can produce unnoticed."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Spot a Weakness",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/ace-up-the-sleeve.svg",
            "system": {
              "chatName": "Spot a Weakness",
              "parentItem": {
                "name": "Ace Up the Sleeve",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to realize your opponent has a weakness you can exploit (take #>text-posmod>+2<# to your next roll, if it involves exploiting the weakness). Ask the GM what it is."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Find an Exit",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/ace-up-the-sleeve.svg",
            "system": {
              "chatName": "Find an Exit",
              "parentItem": {
                "name": "Ace Up the Sleeve",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to spot a way out. Ask the GM what it is. Take #>text-posmod>+2<# to your next roll to make use of it."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "edges"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Inner Power",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/inner-power.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Release Their Power",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/inner-power.svg",
            "system": {
              "parentItem": {
                "name": "Inner Power",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you release your inner power,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "The power attacks all opponents in your vicinity, causing #>text-keyword>2 Harm<#."
                },
                "partialSuccess": {
                  "result": "The power attacks your closest opponent, causing #>text-keyword>2 Harm<#."
                },
                "failure": {
                  "result": "The power attacks all living beings, including yourself, in the vicinity, causing #>text-keyword>2 Harm<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "You harbor a mysterious power, which you do not fully understand. The power can protect you, but you have no control over it.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Network of Contacts",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/network-of-contacts.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "What resources do they have at their disposal?",
              "Who do they have business dealings with?",
              "Where can I find them?",
              "What do they want?",
              "What are they most afraid of losing?"
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Check In with Contacts",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/network-of-contacts.svg",
            "system": {
              "parentItem": {
                "name": "Network of Contacts",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you check in with your contacts regarding an individual of your choosing,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "questions"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Ask three questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "partialSuccess": {
                  "result": "Ask two questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "failure": {
                  "result": "Ask one question from the list below, but the person you're inquiring about finds out you're snooping around. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "questions"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Survivalist",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/survivalist.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Find water and something edible.",
              "Make it past an environmental obstacle.",
              "Find a safe spot to hide and rest."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Survive",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/survivalist.svg",
            "system": {
              "parentItem": {
                "name": "Survivalist",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you utilize your survivalist skills,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below, useable while you remain in this situation.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two options from the list below, useable while you remain in this situation.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below useable while you remain in this situation, but you've also overlooked something important. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.perception,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Officer",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/officer.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>\"Attack!\"<# &mdash; One ally gets #>text-posmod>+2<# to their next roll to #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<#.",
              "#>text-edgename>\"Coordinate Fire!\"<# &mdash; All allies get #>text-posmod>+1<# to their next roll to #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# with firearms while in the fight.",
              "#>text-edgename>\"Go For The Head!\"<# &mdash; You or one of your allies' #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# deals #>text-mod>+1 Harm<#.",
              "#>text-edgename>\"Take Cover!\"<# &mdash; You or an ally receive #>text-keyword>2 Armor<# against a ranged attack."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Take Command",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/officer.svg",
            "system": {
              "parentItem": {
                "name": "Officer",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you are in combat with at least one ally by your side,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": ["edges"]
              },
              "results": {
                "completeSuccess": {
                  "result": "#>text-keyword>Gain 3 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 3
                },
                "partialSuccess": {
                  "result": "#>text-keyword>Gain 2 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 2
                },
                "failure": {
                  "result": "You misjudge the situation. Choose whether you have put yourself or one of your allies in harm's way. #>text-gmtext>The GM makes a Move<# for your opponent."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.violence,
            }
          },
          {
            "name": "\"Attack!\"",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/officer.svg",
            "system": {
              "chatName": "\"Attack!\"",
              "parentItem": {
                "name": "Officer",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to one ally gets #>text-posmod>+2<# to their next roll to #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<#."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "\"Coordinate Fire!\"",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/officer.svg",
            "system": {
              "chatName": "\"Coordinate Fire!\"",
              "parentItem": {
                "name": "Officer",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to give all allies #>text-posmod>+1<# to their next roll to #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# with firearms while in the fight."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "\"Go For The Head!\"",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/officer.svg",
            "system": {
              "chatName": "\"Go For The Head!\"",
              "parentItem": {
                "name": "Officer",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to have you or one of your allies' #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# deals #>text-mod>+1 Harm<#."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "\"Take Cover!\"",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/officer.svg",
            "system": {
              "chatName": "\"Take Cover!\"",
              "parentItem": {
                "name": "Officer",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to have you or an ally receive #>text-keyword>2 Armor<# against a ranged attack."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "edges"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Exit Strategy",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/exit-strategy.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "You leave the scene of the murder unnoticed and reach a safe spot of your choosing in the vicinity. Describe how.",
              "You have left no clues that can be traced back to you.",
              "The body is well hidden and will not be found for quite some time."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Flee the Scene",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/exit-strategy.svg",
            "system": {
              "parentItem": {
                "name": "Exit Strategy",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you have killed someone covertly and leave the scene of the murder,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "You get all three options below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two of the options below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but you risk discovery or face unexpected obstacles. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.perception,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Puppeteer",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/puppeteer.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Execute a Plan",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/puppeteer.svg",
            "system": {
              "parentItem": {
                "name": "Puppeteer",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you execute a plan using other people as pawns,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "Everyone involved takes #>text-mod>+1 ongoing<# to carry out the plan, and you get #>text-keyword>one Experience<# if the plan is successful."
                },
                "partialSuccess": {
                  "result": "You get #>text-keyword>one Experience<# if the plan is successful, but you have overlooked or miscalculated something."
                },
                "failure": {
                  "result": "Your plan is inadequate, revealed, and/or misguided. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Forked Tongue",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/forked-tongue.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "They trust you (PC takes #>text-posmod>+1<# #>text-keyword>Relation<# with you).",
              "They're spellbound by you (take #>text-mod>+1 ongoing<# against them during this scene).",
              "They reveal a weakness, which you can exploit later."
            ]
          },
          "complications": {
            "name": "Complications",
            "items": [
              "They see you as a friend they can turn to when in need.",
              "They fall in love with you.",
              "They will feel betrayed, spurned, humiliated, or manipulated whenever you abuse their trust in you."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Manipulate Someone",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/forked-tongue.svg",
            "system": {
              "parentItem": {
                "name": "Forked Tongue",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you manipulate someone,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below, but there is also a complication, chosen by the GM or the targeted PC: %list.complications%",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "They see right through you and will act as they please."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Cult Leader",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/cult-leader.svg",
      "system": {
        "lists": {
          "visions": {
            "name": "Visions",
            "items": [
              "a vision of a creature's true form.",
              "a vision of a portal between dimensions.",
              "a vision of the cult's enemies.",
              "a vision of an object's purpose.",
              "a vision revealing your deity's wishes (take #>text-posmod>+1<# to all rolls while fulfilling their wishes)."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Lead a Ritual",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/cult-leader.svg",
            "system": {
              "parentItem": {
                "name": "Cult Leader",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you and your followers perform a ritual,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "visions"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose to receive up to three visions from the list below.",
                  "listRefs": [
                    "visions"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose to receive up to two visions from the list below.",
                  "listRefs": [
                    "visions"
                  ]
                },
                "failure": {
                  "result": "Choose one vision, but the Illusion tears as a result. You may temporarily be transported into another dimension, attract a demonic being's attention, or receive a horrifying omen. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Field Agent",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/field-agent.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>Take Cover<# &mdash; Avoid a ranged attack by diving behind an object or a person.",
              "#>text-edgename>Choke Hold<# &mdash; Lock a human opponent in a grip they cannot get out of without taking #>text-keyword>1 Harm<#.",
              "#>text-edgename>Disarm<# &mdash; Remove an opponent's weapon in close combat.",
              "#>text-edgename>Improvised Weapon<# &mdash; Make a lethal, close-combat attack with a seemingly-innocuous object #>text-negmod>(<strong>Surprise Strike</strong> [<strong>2</strong>] [Distance: <strong>arm</strong>])<#."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Enter Combat",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/field-agent.svg",
            "system": {
              "parentItem": {
                "name": "Field Agent",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you enter combat,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "#>text-keyword>Gain 3 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 3
                },
                "partialSuccess": {
                  "result": "#>text-keyword>Gain 2 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 2
                },
                "failure": {
                  "result": "#>text-keyword>Gain 1 Edge<#, but you have made a bad call. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 1
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.violence,
            }
          },
          {
            "name": "Take Cover",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/field-agent.svg",
            "system": {
              "chatName": "Take Cover",
              "parentItem": {
                "name": "Field Agent",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to avoid a ranged attack by diving behind an object or a person."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Choke Hold",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/field-agent.svg",
            "system": {
              "chatName": "Choke Hold",
              "parentItem": {
                "name": "Field Agent",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to lock a human opponent in a grip they cannot get out of without taking #>text-keyword>1 Harm<#."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Disarm",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/field-agent.svg",
            "system": {
              "chatName": "Disarm",
              "parentItem": {
                "name": "Field Agent",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to remove an opponent's weapon in close combat."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Improvised Weapon",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/field-agent.svg",
            "system": {
              "chatName": "Improvised Weapon",
              "parentItem": {
                "name": "Field Agent",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to make a lethal, close-combat attack with a seemingly-innocuous object #>text-negmod>(<strong>Surprise Strike</strong> [<strong>2</strong>] [Distance: <strong>arm</strong>])<#."
              },
              "results": {
                "triggered": {
                  "result": "",
                  "effects": [
                    {
                      key: "CreateAttack",
                      mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                      value: "filter:close_combat,name:Surprise Strike,range:arm,harm:2,fromText:#>item-button text-doclink&data-item-name='Field Agent'&data-action='open'>Field Agent<#,uses:1",
                      priority: undefined
                    }
                  ]
                }
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "You have been trained by an intelligence agency to fight in the field.",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "edges"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Voice of Pain",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/voice-of-pain.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "You realize how to get through your opponent's defenses (take #>text-posmod>+1<# to #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# with them).",
              "You find your opponent's weak spot (deal #>text-mod>+1 Harm<# whenever you #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# with them).",
              "You perceive your opponent's pattern of attack (take #>text-posmod>+1<# to #>item-button text-doclink&data-item-name='Avoid Harm'&data-action='open'>Avoid Harm<# whenever they attack you). These effects are permanent against this opponent."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Learn from Pain",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/voice-of-pain.svg",
            "system": {
              "parentItem": {
                "name": "Voice of Pain",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "When an opponent seriously or critically wounds you for the first time,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose two options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but the pain will overwhelm you eventually and make you black out.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Collector",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/collector.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Seek Rare item",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/collector.svg",
            "system": {
              "parentItem": {
                "name": "Collector",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you search for an unusual or rare item,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You know exactly where the item is, how to acquire it, and how to minimize hazards, obstacles, and/or costs."
                },
                "partialSuccess": {
                  "result": "You know roughly where it is and what hazards, obstacles, and/or costs are associated with acquiring it."
                },
                "failure": {
                  "result": "You know roughly where to start searching for it, but not the hazards or costs involved in pursuing it."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Snake Charmer",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/snake-charmer.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Ask the creature for help with a problem.",
              "Ask the creature for something you desire."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Charm a Monster",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/snake-charmer.svg",
            "system": {
              "parentItem": {
                "name": "Snake Charmer",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you perform your chosen art form for an intelligent, monstrous creature,",
                "outro": "%insert.rollPrompt% to awaken a desire within them.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose one option from the list below immediately, and you may choose two more any time in the future.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "The desire is beyond the creature's ability to regulate. It cannot help but attempt to devour or imprison you."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Data Retrieval",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/data-retrieval.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "What is its origin?",
              "What is it meant for?",
              "How does it work?",
              "What do I have to watch out for?",
              "How can I stop or destroy this?"
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Search the Archives",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/data-retrieval.svg",
            "system": {
              "parentItem": {
                "name": "Data Retrieval",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you look for information on a subject in a library, research archive, or on the Internet,",
                "outro": "%insert.rollPrompt%.%insert.break%In response to the inquiries you make, the GM will tell you what you uncover, in as much detail as can be expected from the source you have utilized.",
                "listRefs": [
                  "questions"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Ask three questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "partialSuccess": {
                  "result": "Ask two questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "failure": {
                  "result": "Ask one question from the list below, but you also discover something unexpected. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "questions"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Divine",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/divine.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Soothe an aggressive creature.",
              "Command the creature and force it to obey your order."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Encounter a Monster",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/divine.svg",
            "system": {
              "parentItem": {
                "name": "Divine",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you encounter a monstrous creature,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "The creature mistakes you for a god. Choose three options from the list below, useable any time during this scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "You are fascinating to the creature. Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "You may choose one option from the list below, but after using it the creature becomes determined to possess you. It might try to devour you or perhaps capture you. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "There is something about you that reminds your former servants of what you truly are.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Keen-Eyed",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/keen-eyed.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "What weaknesses do they have I can use to my advantage?",
              "What strengths do they have I should watch out for?"
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "Whenever you #>item-button text-doclink&data-item-name='Observe a Situation'&data-action='open'>Observe a Situation<#, you may choose from these questions, in addition to the ones normally acquired: %list.questions%",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Observe a Situation,target:system.lists.questions.items,effect:PushElement,value:What weaknesses do they have I can use to my advantage? #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Keen-Eyed'&data-action='open'>Keen-Eyed<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Observe a Situation,target:system.lists.questions.items,effect:PushElement,value:What strengths do they have I should watch out for? #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Keen-Eyed'&data-action='open'>Keen-Eyed<##>text-sourceref>)<#",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Occult Library",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/occult-library.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "Which higher power does this have connections to?",
              "What do I need, or need to do, to exorcise or control this being?",
              "Which dimension is this associated with?",
              "What must I do to protect myself from this?"
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Research the Supernatural",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/occult-library.svg",
            "system": {
              "parentItem": {
                "name": "Occult Library",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you are in your library researching the supernatural,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold at any time to make a hard or soft Move.",
                "listRefs": [
                  "questions"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Ask two questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "partialSuccess": {
                  "result": "Ask one question from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "failure": {
                  "result": "Ask one question from the list below, but you have missed or overlooked something crucial. #>text-gmtext>The GM takes 1 Hold<#.",
                  "listRefs": [
                    "questions"
                  ],
                  "hold": 1
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold at any time to make a hard or soft Move."
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Chameleon",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/chameleon.svg",
      "system": {
        "lists": {
          "complications": {
            "name": "Complications",
            "items": [
              "You can't keep this deception up for very long. You must act fast, if you don't want to risk getting exposed.",
              "You leave traces and clues behind, which can be connected to you later on."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Change Appearance",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/chameleon.svg",
            "system": {
              "parentItem": {
                "name": "Chameleon",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you imitate another's appearance or conceal your own identity to trick someone,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "Your disguise is convincing, as long as you keep the act going."
                },
                "partialSuccess": {
                  "result": "You manage to trick everyone who doesn't examine you in detail, but choose one complication: %list.complications%"
                },
                "failure": {
                  "result": "Your disguise is only effective at a distance. If you attract any attention to yourself, you will be exposed."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.intuition,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Influential Friends",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/influential-friends.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Ask Friends",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/influential-friends.svg",
            "system": {
              "parentItem": {
                "name": "Influential Friends",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you need to acquire an object, gain access to a restricted location, or meet a specific person,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "Your friends can arrange for what you want."
                },
                "partialSuccess": {
                  "result": "They can arrange for it, but you have to repay the favor later."
                },
                "failure": {
                  "result": "They arrange for what you want, but you get on a powerful person's bad side or attract negative publicity. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "#>text-center>You have friends with power and influence.<#",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Magical Intuition",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/magical-intuition.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Learn something about a creature's true nature.",
              "Learn if something has a magical nature.",
              "Learn where the Illusion is weakest towards other dimensions."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Focus Magical Intuition",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/magical-intuition.svg",
            "system": {
              "parentItem": {
                "name": "Magical Intuition",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you utilize your magical intuition,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below. Up to two may be saved until later this scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two options from the list below. One may be saved until later this scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but you also get an unexpected vision or attract attention. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "You have an innate ability to perceive Kirlian auras and sense the presence of magic.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Intuitive",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/intuitive.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "You can sense people's motives through subconscious readings of their body language, word choices, and behavior.%insert.break%Whenever you #>item-button text-doclink&data-item-name='Read a Person'&data-action='open'>Read a Person<#, you may always ask one additional question, regardless of the outcome of your roll.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Read a Person,target:system.results.completeSuccess.result,effect:AppendText,text:%insert.break%You may ask one additional question (3 total). #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Intuitive'&data-action='open'>Intuitive<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Read a Person,target:system.results.partialSuccess.result,effect:AppendText,text:%insert.break%You may ask one additional question (2 total). #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Intuitive'&data-action='open'>Intuitive<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Read a Person,target:system.results.failure.result,effect:AppendText,text:%insert.break%Despite your failure, you may ask one question from the list below any time you are in conversation with the subject of your scrutiny during this scene. #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Intuitive'&data-action='open'>Intuitive<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Read a Person,target:system.results.failure.listRefs,effect:PushElement,value:questions",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Weapon Master (Firearms)",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/weapon-master-(firearms).svg",
      "system": {
        "lists": {
          "attacks": {
            "name": "Attacks (Firearms)",
            "items": [
              "#>text-negmod><strong>Two in the Chest, One in the Head</strong> [<strong>4</strong>] [Distance: <strong>room</strong>] [Ammo: <strong>●●</strong>]<#",
              "#>text-negmod><strong>Disarming Shot</strong> [<strong>1</strong>] [Distance: <strong>room</strong>] [Ammo: <strong>●</strong>] Disarm target on success. A targeted PC must<# #>item-button text-doclink&data-item-name='Act Under Pressure'&data-action='open'>Act Under Pressure<#"
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "#>text-center>You are a master of gunplay.<#%insert.break%When you #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# with a firearm, roll #>text-rolltrait>+Coolness<# instead of #>text-rolltrait>+Violence<#, and add the following to your available attacks: %list.attacks%",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyAttack",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:firearm,effect:ChangeAttribute,value:coolness",
              priority: undefined
            },
            {
              key: "CreateAttack",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:firearm,range:room,harm:4,ammo:-2,fromText:#>item-button text-doclink&data-item-name='Weapon Master (Firearms)'&data-action='open'>Weapon Master (Firearms)<#,name:Two in the Chest, One in the Head",
              priority: undefined
            },
            {
              key: "CreateAttack",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:firearm,range:room,harm:4,ammo:-1,fromText:#>item-button text-doclink&data-item-name='Weapon Master (Firearms)'&data-action='open'>Weapon Master (Firearms)<#,name:Disarm,special:Disarm target; a targeted PC must Act Under Pressure.",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Dreamer",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/dreamer.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Navigate the Dream",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/dreamer.svg",
            "system": {
              "parentItem": {
                "name": "Dreamer",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you want to meet someone or find out the truth about something in the Dream,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You meet the intended person or arrive at the specific place in the Dream."
                },
                "partialSuccess": {
                  "result": "You meet the intended person, or arrive at the specific place. However, some element has changed, or something followed you or the person in question."
                },
                "failure": {
                  "result": "You are lost in the Dream and cannot wake up until you find your way back."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "#>text-center>You are a talented, self-taught dream wanderer.<#",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Divine Champion",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/divine-champion.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Champion the Divine",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/divine-champion.svg",
            "system": {
              "chatName": "Champions the Divine",
              "parentItem": {
                "name": "Divine Champion",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you fight your deity's enemies or fight to protect a sacred object,",
                "outro": "you do #>text-mod>+1 Harm<# and take #>text-mod>+1 ongoing<# to #>item-button text-doclink&data-item-name='Endure Injury'&data-action='open'>Endure Injury<#.%insert.break%#>text-trigger>If you lose such a battle,<# your deity becomes irate: You take #>text-negmod>−1<# #>text-keyword>ongoing<# to all actions related to your deity until you have atoned for your failure."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Instinct",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/instinct.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "Whenever you #>item-button text-doclink&data-item-name='Observe a Situation'&data-action='open'>Observe a Situation<# and act on the GM's answers, take #>text-posmod>+2<# instead of #>text-posmod>+1<#.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Observe a Situation,target:system.results.completeSuccess.result,effect:AppendText,text:%insert.break%Take #>text-posmod>+2<# instead of #>text-posmod>+1<# for acting on the GM's answers. #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Instinct'&data-action='open'>Instinct<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Observe a Situation,target:system.results.partialSuccess.result,effect:AppendText,text:%insert.break%Take #>text-posmod>+2<# instead of #>text-posmod>+1<# for acting on the GM's answers. #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Instinct'&data-action='open'>Instinct<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Observe a Situation,target:system.results.completeSuccess.effects,effect:ModifyEffect,effectFilter:Act On Observations,effectProperty:value,effectValue:2,fromText:#>item-button text-doclink&data-item-name='Instinct'&data-action='open'>Instinct<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Observe a Situation,target:system.results.partialSuccess.effects,effect:ModifyEffect,effectFilter:Act On Observations,effectProperty:value,effectValue:2,fromText:#>item-button text-doclink&data-item-name='Instinct'&data-action='open'>Instinct<#",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Vigilant",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/vigilant.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "Are you hiding anything from me?",
              "How do you really feel about me?"
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "Whenever you #>item-button text-doclink&data-item-name='Read a Person'&data-action='open'>Read a Person<#, you may choose from these questions in addition to the usual ones: %list.questions%",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Read a Person,target:system.lists.questions.items,effect:PushElement,value:Are you hiding anything from me? #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Vigilant'&data-action='open'>Vigilant<##>text-sourceref>)<#",
              priority: undefined
            },
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Read a Person,target:system.lists.questions.items,effect:PushElement,value:How do you really feel about me? #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Vigilant'&data-action='open'>Vigilant<##>text-sourceref>)<#",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Scientist",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/scientist.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "What properties does this have? (take #>text-posmod>+1<# to any rolls against entities or objects of a similar type next time you encounter it).",
              "How do I make use of this? (take #>text-posmod>+1<# to any rolls associated with using the object).",
              "What is its purpose?"
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "Whenever you #>item-button text-doclink&data-item-name='Investigate'&data-action='open'>Investigate<# an object or entity using the proper equipment, you may choose from these following questions, in addition to those acquired through investigation: %list.questions%",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Crime Scene Investigator",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/crime-scene-investigator.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "What was the chain of events?",
              "What can I assume about the perpetrator?",
              "Which mistakes did the perpetrator make?",
              "When was the crime committed?",
              "When was someone here last?",
              "Does the crime remind me of something I am familiar with already and, if so, what?",
              "Who might know more about the crime?"
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Investigate Crime Scene",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/crime-scene-investigator.svg",
            "system": {
              "parentItem": {
                "name": "Crime Scene Investigator",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you investigate a crime scene,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "questions"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Ask two questions from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "partialSuccess": {
                  "result": "Ask one question from the list below.",
                  "listRefs": [
                    "questions"
                  ]
                },
                "failure": {
                  "result": "Ask one question from the list below, but your investigation leads you into danger or introduces additional problems later on.",
                  "listRefs": [
                    "questions"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Magnetic Attraction",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/magnetic-attraction.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "People forget what they're doing and can do nothing but stare at you.",
              "Draw someone to you.",
              "Get someone to do what you ask."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Attract Attention",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/magnetic-attraction.svg",
            "system": {
              "parentItem": {
                "name": "Magnetic Attraction",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you attract everyone's attention,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below. You may save up to two until later in the scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but someone present becomes obsessed, wanting to have you, keep you, and own you for themselves. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Dead Shot",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/dead-shot.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "#>text-center>You are a seasoned marksman.<# #>text-center>You deal #>text-mod>+1 Harm<# with firearms.<#",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyAttack",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:firearm,target:harm,effect:Add,value:1,fromText:#>item-button text-doclink&data-item-name='Dead Shot'&data-action='open'>Dead Shot<#",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Martial Arts Expert",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/martial-arts-expert.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>Block<# &mdash; Avoid a melee attack.",
              "#>text-edgename>Roundhouse Strike<# &mdash; #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# against several opponents surrounding you, counting as a single attack.",
              "#>text-edgename>Disarm<# &mdash; Remove an opponent's weapon.",
              "#>text-edgename>Throw<# &mdash; Reposition an opponent or drop them to the ground."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Use Martial Arts",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/martial-arts-expert.svg",
            "system": {
              "parentItem": {
                "name": "Martial Arts Expert",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you're fighting in close quarters,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": ["edges"]
              },
              "results": {
                "completeSuccess": {
                  "result": "#>text-keyword>Gain 2 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 2
                },
                "partialSuccess": {
                  "result": "#>text-keyword>Gain 1 Edge<#.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 1
                },
                "failure": {
                  "result": "#>text-keyword>Gain 1 Edge<#, but you underestimate your opponents, who may be more numerous or skilled than you first assumed. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 1
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.violence,
            }
          },
          {
            "name": "Block",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/martial-arts-expert.svg",
            "system": {
              "chatName": "Block",
              "parentItem": {
                "name": "Martial Arts Expert",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to avoid a melee attack."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Roundhouse Strike",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/martial-arts-expert.svg",
            "system": {
              "chatName": "Roundhouse Strike",
              "parentItem": {
                "name": "Martial Arts Expert",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# against several opponents surrounding you, counting as a single attack."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Disarm",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/martial-arts-expert.svg",
            "system": {
              "chatName": "Disarm",
              "parentItem": {
                "name": "Martial Arts Expert",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to remove an opponent's weapon."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Throw",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/martial-arts-expert.svg",
            "system": {
              "chatName": "Throw",
              "parentItem": {
                "name": "Martial Arts Expert",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to reposition an opponent or drop them to the ground."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "edges"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Charismatic Aura",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/charismatic-aura.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Catch a stranger's attention. They become curious and approach you.",
              "Change a person's disposition towards you from either aggressive to suspicious, suspicious to neutral, or neutral to positive.",
              "Make opponents perceive you as harmless and ignore you for as long as you remain in the background and do not act against them."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Radiate Charisma",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/charismatic-aura.svg",
            "system": {
              "parentItem": {
                "name": "Charismatic Aura",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever your aura is truly noticeable,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose two separate options.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but you also attract unwanted attention. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "You radiate an aura that makes people trust you and seek your company.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Lightning Fast",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/lightning-fast.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>Dodge<# &mdash; Avoid an attack.",
              "#>text-edgename>Blinding Speed<# &mdash; #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# with every opponent within reach of your weapon as a single attack. If you're attacking with a firearm, this uses up all its ammo.",
              "#>text-edgename>Uncanny Precision<# &mdash; Hit your opponent's weak spot. Deal #>text-mod>+1 Harm<#."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Move Fast",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/lightning-fast.svg",
            "system": {
              "parentItem": {
                "name": "Lightning Fast",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you move unexpectedly fast in combat,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": ["edges"]
              },
              "results": {
                "completeSuccess": {
                  "result": "#>text-keyword>Gain 3 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 3
                },
                "partialSuccess": {
                  "result": "#>text-keyword>Gain 2 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 2
                },
                "failure": {
                  "result": "#>text-keyword>Gain 1 Edge<#, but you also end up in a bad spot or face unexpected resistance. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 1
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.violence,
            }
          },
          {
            "name": "Dodge",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/lightning-fast.svg",
            "system": {
              "chatName": "Dodge",
              "parentItem": {
                "name": "Lightning Fast",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to avoid an attack."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Blinding Speed",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/lightning-fast.svg",
            "system": {
              "chatName": "Blinding Speed",
              "parentItem": {
                "name": "Lightning Fast",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# with every opponent within reach of your weapon as a single attack. If you're attacking with a firearm, this uses up all its ammo."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Uncanny Precision",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/lightning-fast.svg",
            "system": {
              "chatName": "Uncanny Precision",
              "parentItem": {
                "name": "Lightning Fast",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to hit your opponent's weak spot. Deal #>text-mod>+1 Harm<#."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "edges"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Artistic Talent",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/artistic-talent.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "They want to see more of your art.",
              "They are affected by the emotion you wanted to convey (e.g., anger, sorrow, fear, joy, lust, etc).",
              "They look up to you (take #>text-mod>+1 ongoing<# with the audience during this scene).",
              "Their attention is fixed entirely on you throughout your performance."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Perform",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/artistic-talent.svg",
            "system": {
              "parentItem": {
                "name": "Artistic Talent",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you perform your chosen art form or show your works to an audience,",
                "outro": "%insert.rollPrompt% to influence your audience at any time during the scene.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose two options from the list below any time during the scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below any time during the scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but a complication/threat manifests. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Jaded",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/jaded.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "Whenever you #>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<# and the result is a #>text-resultlabel>(9—14)<#, you may suppress your emotions and postpone their effects until the next scene.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyMove",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Keep It Together,target:system.results.partialSuccess.result,effect:AppendText,text:%insert.break%You may suppress your emotions, postponing their effects until the next scene. #>text-sourceref>(from <##>item-button text-doclink&data-item-name='Jaded'&data-action='open'>Jaded<##>text-sourceref>)<#",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Elite Sport (Contact)",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/elite-sport-(contact).svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "You've competed professionally in a contact sport (e.g. ice hockey, football), through which you have learned to take a hit.%insert.break%You take #>text-mod>+1 ongoing<# to #>item-button text-doclink&data-item-name='Endure Injury'&data-action='open'>Endure Injury<# rolls against close-combat attacks.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Arcane Researcher",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/arcane-researcher.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Venture Beyond",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/arcane-researcher.svg",
            "system": {
              "chatName": "Ventures Beyond",
              "parentItem": {
                "name": "Arcane Researcher",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you venture into alternate planes of existence or meet entities from other dimensions,",
                "outro": "you may declare that you have read about this dimension or creature before. Ask the GM what you learned from your past studies."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Backstab",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/backstab.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Aim for the sensitive parts: Deal #>text-mod>+1 Harm<#.",
              "Knock out: The NPC is rendered unconcious. PCs roll to #>item-button text-doclink&data-item-name='Endure Injury'&data-action='open'>Endure Injury<# and become neutralized on a #>text-resultlabel>(—9)<#.",
              "Careful: You act soundlessly and, if your victim dies, you leave no clues or traces behind."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Backstab Someone",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/backstab.svg",
            "system": {
              "parentItem": {
                "name": "Backstab",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you attack someone who's unprepared for it,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose two options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "You expose your betrayal and your target gets to react to your attack as usual. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.coolness,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Access the Dark Net",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/access-the-dark-net.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "You discover a portal to another dimension, and a path you can trace back to it later.",
              "You make contact with someone—or something—who can help you, for the right price.",
              "You find something valuable or important, in addition to what you were looking for. The GM will tell you what it is."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Surf the Dark Net",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/access-the-dark-net.svg",
            "system": {
              "parentItem": {
                "name": "Access the Dark Net",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you search the Dark Net for forbidden information, rare items, or myths,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You discover what you're looking for, and may also choose one option: %list.options%"
                },
                "partialSuccess": {
                  "result": "You find what you're looking for, but you're also exposed to repulsive and frightening stimuli. You must #>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<# to see how it affects you."
                },
                "failure": {
                  "result": "You find what you're after, but also contact something very dangerous. It might attempt to latch onto you or follow you back into reality. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.perception,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Explosives Expert",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/explosives-expert.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Improvise Explosive",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/explosives-expert.svg",
            "system": {
              "parentItem": {
                "name": "Explosives Expert",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you're building an improvised bomb under time pressure,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You construct a functional bomb."
                },
                "partialSuccess": {
                  "result": "The bomb's blast potential is lower than usual (decrease #>text-keyword>Harm<# dealt by #>text-negmod>−1<#)."
                },
                "failure": {
                  "result": "The bomb is unpredictable. Maybe it doesn't detonate, detonates prematurely, or it is more powerful and volatile than expected. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
            }
          },
          {
            "name": "Disarm Explosive",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/explosives-expert.svg",
            "system": {
              "parentItem": {
                "name": "Explosives Expert",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "When you are disarming a bomb,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "The bomb is deactivated."
                },
                "partialSuccess": {
                  "result": "Complications arise. Maybe you can't completely turn it off, just delay the timer, weaken the explosive effect, or something else turns up and makes thing worse."
                },
                "failure": {
                  "result": "Fuck, that's not good! The bomb may go off in your hands, the timer starts counting down from 10, 9, 8, 7…, or even bigger problems occur. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.reason,
            }
          }
        ],
        "rules": {
          "intro": "You can build and disarm bombs. If you have enough time and resources, you can build any kind of bomb you like without a roll.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Perpetual Victim",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/perpetual-victim.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Make someone want to take care of you.",
              "Make an aggressive person want to not harm you.",
              "Make someone confide in you."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Appear Defenseless",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/perpetual-victim.svg",
            "system": {
              "parentItem": {
                "name": "Perpetual Victim",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you appear defenseless during a dangerous experience,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below. You may save up to two options for use later during the scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Someone tries to take advantage of you and your position. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Opportunist",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/opportunist.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Exploit Someone",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/opportunist.svg",
            "system": {
              "chatName": "Exploits Someone",
              "parentItem": {
                "name": "Opportunist",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you sacrifice someone else to further your own goals,",
                "outro": "gain #>text-posmod>+1<# #>text-keyword>Stability<#."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Grudge",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/grudge.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Bear a Grudge",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/grudge.svg",
            "system": {
              "chatName": "Will Remember That",
              "parentItem": {
                "name": "Grudge",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "When someone directly or indirectly ruins your plans,",
                "outro": "you take #>text-mod>+1 ongoing<# against them until you have taken revenge or received restitution of equal worth to what you lost."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Endure Trauma",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/endure-trauma.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "#>text-center>You are not as easily affected by trauma as others.<#%insert.break%Whenever you would lose #>text-keyword>Stability<#, lose one fewer level than normal.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Rage",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/rage.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>Brutal Assault<# &mdash; Add #>text-mod>+1 Harm<# to your attack.",
              "#>text-edgename>What Pain?<# &mdash; Take #>text-posmod>+2<# to #>item-button text-doclink&data-item-name='Endure Injury'&data-action='open'>Endure Injury<#.",
              "#>text-edgename>See Only Red<# &mdash; Shake off and ignore psychological or supernatural influence."
            ]
          }
        },
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Unleash Rage",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/rage.svg",
            "system": {
              "chatName": "Is Enraged",
              "parentItem": {
                "name": "Rage",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "When you choose to awaken your inner rage in combat,",
                "outro": "lose #>text-negmod>−1<# #>text-keyword>Stability<# and mark 1 Rage.%insert.break%Every time you get a wound and every time you defeat a foe, increase Rage (#>text-posmod>+1<#).%insert.break%Rage lasts until the end of the combat.%insert.break%During combat, you may spend 1 Rage to activate 1 Edge from the list below:",
                "listRefs": [
                  "edges"
                ]
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Brutal Assault",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/rage.svg",
            "system": {
              "chatName": "Brutal Assault",
              "parentItem": {
                "name": "Rage",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to add #>text-mod>+1 Harm<# to your attack."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "What Pain?",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/rage.svg",
            "system": {
              "chatName": "What Pain?",
              "parentItem": {
                "name": "Rage",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to take #>text-posmod>+2<# to #>item-button text-doclink&data-item-name='Endure Injury'&data-action='open'>Endure Injury<#."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "See Only Red",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/rage.svg",
            "system": {
              "chatName": "See Only Red",
              "parentItem": {
                "name": "Rage",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to shake off and ignore psychological or supernatural influence."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": ["edges"],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Enforcer",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/enforcer.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "They offer you something they think you'd rather have.",
              "Retreat from the scene.",
              "They are terrorized; you have #>text-mod>+1 ongoing<# on all rolls against them until they've proven they're not afraid of you.",
              "They attack you from a disadvantaged position. You take #>text-posmod>+2<# on your roll to #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# if you counterattack."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Threaten Someone",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/enforcer.svg",
            "system": {
              "parentItem": {
                "name": "Enforcer",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you credibly threaten someone directly or suggestively,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "They must decide to either do what you want or defy you with the knowledge that you can execute your threat."
                },
                "partialSuccess": {
                  "result": "You must give them a third option. Choose one: %list.options%"
                },
                "failure": {
                  "result": "Turns out you didn't have the advantage you thought you did. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.violence,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Voice of Insanity",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/voice-of-insanity.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Attract other people to join in the crowd.",
              "Have crowd members give you all their valuables.",
              "Unite the crowd to fight for you.",
              "Incite the crowd into an orgy of unbridled emotion: sexual lust, anger, sorrow, violence, generosity, or celebrating, depending on what concepts you are instilling into them.",
              "Have the crowd disperse and calmly return to their normal lives."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Manipulate a Crowd",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/voice-of-insanity.svg",
            "system": {
              "parentItem": {
                "name": "Voice of Insanity",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you manipulate a crowd,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below, useable any time during this scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two options from the list below, useable any time during this scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, useable any time during this scene. However, the crowd becomes uncontrollable and volatile, and cannot be dispersed. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Seducer",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/seducer.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Give you something you want.",
              "Reveal a secret.",
              "Fight to protect you. NPCs who fall in love with you cannot oppose you, as long as you haven't expended all your options. Against PCs, you may only choose the following options:",
              "Make them feel bad for opposing you (they must #>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<#)",
              "They feel happy in your presence, and gain #>text-posmod>+2<# #>text-keyword>Stability<#."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Seduce Someone",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/seducer.svg",
            "system": {
              "parentItem": {
                "name": "Seducer",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you have an intimate moment with someone,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below, useable any time in the story.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two options from the list below, useable any time in the story.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, useable any time in the story, but you also develop feelings for the person. Increase your #>text-keyword>Relation<# to them by #>text-posmod>+1<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "#>text-center>You can consciously make people fall in love with you.<#",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Notorious",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/notorious.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Leverage Reputation",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/notorious.svg",
            "system": {
              "parentItem": {
                "name": "Notorious",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you encounter someone who has likely heard about you,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "They know of your reputation; you can decide what they have heard. The GM will have them act accordingly. You take #>text-posmod>+2<# to your next roll to #>item-button text-doclink&data-item-name='Influence Other NPC'&data-action='open'>Influence<# them."
                },
                "partialSuccess": {
                  "result": "They know of your reputation; you can decide what they have heard."
                },
                "failure": {
                  "result": "They know of your reputation; the GM decides what they have heard."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.charisma,
            }
          }
        ],
        "rules": {
          "intro": "#>text-center>You are famous in your trade.<#",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Hunter",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/hunter.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Prepare Ambush - Deal your weapon's #>text-keyword>Harm<# when your enemy stumbles in.",
              "Camouflage - Take #>text-mod>+2 ongoing<# to #>item-button text-doclink&data-item-name='Act Under Pressure'&data-action='open'>Act Under Pressure<# for as long as you remain hiding.",
              "Move in Shadows - Take #>text-mod>+2 ongoing<# to #>item-button text-doclink&data-item-name='Avoid Harm'&data-action='open'>Avoid Harm<# from ranged weapons."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Hunt",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/hunter.svg",
            "system": {
              "parentItem": {
                "name": "Hunter",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you are hunting someone or something,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose three options from the list below. You may spend them anytime during this scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose two options from the list below. You may spend them anytime during this scene.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Choose one option from the list below, but you become the prey. #>text-gmtext>The GM makes a Move<#.",
                  "listRefs": [
                    "options"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.perception,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Contagious Insanity",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/contagious-insanity.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Afflict your victim with a temporary psychosis, in which they are haunted by their fears (NPCs only).",
              "Trigger a Disadvantage within another person (PCs only, roll for the Disadvantage).",
              "Affect an additional victim.",
              "Call for creatures of madness to haunt the infected."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Unleash Madness",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/contagious-insanity.svg",
            "system": {
              "parentItem": {
                "name": "Contagious Insanity",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you allow your madness to infect someone you're speaking with,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose two options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Your intended victim's own terrors and Dark Secrets manifest within you, instead. You must #>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.soul,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Intimidating",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/intimidating.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Frighten Someone",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/intimidating.svg",
            "system": {
              "parentItem": {
                "name": "Intimidating",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you're trying to frighten another person,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "They succumb to fear and give in to your demands."
                },
                "partialSuccess": {
                  "result": "They run away from you or give in to you, GM's choice."
                },
                "failure": {
                  "result": "They see you as their primary threat and act accordingly. #>text-gmtext>The GM makes a Move<# for them."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.violence,
            }
          }
        ],
        "rules": {
          "intro": "There is something about you that instinctively makes others fear you.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Ruthless",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/ruthless.svg",
      "system": {
        "lists": {
          "edges": {
            "name": "Edges",
            "items": [
              "#>text-edgename>Meat Shield<# &mdash; Force them to take all the #>text-keyword>Harm<# from one attack for you.",
              "#>text-edgename>Nothing But Bait<# &mdash; Expose someone to danger so you can flank an enemy (deal #>text-mod>+1 Harm<#).",
              "#>text-edgename>Leave Them Behind<# &mdash; Abandon them to the enemy while you slip away."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Sacrifice Another",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/ruthless.svg",
            "system": {
              "parentItem": {
                "name": "Ruthless",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you sacrifice another to save your own skin,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": ["edges"]
              },
              "results": {
                "completeSuccess": {
                  "result": "#>text-keyword>Gain 3 Edges<#. You may spend them any time during the scene.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 3
                },
                "partialSuccess": {
                  "result": "#>text-keyword>Gain 2 Edges<#.",
                  "listRefs": [
                    "edges"
                  ],
                  "edges": 2
                },
                "failure": {
                  "result": "Things turns out in a bad way for you instead. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.violence,
            }
          },
          {
            "name": "Meat Shield",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/ruthless.svg",
            "system": {
              "chatName": "Meat Shield",
              "parentItem": {
                "name": "Ruthless",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to force them to take all the #>text-keyword>Harm<# from one attack for you."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Nothing But Bait",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/ruthless.svg",
            "system": {
              "chatName": "Nothing But Bait",
              "parentItem": {
                "name": "Ruthless",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to expose someone to danger so you can flank an enemy (deal #>text-mod>+1 Harm<#)."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          },
          {
            "name": "Leave Them Behind",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/ruthless.svg",
            "system": {
              "chatName": "Leave Them Behind",
              "parentItem": {
                "name": "Ruthless",
                "type": K4ItemType.advantage
              },
              "isEdge": true,
              "rules": {
                "outro": "... to abandon them to the enemy while you slip away."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "edges"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    },
    {
      "name": "Improviser",
      "type": K4ItemType.advantage,
      "img": "systems/kult4th/assets/icons/advantage/improviser.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Lie - Come up with a convincing lie.",
              "Gear Up - Find something you can use as a makeshift melee weapon. The GM will tell you what it is.",
              "Hide - Stay out of a pursuer's sight.",
              "Prepare - Set a trap that gives you a #>text-posmod>+2<# surprise bonus the first time you #>item-button text-doclink&data-item-name='Engage in Combat'&data-action='open'>Engage in Combat<# after the trap is sprung."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Wing It",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/advantage/improviser.svg",
            "system": {
              "parentItem": {
                "name": "Improviser",
                "type": K4ItemType.advantage
              },
              "rules": {
                "trigger": "Whenever you attempt to get out of a dangerous situation by winging it,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "options"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "Choose two options from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "partialSuccess": {
                  "result": "Choose one option from the list below.",
                  "listRefs": [
                    "options"
                  ]
                },
                "failure": {
                  "result": "Your improvisation makes the situation worse. #>text-gmtext>The GM makes a Move<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.coolness,
            }
          }
        ],
        "rules": {
          "intro": "",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0,
      }
    }
  ],
  disadvantage: [
    {
      "name": "Competitor",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/competitor.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Oppose Competitor",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/competitor.svg",
            "system": {
              "parentItem": {
                "name": "Competitor",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "Whenever you neglect to protect your interests or are distracted elsewhere,",
                "outro": "%insert.rollPrompt% to see if your competitor managed to damage your business.",
                "holdText": "The GM can spend Hold to make Moves for your competitor. For example, your competitor may take control of some of your business dealings, learn one of your secrets, sabotages one of your assets, or harms or buys off someone you care for and trust."
              },
              "results": {
                "completeSuccess": {
                  "result": "You are safe from your competitor, for the moment."
                },
                "partialSuccess": {
                  "result": "You have been careless. Your competitor may strike against you. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "You hand your competitor a golden opportunity, and they move against your interests. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You have a competitor in the criminal underworld, whose business niche is similar to yours.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make Moves for your competitor. For example, your competitor may take control of some of your business dealings, learn one of your secrets, sabotages one of your assets, or harms or buys off someone you care for and trust."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Mental Compulsion",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/mental-compulsion.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "Cleaning",
              "Counting",
              "Triple-checking",
              "Showering",
              "Memorizing",
              "Pyromania",
              "Kleptomania",
              "Cursing",
              "Confessing your sins",
              "Eating",
              "Hypochondria"
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Resist Compulsion",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/mental-compulsion.svg",
            "system": {
              "parentItem": {
                "name": "Mental Compulsion",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In situations where you could be distracted by your compulsion,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You control your compulsions and can focus on other things."
                },
                "partialSuccess": {
                  "result": "You become distracted and take #>text-negmod>−1<# #>text-keyword>ongoing<# to all rolls until you have removed yourself from the situation or succumbed to your compulsion, taking any actions it demands of you."
                },
                "failure": {
                  "result": "You become completely obsessed with your compulsion. If you focus on anything else, reduce #>text-negmod>−2<# #>text-keyword>Stability<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You are fixated on a particular idea or action, to the point of it strongly impacting your life. Choose a compulsion when you take this Disadvantage:",
          "trigger": "",
          "outro": "",
          "listRefs": [
            "options"
          ],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Sexual Neurosis",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/sexual-neurosis.svg",
      "system": {
        "lists": {
          "gmoptions": {
            "name": "GM Options",
            "items": [
              "You hurt, or you are hurt by, your sexual partner (physically or psychologically).",
              "The boundaries between dimensions are weakened; an entity from beyond catches the scent of you or your lover.",
              "Your sexual partner becomes obsessed with you and starts stalking you."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Resist Libido",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/sexual-neurosis.svg",
            "system": {
              "parentItem": {
                "name": "Sexual Neurosis",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "Whenever you have the opportunity to have consensual sex or take advantage of someone vulnerable to your advances,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You can control your urges."
                },
                "partialSuccess": {
                  "result": "Choose between having sex with the person or reduce your #>text-negmod>−1<# #>text-keyword>Stability<#."
                },
                "failure": {
                  "result": "You cannot resist having sex with the person and the GM chooses one option from the list below: %list.gmoptions%"
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "Your sexuality is a destructive, controlling force in your life. You compulsively seek out superficial sexual encounters and are willing to perform degrading acts—or even commit crimes—to satisfy your fantasies.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Phobia",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/phobia.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Face Your Fear",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/phobia.svg",
            "system": {
              "chatName": "Faces Their Fear",
              "parentItem": {
                "name": "Phobia",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "Whenever you're confronted by the object of your phobia,",
                "outro": "you must #>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<#."
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "You harbor an overpowering fear of something. Choose the stimulus that frightens you when you take this Disadvantage.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Infirm",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/infirm.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Resist Infirmity",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/infirm.svg",
            "system": {
              "parentItem": {
                "name": "Infirm",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "Whenever you are subjected to major physical or psychological stress,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "Your condition is under control."
                },
                "partialSuccess": {
                  "result": "Your condition triggers, causing pain and daze (#>text-negmod>−1<# to all rolls until the scene ends)."
                },
                "failure": {
                  "result": "Your condition is aggravated with life threatening results (#>item-button text-doclink&data-item-name='Endure Injury'&data-action='open'>Endure Injury<# with #>text-keyword>2 Harm<#)."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You suffer from a dangerous physical disease or condition, such as heart disease, hypertension, morbid obesity, or serious gastric ulcer.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Drug Addict",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/drug-addict.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Resist Addiction",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/drug-addict.svg",
            "system": {
              "parentItem": {
                "name": "Drug Addict",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first game session and whenever you have been using, or have the opportunity to use,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to make a Move for your addiction. For example, you cannot resist using the drug, run out of drugs, become indebted to a dangerous person, put yourself in danger while under the influence of drugs, or ruin something important to you—like a relationship—while under the influence."
              },
              "results": {
                "completeSuccess": {
                  "result": "You are in control of the urge, for now."
                },
                "partialSuccess": {
                  "result": "#>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "#>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You are addicted to hard drugs; name at least one when you gain this Disadvantage.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make a Move for your addiction. For example, you cannot resist using the drug, run out of drugs, become indebted to a dangerous person, put yourself in danger while under the influence of drugs, or ruin something important to you—like a relationship—while under the influence."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Victim of Passion",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/victim-of-passion.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Resist Passion",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/victim-of-passion.svg",
            "system": {
              "parentItem": {
                "name": "Victim of Passion",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first game session and whenever you encounter the subject of your passions (or anything resembling it),",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to let your passion steer your actions. For example, you yearn uncontrollably for the subject of your passion—you must seek it out or reduce #>text-negmod>−2<# #>text-keyword>Stability<#, your desire drags the subject of your passion into your dreams (perhaps trapping them there), your passion becomes tainted with jealousy and anger—making you want to control and damage it (#>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<# to resist), your longing leaves you feeble vis-à-vis the objective of this passion (#>text-negmod>−1<# to all rolls while sharing the same scene), or your passion can attract creatures of lust wishing to feed off it or make pacts with you."
              },
              "results": {
                "completeSuccess": {
                  "result": "You keep your passion in check."
                },
                "partialSuccess": {
                  "result": "The passion awakens within you. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "You are completely in the passion's grip. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You have an overwhelming passion for someone or something, seeking to possess it at any cost. Define the object of your passions when you take this Disadvantage.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to let your passion steer your actions. For example, you yearn uncontrollably for the subject of your passion—you must seek it out or reduce #>text-negmod>−2<# #>text-keyword>Stability<#, your desire drags the subject of your passion into your dreams (perhaps trapping them there), your passion becomes tainted with jealousy and anger—making you want to control and damage it (#>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<# to resist), your longing leaves you feeble vis-à-vis the objective of this passion (#>text-negmod>−1<# to all rolls while sharing the same scene), or your passion can attract creatures of lust wishing to feed off it or make pacts with you."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Obsession",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/obsession.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Resist Obsession",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/obsession.svg",
            "system": {
              "parentItem": {
                "name": "Obsession",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "At the first game session and whenever you encounter something associated with your obsession,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to let your obsession creep into your daily life. You may be forced to choose between either engaging in your obsession or losing #>text-keyword>Stability<#. You may forget about important tasks and chores, miss meetings, or neglect your interpersonal relationships to solely focus on your obsession. Your obsession may even influence your dreams, giving you visions and revelations. In turn, the object of your obsession may also take note of you and try to stop your investigations."
              },
              "results": {
                "completeSuccess": {
                  "result": "You overcome your obsession for the moment."
                },
                "partialSuccess": {
                  "result": "Your obsession influences your behavior. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "Your obsession takes over completely. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You have discovered a conspiracy or supernatural phenomenon, and you can't stop yourself from getting to the bottom of it.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to let your obsession creep into your daily life. You may be forced to choose between either engaging in your obsession or losing #>text-keyword>Stability<#. You may forget about important tasks and chores, miss meetings, or neglect your interpersonal relationships to solely focus on your obsession. Your obsession may even influence your dreams, giving you visions and revelations. In turn, the object of your obsession may also take note of you and try to stop your investigations."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Broken",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/broken.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.passive,
        "subItems": [],
        "rules": {
          "intro": "Some experience in your past has broken your psyche so badly you've been unable to recuperate from it.%insert.break%Your #>text-keyword>Stability<# can never increase beyond Distressed (6).",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyProperty",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:actor,effect:Set,target:system.stability.max,value:6",
              priority: undefined
            },
            {
              key: "ModifyProperty",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:actor,effect:Downgrade,target:system.stability.value,value:6,permanent:true",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Nightmares",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/nightmares.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Sleep",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/nightmares.svg",
            "system": {
              "parentItem": {
                "name": "Nightmares",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "During any scene when you sleep,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You sleep in peace."
                },
                "partialSuccess": {
                  "result": "The nightmares torment you. #>text-gmtext>The GM may make a Move<# for your nightmares. For example, you are unable to sleep at all during the night (#>text-negmod>−1<# #>text-keyword>ongoing<# until you sleep), something follows you back into reality, the nightmares provide you insight into the Truth, or you are forced to process some trauma (#>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<#) when you wake up."
                },
                "failure": {
                  "result": "The nightmares take over completely. You are trapped in the dream until you find a way to wake up, and everything that happens there also directly affects your sleeping body."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You suffer from recurring nightmares, probably connected to your Dark Secrets.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Experiment Gone Wrong",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/experiment-gone-wrong.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Track Experiment",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/experiment-gone-wrong.svg",
            "system": {
              "parentItem": {
                "name": "Experiment Gone Wrong",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first session and whenever things seem in control,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to make Moves on the experiment's behalf. For example, the experiment gives you a lead on the Truth, sabotages or otherwise disrupts your research, demands something from you under threat of retribution, or kidnaps someone you care for—possibly returning them dead or transformed."
              },
              "results": {
                "completeSuccess": {
                  "result": "Your experiment leaves you alone."
                },
                "partialSuccess": {
                  "result": "Your experiment is close on your heels. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "Your experiment is in your vicinity and acts against you. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You have carried out a scientific experiment, which went horribly awry. The experiment gave rise to something unnatural, which escaped and disappeared without a trace. Recently, the 'results' of your experiment tracked you down, reappearing in your life, and forcing you to either escape or confront it.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make Moves on the experiment's behalf. For example, the experiment gives you a lead on the Truth, sabotages or otherwise disrupts your research, demands something from you under threat of retribution, or kidnaps someone you care for—possibly returning them dead or transformed."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Lost Identity",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/lost-identity.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Face Identity Crisis",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/lost-identity.svg",
            "system": {
              "parentItem": {
                "name": "Lost Identity",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first game session and whenever you encounter something from your repressed past,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to make Moves for your true identity. For example, you recognize unknown people or places, organizations or individuals from your past life get in touch with you, your old identity influences your thought patterns or actions, or you suffer traumatic flashbacks."
              },
              "results": {
                "completeSuccess": {
                  "result": "You repress your true identity, remaining in the present."
                },
                "partialSuccess": {
                  "result": "Your true identity is catching up to you. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "Your true identity resurfaces. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "Your true identity has been lost to a military or private-run secret agent program. You do not remember anything about your pre-employment life. Recently, memories of your true identity have started coming back to you.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make Moves for your true identity. For example, you recognize unknown people or places, organizations or individuals from your past life get in touch with you, your old identity influences your thought patterns or actions, or you suffer traumatic flashbacks."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Guilt",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/guilt.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Manage Guilt",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/guilt.svg",
            "system": {
              "parentItem": {
                "name": "Guilt",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first game session and whenever everything appears okay,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to make Moves for your guilt. For example, relatives of the people you've hurt seek you out, demons and other creatures are attracted by your guilt, the dead haunt you with nightmares or visions, or you fall victim to anxiety and self-doubt."
              },
              "results": {
                "completeSuccess": {
                  "result": "Your guilt isn't on your mind at the moment."
                },
                "partialSuccess": {
                  "result": "You are reminded of your guilt. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "Your guilt catches up to you. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You carry heavy guilt for your past sins, having harmed one or several people through your actions or inaction.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make Moves for your guilt. For example, relatives of the people you've hurt seek you out, demons and other creatures are attracted by your guilt, the dead haunt you with nightmares or visions, or you fall victim to anxiety and self-doubt."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Haunted",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/haunted.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Face the Entity",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/haunted.svg",
            "system": {
              "parentItem": {
                "name": "Haunted",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first session and whenever you are distracted or weakened,",
                "outro": "%insert.rollPrompt% to see if the entity gains power over you.",
                "holdText": "The GM can spend Hold to make a Move for the entity. For example, it requests a service from you and threatens retribution if you refuse, the entity possesses your body for the night, or the entity reveals a clue of what it is and what it wants from you."
              },
              "results": {
                "completeSuccess": {
                  "result": "The entity leaves you alone."
                },
                "partialSuccess": {
                  "result": "#>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "#>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You are haunted by supernatural forces. With the GM's assistance, determine the nature of what you believe is haunting you.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make a Move for the entity. For example, it requests a service from you and threatens retribution if you refuse, the entity possesses your body for the night, or the entity reveals a clue of what it is and what it wants from you."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Wanted",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/wanted.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Risk Attention",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/wanted.svg",
            "system": {
              "parentItem": {
                "name": "Wanted",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "Whenever you attract attention to yourself or forget to keep your head down,",
                "outro": "%insert.rollPrompt% to see if you've been discovered.",
                "holdText": "The GM can spend Hold to make a Move for the authorities. For example, your mugshot appears on the TV news and in newspapers, law enforcement officers attempt to trap and catch you, or the authorities detain and interrogate someone you care about, confiscate your possessions, or turn your friends/family against you."
              },
              "results": {
                "completeSuccess": {
                  "result": "You are safe, for now."
                },
                "partialSuccess": {
                  "result": "You have made a mistake. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "All eyes are on you. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You are wanted by the authorities—local, state, or federal—for crimes you have committed. Determine the nature of the allegations against you when you take this Disadvantage.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make a Move for the authorities. For example, your mugshot appears on the TV news and in newspapers, law enforcement officers attempt to trap and catch you, or the authorities detain and interrogate someone you care about, confiscate your possessions, or turn your friends/family against you."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Stalker",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/stalker.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Evade Stalkers",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/stalker.svg",
            "system": {
              "parentItem": {
                "name": "Stalker",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first game session and whenever you expose your current location,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to make a Move for your pursuers. For example, a trusted associate has been paid off by them, one of your loved ones or allies disappears, something you are trying to do is undermined by your enemies, or they try to actively hurt you."
              },
              "results": {
                "completeSuccess": {
                  "result": "You are safe for now."
                },
                "partialSuccess": {
                  "result": "Your enemies are on to you. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "Your enemies have caught up to you. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You are hunted by a faceless enemy. Anyone you meet could be one of their minions—or even the stalker themselves. No one can be trusted. You must constantly change your address and be vigilant at all times to avoid leaving any tracks they can follow.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make a Move for your pursuers. For example, a trusted associate has been paid off by them, one of your loved ones or allies disappears, something you are trying to do is undermined by your enemies, or they try to actively hurt you."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Oath of Revenge",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/oath-of-revenge.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Resist Vengeful Urges",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/oath-of-revenge.svg",
            "system": {
              "parentItem": {
                "name": "Oath of Revenge",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "Whenever the target of your vengeance (or someone/something associated with them) appears,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You remain in control of your vengeful nature and can act rationally."
                },
                "partialSuccess": {
                  "result": "You can't focus on anything, other than the target of your vengeance. Take #>text-negmod>−1<# #>text-keyword>ongoing<# until the target's involvement in the scene ends."
                },
                "failure": {
                  "result": "You become obsessed and can act only to further your revenge. Doing anything else requires you roll #>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<#. Your obsession cannot be assuaged while the target remains in the same scene with you."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You have sworn to avenge an unforgivable injustice. Decide who is the subject of your vengeance and what they have done to you. It could be a single individual, people who share a certain trait, or members of an organization.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Jealousy",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/jealousy.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Resist Jealousy",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/jealousy.svg",
            "system": {
              "parentItem": {
                "name": "Jealousy",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "Whenever you encounter the subject of your jealousy or their life's trappings (possessions, family, friends, etc),",
                "outro": "%insert.rollPrompt% to see if you can keep your cool."
              },
              "results": {
                "completeSuccess": {
                  "result": "You maintain control over your jealousy."
                },
                "partialSuccess": {
                  "result": "You're afflicted by jealousy and take #>text-negmod>−1<# #>text-keyword>ongoing<# for as long as you remain in the subject's vicinity, and you do not suppress your jealous desires."
                },
                "failure": {
                  "result": "Your jealousy takes hold of you. You must #>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<# to refrain from harming, destroying, or stealing from the subject of your jealousy."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "There is someone who has the life you want to have, and you would do anything to possess it.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Harassed",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/harassed.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Avoid Harassment",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/harassed.svg",
            "system": {
              "parentItem": {
                "name": "Harassed",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first game session and whenever you draw attention to yourself,",
                "outro": "%insert.rollPrompt% to see if you're harassed.",
                "holdText": "The GM can spend Hold to make Moves for the harassers. For example, someone destroys your property or possessions, you are bullied and attacked by people with a prejudice against you, the authorities forcefully take something from you (rights, property, assets), someone you care about is harmed for associating with you, or you are denied your basic rights due to your identity."
              },
              "results": {
                "completeSuccess": {
                  "result": "You've managed to keep clear of harassment."
                },
                "partialSuccess": {
                  "result": "#>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "#>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "For some reason, personal or otherwise, people tend to harass you; the authorities in particular.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make Moves for the harassers. For example, someone destroys your property or possessions, you are bullied and attacked by people with a prejudice against you, the authorities forcefully take something from you (rights, property, assets), someone you care about is harmed for associating with you, or you are denied your basic rights due to your identity."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Rival",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/rival.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Face Your Rival",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/rival.svg",
            "system": {
              "parentItem": {
                "name": "Rival",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first game session and whenever you make a mistake or let down your guard,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to make a Move on behalf of your rival. For example, the rival may get an important person on their side, sabotage one of your projects, extort you with evidence damaging to your reputation, or take desperate measures to get rid of you permanently."
              },
              "results": {
                "completeSuccess": {
                  "result": "All clear; your rival makes no moves against you."
                },
                "partialSuccess": {
                  "result": "You've given your rival an opportunity. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "You've handed your rival whatever they needed to completely undermine you. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You have an ambitious rival, who will do anything to be in your shoes. Choose who your rival is when you take this Disadvantage.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make a Move on behalf of your rival. For example, the rival may get an important person on their side, sabotage one of your projects, extort you with evidence damaging to your reputation, or take desperate measures to get rid of you permanently."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Rationalist",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/rationalist.svg",
      "system": {
        "lists": {
          "gmoptions": {
            "name": "GM Options",
            "items": [
              "Your presence nurtures the Illusion, making it more powerful and impenetrable.",
              "Your bewildered psyche starts creating mirror images of familiar places and people in the Illusion.",
              "You attract extradimensional entities.",
              "You consciously deny what you see, even to your own detriment."
            ]
          }
        },
        "subType": K4ItemSubType.activeStatic,
        "subItems": [
          {
            "name": "Face the Impossible",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/rationalist.svg",
            "system": {
              "chatName": "Faces the Impossible",
              "parentItem": {
                "name": "Rationalist",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "intro": "In addition to the standard effects,",
                "trigger": "Whenever you #>item-button text-doclink&data-item-name='See Through the Illusion'&data-action='open'>See Through the Illusion<# and whenever the Illusion shatters,",
                "outro": "the GM may choose one option from the list below:",
                "listRefs": [
                  "gmoptions"
                ]
              },
              "subType": K4ItemSubType.activeStatic,
            }
          }
        ],
        "rules": {
          "intro": "You refuse to believe in anything not confirmed as fact by modern science, even when it is right in front of you.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Fanatic",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/fanatic.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Resist Fanaticism",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/fanatic.svg",
            "system": {
              "parentItem": {
                "name": "Fanatic",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "Whenever someone questions your ideology,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You can keep your emotions in check."
                },
                "partialSuccess": {
                  "result": "You become angry, confused, or frustrated. You take #>text-negmod>−1<# to your next roll."
                },
                "failure": {
                  "result": "You are forced to choose between taking steps to changing the person or situation to adhere to your ideology, or reduce #>text-negmod>−2<# #>text-keyword>Stability<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You are a fervent adherent of an ideology, which you must define when you take this Disadvantage. You interpret the whole world in accordance with your ideology, which must not be questioned.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Liar",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/liar.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Weave Lies",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/liar.svg",
            "system": {
              "parentItem": {
                "name": "Liar",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "At the start of every session,",
                "outro": "%insert.rollPrompt% to see what trouble your lies have gotten you into this time.",
                "holdText": "The GM can spend Hold whenever a PC encounters someone they know to ask, \"What have you lied about to this person?\" or to invent a troublesome lie the PC has told in the past."
              },
              "results": {
                "completeSuccess": {
                  "result": "You have kept your lies tangle-free."
                },
                "partialSuccess": {
                  "result": "You've told one too many lies. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "Your web of lies has come completely unraveled. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You're a compulsive liar, who invents stories at every opportunity, especially when it's beneficial for you.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold whenever a PC encounters someone they know to ask, \"What have you lied about to this person?\" or to invent a troublesome lie the PC has told in the past."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Marked",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/marked.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Tempt the Darkness",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/marked.svg",
            "system": {
              "parentItem": {
                "name": "Marked",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "Whenever you consciously #>text-keyword>Harm<# someone,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to make Moves for the darkness living inside of you. For example, the darkness feeds on your life energy to sustain itself, forces you to commit murder in order to replenish its life energy, takes charge of your body and leaves you with only memory fragments of what transpired, forces you to harm someone in your vicinity, or temporarily transforms your body into something inhuman. You may have to #>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<# to resist the darkness' influence."
              },
              "results": {
                "completeSuccess": {
                  "result": "You are still in control."
                },
                "partialSuccess": {
                  "result": "You feed the darkness. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "The darkness gains power over you. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You are marked by the darkness. The mark can take the shape of a full-body tattoo, a demonic body part such as a vestigial arm, an extra eye or mouth, machine parts integrated with your flesh, or similar manifestations.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make Moves for the darkness living inside of you. For example, the darkness feeds on your life energy to sustain itself, forces you to commit murder in order to replenish its life energy, takes charge of your body and leaves you with only memory fragments of what transpired, forces you to harm someone in your vicinity, or temporarily transforms your body into something inhuman. You may have to #>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<# to resist the darkness' influence."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Cursed",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/cursed.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Resist Curse",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/cursed.svg",
            "system": {
              "parentItem": {
                "name": "Cursed",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first session and whenever you're confronted by the supernatural,",
                "outro": "%insert.rollPrompt% to see how strongly the curse influences you.",
                "holdText": "The GM can spend Hold to make a Move for the curse. For example, you or someone you care about have an accident, something of yours is taken from you, you experience terrifying visions, or you're forced to take certain actions with risk of dire consequences, if you refuse."
              },
              "results": {
                "completeSuccess": {
                  "result": "You temporarily avoid the curse's influence."
                },
                "partialSuccess": {
                  "result": "#>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "#>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You are cursed.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make a Move for the curse. For example, you or someone you care about have an accident, something of yours is taken from you, you experience terrifying visions, or you're forced to take certain actions with risk of dire consequences, if you refuse."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Nemesis",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/nemesis.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Face Nemesis",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/nemesis.svg",
            "system": {
              "parentItem": {
                "name": "Nemesis",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first game session and whenever you let your guard down,",
                "outro": "%insert.rollPrompt% to see if your nemesis moves against you.",
                "holdText": "The GM can spend Hold to make Moves on behalf of your nemesis. For example, your nemesis may strike when you're alone, use secrets they've uncovered to extort you, intimidate you, hire henchmen to capture you, or attack someone or something you hold dear."
              },
              "results": {
                "completeSuccess": {
                  "result": "You are safe from your nemesis for the moment."
                },
                "partialSuccess": {
                  "result": "You have been careless and your nemesis moves against you. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "You have compromised your position and your nemesis strikes against you in full force. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "Through some terrible act you have made an enemy, who does everything in their power to take revenge. Decide who your nemesis is and what you have done to earn their vengeance.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make Moves on behalf of your nemesis. For example, your nemesis may strike when you're alone, use secrets they've uncovered to extort you, intimidate you, hire henchmen to capture you, or attack someone or something you hold dear."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Condemned",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/condemned.svg",
      "system": {
        "lists": {
          "gmoptions": {
            "name": "GM Options",
            "items": [
              "You mark 1 Time.",
              "You're tortured by dreams or visions of your fate. Reduce #>text-negmod>−2<# #>text-keyword>Stability<#.",
              "You're haunted by the entity or event that sealed your fate.",
              "Someone in your vicinity is negatively affected by your fate.",
              "Something provides you with false hope of escaping your fate."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Check the Clock",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/condemned.svg",
            "system": {
              "parentItem": {
                "name": "Condemned",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "At the start of every game session,",
                "outro": "%insert.rollPrompt%.",
                "listRefs": [
                  "gmoptions"
                ]
              },
              "results": {
                "completeSuccess": {
                  "result": "You still have some time remaining."
                },
                "partialSuccess": {
                  "result": "Your fate approaches. The GM chooses one option from the list below.",
                  "listRefs": [
                    "gmoptions"
                  ]
                },
                "failure": {
                  "result": "Your end approaches. The GM chooses two options from the list below, and may choose the same option twice.",
                  "listRefs": [
                    "gmoptions"
                  ]
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "Your fate has already been sealed. Perhaps you're dying from a disease, been promised as the sacrificial offering to a forgotten god, or you've sold your soul to some entity, waiting to drag you off to hell when your time is up. When you finally run out of Time, you meet your ultimate fate.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [
            {
              key: "CreateTracker",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "name:Time,imgFolder:systems/kult4th/assets/icons/trackers/condemned/,key:flags.kult4th.tracker,value:0,min:0,max:10,fromText:#>item-button text-doclink&data-item-name='Condemned'&data-action='open'>Condemned<#",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Depression",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/depression.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Manage Depression",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/depression.svg",
            "system": {
              "parentItem": {
                "name": "Depression",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "Whenever facing personal setbacks,",
                "outro": "%insert.rollPrompt%."
              },
              "results": {
                "completeSuccess": {
                  "result": "You remain in control."
                },
                "partialSuccess": {
                  "result": "You experience temporary anxiety, decreased self-confidence, or lack of will. You take #>text-negmod>−1<# to your next roll."
                },
                "failure": {
                  "result": "You succumb to the sense of hopelessness or blame and punish yourself; reduce #>text-negmod>−2<# #>text-keyword>Stability<#. Your lethargy and self-destructive urges do not go away until you numb your depression with medicine, drugs, or alcohol."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You are constantly struggling with depression, which is only worsened by dejection and discouragement.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Schizophrenia",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/schizophrenia.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Manage Schizophrenia",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/schizophrenia.svg",
            "system": {
              "parentItem": {
                "name": "Schizophrenia",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first game session and whenever you go through difficult experiences,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to make a Move for your schizophrenia. For example, one of your hallucinations takes on physical form, you view your current surroundings as being hostile to you, you're afflicted by terrifying hallucinations, you're subjected to dark visions (true or false), or someone in your vicinity turns out to not actually be real."
              },
              "results": {
                "completeSuccess": {
                  "result": "You maintain control of your insanity."
                },
                "partialSuccess": {
                  "result": "#>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "Schizophrenia overtakes you. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You struggle with recurring psychotic episodes and terrifying hallucinations.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make a Move for your schizophrenia. For example, one of your hallucinations takes on physical form, you view your current surroundings as being hostile to you, you're afflicted by terrifying hallucinations, you're subjected to dark visions (true or false), or someone in your vicinity turns out to not actually be real."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Bad Reputation",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/bad-reputation.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Manage Reputation",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/bad-reputation.svg",
            "system": {
              "parentItem": {
                "name": "Bad Reputation",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first game session and whenever you attract the public's attention,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to make a Move representing how your bad reputation sticks to you. For example, people might react with fear and suspicion towards you, a lynch mob forms to bring you to justice, your property is vandalized, your allies turn against you, and you can lose your job, agreements, and relationships."
              },
              "results": {
                "completeSuccess": {
                  "result": "You blend in. Nobody is out to get you."
                },
                "partialSuccess": {
                  "result": "You have been recognized. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "Several people have recognized you. Anger and fear control their actions. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "For some reason, you have attracted the public's disapproval—even animosity. Perhaps you've been spotlighted in the tabloids as a pedophile or murderer, falsely or otherwise.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make a Move representing how your bad reputation sticks to you. For example, people might react with fear and suspicion towards you, a lynch mob forms to bring you to justice, your property is vandalized, your allies turn against you, and you can lose your job, agreements, and relationships."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Greedy",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/greedy.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Resist Greed",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/greedy.svg",
            "system": {
              "parentItem": {
                "name": "Greedy",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "When an opportunity to increase your wealth arises,",
                "outro": "%insert.rollPrompt% to see if you are in control of your desire."
              },
              "results": {
                "completeSuccess": {
                  "result": "You keep your greed in check."
                },
                "partialSuccess": {
                  "result": "The black void inside shrieks for more. As long as the opportunity exists and you do not take it, you suffer #>text-negmod>−1<# #>text-keyword>ongoing<# to any rolls you make."
                },
                "failure": {
                  "result": "You must take advantage of every opportunity to further your wealth, or reduce #>text-negmod>−2<# #>text-keyword>Stability<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You are driven by an unquenchable desire for money and wealth, and are prepared to sacrifice your health, family, and friends to fill the emptiness inside.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Involuntary Medium",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/involuntary-medium.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Resist Possession",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/involuntary-medium.svg",
            "system": {
              "parentItem": {
                "name": "Involuntary Medium",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "Whenever you encounter spiritual entities or haunted places,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to make Moves for the being possessing you. For example, the entity may give you a vision, make use of your body, communicate with or through you, try to harm someone else through you, follow you unseen, demand something from you, or drag you into another dimension."
              },
              "results": {
                "completeSuccess": {
                  "result": "You resist the possession."
                },
                "partialSuccess": {
                  "result": "The entity gains influence over you. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "The entity gains control over you. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You are an open vessel for any spirits or demonic entities who desire a medium to speak through or need a corporeal body to use for their purposes.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make Moves for the being possessing you. For example, the entity may give you a vision, make use of your body, communicate with or through you, try to harm someone else through you, follow you unseen, demand something from you, or drag you into another dimension."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Repressed Memories",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/repressed-memories.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Resist Memories",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/repressed-memories.svg",
            "system": {
              "parentItem": {
                "name": "Repressed Memories",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In situations associated with your repressed memories,",
                "outro": "%insert.rollPrompt% to determine if the memories resurface."
              },
              "results": {
                "completeSuccess": {
                  "result": "You continue to suppress the memories."
                },
                "partialSuccess": {
                  "result": "The memories partly resurface, taking the form of flashbacks and/or hallucinations. You must #>item-button text-doclink&data-item-name='Keep It Together'&data-action='open'>Keep It Together<#."
                },
                "failure": {
                  "result": "You are overwhelmed by your repressed memories, completely losing yourself to them. #>text-gmtext>The GM makes a hard Move<# and you take #>text-negmod>−2<# #>text-keyword>Stability<#."
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You have repressed a particularly unpleasant event from your past, but the memory of it sometimes rises to the surface. It could be a crime or some horrible thing you have done, been subjected to, or witnessed. The GM decides the nature of your repressed memory, usually based on your Dark Secrets.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "currentHold": 0
      }
    },
    {
      "name": "Owned",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/owned.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Evade Former Owner",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/owned.svg",
            "system": {
              "parentItem": {
                "name": "Owned",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "In the first game session and whenever you draw attention to yourself in public,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to make Moves for your former owner. For example, they appear unexpectedly to convince you to return, send henchmen after you, kidnap or harm someone you care about, directly threaten you, destroy something important to you, try to mutilate you so nobody else would want you, or kill you outright so nobody else can have you."
              },
              "results": {
                "completeSuccess": {
                  "result": "For the moment, you are safe."
                },
                "partialSuccess": {
                  "result": "Your former owner picks up your scent. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "Your owner finds you. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "You used to be a dangerous person's private property, willingly or not. Since your escape, your former owner has been looking for you. Decide who your former owner is when you take this Disadvantage.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to make Moves for your former owner. For example, they appear unexpectedly to convince you to return, send henchmen after you, kidnap or harm someone you care about, directly threaten you, destroy something important to you, try to mutilate you so nobody else would want you, or kill you outright so nobody else can have you."
        },
        "currentHold": 0
      }
    },
    {
      "name": "Object of Desire",
      "type": K4ItemType.disadvantage,
      "img": "systems/kult4th/assets/icons/disadvantage/object-of-desire.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "subItems": [
          {
            "name": "Avoid Desire",
            "type": K4ItemType.move,
            "img": "systems/kult4th/assets/icons/disadvantage/object-of-desire.svg",
            "system": {
              "parentItem": {
                "name": "Object of Desire",
                "type": K4ItemType.disadvantage
              },
              "rules": {
                "trigger": "At the first game session and whenever you meet one or more new people,",
                "outro": "%insert.rollPrompt%.",
                "holdText": "The GM can spend Hold to ignite a person's desires, influencing their behavior. For example, someone can be afflicted with an uncontrollable passion for you, attempt to force themselves on you, strongly proposition you, become intensely jealous of you, or harm themselves or someone else because of their desire of you."
              },
              "results": {
                "completeSuccess": {
                  "result": "The desire is not awakened at this moment."
                },
                "partialSuccess": {
                  "result": "Someone becomes desirous of you. #>text-gmtext>The GM takes 1 Hold<#.",
                  "hold": 1
                },
                "failure": {
                  "result": "A strong desire is awakened in one or several people. #>text-gmtext>The GM takes 3 Hold<#.",
                  "hold": 3
                }
              },
              "subType": K4ItemSubType.activeRolled,
              "attribute": K4Attribute.zero,
            }
          }
        ],
        "rules": {
          "intro": "There is just something special about you. You ignite deep unhealthy desires in others, which they are unable to keep in check.",
          "trigger": "",
          "outro": "",
          "listRefs": [],
          "effects": [],
          "holdText": "The GM can spend Hold to ignite a person's desires, influencing their behavior. For example, someone can be afflicted with an uncontrollable passion for you, attempt to force themselves on you, strongly proposition you, become intensely jealous of you, or harm themselves or someone else because of their desire of you."
        },
        "currentHold": 0
      }
    }
  ],
  darksecret: [
    {
      "name": "Returned from the Other Side",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/returned-from-the-other-side.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Discover the truth about the event.",
              "Expose what happened to you to the world.",
              "Elude your fate.",
              "Return to the scene.",
              "Find lost relatives or friends."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You experienced an event where the Illusion shattered completely, and you were the only one who returned.",
          "trigger": "",
          "outro": "Your apartment block may have slipped into another dimension, its existence wiped from history. An airplane may have disappeared and you were found twenty years later, without memories and having not aged a day. A company of soldiers in Afghanistan may have literally walked into hell and only you returned, covered in your comrades' blood. Deep down you feel you were not meant to have survived, and that something is coming for you to restore balance and order.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Responsible for Medical Experiments",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/responsible-for-medical-experiments.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Avoid taking responsibility for the experiments.",
              "Seek forgiveness from subjects and/or their relatives.",
              "Gather evidence to expose your former employer.",
              "Conclude interrupted or failed experiments.",
              "Continue researching your findings.",
              "Restore the test subjects to their former selves."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You were responsible for or assisted in shady medical experiments, which ended in horrifying results.",
          "trigger": "",
          "outro": "Regardless of whether the subjects were willing or not, the experiments destroyed their lives and they are now dead, missing, or transformed into something inhuman. In addition to your pangs of guilt, you may be pursued by your former test subjects, their relatives, the law, former colleagues, employers, or nameless forces trying to silence you.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Heir",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/heir.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Discover the truth about your inheritance.",
              "Protect your inheritance.",
              "Investigate what happened to its previous owner.",
              "Confront those who seek to acquire your inheritance."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You have been granted a unique inheritance from relatives or friends.",
          "trigger": "",
          "outro": "It could be a small object or something more substantial, such as a house. The inheritance has instilled an unnatural obsession within you. You know it hides secrets and perhaps unknown forces. Might it reveal what happened to its previous owner? Others want to possess your inheritance also, and you suspect they will stop at nothing to acquire it.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Pact with Dark Forces",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/pact-with-dark-forces.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Find a way to break the pact.",
              "Cheat death.",
              "Slay the being.",
              "Achieve further power or success.",
              "Take revenge on whoever tricked you into the pact."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You have sealed a pact with a powerful entity.",
          "trigger": "",
          "outro": "You may have made the pact willingly or been tricked into it. Regardless, you are now under the being's spell. You may have benefited greatly from this pact, but the cost could be your literal soul. Deep inside you understand you must find a way to trick the being into breaking the pact. The question is how?.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Victim of Medical Experiments",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/victim-of-medical-experiments.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Track down those responsible.",
              "Restore yourself to the state you were in before.",
              "Get revenge on the person(s) responsible.",
              "Find a way to accept the person you are now.",
              "Explore other dimensions.",
              "Expose the truth to the world."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You were subjected to medical experiments with unexpected outcomes, with or without your consent and knowledge.",
          "trigger": "",
          "outro": "The experiments have had enduring mental and/or physical side effects. They may have shown you windows into alternate dimensions—resulting in madness. The side effects still torment you, and ridding yourself of them requires you to find the responsible parties. It's also possible your parents were the test subjects and you inherited the experimental effects, as a result.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Rootless",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/rootless.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Find out what is pursuing you.",
              "Find a place where you can stop and breathe.",
              "Escape what is pursuing you.",
              "Find your parents.",
              "Figure out why this is happening."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "Your family always moved around.",
          "trigger": "",
          "outro": "Your parents never told you why, but the haunted look in their eyes and hushed conversations hinted that you were running away from something terrifying. They would rouse you in the middle of night, leaving behind everything you owned, simply to escape. Eventually, they even abandoned you. Maybe they're still on the run, or maybe whatever they feared finally caught up with them. The feeling of being followed never truly lets go, and wherever you end up it's not long before you're on the road again. You don't know exactly what would happen if you stopped, but you feel it's something terrible.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Occult Experience",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/occult-experience.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Uncover more of the Truth.",
              "Seek atonement for your actions.",
              "Help others realize the Truth.",
              "Seek out more occult knowledge and power.",
              "Fight the demons."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You have witnessed occult proceedings, which changed your view of reality.",
          "trigger": "",
          "outro": "You may have participated in arcane rituals, exposed cults serving disturbing entities, or seen things revealing that the world is not what it seems. Your experiences make it difficult for you to accept the Illusion that most others live in.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Curse",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/curse.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Find out what the curse is.",
              "Discover how to break the curse.",
              "Transfer the curse to someone else.",
              "Find some way to accept your fate.",
              "Take revenge on the person responsible for the curse."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You are afflicted by a curse, knowingly or not.",
          "trigger": "",
          "outro": "The curse has started influencing your life and you must find a way to get rid of it.%insert.break%The curse may have been inherited or brought upon yourself through your own actions. Its effects are starting to make you lose your grasp on reality and threaten to harm those closest to you.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Mental Illness",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/mental-illness.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Explore the Illusion.",
              "Expose the conspiracy.",
              "Take revenge on your doctors and other caregivers.",
              "Find out the truth about your relative.",
              "Find your missing mentally ill relative."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You or one of your close relations suffer from mental illness.",
          "trigger": "",
          "outro": "There's a good chance you have seen with your own eyes (or heard from your relative) that reality is simply an illusion. But who would believe a crazy person? Psychiatric institutions hold many secrets and many doctors have hidden motives. For the insane who end up on the streets, disturbed mentors gladly take newcomers under their wing to initiate them in the Truth.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Strange Disappearance",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/strange-disappearance.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Figure out whatever became of the missing person.",
              "Finish the investigation they started.",
              "Escape your pursuers.",
              "Bring the guilty to justice.",
              "Reveal the truth to the public."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "Someone close to you disappeared after getting too close to the truth while investigating something.",
          "trigger": "",
          "outro": "You have no idea what happened, but someone recently sent you cryptic information, urging you to finish what your colleague started. Since your associate disappeared, you've become the victim of unknown stalkers.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Visitations",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/visitations.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Figure out why you are haunted in this way.",
              "Help spirits find peace after death.",
              "Fight evil beings.",
              "Help people communicate with the dead.",
              "Escape the entity pursuing you."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You have a history of encounters with beings from the other side.",
          "trigger": "",
          "outro": "They could be family members or friends tracking you down post-mortem, entities discovered at haunted locations, or inhuman forces taking an interest in you. Regardless of what you do, you can't seem to escape them. Every time you think it's finally over, they reappear in your life—you are never truly free.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Guilty of Crime",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/guilty-of-crime.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Avoid justice.",
              "Confront the victim or their relatives.",
              "Punish yourself.",
              "Help other people.",
              "Bring the other perpetrators to justice—be it of the legal or personal variety.",
              "Take revenge on those who made you commit the crime."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You feel constant remorse for a crime you have committed.",
          "trigger": "",
          "outro": "Regardless if you committed the crime on your own initiative or because you were coerced by others, you feel you are solely to blame. The victim, their relatives, and/or the police are probably looking for you.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Victim of Crime",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/victim-of-crime.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Get revenge on the perpetrator.",
              "Re-experience the crime again (as victim or as perpetrator).",
              "Find out why it happened to you.",
              "Stop similar crimes.",
              "Confront and forgive the perpetrator."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You have endured a terrible crime.",
          "trigger": "",
          "outro": "Your whole life is marred by this event and you cannot mentally suppress the violation, no matter how hard you try. Fear, shame, anger, and a sense of helplessness torment you, and in order to survive this trauma, you must find a way to heal your wounds.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Forbidden Knowledge",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/forbidden-knowledge.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Reveal the Truth to the world.",
              "Acquire power or knowledge.",
              "Explore the forbidden truth.",
              "Fight the enemy.",
              "Escape your pursuers."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You have uncovered some horrid truth, which brings reality's very nature into question.",
          "trigger": "",
          "outro": "%insert.break%It might be unlocking some way to move between dimensions, exposing the mayor's true demonic visage, finding proof that history has been rewritten, or discovering that the world as we know it is actually an illusion.%insert.break%The Illusion's keepers are now after you and it is only a matter of time before they find you.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Family Secret",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/family-secret.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Keep the secret.",
              "Avoid your family.",
              "Confront your family.",
              "Help your family.",
              "Find out the entire truth."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "Your family has a well-kept secret, which has haunted you for your entire life.",
          "trigger": "",
          "outro": "They may have been members of an obscure sect or exposed to some dreadful horror.%insert.break%You may have been initiated into this secret as a child, or only recently found out the truth as an adult.%insert.break%This secret keeps you on edge and threatens to destroy your life. You likely have to take action to save yourself and your family.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Guardian",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/guardian.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Keep what you are guarding safe.",
              "Find out more about the previous guardians and what you are protecting.",
              "Pass the guardianship over to a worthy individual.",
              "Fulfill your purpose."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You have been chosen to protect an important object, place, or person.",
          "trigger": "",
          "outro": "%insert.break%This sacred duty could have been inherited, assigned to you specifically, or granted to you at your own request.%insert.break%What you are protecting may be intended for accomplishing some great task in the future, or you may be safeguarding it to ensure it doesn't fall into the wrong hands.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    },
    {
      "name": "Chosen One",
      "type": K4ItemType.darksecret,
      "img": "systems/kult4th/assets/icons/darksecret/chosen-one.svg",
      "system": {
        "lists": {
          "drives": {
            "name": "Suggested Drives",
            "items": [
              "Avoid your pursuers.",
              "Fight the cult and/or their god.",
              "Fulfill your god's desire.",
              "Expand the cult's membership.",
              "Find out the truth about your destiny."
            ]
          }
        },
        "subType": K4ItemSubType.passive,
        "rules": {
          "intro": "You have been chosen by a god to become its advocate or sacrificial lamb.",
          "trigger": "",
          "outro": "The god's disciples watch over you, waiting for the day of your ascension.%insert.break%You may have grown up in their cult, or were discovered by them well into your adulthood. Whichever the case, you're sure the cult has terrible plans for you. You've tried escaping from these disciples, but they always end up finding you again.",
          "listRefs": [
            "drives"
          ],
          "effects": [],
          "holdText": ""
        },
        "drive": "",
        "currentHold": 0,
        "playerNotes": "",
        "gmNotes": ""
      }
    }
  ],
  weapon: [],
  gear: [],
  move: [
    {
      "name": "Help Other",
      "type": K4ItemType.move,
      "img": "systems/kult4th/assets/icons/move/help-other.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "rules": {
          "intro": "",
          "trigger": "When you help another player character's Move,",
          "outro": "explain how before their roll and #>text-keyword>roll +Attribute<#, where the #>item-button text-doclink&data-item-name='Attribute'&data-action='open'>Attribute<# is the same as the other player is rolling.",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "results": {
          "completeSuccess": {
            "result": "You may modify the subsequent roll by #>text-posmod>+2<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "partialSuccess": {
            "result": "You may modify the subsequent roll by #>text-posmod>+1<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "failure": {
            "result": "Your interference has unintended consequences. #>text-gmtext>The GM makes a Move<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          }
        },
        "attribute": K4Attribute.ask
      }
    },
    {
      "name": "Keep It Together",
      "type": K4ItemType.move,
      "img": "systems/kult4th/assets/icons/move/keep-it-together.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "You become angry (#>text-negmod>−1<# #>text-keyword>Stability<#).",
              "You become sad (#>text-negmod>−1<# #>text-keyword>Stability<#).",
              "You become scared (#>text-negmod>−1<# #>text-keyword>Stability<#).",
              "You become guilt-ridden (#>text-negmod>−1<# #>text-keyword>Stability<#).",
              "You become obsessed (#>text-posmod>+1<# #>text-keyword>Relation<# to whatever caused the condition).",
              "You become distracted (#>text-negmod>−2<# in situations where the condition limits you).",
              "You will be haunted by the experience at a later time."
            ]
          },
          "gmoptions": {
            "name": "GM Options",
            "items": [
              "You cower powerless in the threat's presence.",
              "You panic with no control of your actions.",
              "You suffer emotional trauma (#>text-negmod>−2<# #>text-keyword>Stability<#).",
              "You suffer life-changing trauma (#>text-negmod>−4<# #>text-keyword>Stability<#)."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "rules": {
          "intro": "",
          "trigger": "When you exercise self-control to keep from succumbing to stress, traumatic experiences, psychic influence, or supernatural forces,",
          "outro": "%insert.rollPrompt%.",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "results": {
          "completeSuccess": {
            "result": "You grit your teeth and stay the course.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "partialSuccess": {
            "result": "The effort to resist instills a condition, which remains with you until you have had time to recuperate. You get #>text-negmod>−1<# in situations where this condition would be a hindrance to you. Choose one: %list.options%",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "failure": {
            "result": "The strain is too much for your mind to handle. The GM chooses your reaction: %list.gmoptions%",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          }
        },
        "attribute": K4Attribute.willpower
      }
    },
    {
      "name": "Investigate",
      "type": K4ItemType.move,
      "img": "systems/kult4th/assets/icons/move/investigate.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "How can I find out more about what I'm investigating?",
              "What is my gut feel about what I'm investigating?",
              "Is there anything weird about what I'm investigating?"
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "rules": {
          "intro": "",
          "trigger": "When you investigate something,",
          "outro": "%insert.rollPrompt%.",
          "listRefs": [
            "questions"
          ],
          "effects": [],
          "holdText": ""
        },
        "results": {
          "completeSuccess": {
            "result": "You uncover all direct leads, and may additionally ask two questions from the list below.",
            "listRefs": [
              "questions"
            ],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "partialSuccess": {
            "result": "You uncover all direct leads, and may additionally ask one question from the list below. The information comes at a cost, determined by the GM, such as requiring someone or something for the answer, exposing yourself to danger, or needing to expend extra time or resources. Will you do what it takes?",
            "listRefs": [
              "questions"
            ],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "failure": {
            "result": "You may get some information anyway, but you pay a price for it. You may expose yourself to dangers or costs. #>text-gmtext>The GM makes a Move<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          }
        },
        "attribute": K4Attribute.reason
      }
    },
    {
      "name": "Engage in Combat",
      "type": K4ItemType.move,
      "img": "systems/kult4th/assets/icons/move/engage-in-combat.svg",
      "system": {
        "lists": {
          "gmoptions": {
            "name": "GM Options",
            "items": [
              "You're subjected to a counterattack.",
              "You do less damage than intended.",
              "You lose something important.",
              "You expend all your ammo.",
              "You're beset by a new threat.",
              "You'll be in trouble later on."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "rules": {
          "intro": "",
          "trigger": "When you engage an able opponent in combat,",
          "outro": "explain how and %insert.rollPrompt%.",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "results": {
          "completeSuccess": {
            "result": "You inflict damage to your opponent and avoid counterattacks.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "partialSuccess": {
            "result": "You inflict damage, but at a cost. The GM chooses one: %list.gmoptions%",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "failure": {
            "result": "Your attack doesn't go as anticipated. You might be subjected to bad luck, miss your target, or pay a high price for your assault. #>text-gmtext>The GM makes a Move<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          }
        },
        "attribute": K4Attribute.violence
      }
    },
    {
      "name": "Hinder Other",
      "type": K4ItemType.move,
      "img": "systems/kult4th/assets/icons/move/hinder-other.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "rules": {
          "intro": "",
          "trigger": "When you hinder another player character's Move,",
          "outro": "explain how before their roll and #>text-keyword>roll +Attribute<#, where the #>item-button text-doclink&data-item-name='Attribute'&data-action='open'>Attribute<# is the same as the other player is rolling.",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "results": {
          "completeSuccess": {
            "result": "You may modify the subsequent roll by #>text-negmod>−2<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "partialSuccess": {
            "result": "You may modify the subsequent roll by #>text-negmod>−1<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "failure": {
            "result": "Your interference has unintended consequences. #>text-gmtext>The GM makes a Move<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          }
        },
        "attribute": K4Attribute.ask
      }
    },
    {
      "name": "Influence Other NPC",
      "type": K4ItemType.move,
      "img": "systems/kult4th/assets/icons/move/influence-other-npc.svg",
      "system": {
        "lists": {
          "gmoptions": {
            "name": "GM Options",
            "items": [
              "She demands better compensation.",
              "Complications will arise at a future time.",
              "She gives in for the moment, but will change her mind and regret it later."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "rules": {
          "intro": "",
          "trigger": "When you influence an NPC through negotiation, argument, or from a position of power,",
          "outro": "%insert.rollPrompt%.",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "results": {
          "completeSuccess": {
            "result": "She does what you ask.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "partialSuccess": {
            "result": "She does what you ask, but the GM chooses one: %list.gmoptions%",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "failure": {
            "result": "Your attempt has unintended repercussions. #>text-gmtext>The GM makes a Move<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          }
        },
        "attribute": K4Attribute.charisma
      }
    },
    {
      "name": "Read a Person",
      "type": K4ItemType.move,
      "img": "systems/kult4th/assets/icons/move/read-a-person.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "Are you lying?",
              "How do you feel right now?",
              "What are you about to do?",
              "What do you wish I would do?",
              "How could I get you to […]?"
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "rules": {
          "intro": "",
          "trigger": "When you read a person,",
          "outro": "%insert.rollPrompt%.",
          "listRefs": [
            "questions"
          ],
          "effects": [],
          "holdText": ""
        },
        "results": {
          "completeSuccess": {
            "result": "Ask two questions from the list below any time you are in conversation with the subject of your scrutiny during this scene.",
            "listRefs": [
              "questions"
            ],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "partialSuccess": {
            "result": "Ask one question from the list below any time you are in conversation with the subject of your scrutiny during this scene.",
            "listRefs": [
              "questions"
            ],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "failure": {
            "result": "You accidentally reveal your own intentions to the person you're trying to read. Tell the GM/player what these intentions are. #>text-gmtext>The GM makes a Move<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          }
        },
        "attribute": K4Attribute.intuition
      }
    },
    {
      "name": "Influence Other PC",
      "type": K4ItemType.move,
      "img": "systems/kult4th/assets/icons/move/influence-other-pc.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Options",
            "items": [
              "She's motivated to do what you ask, and recieves #>text-posmod>+1<# for her next roll, if she does it.",
              "She's worried of the consequences if she doesn't do what you ask, and gets #>text-negmod>−1<# #>text-keyword>Stability<# if she doesn't do it."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "rules": {
          "intro": "",
          "trigger": "When you influence another PC,",
          "outro": "%insert.rollPrompt%.",
          "listRefs": [
            "options"
          ],
          "effects": [],
          "holdText": ""
        },
        "results": {
          "completeSuccess": {
            "result": "Gain the benefits of both options from the list below.",
            "listRefs": [
              "options"
            ],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "partialSuccess": {
            "result": "Choose one option from the list below.",
            "listRefs": [
              "options"
            ],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "failure": {
            "result": "The character gets #>text-posmod>+1<# on her next roll against you. #>text-gmtext>The GM makes a Move<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          }
        },
        "attribute": K4Attribute.charisma
      }
    },
    {
      "name": "Act Under Pressure",
      "type": K4ItemType.move,
      "img": "systems/kult4th/assets/icons/move/act-under-pressure.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "rules": {
          "intro": "",
          "trigger": "When you do something risky, under time pressure, or try to avoid danger,",
          "outro": "the GM will explain what the consequences for failure are and you %insert.rollPrompt%.",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "results": {
          "completeSuccess": {
            "result": "You do what you intended.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "partialSuccess": {
            "result": "You do it, but hesitate, are delayed, or must deal with a complication—the GM reveals an unexpected outcome, a high price, or a difficult choice.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "failure": {
            "result": "There are serious consequences, you make a mistake, or you're exposed to the danger. #>text-gmtext>The GM makes a Move<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          }
        },
        "attribute": K4Attribute.coolness
      }
    },
    {
      "name": "Observe a Situation",
      "type": K4ItemType.move,
      "img": "systems/kult4th/assets/icons/move/observe-a-situation.svg",
      "system": {
        "lists": {
          "questions": {
            "name": "Questions",
            "items": [
              "What is my best way through this?",
              "What currently poses the biggest threat?",
              "What can I use to my advantage?",
              "What should I be on the lookout for?",
              "What is being hidden from me?",
              "What seems strange about this?"
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "rules": {
          "intro": "",
          "trigger": "When you observe a situation,",
          "outro": "%insert.rollPrompt%.",
          "listRefs": [
            "questions"
          ],
          "effects": [],
          "holdText": ""
        },
        "results": {
          "completeSuccess": {
            "result": "Ask two questions from the list below. When you act on these answers, gain #>text-posmod>+1<# to your rolls.",
            "listRefs": [
              "questions"
            ],
            "effects": [
              {
                key: "ModifyRoll",
                mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                value: "filter:all,effect:Add,value:1,duration:ongoing,uses:1,defaultState:true,canToggle:true,icon:systems/kult4th/assets/icons/move/observe-a-situation.svg,resetOn:onUse,resetTo:false,label:Acting On Observations,fromText:an #>item-button text-doclink&data-item-name='Observe a Situation'&data-action='open'>Observe a Situation<# roll,tooltip:Applies to any rolls made while acting on the GM's answers.#>text-sourceref>(from an <##>item-button text-doclink&data-item-name='Observe a Situation'&data-action='open'>Observe a Situation<##>text-sourceref> roll)<#",
                priority: undefined
              }
            ],
            "edges": 0,
            "hold": 0
          },
          "partialSuccess": {
            "result": "Ask one question from the list below. When you act on the answer, gain #>text-posmod>+1<# to your rolls.",
            "listRefs": [
              "questions"
            ],
            "effects": [
              {
                key: "ModifyRoll",
                mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                value: "filter:all,effect:Add,value:1,duration:ongoing,uses:1,defaultState:true,canToggle:true,icon:systems/kult4th/assets/icons/move/observe-a-situation.svg,resetOn:onUse,resetTo:false,label:Acting On Observations,fromText:an #>item-button text-doclink&data-item-name='Observe a Situation'&data-action='open'>Observe a Situation<# roll,tooltip:Applies once to the next roll made to act on the GM's answers. #>text-sourceref>(from an <##>item-button text-doclink&data-item-name='Observe a Situation'&data-action='open'>Observe a Situation<##>text-sourceref> roll)<#",
                priority: undefined
              }
            ],
            "edges": 0,
            "hold": 0
          },
          "failure": {
            "result": "Ask one question from the list below, but you get no bonus for it and miss something, attract unwanted attention or expose yourself to danger. #>text-gmtext>The GM makes a Move<#.",
            "listRefs": [
              "questions"
            ],
            "effects": [],
            "edges": 0,
            "hold": 0
          }
        },
        "attribute": K4Attribute.perception
      }
    },
    {
      "name": "Endure Injury",
      "type": K4ItemType.move,
      "img": "systems/kult4th/assets/icons/move/endure-injury.svg",
      "system": {
        "lists": {
          "options": {
            "name": "Consequences",
            "items": [
              "...are knocked out (the GM may also choose to inflict a #>text-keyword>Serious Wound<#),",
              "...receive a #>text-keyword>Critical Wound<#, but may continue to act (if you already have a #>text-keyword>Critical Wound<#, you may not choose this option again), or",
              "...die."
            ]
          },
          "gmoptions": {
            "name": "GM Options",
            "items": [
              "The injury throws you off balance.",
              "You lose something.",
              "You receive a #>text-keyword>Serious Wound<#."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "rules": {
          "intro": "",
          "trigger": "When enduring an injury,",
          "outro": "%insert.rollPrompt% #>text-posmod>+Armor<# #>text-negmod>−Harm<#.",
          "listRefs": [],
          "effects": [
            {
              key: "ModifyRoll",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Endure Injury,effect:Add,value:actor.system.armor,inStatusBar:false",
              priority: undefined
            },
            {
              key: "ModifyRoll",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: "filter:Endure Injury,effect:Subtract,value:prompt,title:How much Harm?,input:numberButtons,inputVals:1|2|3|4|5,inStatusBar:false",
              priority: undefined
            }
          ],
          "holdText": ""
        },
        "results": {
          "completeSuccess": {
            "result": "You ride out the pain and keep going.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "partialSuccess": {
            "result": "You are still standing, but the GM picks one condition: %list.gmoptions%",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "failure": {
            "result": "The injury is overwhelming. You choose if you... %list.options%",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          }
        },
        "attribute": K4Attribute.fortitude
      }
    },
    {
      "name": "See Through the Illusion",
      "type": K4ItemType.move,
      "img": "systems/kult4th/assets/icons/move/see-through-the-illusion.svg",
      "system": {
        "lists": {
          "gmoptions": {
            "name": "GM Options",
            "items": [
              "Something senses you.",
              "The Illusions tears around you."
            ]
          }
        },
        "subType": K4ItemSubType.activeRolled,
        "rules": {
          "intro": "",
          "trigger": "When you suffer shock, injuries, or distort your perception through drugs or rituals,",
          "outro": "%insert.rollPrompt%.",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "results": {
          "completeSuccess": {
            "result": "You perceive things as they truly are.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "partialSuccess": {
            "result": "You see Reality, but you also affect the Illusion. The GM chooses one: %list.gmoptions%",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "failure": {
            "result": "The GM explains what you see. #>text-gmtext>The GM makes a Move<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          }
        },
        "attribute": K4Attribute.soul
      }
    },
    {
      "name": "Avoid Harm",
      "type": K4ItemType.move,
      "img": "systems/kult4th/assets/icons/move/avoid-harm.svg",
      "system": {
        "lists": {},
        "subType": K4ItemSubType.activeRolled,
        "rules": {
          "intro": "",
          "trigger": "When you dodge, parry, or block Harm,",
          "outro": "%insert.rollPrompt%.",
          "listRefs": [],
          "effects": [],
          "holdText": ""
        },
        "results": {
          "completeSuccess": {
            "result": "You emerge completely unharmed.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "partialSuccess": {
            "result": "You avoid the worst of it, but the GM decides if you end up in a bad spot, lose something, or partially sustain #>text-keyword>Harm<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          },
          "failure": {
            "result": "You were too slow to react or you made a bad judgment call. Perhaps you didn't avoid any #>text-keyword>Harm<# at all, or you ended up in an even worse spot than before. #>text-gmtext>The GM makes a Move<#.",
            "listRefs": [],
            "effects": [],
            "edges": 0,
            "hold": 0
          }
        },
        "attribute": K4Attribute.reflexes
      }
    }
  ],
  relation: []
};

export default ITEM_DATA;