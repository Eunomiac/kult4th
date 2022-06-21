import {K4Attribute} from "../../scripts/constants.js";
import {K4ItemType, K4ItemSubType} from "../../documents/K4Item.js";

/* REG EX REPLACEMENT PATTERNS AFTER IMPORTING FROM CONSOLE:
	 "\[K4(.*?):(.*?)\]"			-->			K4$1.$2
	 "\[\[K4(.*?):(.*?)\]\]" 	-->			[K4$1.$2]		*/

const ITEM_DATA: Partial<Record<
	K4ItemType,
	Partial<Record<
		K4ItemSubType,
		Record<
			string,
			Partial<K4ItemData>
		>
	>>
>> = {
	[K4ItemType.advantage]: {
		[K4ItemSubType.activeRolled]: {
			"Academic Network": {
				name: "Academic Network",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/academic-network.svg",
				data: {
					subItems: [
						{
							name: "Tap Academic Network",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/academic-network.svg",
							data: {
								sourceItem: {
									name: "Academic Network",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When it would be useful to know someone at a university,",
									outro: "provide the person's name, field of study, and how you got to know one another, then roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "The person is a friend (Relation +1)."
									},
									partialSuccess: {
										result: "The person is an acquaintance (Relation +0)."
									},
									failure: {
										result: "You know one another, but there is an old enmity between the two of you (Relation +0)."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have academic contacts at universities around the world."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Access the Dark Net": {
				name: "Access the Dark Net",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/access-the-dark-net.svg",
				data: {
					subItems: [
						{
							name: "Access the Dark Net",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/access-the-dark-net.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"You discover a portal to another dimension, and a path you can trace back to it later.",
											"You make contact with someone—or something—who can help you, for the right price.",
											"You find something valuable or important, in addition to what you were looking for. The GM will tell you what it is."
										]
									}
								},
								sourceItem: {
									name: "Access the Dark Net",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you search the Dark Net for forbidden information, rare items, or myths,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You discover what you're looking for, and may also choose one option: %list:options%",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "You find what you're looking for, but you're also exposed to repulsive and frightening stimuli. You must Keep It Together to see how it affects you."
									},
									failure: {
										result: "You find what you're after, but also contact something very dangerous. It might attempt to latch onto you or follow you back into reality. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.perception
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.perception
				}
			},
			"Ace Up the Sleeve": {
				name: "Ace Up the Sleeve",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/ace-up-the-sleeve.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"Reveal a Weapon &mdash; You have a small, concealed lethal weapon (stiletto or similar), which you can produce unnoticed.",
								"Spot a Weakness &mdash; You realize your opponent has a weakness you can exploit (take +2 to your next roll, if it involves exploiting the weakness). Ask the GM what it is.",
								"Find an Exit &mdash; You spot a way out. Ask the GM what it is. Take +2 to your next roll to make use of it."
							]
						}
					},
					subItems: [
						{
							name: "Pull an Ace",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/ace-up-the-sleeve.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"Reveal a Weapon &mdash; You have a small, concealed lethal weapon (stiletto or similar), which you can produce unnoticed.",
											"Spot a Weakness &mdash; You realize your opponent has a weakness you can exploit (take +2 to your next roll, if it involves exploiting the weakness). Ask the GM what it is.",
											"Find an Exit &mdash; You spot a way out. Ask the GM what it is. Take +2 to your next roll to make use of it."
										]
									}
								},
								sourceItem: {
									name: "Ace Up the Sleeve",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever someone's got you up against the wall or in a tight spot,",
									outro: "roll +%data.attribute%.",
									listRefs: [
										"edges"
									]
								},
								results: {
									completeSuccess: {
										result: "Gain 2 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 2
									},
									partialSuccess: {
										result: "Gain 1 Edge. You may spend it at any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 1
									},
									failure: {
										result: "Gain 1 Edge, but the situation is worse than you imagined. The GM makes a Move.",
										listRefs: [
											"edges"
										],
										edges: 1
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.coolness
							}
						}
					],
					isCustom: false,
					rules: {
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.coolness
				}
			},
			"Animal Speaker": {
				name: "Animal Speaker",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/animal-speaker.svg",
				data: {
					subItems: [
						{
							name: "Control Animal",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/animal-speaker.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Make the animal go against its instincts.",
											"Make the animal follow you.",
											"Make the animal protect you against an attacker."
										]
									}
								},
								sourceItem: {
									name: "Animal Speaker",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you attempt to control an animal,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose three options. You may save up to two for later.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose two options. You may save one for later.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, but the animal is affected by your memories and Disadvantages. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.intuition
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are able to understand and control animals."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.intuition
				}
			},
			"Artifact": {
				name: "Artifact",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/artifact.svg",
				data: {
					lists: {
						powers: {
							name: "Powers",
							items: [
								"See the true form of a creature or location.",
								"Receive a vision of what threatens you.",
								"Get yourself out of a bind.",
								"Call on the entity bound to the artifact and bargain with them."
							]
						}
					},
					subItems: [
						{
							name: "Activate Artifact",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/artifact.svg",
							data: {
								lists: {
									powers: {
										name: "Powers",
										items: [
											"See the true form of a creature or location.",
											"Receive a vision of what threatens you.",
											"Get yourself out of a bind.",
											"Call on the entity bound to the artifact and bargain with them."
										]
									}
								},
								sourceItem: {
									name: "Artifact",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you activate the object,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose one option (the GM determines what happens).",
										listRefs: [
											"powers"
										]
									},
									partialSuccess: {
										result: "Choose one option (the GM determines what happens). However, the artifact also exacts an additional price (the GM determines what is required).",
										listRefs: [
											"powers"
										]
									},
									failure: {
										result: "The artifact does something unexpected, possibly dangerous. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You own a seemingly mundane item, which actually possesses mystical powers. Its powers can be activated through certain methods, such as infusing it with blood or whispering forbidden words (you decide what is required). Work with the GM to devise a list of options appropriate to the artifact, using this list as an example:",
						listRefs: [
							"powers"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Artistic Talent": {
				name: "Artistic Talent",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/artistic-talent.svg",
				data: {
					subItems: [
						{
							name: "Perform",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/artistic-talent.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"They want to see more of your art.",
											"They are affected by the emotion you wanted to convey (e.g., anger, sorrow, fear, joy, lust, etc).",
											"They look up to you (take +1 ongoing with the audience during this scene).",
											"Their attention is fixed entirely on you throughout your performance."
										]
									}
								},
								sourceItem: {
									name: "Artistic Talent",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you perform your chosen art form or show your works to an audience,",
									outro: "roll +%data.attribute% to influence your audience at any time during the scene."
								},
								results: {
									completeSuccess: {
										result: "Choose two options any time during the scene.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option any time during the scene.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, but a complication/threat manifests. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Authority": {
				name: "Authority",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/authority.svg",
				data: {
					subItems: [
						{
							name: "Check: Authority",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/authority.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Influence someone who has heard of your authority in your academic field, as if you had rolled a (15+).",
											"Gain access to a university's resources, such as their facilities, researchers, or scientific archives.",
											"Make a statement about something or someone in mass media.",
											"Gain access to people or places under the pretense of engaging in your research or studies."
										]
									}
								},
								sourceItem: {
									name: "Authority",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "At the beginning of each game session,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "During this game session, choose three options.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "During this game session, choose two options.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "During this game session you may choose one option, but you also attract unwanted attention like stalkers, professional adversaries, competitors, or hostile forces. The GM makes a Move for them at some point during the session.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You're an academic authority in your field and a well-known name in newspapers, debate shows, and scientific journals."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Awe-Inspiring": {
				name: "Awe-Inspiring",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/awe-inspiring.svg",
				data: {
					subItems: [
						{
							name: "Take Charge",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/awe-inspiring.svg",
							data: {
								sourceItem: {
									name: "Awe-Inspiring",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you make a show of being the boss,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "People around you accept you as their leader and listen to you. Take +1 ongoing against people in this scene."
									},
									partialSuccess: {
										result: "People feel you're leadership material and show you respect. Choose one of them, in particular, who goes along with what you think. You have +1 ongoing against them during this scene."
									},
									failure: {
										result: "People feel like you're the leader, but one of them tries to challenge you for it. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Backstab": {
				name: "Backstab",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/backstab.svg",
				data: {
					subItems: [
						{
							name: "Backstab",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/backstab.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Aim for the sensitive parts: Deal +1 Harm.",
											"Knock out: The NPC is rendered unconcious. PCs roll to Endure Injury and become neutralized on a (—9).",
											"Careful: You act soundlessly and, if your victim dies, you leave no clues or traces behind."
										]
									}
								},
								sourceItem: {
									name: "Backstab",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you attack someone who's unprepared for it,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose two options.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "You expose your betrayal and your target gets to react to your attack as usual. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.coolness
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.coolness
				}
			},
			"Battlefield Medicine": {
				name: "Battlefield Medicine",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/battlefield-medicine.svg",
				data: {
					subItems: [
						{
							name: "Stabilize Injury",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/battlefield-medicine.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Improvisation: You stabilize one Wound without access to medical equipment.",
											"Effective: You stabilize two Wounds instead of one.",
											"Careful: The wound stabilizes and will heal much faster than normal."
										]
									},
									complications: {
										name: "Complications",
										items: [
											"You leave cosmetic scars or defects (the patient loses Stability (−2).",
											"There are lingering side effects (−1 to all rolls the wound could feasibly affect until it's fully healed).",
											"The patient remains knocked out until the GM determines that they awaken."
										]
									}
								},
								sourceItem: {
									name: "Battlefield Medicine",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you stabilize an injured person's wounds, even if you don't have access to medical equipment,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose two options.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "You may choose one option from the list below, but you must also choose one complication: %list:complications%",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "You stabilize the wound, even without access to medical equipment, but there are also unexpected and potentially dangerous consequences, such as infections, healing deformities, or other serious side effects. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Body Awareness": {
				name: "Body Awareness",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/body-awareness.svg",
				data: {
					subItems: [
						{
							name: "Perform Acrobatics",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/body-awareness.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Escape bindings or restraints.",
											"Get past an obstacle (creature or object).",
											"Get into or make it through a space you normally wouldn't be able to."
										]
									}
								},
								sourceItem: {
									name: "Body Awareness",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you perform acrobatic or agile feats,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option, but you expose yourself to danger or incur a cost.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, but something goes very wrong. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.perception
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "Your body and mind are as one."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.perception
				}
			},
			"Boss": {
				name: "Boss",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/boss.svg",
				data: {
					subItems: [
						{
							name: "Deploy Henchmen",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/boss.svg",
							data: {
								lists: {
									gmoptions: {
										name: "GM Options",
										items: [
											"Someone got into trouble.",
											"The job isn't done, and needs something else to be completed.",
											"There will be repercussions later on."
										]
									}
								},
								sourceItem: {
									name: "Boss",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you send your henchmen to do a risky job,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "They follow your orders and everything goes according to plan."
									},
									partialSuccess: {
										result: "They follow your orders, but GM picks one option:",
										listRefs: [
											"gmoptions"
										]
									},
									failure: {
										result: "The GM decides what went wrong, and whether it's immediately evident or will become apparent later on. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.coolness
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have five to ten criminal henchmen who are loyal to you, usually for as long as you continue paying them."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.coolness
				}
			},
			"Bound": {
				name: "Bound",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/bound.svg",
				data: {
					subItems: [
						{
							name: "Check: Bound",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/bound.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"See the true form of a creature or location.",
											"Disperse magic targeting you.",
											"Call on the entity."
										]
									}
								},
								sourceItem: {
									name: "Bound",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "At the start of each game session,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You may choose three options at any time during the session.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "You may choose one option at any time during the session.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "You may choose one option at any time during the session, but the GM makes a Move for the entity at some point during the session.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are bound to an extradimensional entity whose powers you can draw upon. Explain what you think it is when you take this Advantage."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Burglar": {
				name: "Burglar",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/burglar.svg",
				data: {
					subItems: [
						{
							name: "Burgle",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/burglar.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"You silently open a locked door within a few moments.",
											"You neutralize an alarm.",
											"You bust a lockbox or safe in less than two minutes.",
											"You avoid being discovered by someone.",
											"Trick someone into believing you belong here (e.g., pretend you're a security guard) for a limited time."
										]
									}
								},
								sourceItem: {
									name: "Burglar",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you make use of your expertise in breaking and entering,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Get three options. You may spend them any time during the scene.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Get two options. You may spend them any time during the scene.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Get one option, but a problem arises. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.coolness
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.coolness
				}
			},
			"Chameleon": {
				name: "Chameleon",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/chameleon.svg",
				data: {
					subItems: [
						{
							name: "Alter Appearance",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/chameleon.svg",
							data: {
								lists: {
									complications: {
										name: "Complications",
										items: [
											"You can't keep this deception up for very long. You must act fast, if you don't want to risk getting exposed.",
											"You leave traces and clues behind, which can be connected to you later on."
										]
									}
								},
								sourceItem: {
									name: "Chameleon",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you imitate another's appearance or conceal your own identity to trick someone,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Your disguise is convincing, as long as you keep the act going."
									},
									partialSuccess: {
										result: "You manage to trick everyone who doesn't examine you in detail, but choose one complication:",
										listRefs: [
											"complications"
										]
									},
									failure: {
										result: "Your disguise is only effective at a distance. If you attract any attention to yourself, you will be exposed."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.intuition
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.intuition
				}
			},
			"Character Actor": {
				name: "Character Actor",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/character-actor.svg",
				data: {
					subItems: [
						{
							name: "Blend In",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/character-actor.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Placate someone who is becoming suspicious.",
											"Get access to a place outsiders aren't allowed to go.",
											"Get someone to tell you about this place's secrets.",
											"Get someone's assistance with something here."
										]
									}
								},
								sourceItem: {
									name: "Character Actor",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you try to blend into a place or crowd by adapting your appearance and behavior to the others present,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose three options. You may save up to two for later.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose two options. You may save one for later.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, but things don't go according to plan. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.intuition
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.intuition
				}
			},
			"Charismatic Aura": {
				name: "Charismatic Aura",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/charismatic-aura.svg",
				data: {
					subItems: [
						{
							name: "Radiate Charisma",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/charismatic-aura.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Catch a stranger's attention. They become curious and approach you.",
											"Change a person's disposition towards you from either aggressive to suspicious, suspicious to neutral, or neutral to positive.",
											"Make opponents perceive you as harmless and ignore you for as long as you remain in the background and do not act against them."
										]
									}
								},
								sourceItem: {
									name: "Charismatic Aura",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever your aura is truly noticeable,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose two separate options.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, but you also attract unwanted attention. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You radiate an aura that makes people trust you and seek your company."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Collector": {
				name: "Collector",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/collector.svg",
				data: {
					subItems: [
						{
							name: "Seek Rare Item",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/collector.svg",
							data: {
								sourceItem: {
									name: "Collector",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you search for an unusual or rare item,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You know exactly where the item is, how to acquire it, and how to minimize hazards, obstacles, and/or costs."
									},
									partialSuccess: {
										result: "You know roughly where it is and what hazards, obstacles, and/or costs are associated with acquiring it."
									},
									failure: {
										result: "You know roughly where to start searching for it, but not the hazards or costs involved in pursuing it."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Contagious Insanity": {
				name: "Contagious Insanity",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/contagious-insanity.svg",
				data: {
					subItems: [
						{
							name: "Spread Madness",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/contagious-insanity.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Afflict your victim with a temporary psychosis, in which they are haunted by their fears (NPCs only).",
											"Trigger a Disadvantage within another person (PCs only, roll for the Disadvantage).",
											"Affect an additional victim.",
											"Call for creatures of madness to haunt the infected."
										]
									}
								},
								sourceItem: {
									name: "Contagious Insanity",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you allow your madness to infect someone you're speaking with,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose two options.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Your intended victim's own terrors and Dark Secrets manifest within you, instead. You must Keep It Together."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Crafty": {
				name: "Crafty",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/crafty.svg",
				data: {
					subItems: [
						{
							name: "Pull a Long Con",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/crafty.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"They become suspicious of someone else of your choosing.",
											"They view you as their ally, for as long as you don't betray them (+1 to all rolls against them).",
											"They willingly do a favor for you."
										]
									}
								},
								sourceItem: {
									name: "Crafty",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you manipulate an NPC in a longer conversation,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose two options. You may save one until later during this scene.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "They're on to you. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.intuition
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.intuition
				}
			},
			"Crime Scene Investigator": {
				name: "Crime Scene Investigator",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/crime-scene-investigator.svg",
				data: {
					subItems: [
						{
							name: "Investigate Crime Scene",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/crime-scene-investigator.svg",
							data: {
								lists: {
									questions: {
										name: "Questions",
										items: [
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
								sourceItem: {
									name: "Crime Scene Investigator",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you investigate a crime scene,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Ask two questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									partialSuccess: {
										result: "Ask one question from the list below.",
										listRefs: [
											"questions"
										]
									},
									failure: {
										result: "Ask one question from the list below, but your investigation leads you into danger or introduces additional problems later on.",
										listRefs: [
											"questions"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Cult Leader": {
				name: "Cult Leader",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/cult-leader.svg",
				data: {
					subItems: [
						{
							name: "Lead a Ritual",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/cult-leader.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"a vision of a creature's true form.",
											"a vision of a portal between dimensions.",
											"a vision of the cult's enemies.",
											"a vision of an object's purpose.",
											"a vision revealing your deity's wishes (take +1 to all rolls while fulfilling their wishes)."
										]
									}
								},
								sourceItem: {
									name: "Cult Leader",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you and your followers perform a ritual,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose to receive up to three visions from the list below.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose to receive up to two visions from the list below.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one vision, but the Illusion tears as a result. You may temporarily be transported into another dimension, attract a demonic being's attention, or receive a horrifying omen. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Dabbler in the Occult": {
				name: "Dabbler in the Occult",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/dabbler-in-the-occult.svg",
				data: {
					subItems: [
						{
							name: "Perform a Ritual",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/dabbler-in-the-occult.svg",
							data: {
								lists: {
									gmoptions: {
										name: "GM Options",
										items: [
											"You do not have working protection against the forces or entities the ritual summons.",
											"The effects of the ritual are slightly different than what you had imagined.",
											"The ritual summons unexpected entities or forces."
										]
									}
								},
								sourceItem: {
									name: "Dabbler in the Occult",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you attempt to perform a magical ritual from a set of instructions,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You perform every step correctly; the ritual works as intended."
									},
									partialSuccess: {
										result: "You make a minor error. The GM chooses one:",
										listRefs: [
											"gmoptions"
										]
									},
									failure: {
										result: "You misunderstand the scripture and perform the ritual with no control whatsoever over the resulting outcome. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You know a little of magical rituals, but have never gone beyond performing written instructions."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Daredevil": {
				name: "Daredevil",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/daredevil.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"On a Swivel &mdash; Discover a threat before it discovers you.",
								"Not Today &mdash; Avoid an attack.",
								"Sucker Punch &mdash; Get the jump on them: Harm your opponent before they can react."
							]
						}
					},
					subItems: [
						{
							name: "Live Dangerously",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/daredevil.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"On a Swivel &mdash; Discover a threat before it discovers you.",
											"Not Today &mdash; Avoid an attack.",
											"Sucker Punch &mdash; Get the jump on them: Harm your opponent before they can react."
										]
									}
								},
								sourceItem: {
									name: "Daredevil",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you're entering a dangerous situation,",
									outro: "roll +%data.attribute%.",
									listRefs: [
										"edges"
									]
								},
								results: {
									completeSuccess: {
										result: "Gain 3 Edges. You may spend them anytime during the scene.",
										listRefs: [
											"edges"
										],
										edges: 3
									},
									partialSuccess: {
										result: "Gain 2 Edges. You may spend them anytime during the scene.",
										listRefs: [
											"edges"
										],
										edges: 2
									},
									failure: {
										result: "Gain 1 Edge, but you are in over your head. The GM makes a Move.",
										listRefs: [
											"edges"
										],
										edges: 1
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.perception
							}
						}
					],
					isCustom: false,
					rules: {
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.perception
				}
			},
			"Data Retrieval": {
				name: "Data Retrieval",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/data-retrieval.svg",
				data: {
					subItems: [
						{
							name: "Perform Research",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/data-retrieval.svg",
							data: {
								lists: {
									questions: {
										name: "Questions",
										items: [
											"What is its origin?",
											"What is it meant for?",
											"How does it work?",
											"What do I have to watch out for?",
											"How can I stop or destroy this?"
										]
									}
								},
								sourceItem: {
									name: "Data Retrieval",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you look for information on a subject in a library, research archive, or on the Internet,",
									outro: "roll +%data.attribute%.%n%In response to the inquiries you make, the GM will tell you what you uncover, in as much detail as can be expected from the source you have utilized."
								},
								results: {
									completeSuccess: {
										result: "Ask three questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									partialSuccess: {
										result: "Ask two questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									failure: {
										result: "Ask one question from the list below, but you also discover something unexpected. The GM makes a Move.",
										listRefs: [
											"questions"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Deadly Stare": {
				name: "Deadly Stare",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/deadly-stare.svg",
				data: {
					subItems: [
						{
							name: "Death Stare",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/deadly-stare.svg",
							data: {
								sourceItem: {
									name: "Deadly Stare",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you find yourself in a charged situation,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You make eye contact with an NPC, causing them to freeze up and be unable to take any actions until you break eye contact. You also get +2 ongoing against your target."
									},
									partialSuccess: {
										result: "You make eye contact with an NPC, causing them to freeze up and be unable to take any actions until you break eye contact."
									},
									failure: {
										result: "Your opponents see you as their primary threat."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Death Drive": {
				name: "Death Drive",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/death-drive.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"Bring 'Em On &mdash; Engage an additional hostile in Combat.",
								"Savagery &mdash; Deal +2 Harm with one attack.",
								"Charge &mdash; Get within reach to attack a hostile.",
								"Go Crazy &mdash; Frighten your opponents by laughing into the face of death (+1 ongoing during the fight)."
							]
						}
					},
					subItems: [
						{
							name: "Fight Recklessly",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/death-drive.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"Bring 'Em On &mdash; Engage an additional hostile in Combat.",
											"Savagery &mdash; Deal +2 Harm with one attack.",
											"Charge &mdash; Get within reach to attack a hostile.",
											"Go Crazy &mdash; Frighten your opponents by laughing into the face of death (+1 ongoing during the fight)."
										]
									}
								},
								sourceItem: {
									name: "Death Drive",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you fight with no regard for your personal safety,",
									outro: "roll +%data.attribute%.",
									listRefs: [
										"edges"
									]
								},
								results: {
									completeSuccess: {
										result: "Gain 3 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 3
									},
									partialSuccess: {
										result: "Gain 2 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 2
									},
									failure: {
										result: "Gain 1 Edge, but afterwards you discover you have been injured without noticing it (Endure Injury; the GM determines the amount of Harm based on who attacked you and how).",
										listRefs: [
											"edges"
										],
										edges: 1
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence
							}
						}
					],
					isCustom: false,
					rules: {
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Divine": {
				name: "Divine",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/divine.svg",
				data: {
					subItems: [
						{
							name: "Sway Monster",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/divine.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Soothe an aggressive creature.",
											"Command the creature and force it to obey your order."
										]
									}
								},
								sourceItem: {
									name: "Divine",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you encounter a monstrous creature,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "The creature mistakes you for a god. choose three options, useable any time during this scene.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "You are fascinating to the creature. Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "You may choose one option, but after using it the creature becomes determined to possess you. It might try to devour you or perhaps capture you. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "There is something about you that reminds your former servants of what you truly are."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Dreamer": {
				name: "Dreamer",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/dreamer.svg",
				data: {
					subItems: [
						{
							name: "Navigate the Dream",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/dreamer.svg",
							data: {
								sourceItem: {
									name: "Dreamer",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you want to meet someone or find out the truth about something in the Dream,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You meet the intended person or arrive at the specific place in the Dream."
									},
									partialSuccess: {
										result: "You meet the intended person, or arrive at the specific place. However, some element has changed, or something followed you or the person in question."
									},
									failure: {
										result: "You are lost in the Dream and cannot wake up until you find your way back."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are a talented, self-taught dream wanderer."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Driver": {
				name: "Driver",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/driver.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"Defensive Driving &mdash; Make a risky maneuver to get out of the way.",
								"Evasive Driving &mdash; Shake off one pursuing vehicle.",
								"Deadly Driving &mdash; Use your vehicle as a weapon against a pedestrian (2-4 Harm depending on speed).",
								"Reckless Driving &mdash; Sideswipe another vehicle off the road."
							]
						}
					},
					subItems: [
						{
							name: "Drive Dangerously",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/driver.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"Defensive Driving &mdash; Make a risky maneuver to get out of the way.",
											"Evasive Driving &mdash; Shake off one pursuing vehicle.",
											"Deadly Driving &mdash; Use your vehicle as a weapon against a pedestrian (2-4 Harm depending on speed).",
											"Reckless Driving &mdash; Sideswipe another vehicle off the road."
										]
									}
								},
								sourceItem: {
									name: "Driver",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you drive your vehicle under pressure and in dangerous situations,",
									outro: "roll +%data.attribute%.",
									listRefs: [
										"edges"
									]
								},
								results: {
									completeSuccess: {
										result: "Gain 3 Edges. You may spend them anytime during the scene.",
										listRefs: [
											"edges"
										],
										edges: 3
									},
									partialSuccess: {
										result: "Gain 2 Edges. You may spend them anytime during the scene.",
										listRefs: [
											"edges"
										],
										edges: 2
									},
									failure: {
										result: "Gain 1 Edge to spend any time during the scene, but the situation worsens somehow—maybe you speed past a police car, additional vehicles start pursuing you, or you or your vehicle is damaged. The GM makes a Move.",
										listRefs: [
											"edges"
										],
										edges: 1
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.coolness
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are a trained professional at operating motor vehicles (car or motorcycle).",
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.coolness
				}
			},
			"Elite Education": {
				name: "Elite Education",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/elite-education.svg",
				data: {
					subItems: [
						{
							name: "Request a Favor",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/elite-education.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Gain a favor from a country's administration (e.g., released from jail, skip a customs check, or get help from the police).",
											"Gain access to a location unavailable to the public.",
											"Locate or track a hidden or missing person.",
											"Receive both the means to escape and a safe hiding spot."
										]
									}
								},
								sourceItem: {
									name: "Elite Education",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you ask your contacts for a favor,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose three options.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose two options.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, but you've become indebted to someone. The debt can be called in at any time during the story, at the GM's discretion.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have attended one of the world's most prestigious institutes of higher learning and have acquired contacts with power and influence."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Enforcer": {
				name: "Enforcer",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/enforcer.svg",
				data: {
					subItems: [
						{
							name: "Threaten Other",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/enforcer.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"They offer you something they think you'd rather have.",
											"Retreat from the scene.",
											"They are terrorized; you have +1 ongoing on all rolls against them until they've proven they're not afraid of you.",
											"They attack you from a disadvantaged position. You take +2 on your roll to Engage in Combat if you counterattack."
										]
									}
								},
								sourceItem: {
									name: "Enforcer",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you credibly threaten someone directly or suggestively,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "They must decide to either do what you want or defy you with the knowledge that you can execute your threat."
									},
									partialSuccess: {
										result: "You must give them a third option. Choose one:",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Turns out you didn't have the advantage you thought you did. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Enhanced Awareness": {
				name: "Enhanced Awareness",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/enhanced-awareness.svg",
				data: {
					subItems: [
						{
							name: "Focus on the Illusion",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/enhanced-awareness.svg",
							data: {
								sourceItem: {
									name: "Enhanced Awareness",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When you focus your senses at a location where the Illusion is weak,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You can discern clear details regarding the location, and may be able to speak to entities tied to it."
									},
									partialSuccess: {
										result: "You get some basic impressions regarding the location."
									},
									failure: {
										result: "The Illusion tears. The veil is lifted temporarily, revealing an alternate dimension—the GM determines which one. The PC could be sucked into it or something may cross over into our reality. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Erotic": {
				name: "Erotic",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/erotic.svg",
				data: {
					subItems: [
						{
							name: "Incite Desire",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/erotic.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"The person must have you, and will abandon their normally reasonable behavior to do so.",
											"The person is distracted by you for as long as you're in the vicinity, unable to concentrate on anything else.",
											"The person becomes jealous of anyone competing for your attention, and tries to dispose of them by any means necessary.",
											"You make them uncertain and confused. You take +1 ongoing against them during this scene."
										]
									}
								},
								sourceItem: {
									name: "Erotic",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you make moves to attract an NPC to you,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose three options any time during this scene.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose two options any time during this scene.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option any time during this scene, but the nature of the attraction is different than you had hoped. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Escape Artist": {
				name: "Escape Artist",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/escape-artist.svg",
				data: {
					subItems: [
						{
							name: "Escape",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/escape-artist.svg",
							data: {
								sourceItem: {
									name: "Escape Artist",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you need to escape a dangerous situation,",
									outro: "outline your plan and roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You escape without complications."
									},
									partialSuccess: {
										result: "You can choose to stay or escape at a cost, such as leaving something important behind or take something traceable with you. The GM decides what it is."
									},
									failure: {
										result: "You are only half out the door when you're caught in a really bad spot. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.coolness
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are a master at slipping away when the shit hits the fan."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.coolness
				}
			},
			"Exit Strategy": {
				name: "Exit Strategy",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/exit-strategy.svg",
				data: {
					subItems: [
						{
							name: "Make a Clean Exit",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/exit-strategy.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"You leave the scene of the murder unnoticed and reach a safe spot of your choosing in the vicinity. Describe how.",
											"You have left no clues that can be traced back to you.",
											"The body is well hidden and will not be found for quite some time."
										]
									}
								},
								sourceItem: {
									name: "Exit Strategy",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you have killed someone covertly and leave the scene of the murder,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You get all three options below.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose two of the options below.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, but you risk discovery or face unexpected obstacles. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.perception
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.perception
				}
			},
			"Exorcist": {
				name: "Exorcist",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/exorcist.svg",
				data: {
					subItems: [
						{
							name: "Perform Exorcism",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/exorcist.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Nobody is harmed during the ritual.",
											"The entity will not reappear later.",
											"The entity will not become hostile toward you."
										]
									}
								},
								sourceItem: {
									name: "Exorcist",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you perform an exorcism to banish a spirit or extradimensional creature,",
									outro: "explain what the ritual looks like and roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "The creature is banished. Choose two options.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "The creature is banished. Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "The creature resists banishment and something goes terribly wrong, such as the creature possessing you. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Explosives Expert": {
				name: "Explosives Expert",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/explosives-expert.svg",
				data: {
					subItems: [
						{
							name: "Improvise Explosive",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/explosives-expert.svg",
							data: {
								sourceItem: {
									name: "Explosives Expert",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you're building an improvised bomb under time pressure,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You construct a functional bomb."
									},
									partialSuccess: {
										result: "The bomb's blast potential is lower than usual (decrease Harm dealt by −1)."
									},
									failure: {
										result: "The bomb is unpredictable. Maybe it doesn't detonate, detonates prematurely, or it is more powerful and volatile than expected. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						},
						{
							name: "Disarm Explosive",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/explosives-expert.svg",
							data: {
								sourceItem: {
									name: "Explosives Expert",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When you are disarming a bomb,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "The bomb is deactivated."
									},
									partialSuccess: {
										result: "Complications arise. Maybe you can't completely turn it off, just delay the timer, weaken the explosive effect, or something else turns up and makes thing worse."
									},
									failure: {
										result: "Fuck, that's not good! The bomb may go off in your hands, the timer starts counting down from 10, 9, 8, 7…, or even bigger problems occur. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You can build and disarm bombs. If you have enough time and resources, you can build any kind of bomb you like without a roll."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Eye for Detail": {
				name: "Eye for Detail",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/eye-for-detail.svg",
				data: {
					subItems: [
						{
							name: "Study Other",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/eye-for-detail.svg",
							data: {
								lists: {
									questions: {
										name: "Questions",
										items: [
											"Where are you from?",
											"Are you capable of violence?",
											"How could I seduce or tempt you?",
											"Why are you here?",
											"What are you working on?"
										]
									}
								},
								sourceItem: {
									name: "Eye for Detail",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you have had time to study somebody for a while,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Ask three questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									partialSuccess: {
										result: "Ask two questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									failure: {
										result: "Ask one question from the list below, but you expose your inquisitiveness to the person you're observing. The GM makes a Move.",
										listRefs: [
											"questions"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.perception
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.perception
				}
			},
			"Fascination": {
				name: "Fascination",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/fascination.svg",
				data: {
					subItems: [
						{
							name: "Artful Seduction",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/fascination.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"They are attracted to you.",
											"They forget their woes when experiencing your art.",
											"They are totally captivated by your art and forget all about their surrounding environment."
										]
									},
									gmoptions: {
										name: "GM Options",
										items: [
											"They become obsessed with you.",
											"They want you right now."
										]
									}
								},
								sourceItem: {
									name: "Fascination",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you use your art to seduce an NPC,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option, but the GM also chooses one of the following: %list:gmoptions%",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "They are affected by you in a way you didn't anticipate, or the attraction is uncomfortably strong—you choose. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Fast Talk": {
				name: "Fast Talk",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/fast-talk.svg",
				data: {
					subItems: [
						{
							name: "Fast Talk",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/fast-talk.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Prevent the NPC from noticing something in her immediate vicinity.",
											"Get the NPC to disclose something important (the GM will provide the details).",
											"Distract the NPC. You take +1 to your next roll against them."
										]
									}
								},
								sourceItem: {
									name: "Fast Talk",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you talk to an NPC to get their attention,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose two options.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, but they grow suspicious of your motives. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.coolness
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.coolness
				}
			},
			"Field Agent": {
				name: "Field Agent",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/field-agent.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"Take Cover &mdash; Avoid a ranged attack by diving behind an object or a person.",
								"Choke Hold &mdash; Lock a human opponent in a grip they cannot get out of without taking 1 Harm.",
								"Disarm &mdash; Remove an opponent's weapon in close combat.",
								"Improvised Weapon &mdash; Make a lethal, close-combat attack with a seemingly-innocuous object. %list:inline-attacks%"
							]
						}
					},
					subItems: [
						{
							name: "Surprise Strike",
							type: K4ItemType.attack,
							img: "systems/kult4th/assets/icons/advantage/field-agent.svg",
							data: {
								lists: {
									gmoptions: {
										name: "GM Options",
										items: [
											"You're subjected to a counterattack.",
											"You do less damage than intended.",
											"You lose something important.",
											"You expend all your ammo.",
											"You're beset by a new threat.",
											"You'll be in trouble later on."
										]
									}
								},
								sourceItem: {
									name: "Field Agent",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When you engage an able opponent within arm's reach in close combat,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You inflict 3 Harm to your opponent(s) and avoid counterattacks."
									},
									partialSuccess: {
										result: "You inflict 3 Harm, but at a cost. The GM chooses one:",
										listRefs: [
											"gmoptions"
										]
									},
									failure: {
										result: "Your attack doesn't go as anticipated. You might be subjected to bad luck, miss your target, or pay a high price for your assault. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence,
								range: [
									"arm"
								],
								harm: 2
							}
						},
						{
							name: "Enter Combat",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/field-agent.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"Take Cover &mdash; Avoid a ranged attack by diving behind an object or a person.",
											"Choke Hold &mdash; Lock a human opponent in a grip they cannot get out of without taking 1 Harm.",
											"Disarm &mdash; Remove an opponent's weapon in close combat.",
											"Improvised Weapon &mdash; Make a lethal, close-combat attack with a seemingly-innocuous object: %parent-lists:attacks%"
										]
									}
								},
								sourceItem: {
									name: "Field Agent",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you enter combat,",
									outro: "roll +%data.attribute%.",
									listRefs: [
										"edges"
									]
								},
								results: {
									completeSuccess: {
										result: "Gain 3 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 3
									},
									partialSuccess: {
										result: "Gain 2 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 2
									},
									failure: {
										result: "Gain 1 Edge, but you have made a bad call. The GM makes a Move.",
										listRefs: [
											"edges"
										],
										edges: 1
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have been trained by an intelligence agency to fight in the field.",
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Forbidden Inspiration": {
				name: "Forbidden Inspiration",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/forbidden-inspiration.svg",
				data: {
					subItems: [
						{
							name: "Seek Inspiration",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/forbidden-inspiration.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Enticement: Entice an entity to come to you.",
											"Visions: See Through the Illusion into a specific place of your choice.",
											"Inspiration: Ask the GM if there is anything strange or supernatural about the situation you're in. The answer will be revealed through your art."
										]
									}
								},
								sourceItem: {
									name: "Forbidden Inspiration",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you dive deep into your art and allow yourself to be inspired by the Truth,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose two options.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "You have gazed too deeply into the abyss. Choose one option, but you also experience terrifying visions or encounter something horrible. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Forked Tongue": {
				name: "Forked Tongue",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/forked-tongue.svg",
				data: {
					subItems: [
						{
							name: "Manipulate Other",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/forked-tongue.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"They trust you (PC takes +1 Relation with you).",
											"They're spellbound by you (take +1 ongoing against them during this scene).",
											"They reveal a weakness, which you can exploit later."
										]
									},
									complications: {
										name: "Complications",
										items: [
											"They see you as a friend they can turn to when in need.",
											"They fall in love with you.",
											"They will feel betrayed, spurned, humiliated, or manipulated whenever you abuse their trust in you."
										]
									}
								},
								sourceItem: {
									name: "Forked Tongue",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you manipulate someone,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose one option:",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option from the list below, but there is also a complication, chosen by the GM or the targeted PC: %list:complications%",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "They see right through you and will act as they please."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Gang Leader": {
				name: "Gang Leader",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/gang-leader.svg",
				data: {
					subItems: [
						{
							name: "Give Orders",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/gang-leader.svg",
							data: {
								lists: {
									complications: {
										name: "Complications",
										items: [
											"One of them defies you in front of the others.",
											"They will all be disgruntled for some time."
										]
									}
								},
								sourceItem: {
									name: "Gang Leader",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you give your gang orders that are risky and/ or may result in them paying a high price,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "They enact your orders without question."
									},
									partialSuccess: {
										result: "They do as you want, but there is a complication (choose one):",
										listRefs: [
											"complications"
										]
									},
									failure: {
										result: "Problems arise. Maybe something goes wrong when carrying out your orders, or they doubt your abilities as a leader. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You're the boss of a small gang of criminals."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Genius": {
				name: "Genius",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/genius.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"Logical &mdash; You realize an effective way to dispose of the threat. Deal +1 Harm whenever you exploit it.",
								"Quick Thinker &mdash; You realize how to protect yourself from Harm. Treat it as if you'd rolled a (15+) on Avoid Harm whenever you exploit it.",
								"Rational &mdash; You realize how to save yourself by sacrificing someone else. Pick the person you throw under the bus to escape the threat."
							]
						}
					},
					subItems: [
						{
							name: "Think Fast",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/genius.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"Logical &mdash; You realize an effective way to dispose of the threat. Deal +1 Harm whenever you exploit it.",
											"Quick Thinker &mdash; You realize how to protect yourself from Harm. Treat it as if you'd rolled a (15+) on Avoid Harm whenever you exploit it.",
											"Rational &mdash; You realize how to save yourself by sacrificing someone else. Pick the person you throw under the bus to escape the threat."
										]
									}
								},
								sourceItem: {
									name: "Genius",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you find yourself in a life-threatening situation,",
									outro: "roll +%data.attribute% to see if you can discover a way out.",
									listRefs: [
										"edges"
									]
								},
								results: {
									completeSuccess: {
										result: "Gain 3 Edges, useable any time in the scene, while you're still in danger.",
										listRefs: [
											"edges"
										],
										edges: 3
									},
									partialSuccess: {
										result: "Gain 2 Edges, useable any time in the scene, while you're still in danger.",
										listRefs: [
											"edges"
										],
										edges: 2
									},
									failure: {
										result: "Gain 1 Edge, but you also attract unwanted attention. The GM makes a Move.",
										listRefs: [
											"edges"
										],
										edges: 1
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					rules: {
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Hacker": {
				name: "Hacker",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/hacker.svg",
				data: {
					subItems: [
						{
							name: "Hack",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/hacker.svg",
							data: {
								lists: {
									complications: {
										name: "Complications",
										items: [
											"Someone discovers the intrusion. You must take risks or compromise on how much you're able to accomplish.",
											"You leave traces of your intrusion."
										]
									}
								},
								sourceItem: {
									name: "Hacker",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you penetrate digital networks in the pursuit of confidential data, crack software, or disable security systems,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You accomplish your task without a problem."
									},
									partialSuccess: {
										result: "Complications arise. Choose one option:",
										listRefs: [
											"complications"
										]
									},
									failure: {
										result: "Unbeknownst to you, your intrusion didn't work out as you wanted. Maybe you didn't succeed at your task as well as you imagined, or you may have been discovered by personal enemies, law enforcement, or something else lurking in the network. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Hunter": {
				name: "Hunter",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/hunter.svg",
				data: {
					subItems: [
						{
							name: "Hunt Other",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/hunter.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Prepare Ambush - Deal your weapon's Harm when your enemy stumbles in.",
											"Camouflage - Take +2 ongoing to Act Under Pressure for as long as you remain hiding.",
											"Move in Shadows - Take +2 ongoing to Avoid Harm from ranged weapons."
										]
									}
								},
								sourceItem: {
									name: "Hunter",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you are hunting someone or something,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Get three options. You may spend them anytime during this scene.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Get two options. You may spend them anytime during this scene.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Get one option, but you become the prey. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.perception
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.perception
				}
			},
			"Ice Cold": {
				name: "Ice Cold",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/ice-cold.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"Easy Dodge &mdash; Avoid an attack.",
								"Opportunity Calls &mdash; Manage to snatch something.",
								"Patience, Patience &mdash; Maneuver into a better position.",
								"Clever Trick &mdash; Put someone in a bad position (everyone gets +2 to any attack Moves)."
							]
						}
					},
					subItems: [
						{
							name: "Keep Cool",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/ice-cold.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"Easy Dodge &mdash; Avoid an attack.",
											"Opportunity Calls &mdash; Manage to snatch something.",
											"Patience, Patience &mdash; Maneuver into a better position.",
											"Clever Trick &mdash; Put someone in a bad position (everyone gets +2 to any attack Moves)."
										]
									}
								},
								sourceItem: {
									name: "Ice Cold",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you are in a violent conflict,",
									outro: "roll +%data.attribute%.",
									listRefs: [
										"edges"
									]
								},
								results: {
									completeSuccess: {
										result: "Gain 3 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 3
									},
									partialSuccess: {
										result: "Gain 2 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 2
									},
									failure: {
										result: "Gain 1 Edge, but you attract attention from the hostiles. The GM makes a Move.",
										listRefs: [
											"edges"
										],
										edges: 1
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.coolness
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You keep your calm and cool, even in the midst of violence and chaos.",
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.coolness
				}
			},
			"Implanted Messages": {
				name: "Implanted Messages",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/implanted-messages.svg",
				data: {
					subItems: [
						{
							name: "Experiment on Human",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/implanted-messages.svg",
							data: {
								sourceItem: {
									name: "Implanted Messages",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you experiment on a human and wish to implant an order into them,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You hold 2 Power over them. For as long as you retain Power over them, they take 1 Serious Wound should they refuse or attempt to go against your order, but this loosens your grip over them by 1 Power. If they fulfill your order, all your remaining Power over them is removed."
									},
									partialSuccess: {
										result: "You hold 1 Power over them. For as long as you retain Power over them, they take 1 Serious Wound should they refuse or attempt to go against your order, but this loosens your grip over them by 1 Power. If they fulfill your order, all your remaining Power over them is removed."
									},
									failure: {
										result: "Something goes wrong, such as they get hurt in the process or the order's outcome is different than what you imagined. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You know how to implant orders into the minds of your \"subjects\"."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Impostor": {
				name: "Impostor",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/impostor.svg",
				data: {
					subItems: [
						{
							name: "Exploit Rube",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/impostor.svg",
							data: {
								sourceItem: {
									name: "Impostor",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you need money, a safehouse, protection, or other help one of your victims can provide,",
									outro: "describe who they are and roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "They can provide you with whatever you require."
									},
									partialSuccess: {
										result: "One of them might be able to help, but it will take some convincing."
									},
									failure: {
										result: "You know someone who can help, but they have already seen through your game. If you want their assistance it will require threats or blackmail to get them to provide it."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You maintain relationships with numerous people who all believe you are their soulmate, yet are unaware of each other."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Improviser": {
				name: "Improviser",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/improviser.svg",
				data: {
					subItems: [
						{
							name: "Wing It",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/improviser.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Lie - Come up with a convincing lie.",
											"Gear Up - Find something you can use as a makeshift melee weapon. The GM will tell you what it is.",
											"Hide - Stay out of a pursuer's sight.",
											"Prepare - Set a trap that gives you a +2 surprise bonus the first time you Engage in Combat after the trap is sprung."
										]
									}
								},
								sourceItem: {
									name: "Improviser",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you attempt to get out of a dangerous situation by winging it,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose two options.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Your improvisation makes the situation worse. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.coolness
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.coolness
				}
			},
			"Influential Friends": {
				name: "Influential Friends",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/influential-friends.svg",
				data: {
					subItems: [
						{
							name: "Pull Strings",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/influential-friends.svg",
							data: {
								sourceItem: {
									name: "Influential Friends",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you need to acquire an object, gain access to a restricted location, or meet a specific person,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Your friends can arrange for what you want."
									},
									partialSuccess: {
										result: "They can arrange for it, but you have to repay the favor later."
									},
									failure: {
										result: "They arrange for what you want, but you get on a powerful person's bad side or attract negative publicity. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have friends with power and influence."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Inner Power": {
				name: "Inner Power",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/inner-power.svg",
				data: {
					subItems: [
						{
							name: "Release Power",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/inner-power.svg",
							data: {
								sourceItem: {
									name: "Inner Power",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you release your inner power,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "The power attacks all opponents in your vicinity, causing 2 Harm."
									},
									partialSuccess: {
										result: "The power attacks your closest opponent, causing 2 Harm."
									},
									failure: {
										result: "The power attacks all living beings, including yourself, in the vicinity, causing 2 Harm."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You harbor a mysterious power, which you do not fully understand. The power can protect you, but you have no control over it."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Intimidating": {
				name: "Intimidating",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/intimidating.svg",
				data: {
					subItems: [
						{
							name: "Intimidate Other",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/intimidating.svg",
							data: {
								sourceItem: {
									name: "Intimidating",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you're trying to frighten another person,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "They succumb to fear and give in to your demands."
									},
									partialSuccess: {
										result: "They run away from you or give in to you, GM's choice."
									},
									failure: {
										result: "They see you as their primary threat and act accordingly. The GM makes a Move for them."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "There is something about you that instinctively makes others fear you."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Inventor": {
				name: "Inventor",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/inventor.svg",
				data: {
					subItems: [
						{
							name: "Create or Repair",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/inventor.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Durable: The construction can be used multiple times and doesn't break easily.",
											"Effective: The construction confers +1 on rolls where it is used for its intended purpose.",
											"Lethal: The construction causes +1 Harm.",
											"Protective: The construction confers +1 armor."
										]
									}
								},
								sourceItem: {
									name: "Inventor",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you are about to create or repair something,",
									outro: "explain what you are about to do. The GM will tell you what you need to succeed, and once you have collected these materials, you may roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "The construction is successful and you may pick two options from below.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "The construction has minor flaws. You may choose one option from below.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "You complete the construction or repair, but it has significant flaws, some of which are hidden. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Lay on Hands": {
				name: "Lay on Hands",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/lay-on-hands.svg",
				data: {
					subItems: [
						{
							name: "Heal",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/lay-on-hands.svg",
							data: {
								sourceItem: {
									name: "Lay on Hands",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you lay your hands on a seriously or critically wounded person and pray,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You fully heal the injured person, channeling the Wound onto yourself or a selected target."
									},
									partialSuccess: {
										result: "You stabilize the injured, channeling the Wound onto yourself or a selected target."
									},
									failure: {
										result: "You may choose to stabilize the injured, but if you do, the powers break free from your control."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are able to heal others' Wounds without using medicine or first aid, but you must channel the injuries onto yourself or another living victim.%n%To transfer a Wound, you must be able to see the victim, but not touch them and they are not required to consent.%n%The wound transferred is of the same type, severity, and condition as the original."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Lightning Fast": {
				name: "Lightning Fast",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/lightning-fast.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"Dodge &mdash; Avoid an attack.",
								"Blinding Speed &mdash; Engage in Combat with every opponent within reach of your weapon as a single attack. If you're attacking with a firearm, this uses up all its ammo.",
								"Uncanny Precision &mdash; Hit your opponent's weak spot. Deal +1 Harm."
							]
						}
					},
					subItems: [
						{
							name: "Accelerate",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/lightning-fast.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"Dodge &mdash; Avoid an attack.",
											"Blinding Speed &mdash; Engage in Combat with every opponent within reach of your weapon as a single attack. If you're attacking with a firearm, this uses up all its ammo.",
											"Uncanny Precision &mdash; Hit your opponent's weak spot. Deal +1 Harm."
										]
									}
								},
								sourceItem: {
									name: "Lightning Fast",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you move unexpectedly fast in combat,",
									outro: "roll +%data.attribute%.",
									listRefs: [
										"edges"
									]
								},
								results: {
									completeSuccess: {
										result: "Gain 3 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 3
									},
									partialSuccess: {
										result: "Gain 2 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 2
									},
									failure: {
										result: "Gain 1 Edge, but you also end up in a bad spot or face unexpected resistance. The GM makes a Move.",
										listRefs: [
											"edges"
										],
										edges: 1
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence
							}
						}
					],
					isCustom: false,
					rules: {
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Magical Intuition": {
				name: "Magical Intuition",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/magical-intuition.svg",
				data: {
					subItems: [
						{
							name: "Intuit the Illusion",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/magical-intuition.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Learn something about a creature's true nature.",
											"Learn if something has a magical nature.",
											"Learn where the Illusion is weakest towards other dimensions."
										]
									}
								},
								sourceItem: {
									name: "Magical Intuition",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you utilize your magical intuition,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose three options. Up to two may be saved until later this scene.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose two options. One may be saved until later this scene.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, but you also get an unexpected vision or attract attention. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have an innate ability to perceive Kirlian auras and sense the presence of magic."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Magnetic Attraction": {
				name: "Magnetic Attraction",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/magnetic-attraction.svg",
				data: {
					subItems: [
						{
							name: "Attract Attention",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/magnetic-attraction.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"People forget what they're doing and can do nothing but stare at you.",
											"Draw someone to you.",
											"Get someone to do what you ask."
										]
									}
								},
								sourceItem: {
									name: "Magnetic Attraction",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you attract everyone's attention,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose three options. You may save up to two until later in the scene.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, but someone present becomes obsessed, wanting to have you, keep you, and own you for themselves. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Manhunter": {
				name: "Manhunter",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/manhunter.svg",
				data: {
					subItems: [
						{
							name: "Investigate Person",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/manhunter.svg",
							data: {
								lists: {
									questions: {
										name: "Questions",
										items: [
											"What is their background?",
											"What or who do they love most of all?",
											"Who do they surround themselves with, like, and/or trust?",
											"Where are they located right now?",
											"How can I best gain access to them?"
										]
									}
								},
								sourceItem: {
									name: "Manhunter",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you're out to get information about someone,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Ask three questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									partialSuccess: {
										result: "Ask two questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									failure: {
										result: "Ask one question from the list below, but someone figures out you've been snooping around.",
										listRefs: [
											"questions"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Martial Arts Expert": {
				name: "Martial Arts Expert",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/martial-arts-expert.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"Block &mdash; Avoid a melee attack.",
								"Roundhouse Strike &mdash; Engage in Combat against several opponents surrounding you, counting as a single attack.",
								"Disarm &mdash; Remove an opponent's weapon.",
								"Throw &mdash; Reposition an opponent or drop them to the ground."
							]
						}
					},
					subItems: [
						{
							name: "Engage in Melee",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/martial-arts-expert.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"Block &mdash; Avoid a melee attack.",
											"Roundhouse Strike &mdash; Engage in Combat against several opponents surrounding you, counting as a single attack.",
											"Disarm &mdash; Remove an opponent's weapon.",
											"Throw &mdash; Reposition an opponent or drop them to the ground."
										]
									}
								},
								sourceItem: {
									name: "Martial Arts Expert",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you're fighting in close quarters,",
									outro: "roll +%data.attribute%.",
									listRefs: [
										"edges"
									]
								},
								results: {
									completeSuccess: {
										result: "Gain 2 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 2
									},
									partialSuccess: {
										result: "Gain 1 Edge.",
										listRefs: [
											"edges"
										],
										edges: 1
									},
									failure: {
										result: "Gain 1 Edge, but you underestimate your opponents, who may be more numerous or skilled than you first assumed. The GM makes a Move.",
										listRefs: [
											"edges"
										],
										edges: 1
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence
							}
						}
					],
					isCustom: false,
					rules: {
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Moles": {
				name: "Moles",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/moles.svg",
				data: {
					subItems: [
						{
							name: "Contact Mole",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/moles.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"The mole has penetrated the organization's inner circle; however, their influence is limited.",
											"The mole owes you one; however, you must meet their demands to get what you want."
										]
									}
								},
								sourceItem: {
									name: "Moles",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you make contact with one of your moles to acquire info or services,",
									outro: "explain what group or organization the mole belongs to, name them, and then roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You receive both options below.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one of the options below.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "The mole's loyalties are questionable. Can you trust them? The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have placed a number of moles in groups or organizations of interest to you, such as business competitors, governments, or cults."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Network of Contacts": {
				name: "Network of Contacts",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/network-of-contacts.svg",
				data: {
					subItems: [
						{
							name: "Ask About Someone",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/network-of-contacts.svg",
							data: {
								lists: {
									questions: {
										name: "Questions",
										items: [
											"What resources do they have at their disposal?",
											"Who do they have business dealings with?",
											"Where can I find them?",
											"What do they want?",
											"What are they most afraid of losing?"
										]
									}
								},
								sourceItem: {
									name: "Network of Contacts",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you check in with your contacts regarding an individual of your choosing,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Ask three questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									partialSuccess: {
										result: "Ask two questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									failure: {
										result: "Ask one question from the list below, but the person you're inquiring about finds out you're snooping around. The GM makes a Move.",
										listRefs: [
											"questions"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Notorious": {
				name: "Notorious",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/notorious.svg",
				data: {
					subItems: [
						{
							name: "Check: Notorious",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/notorious.svg",
							data: {
								sourceItem: {
									name: "Notorious",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you encounter someone who has likely heard about you,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "They know of your reputation; you can decide what they have heard. The GM will have them act accordingly. You take +2 to your next roll to Influence them."
									},
									partialSuccess: {
										result: "They know of your reputation; you can decide what they have heard."
									},
									failure: {
										result: "They know of your reputation; the GM decides what they have heard."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are famous in your trade."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Occult Library": {
				name: "Occult Library",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/occult-library.svg",
				data: {
					subItems: [
						{
							name: "Do Library Research",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/occult-library.svg",
							data: {
								lists: {
									questions: {
										name: "Questions",
										items: [
											"Which higher power does this have connections to?",
											"What do I need, or need to do, to exorcise or control this being?",
											"Which dimension is this associated with?",
											"What must I do to protect myself from this?"
										]
									}
								},
								sourceItem: {
									name: "Occult Library",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you are in your library researching the supernatural,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold at any time to make a hard or soft Move."
								},
								results: {
									completeSuccess: {
										result: "Ask two questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									partialSuccess: {
										result: "Ask one question from the list below.",
										listRefs: [
											"questions"
										]
									},
									failure: {
										result: "Ask one question from the list below, but you have missed or overlooked something crucial. The GM takes 1 Hold.",
										listRefs: [
											"questions"
										],
										hold: 1
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					rules: {
						holdText: "The GM can spend Hold at any time to make a hard or soft Move."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Occult Studies": {
				name: "Occult Studies",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/occult-studies.svg",
				data: {
					subItems: [
						{
							name: "Encounter the Occult",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/occult-studies.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"I know something about this (ask the GM what you know and take +1 ongoing while acting on the answers during this scene).",
											"I know where I can find more information about this (ask the GM where)."
										]
									}
								},
								sourceItem: {
									name: "Occult Studies",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Upon coming in contact with a magical discipline, entity, or phenomenon for the first time,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Take both options below.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "You have a hazy memory of something like this, but can't say for sure if it's true or not. The GM explains what it is you remember."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are a student of the occult."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Officer": {
				name: "Officer",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/officer.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"\"Attack!\" &mdash; One ally gets +2 to their next roll to Engage in Combat.",
								"\"Coordinate Fire!\" &mdash; All allies get +1 to their next roll to Engage in Combat with firearms while in the fight.",
								"\"Go For The Head!\" &mdash; You or one of your allies' Engage in Combat deals +1 Harm.",
								"\"Take Cover!\" &mdash; You or an ally receive 2 Armor against a ranged attack."
							]
						}
					},
					subItems: [
						{
							name: "Fight Beside Ally",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/officer.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"\"Attack!\" &mdash; One ally gets +2 to their next roll to Engage in Combat.",
											"\"Coordinate Fire!\" &mdash; All allies get +1 to their next roll to Engage in Combat with firearms while in the fight.",
											"\"Go For The Head!\" &mdash; You or one of your allies' Engage in Combat deals +1 Harm.",
											"\"Take Cover!\" &mdash; You or an ally receive 2 Armor against a ranged attack."
										]
									}
								},
								sourceItem: {
									name: "Officer",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you are in combat with at least one ally by your side,",
									outro: "roll +%data.attribute%.",
									listRefs: [
										"edges"
									]
								},
								results: {
									completeSuccess: {
										result: "Gain 3 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 3
									},
									partialSuccess: {
										result: "Gain 2 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 2
									},
									failure: {
										result: "You misjudge the situation. Choose whether you have put yourself or one of your allies in harm's way. The GM makes a Move for your opponent."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence
							}
						}
					],
					isCustom: false,
					rules: {
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Parkour": {
				name: "Parkour",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/parkour.svg",
				data: {
					subItems: [
						{
							name: "Execute Acrobatic Maneuver",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/parkour.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Scale a seemingly impossible obstacle.",
											"Make a seemingly life-threatening leap without suffering Harm.",
											"Successfully avoid a threat."
										]
									}
								},
								sourceItem: {
									name: "Parkour",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you execute acrobatic maneuvers,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose two options. You may save one until later.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, but a complication, cost, or new threat emerges. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.coolness
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are deft at running and jumping, even over difficult terrain."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.coolness
				}
			},
			"Perpetual Victim": {
				name: "Perpetual Victim",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/perpetual-victim.svg",
				data: {
					subItems: [
						{
							name: "Appear Helpless",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/perpetual-victim.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Make someone want to take care of you.",
											"Make an aggressive person want to not harm you.",
											"Make someone confide in you."
										]
									}
								},
								sourceItem: {
									name: "Perpetual Victim",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you appear defenseless during a dangerous experience,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose three options. You may save up to two options for use later during the scene.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Someone tries to take advantage of you and your position. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Prepared": {
				name: "Prepared",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/prepared.svg",
				data: {
					subItems: [
						{
							name: "Investigate Location",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/prepared.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Find or create a map of the location.",
											"Uncover any security systems and other obstacles.",
											"Pinpoint the location of something you're after."
										]
									}
								},
								sourceItem: {
									name: "Prepared",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you investigate a location prior to visiting it,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold at any time to make a hard or soft Move for the location."
								},
								results: {
									completeSuccess: {
										result: "Choose three options.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose two options.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, but you have missed or overlooked something crucial: The GM takes 1 Hold.",
										listRefs: [
											"options"
										],
										hold: 1
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					rules: {
						holdText: "The GM can spend Hold at any time to make a hard or soft Move for the location."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Puppeteer": {
				name: "Puppeteer",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/puppeteer.svg",
				data: {
					subItems: [
						{
							name: "Play Your Pawns",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/puppeteer.svg",
							data: {
								sourceItem: {
									name: "Puppeteer",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you execute a plan using other people as pawns,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Everyone involved takes +1 ongoing to carry out the plan, and you get one Experience if the plan is successful."
									},
									partialSuccess: {
										result: "You get one Experience if the plan is successful, but you have overlooked or miscalculated something."
									},
									failure: {
										result: "Your plan is inadequate, revealed, and/or misguided. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Quick Thinker": {
				name: "Quick Thinker",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/quick-thinker.svg",
				data: {
					subItems: [
						{
							name: "Prepare for Danger",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/quick-thinker.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Remember something that's advantageous in a negotiation. Ask the GM what it is.",
											"You possess some equipment you can use to get out of a sticky situation. Ask the GM what it is.",
											"You have special field training that would be useful in getting past one of your obstacles. Ask the GM what it is."
										]
									}
								},
								sourceItem: {
									name: "Quick Thinker",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you commence a dangerous mission,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose three options, at any time during the mission.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose two options, at any time during the mission.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "At any time during the mission, choose one option, but you've failed to account for something. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Read a Crowd": {
				name: "Read a Crowd",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/read-a-crowd.svg",
				data: {
					subItems: [
						{
							name: "Mingle",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/read-a-crowd.svg",
							data: {
								lists: {
									questions: {
										name: "Questions",
										items: [
											"Who here has information I want?",
											"Where can I find what I am looking for?",
											"Who is watching me?",
											"Is there anything else of interest?"
										]
									}
								},
								sourceItem: {
									name: "Read a Crowd",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you move through a small crowd to gather information,",
									outro: "roll +%data.attribute%.%n%Examples of a 'small crowd' include a party, bar/restaurant, or an office. You decide what specific information you are looking for, as long as it makes sense for the crowd to possess such information."
								},
								results: {
									completeSuccess: {
										result: "Ask three questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									partialSuccess: {
										result: "Ask two questions from the list below, but you also draw unwanted attention to yourself.",
										listRefs: [
											"questions"
										]
									},
									failure: {
										result: "Ask one question from the list below, but you've blown your cover. Those who have what you're looking for will be expecting you. The GM makes a Move.",
										listRefs: [
											"questions"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.perception
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.perception
				}
			},
			"Ruthless": {
				name: "Ruthless",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/ruthless.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"Meat Shield &mdash; Force them to take all the Harm from one attack for you.",
								"Nothing But Bait &mdash; Expose someone to danger so you can flank an enemy (deal +1 Harm).",
								"Leave Them Behind &mdash; Abandon them to the enemy while you slip away."
							]
						}
					},
					subItems: [
						{
							name: "Sacrifice Other",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/ruthless.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"Meat Shield &mdash; Force them to take all the Harm from one attack for you.",
											"Nothing But Bait &mdash; Expose someone to danger so you can flank an enemy (deal +1 Harm).",
											"Leave Them Behind &mdash; Abandon them to the enemy while you slip away."
										]
									}
								},
								sourceItem: {
									name: "Ruthless",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you sacrifice another to save your own skin,",
									outro: "roll +%data.attribute%.",
									listRefs: [
										"edges"
									]
								},
								results: {
									completeSuccess: {
										result: "Gain 3 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 3
									},
									partialSuccess: {
										result: "Gain 2 Edges.",
										listRefs: [
											"edges"
										],
										edges: 2
									},
									failure: {
										result: "Things turns out in a bad way for you instead. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence
							}
						}
					],
					isCustom: false,
					rules: {
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Seducer": {
				name: "Seducer",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/seducer.svg",
				data: {
					subItems: [
						{
							name: "Seduce",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/seducer.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Give you something you want.",
											"Reveal a secret.",
											"Fight to protect you. NPCs who fall in love with you cannot oppose you, as long as you haven't expended all your options. Against PCs, you may only choose the following options:",
											"Make them feel bad for opposing you (they must Keep It Together)",
											"They feel happy in your presence, and gain Stability (+2)."
										]
									}
								},
								sourceItem: {
									name: "Seducer",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you have an intimate moment with someone,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose three options, useable any time in the story.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose two options, useable any time in the story.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, useable any time in the story, but you also develop feelings for the person. Increase your Relation to them by +1.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You can consciously make people fall in love with you."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Shadow": {
				name: "Shadow",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/shadow.svg",
				data: {
					subItems: [
						{
							name: "Shadow Someone",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/shadow.svg",
							data: {
								sourceItem: {
									name: "Shadow",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When shadowing someone,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You avoid discovery, follow your target all the way to their final destination, and learn something about them you can use to your advantage later."
									},
									partialSuccess: {
										result: "You avoid discovery and follow your target to their final destination."
									},
									failure: {
										result: "You are spotted or encounter some sort of problem along the way. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.perception
							}
						},
						{
							name: "Evade a Shadow",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/shadow.svg",
							data: {
								sourceItem: {
									name: "Shadow",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you want to lose someone shadowing you,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You shake your pursuers and can choose to try to shadow them instead."
									},
									partialSuccess: {
										result: "You shake your pursuers."
									},
									failure: {
										result: "Your pursuers are still on your tail, and they can set up an ambush, disappear without a trace (only to show up when you least expect it), or refuse to go away. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.perception
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.perception
				}
			},
			"Sixth Sense": {
				name: "Sixth Sense",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/sixth-sense.svg",
				data: {
					subItems: [
						{
							name: "Check: Sixth Sense",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/sixth-sense.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Act first in a threatening situation. This can include even acting prior to a surprise attack.",
											"Sense whether someone wishes good or ill towards you.",
											"Discover or sense a clue or lead when you're off track."
										]
									}
								},
								sourceItem: {
									name: "Sixth Sense",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "At the start of each game session,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose three options, useable any time during the session.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose two options, useable any time during the session.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Your instincts will fail to trigger in a dangerous situation. The GM makes a Move at some point during the session."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have an intuition for things, both good and bad."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Snake Charmer": {
				name: "Snake Charmer",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/snake-charmer.svg",
				data: {
					subItems: [
						{
							name: "Charm",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/snake-charmer.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Ask the creature for help with a problem.",
											"Ask the creature for something you desire."
										]
									}
								},
								sourceItem: {
									name: "Snake Charmer",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you perform your chosen art form for an intelligent, monstrous creature,",
									outro: "roll +%data.attribute% to awaken a desire within them."
								},
								results: {
									completeSuccess: {
										result: "Choose one option immediately, and you may choose two more any time in the future.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "The desire is beyond the creature's ability to regulate. It cannot help but attempt to devour or imprison you."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Sneak": {
				name: "Sneak",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/sneak.svg",
				data: {
					subItems: [
						{
							name: "Hide & Sneak",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/sneak.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Find a secure hiding spot for a while.",
											"Find an alternate route to avoid encountering people.",
											"Bypass a security system or other obstacle without being noticed."
										]
									}
								},
								sourceItem: {
									name: "Sneak",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you keep hidden and try to avoid drawing attention to yourself,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose 2 options. You may spend them any time during the scene.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose 1 option. You may spend them any time during the scene.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose 1 option, but you manage to attract someone's attention. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.coolness
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.coolness
				}
			},
			"Sniper": {
				name: "Sniper",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/sniper.svg",
				data: {
					subItems: [
						{
							name: "Scoped Shot",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/sniper.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Deal +1 Harm.",
											"Hit another target as well.",
											"Immobilize your target.",
											"Get the target to lose control of something.",
											"You don't reveal your position."
										]
									}
								},
								sourceItem: {
									name: "Sniper",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you fire at a distant target utilizing a scoped rifle,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "The shot finds its target. Choose two options.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "The shot finds its target. Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "The shot didn't go where you intended it to, or you reveal your position to the enemy—expect witnesses, opponents pursuing you as you leave the scene, or other problems. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Street Contacts": {
				name: "Street Contacts",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/street-contacts.svg",
				data: {
					subItems: [
						{
							name: "Canvas Street Contacts",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/street-contacts.svg",
							data: {
								lists: {
									questions: {
										name: "Questions",
										items: [
											"What do you know about the [building / person / organization / event]?",
											"What rumors are circulating on the street at the moment?",
											"How can I get into [location]?",
											"Who in this city would know more about this supernatural thing?"
										]
									}
								},
								sourceItem: {
									name: "Street Contacts",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you need to know something and check in with your contacts,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Ask three questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									partialSuccess: {
										result: "Ask one question from the list below.",
										listRefs: [
											"questions"
										]
									},
									failure: {
										result: "Ask one question from the list below, but someone becomes suspicious or aggressive. The GM makes a Move.",
										listRefs: [
											"questions"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have contacts among the homeless, crazies, and other societal outsiders and outcasts."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Streetfighter": {
				name: "Streetfighter",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/streetfighter.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"Dodge &mdash; Avoid an attack.",
								"Flurry of Blows &mdash; Take +2 on your roll to attack an opponent.",
								"Dirty Strike &mdash; Momentarily stun an opponent by striking them where it hurts."
							]
						}
					},
					subItems: [
						{
							name: "Engage in Melee",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/streetfighter.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"Dodge &mdash; Avoid an attack.",
											"Flurry of Blows &mdash; Take +2 on your roll to attack an opponent.",
											"Dirty Strike &mdash; Momentarily stun an opponent by striking them where it hurts."
										]
									},
									complications: {
										name: "Complications",
										items: [
											"You risk losing control during the fight (Keep It Together to prevent it).",
											"You earn an enemy, who will try to get back at you later."
										]
									}
								},
								sourceItem: {
									name: "Streetfighter",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you fight in close combat,",
									outro: "roll +%data.attribute%.",
									listRefs: [
										"edges"
									]
								},
								results: {
									completeSuccess: {
										result: "Gain 3 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 3
									},
									partialSuccess: {
										result: "Gain 2 Edges, but the GM also gets to pick one complication: %list:complications%",
										listRefs: [
											"edges"
										],
										edges: 2
									},
									failure: {
										result: "You're unfocused and lose control. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence
							}
						}
					],
					isCustom: false,
					rules: {
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Streetwise": {
				name: "Streetwise",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/streetwise.svg",
				data: {
					subItems: [
						{
							name: "Shop the Black Market",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/streetwise.svg",
							data: {
								lists: {
									gmoptions: {
										name: "GM Options",
										items: [
											"It will cost you something extra, such as in-kind services, tasks, or an inflated price.",
											"You can get it handled, but only by dealing with someone you're already indebted to.",
											"\"Shit, I had one, but I just let it go to [insert name]—maybe you can buy it from her?\"",
											"\"Sorry, that's a bit outside of my area, but maybe this will work instead?\""
										]
									}
								},
								sourceItem: {
									name: "Streetwise",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you want to acquire items or services from the criminal underworld,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "No problem—you get what you're after. Someone will fix you right up."
									},
									partialSuccess: {
										result: "The GM chooses one option:",
										listRefs: [
											"gmoptions"
										]
									},
									failure: {
										result: "You think you find what you're looking for, but there will be costly stipulations, considerable flaws, or major complications. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.charisma
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Stubborn": {
				name: "Stubborn",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/stubborn.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"Refuse to Give Up &mdash; Postpone the effects of a critical injury until you have made it out of the threat's reach.",
								"Will Over Skill &mdash; Roll +Willpower instead of the normal attribute whenever you avoid or fight whatever is threatening you.",
								"Steel Yourself &mdash; Break free from a supernatural effect."
							]
						}
					},
					subItems: [
						{
							name: "Push Through",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/stubborn.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"Refuse to Give Up &mdash; Postpone the effects of a critical injury until you have made it out of the threat's reach.",
											"Will Over Skill &mdash; Roll +Willpower instead of the normal attribute whenever you avoid or fight whatever is threatening you.",
											"Steel Yourself &mdash; Break free from a supernatural effect."
										]
									}
								},
								sourceItem: {
									name: "Stubborn",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you push yourself to the limit to overcome a threat,",
									outro: "roll +%data.attribute%.",
									listRefs: [
										"edges"
									]
								},
								results: {
									completeSuccess: {
										result: "Gain 3 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 3
									},
									partialSuccess: {
										result: "Gain 2 Edges. You may spend them any time during the scene.",
										listRefs: [
											"edges"
										],
										edges: 2
									},
									failure: {
										result: "Gain 1 Edge, but you push yourself past your breaking point. Decrease Stability (−2).",
										listRefs: [
											"edges"
										],
										edges: 1
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					rules: {
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Survival Instinct": {
				name: "Survival Instinct",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/survival-instinct.svg",
				data: {
					subItems: [
						{
							name: "Refuse to Yield",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/survival-instinct.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Viciousness — +1 ongoing to Engage in Combat rolls for the remainder of the fight.",
											"Adrenaline Rush — +1 ongoing to Endure Injury rolls for the remainder of the fight."
										]
									}
								},
								sourceItem: {
									name: "Survival Instinct",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you suffer a serious or critical injury yet refuse to yield,",
									outro: "roll +%data.attribute%.%n%On a success, you may temporarily ignore the effects of the injuries, but you will need treatment to stabilize them as soon as the time limit expires."
								},
								results: {
									completeSuccess: {
										result: "You ignore your injuries until the conflict is over, and you may choose one option from the list below:",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "You ignore your injuries until the conflict is over."
									},
									failure: {
										result: "You overexert yourself and after a few moments your injuries cause you to pass out and collapse. After your next action, the GM decides when and how you pass out."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Survivalist": {
				name: "Survivalist",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/survivalist.svg",
				data: {
					subItems: [
						{
							name: "Survivalist Skills",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/survivalist.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Find water and something edible.",
											"Make it past an environmental obstacle.",
											"Find a safe spot to hide and rest."
										]
									}
								},
								sourceItem: {
									name: "Survivalist",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you utilize your survivalist skills,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose three options, useable while you remain in this situation.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose two options, useable while you remain in this situation.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option useable while you remain in this situation, but you've also overlooked something important. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.perception
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.perception
				}
			},
			"Tracer": {
				name: "Tracer",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/tracer.svg",
				data: {
					subItems: [
						{
							name: "Execute Trace",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/tracer.svg",
							data: {
								lists: {
									questions: {
										name: "Questions",
										items: [
											"Where in the world was this seen last?",
											"What people have associated themselves with what I'm looking for lately?",
											"What tracks and marks has it left behind?",
											"Who else is trying to find what I'm looking for?"
										]
									}
								},
								sourceItem: {
									name: "Tracer",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you utilize your intelligence networks to trace someone or something,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Ask three questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									partialSuccess: {
										result: "Ask two questions from the list below.",
										listRefs: [
											"questions"
										]
									},
									failure: {
										result: "Ask one question from the list below, but someone notices you snooping around. It might be someone you'd rather not be known by, or a traitor inside your network.",
										listRefs: [
											"questions"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.reason
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Voice of Insanity": {
				name: "Voice of Insanity",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/voice-of-insanity.svg",
				data: {
					subItems: [
						{
							name: "Mass Manipulation",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/voice-of-insanity.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Attract other people to join in the crowd.",
											"Have crowd members give you all their valuables.",
											"Unite the crowd to fight for you.",
											"Incite the crowd into an orgy of unbridled emotion: sexual lust, anger, sorrow, violence, generosity, or celebrating, depending on what concepts you are instilling into them.",
											"Have the crowd disperse and calmly return to their normal lives."
										]
									}
								},
								sourceItem: {
									name: "Voice of Insanity",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you manipulate a crowd,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Choose three options, useable any time during this scene.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose two options, useable any time during this scene.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, useable any time during this scene. However, the crowd becomes uncontrollable and volatile, and cannot be dispersed. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Voice of Pain": {
				name: "Voice of Pain",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/voice-of-pain.svg",
				data: {
					subItems: [
						{
							name: "Gain Insight from Pain",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/voice-of-pain.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"You realize how to get through your opponent's defenses (take +1 to Engage in Combat with them).",
											"You find your opponent's weak spot (deal +1 Harm whenever you Engage in Combat with them).",
											"You perceive your opponent's pattern of attack (take +1 to Avoid Harm whenever they attack you). These effects are permanent against this opponent."
										]
									}
								},
								sourceItem: {
									name: "Voice of Pain",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When an opponent seriously or critically wounds you for the first time,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You get two options.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "Choose one option.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "Choose one option, but the pain will overwhelm you eventually and make you black out.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			},
			"Wanderer": {
				name: "Wanderer",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/wanderer.svg",
				data: {
					subItems: [
						{
							name: "Wander",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/wanderer.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Ask the GM one question about this place.",
											"You have a contact at this place who could help you, with a bit of convincing.",
											"You have a hideout here, where you can put your head down and get some rest.",
											"You know something about this place. Tell the others what."
										]
									}
								},
								sourceItem: {
									name: "Wanderer",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you are heading out to a community or another part of the city,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You have been here before. Choose two options any time during your visit.",
										listRefs: [
											"options"
										]
									},
									partialSuccess: {
										result: "You have heard of this place. Choose one option any time during your visit.",
										listRefs: [
											"options"
										]
									},
									failure: {
										result: "You have been here before, but something bad happened. Choose one option any time during your visit. The GM explains what kind of problem awaits you here. The GM makes a Move.",
										listRefs: [
											"options"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.perception
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.perception
				}
			},
			"Wayfinder": {
				name: "Wayfinder",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/wayfinder.svg",
				data: {
					subItems: [
						{
							name: "Mad Guidance",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/wayfinder.svg",
							data: {
								sourceItem: {
									name: "Wayfinder",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you travel between two places in the city and allow your madness to guide you through the alleys,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You discover a shortcut through the alleys, which takes you to your destination within a few minutes, regardless of how far the distance actually is."
									},
									partialSuccess: {
										result: "You discover a shortcut, but there is also some sort of obstacle you will need to get past."
									},
									failure: {
										result: "You discover a shortcut, but it leads you into a dangerous situation, such as the lair of some creature or an ambush set by some gang. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.soul
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			}
		},
		[K4ItemSubType.activeStatic]: {
			"Arcane Researcher": {
				name: "Arcane Researcher",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/arcane-researcher.svg",
				data: {
					subItems: [
						{
							name: "Invoke Arcane Studies",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/arcane-researcher.svg",
							data: {
								sourceItem: {
									name: "Arcane Researcher",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you venture into alternate planes of existence or meet entities from other dimensions,",
									outro: "you may declare that you have read about this dimension or creature before. Ask the GM what you learned from your past studies."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"At Any Cost": {
				name: "At Any Cost",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/at-any-cost.svg",
				data: {
					subItems: [
						{
							name: "Pay the Price",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/at-any-cost.svg",
							data: {
								sourceItem: {
									name: "At Any Cost",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you truly desire something,",
									outro: "you may take +2 to a roll by decreasing Stability (−2)."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Code of Honor": {
				name: "Code of Honor",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/code-of-honor.svg",
				data: {
					subItems: [
						{
							name: "Uphold Your Code",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/code-of-honor.svg",
							data: {
								sourceItem: {
									name: "Code of Honor",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you take risks or make sacrifices for your code of honor,",
									outro: "gain Stability (+1)."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You abide by a strict code of honor. Decide its nature when you take this Advantage."
					},
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Desperate": {
				name: "Desperate",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/desperate.svg",
				data: {
					subItems: [
						{
							name: "Fight Through",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/desperate.svg",
							data: {
								sourceItem: {
									name: "Desperate",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you try to make it through overwhelming odds,",
									outro: "take +1 ongoing on all rolls until you're clear of the threat."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Divine Champion": {
				name: "Divine Champion",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/divine-champion.svg",
				data: {
					subItems: [
						{
							name: "Fight for Your God",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/divine-champion.svg",
							data: {
								sourceItem: {
									name: "Divine Champion",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you fight your deity's enemies or fight to protect a sacred object,",
									outro: "you do +1 Harm and take +1 to Endure Injury."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						},
						{
							name: "Fail your God",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/divine-champion.svg",
							data: {
								sourceItem: {
									name: "Divine Champion",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When you lose a battle against your deity's enemies or to protect a sacred object,",
									outro: "your deity becomes irate: You take −1 ongoing to all actions related to your deity until you have atoned for your failure."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Eye for an Eye": {
				name: "Eye for an Eye",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/eye-for-an-eye.svg",
				data: {
					subItems: [
						{
							name: "Promise Vengeance",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/eye-for-an-eye.svg",
							data: {
								sourceItem: {
									name: "Eye for an Eye",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you suffer a serious or critical injury, name the person you feel is responsible.",
									outro: "You get +2 ongoing to all rolls against them, forever. All rolls targeting the person count, but rolls targeting the person's family, friends, minions, and property only count if the GM feels they're applicable."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Good Samaritan": {
				name: "Good Samaritan",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/good-samaritan.svg",
				data: {
					subItems: [
						{
							name: "Help and Heal",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/good-samaritan.svg",
							data: {
								sourceItem: {
									name: "Good Samaritan",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you help another at your own expense,",
									outro: "gain Stability (+1)."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Grudge": {
				name: "Grudge",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/grudge.svg",
				data: {
					subItems: [
						{
							name: "Chase a Grudge",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/grudge.svg",
							data: {
								sourceItem: {
									name: "Grudge",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When someone directly or indirectly ruins your plans,",
									outro: "you take +1 ongoing against them until you have taken revenge or received restitution of equal worth to what you lost."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Manipulative": {
				name: "Manipulative",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/manipulative.svg",
				data: {
					lists: {
						options: {
							name: "Options",
							items: [
								"Take +2 to Influence Other rolls made against them.",
								"Take +2 to Hinder Other rolls made against them."
							]
						}
					},
					subItems: [
						{
							name: "Exploit Trust",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/manipulative.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
											"Take +2 to Influence Other rolls made against them.",
											"Take +2 to Hinder Other rolls made against them."
										]
									}
								},
								sourceItem: {
									name: "Manipulative",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you do someone a favor or learn one of their secrets,",
									outro: "you may later choose one of the options below, by reminding them of your prior services or hint at the secret you know:",
									listRefs: [
										"options"
									]
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						listRefs: [
							"options"
						]
					},
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Opportunist": {
				name: "Opportunist",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/opportunist.svg",
				data: {
					subItems: [
						{
							name: "Trample Other",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/opportunist.svg",
							data: {
								sourceItem: {
									name: "Opportunist",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you sacrifice someone else to further your own goals,",
									outro: "gain Stability (+1)."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Rage": {
				name: "Rage",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/rage.svg",
				data: {
					lists: {
						edges: {
							name: "Edges",
							items: [
								"Brutal Assault &mdash; Take +1 Harm to your attack.",
								"What Pain? &mdash; Take +2 to Endure Injury.",
								"See Only Red &mdash; Shake off and ignore psychological or supernatural influence."
							]
						}
					},
					subItems: [
						{
							name: "Awaken Inner Rage",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/rage.svg",
							data: {
								lists: {
									edges: {
										name: "Edges",
										items: [
											"Brutal Assault &mdash; Take +1 Harm to your attack.",
											"What Pain? &mdash; Take +2 to Endure Injury.",
											"See Only Red &mdash; Shake off and ignore psychological or supernatural influence."
										]
									}
								},
								sourceItem: {
									name: "Rage",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When you choose to awaken your inner rage in combat,",
									outro: "lose Stability (−1) and mark 1 Rage.%n%Every time you get a wound and every time you defeat a foe, increase Rage (+1).%n%Rage lasts until the end of the combat.%n%During combat, you may spend 1 Rage to activate 1 Edge from the list below:",
									listRefs: [
										"edges"
									]
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						listRefs: [
							"edges"
						]
					},
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Sealed Fate": {
				name: "Sealed Fate",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/sealed-fate.svg",
				data: {
					subItems: [
						{
							name: "Invoke Fate",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/sealed-fate.svg",
							data: {
								sourceItem: {
									name: "Sealed Fate",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you are dealt a Critical Wound,",
									outro: "you may mark 1 Time from Condemned to immediately stabilize the Wound."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						},
						{
							name: "Defy Death",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/sealed-fate.svg",
							data: {
								sourceItem: {
									name: "Sealed Fate",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you die,",
									outro: "mark 2 Time from Condemned and reawaken, injured and weak, but alive, and with all of your Wounds stabilized."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						effectFunctions: [
							"Requires the Disadvantage Condemned"
						]
					},
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Thirst for Knowledge": {
				name: "Thirst for Knowledge",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/thirst-for-knowledge.svg",
				data: {
					subItems: [
						{
							name: "Drink Deep",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/thirst-for-knowledge.svg",
							data: {
								sourceItem: {
									name: "Thirst for Knowledge",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you learn new information about alternate planes of existence, a supernatural entity, or a Higher Power,",
									outro: "gain Stability (+1)."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"To the Last Breath": {
				name: "To the Last Breath",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/to-the-last-breath.svg",
				data: {
					subItems: [
						{
							name: "Refuse to Give In",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/to-the-last-breath.svg",
							data: {
								sourceItem: {
									name: "To the Last Breath",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When you refuse to give in even if the odds turn against you,",
									outro: "mark 1 Time to reroll the dice."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						effectFunctions: [
							"Requires the Disadvantage Condemned"
						]
					},
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Watchers": {
				name: "Watchers",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/watchers.svg",
				data: {
					lists: {
						watchers: {
							name: "Watchers Gang",
							items: [
								"Small Gang: 2 Harm, 5 Wounds",
								"Medium Gang: 3 Harm, 10 Wounds",
								"Large Gang: 3 Harm, 15 Wounds"
							],
							intro: "The GM determines the size of the gang that appears, based on the power of the threat you face."
						}
					},
					subItems: [
						{
							name: "Invoke Watchers",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/watchers.svg",
							data: {
								lists: {
									watchers: {
										name: "Watchers Gang",
										items: [
											"Small Gang: 2 Harm, 5 Wounds",
											"Medium Gang: 3 Harm, 10 Wounds",
											"Large Gang: 3 Harm, 15 Wounds"
										],
										intro: "The GM determines the size of the gang that appears, based on the power of the threat you face."
									}
								},
								sourceItem: {
									name: "Watchers",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you are in mortal danger and choose to activate your Watchers,",
									outro: "the GM takes 1 Hold and introduces your Watchers to the scene. Their sole motivation is to keep you out of harm's reach.",
									holdText: "The GM can spend Hold on the Watchers' behalf to let them make a Move against you.",
									listRefs: [
										"watchers"
									]
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are being watched over and protected by a group of mysterious people who intend on keeping you alive for their own obscure purposes.",
						holdText: "The GM can spend Hold on the Watchers' behalf to let them make a Move against you.",
						listRefs: [
							"watchers"
						]
					},
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Workaholic": {
				name: "Workaholic",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/workaholic.svg",
				data: {
					subItems: [
						{
							name: "Lose Yourself in Work",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/workaholic.svg",
							data: {
								sourceItem: {
									name: "Workaholic",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you create something or carry out an experiment,",
									outro: "gain Stability (+1)."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			},
			"Worldly": {
				name: "Worldly",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/worldly.svg",
				data: {
					subItems: [
						{
							name: "Assert Familiarity",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/advantage/worldly.svg",
							data: {
								sourceItem: {
									name: "Worldly",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you arrive at a new location in the mundane world,",
									outro: "decide whether you have been here before, and if so, name some detail about the place significant to you. Also, decide if you met someone there and what you left behind. The GM will say what has changed since then."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			}
		},
		[K4ItemSubType.passive]: {
			"Analyst": {
				name: "Analyst",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/analyst.svg",
				data: {
					lists: {
						questions: {
							name: "Questions",
							items: [
								"Which organizations, groups, or people of interest may be connected to this?",
								"Is there a connection between this and another event?",
								"What could a plausible motive be?"
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "When you Investigate, you may also choose from these additional questions:",
						listRefs: [
							"questions"
						],
						effectFunctions: [
							">AppendList:move/Investigate,questions"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Dead Shot": {
				name: "Dead Shot",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/dead-shot.svg",
				data: {
					isCustom: false,
					rules: {
						intro: "You are a seasoned marksman.%n%You deal +1 Harm with firearms.",
						effectFunctions: [
							">ModValue:weapon/firearm,harm,1"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Elite Sport (Athletic)": {
				name: "Elite Sport (Athletic)",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/elite-sport-(athletic).svg",
				data: {
					isCustom: false,
					rules: {
						intro: "You've competed professionally in an athletic sport (baseball, football, tennis, etc.), through which you have developed your physical capabilities.%n%You take +1 ongoing to all rolls relevant to running, throwing, or catching objects."
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Elite Sport (Contact)": {
				name: "Elite Sport (Contact)",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/elite-sport-(contact).svg",
				data: {
					isCustom: false,
					rules: {
						intro: "You've competed professionally in a contact sport (e.g. ice hockey, football), through which you have learned to take a hit.%n%You take +1 ongoing to Endure Injury rolls against close-combat attacks."
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Elite Sport (Fencing)": {
				name: "Elite Sport (Fencing)",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/elite-sport-(fencing).svg",
				data: {
					subItems: [
						{
							name: "Riposte",
							type: K4ItemType.attack,
							img: "systems/kult4th/assets/icons/advantage/elite-sport-(fencing).svg",
							data: {
								lists: {
									gmoptions: {
										name: "GM Options",
										items: [
											"You're subjected to a counterattack.",
											"You do less damage than intended.",
											"You lose something important.",
											"You expend all your ammo.",
											"You're beset by a new threat.",
											"You'll be in trouble later on."
										]
									}
								},
								sourceItem: {
									name: "Elite Sport (Fencing)",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When you engage an able opponent within arm's reach in close combat, including immediately after a successful parry,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You inflict 3 Harm to your opponent(s) and avoid counterattacks."
									},
									partialSuccess: {
										result: "You inflict 3 Harm, but at a cost. The GM chooses one:",
										listRefs: [
											"gmoptions"
										]
									},
									failure: {
										result: "Your attack doesn't go as anticipated. You might be subjected to bad luck, miss your target, or pay a high price for your assault. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence,
								range: [
									"arm"
								],
								harm: 3
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You've competed professionally in fencing.%n%You own a rapier at home and you know how to wield it. Add the following to the attacks available to you when fighting with a sword: %list:inline-attacks%",
						effectFunctions: [
							">AppendList:weapon/sword,attacks"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Endure Trauma": {
				name: "Endure Trauma",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/endure-trauma.svg",
				data: {
					isCustom: false,
					rules: {
						intro: "You are not as easily affected by trauma as others.%n%Whenever you would lose Stability, lose one fewer level than normal."
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Expert": {
				name: "Expert",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/expert.svg",
				data: {
					lists: {
						expertise: {
							name: "Fields of Expertise",
							items: [
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
					isCustom: false,
					rules: {
						intro: "You are an expert in certain fields of knowledge. Choose two areas of expertise when you gain this Advantage: %list:expertise%Whenever you Investigate something associated with one of your chosen fields, you always get to ask one additional question, regardless of the outcome, and may ask any questions you want.",
						effectFunctions: [
							"GET: ReplaceList (Investigate, Questions)",
							"StoreInput: text=Field of Expertise #1>flags.field_1",
							"StoreInput: text=Field of Expertise #2>flags.field_2"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Extortionist": {
				name: "Extortionist",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/extortionist.svg",
				data: {
					lists: {
						questions: {
							name: "Questions",
							items: [
								"What are you afraid of?",
								"What is precious to you?"
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "Whenever you Read a Person, you may choose from these questions in addition to the usual ones:",
						listRefs: [
							"questions"
						],
						effectFunctions: [
							">AppendList:move/Read a Person,questions"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Gritted Teeth": {
				name: "Gritted Teeth",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/gritted-teeth.svg",
				data: {
					isCustom: false,
					rules: {
						intro: "Abuse, violence, self-harm, and assaults have become familiar, and the pain hardly affects you at all anymore.%n%You suffer no penalties to your dice rolls from your Wounds.",
						effectFunctions: [
							"SetPenalty:SeriousWound,0",
							"SetPenalty:CriticalWound,0"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Hardened": {
				name: "Hardened",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/hardened.svg",
				data: {
					isCustom: false,
					rules: {
						intro: "You take +1 ongoing to all Endure Injury rolls.",
						effectFunctions: [
							"BuffRoll:Endure Injury,1"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Instinct": {
				name: "Instinct",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/instinct.svg",
				data: {
					isCustom: false,
					rules: {
						intro: "Whenever you Observe a Situation and act on the GM's answers, take +2 instead of +1.",
						effectFunctions: [
							"AddNote:Observe a Situation/completeSuccess,Take +2 instead of +1 for acting on the GM's answers.",
							"AddNote:Observe a Situation/partialSuccess,Take +2 instead of +1 for acting on the GM's answers."
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Interrogator": {
				name: "Interrogator",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/interrogator.svg",
				data: {
					isCustom: false,
					rules: {
						intro: "Whenever you Read a Person and mention a name, person, or object, you may always ask \"Are you lying?\" This doesn't count towards the number of questions you're allowed to normally ask."
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Intuitive": {
				name: "Intuitive",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/intuitive.svg",
				data: {
					isCustom: false,
					rules: {
						intro: "You can sense people's motives through subconscious readings of their body language, word choices, and behavior.%n%Whenever you Read a Person, you may always ask one additional question, regardless of the outcome of your roll.",
						effectFunctions: [
							"AddNote:completeSuccess,effect|AddNote:partialSuccess,effect|AddNote:failure,effect"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Jaded": {
				name: "Jaded",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/jaded.svg",
				data: {
					isCustom: false,
					rules: {
						intro: "Whenever you Keep It Together and the result is a Partial Success, you may suppress your emotions and postpone their effects until the next scene.",
						effectFunctions: [
							"AddNote:Keep It Together:partialSuccess='You may suppress your emotions, postponing their effects until the next scene.'"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Keen-Eyed": {
				name: "Keen-Eyed",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/keen-eyed.svg",
				data: {
					lists: {
						questions: {
							name: "Questions",
							items: [
								"What weaknesses do they have I can use to my advantage?",
								"What strengths do they have I should watch out for?"
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "Whenever you Observe a Situation, you may choose from these questions, in addition to the ones normally acquired:",
						listRefs: [
							"questions"
						],
						effectFunctions: [
							">AppendList:move/Observe a Situation,questions"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Observant": {
				name: "Observant",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/observant.svg",
				data: {
					lists: {
						questions: {
							name: "Questions",
							items: [
								"What sort of person are you?",
								"Is there anything odd about you?"
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "Whenever you Read a Person, you may choose from these questions in addition to the usual ones:",
						listRefs: [
							"questions"
						],
						effectFunctions: [
							"AppendList:Read a Person,questions"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Scientist": {
				name: "Scientist",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/scientist.svg",
				data: {
					lists: {
						questions: {
							name: "Questions",
							items: [
								"What properties does this have? (take +1 to any rolls against entities or objects of a similar type next time you encounter it).",
								"How do I make use of this? (take +1 to any rolls associated with using the object).",
								"What is its purpose?"
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "Whenever you Investigate an object or entity using the proper equipment, you may choose from these following questions, in addition to those acquired through investigation:",
						listRefs: [
							"questions"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Vigilant": {
				name: "Vigilant",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/vigilant.svg",
				data: {
					lists: {
						questions: {
							name: "Questions",
							items: [
								"Are you hiding anything from me?",
								"How do you really feel about me?"
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "Whenever you Read a Person, you may choose from these questions in addition to the usual ones:",
						listRefs: [
							"questions"
						],
						effectFunctions: [
							"AppendList:Read a Person,questions"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Weapon Master (Firearms)": {
				name: "Weapon Master (Firearms)",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/weapon-master-(firearms).svg",
				data: {
					subItems: [
						{
							name: "Two In the Chest, One in the Head",
							type: K4ItemType.attack,
							img: "systems/kult4th/assets/icons/advantage/weapon-master-(firearms).svg",
							data: {
								lists: {
									gmoptions: {
										name: "GM Options",
										items: [
											"You're subjected to a counterattack.",
											"You do less damage than intended.",
											"You lose something important.",
											"You expend all your ammo.",
											"You're beset by a new threat.",
											"You'll be in trouble later on."
										]
									}
								},
								sourceItem: {
									name: "Weapon Master (Firearms)",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When you engage an able opponent out of your reach but no farther than a few meters away in ranged combat,",
									outro: "expend 2 Ammo and roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You inflict 4 Harm to your opponent(s) and avoid counterattacks."
									},
									partialSuccess: {
										result: "You inflict 4 Harm, but at a cost. The GM chooses one:",
										listRefs: [
											"gmoptions"
										]
									},
									failure: {
										result: "Your attack doesn't go as anticipated. You might be subjected to bad luck, miss your target, or pay a high price for your assault. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence,
								range: [
									"room"
								],
								harm: 4,
								ammo: 2
							}
						},
						{
							name: "Disarming Shot",
							type: K4ItemType.attack,
							img: "systems/kult4th/assets/icons/advantage/weapon-master-(firearms).svg",
							data: {
								lists: {
									gmoptions: {
										name: "GM Options",
										items: [
											"You're subjected to a counterattack.",
											"You do less damage than intended.",
											"You lose something important.",
											"You expend all your ammo.",
											"You're beset by a new threat.",
											"You'll be in trouble later on."
										]
									}
								},
								sourceItem: {
									name: "Weapon Master (Firearms)",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When you engage an able opponent out of your reach but no farther than a few meters away in ranged combat,",
									outro: "expend 1 Ammo and roll +%data.attribute%. A targeted PC must Act Under Pressure."
								},
								results: {
									completeSuccess: {
										result: "You inflict 1 Harm to your opponent(s) and avoid counterattacks."
									},
									partialSuccess: {
										result: "You inflict 1 Harm, but at a cost. The GM chooses one:",
										listRefs: [
											"gmoptions"
										]
									},
									failure: {
										result: "Your attack doesn't go as anticipated. You might be subjected to bad luck, miss your target, or pay a high price for your assault. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence,
								range: [
									"room"
								],
								harm: 1,
								ammo: 1
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are a master of gunplay.%n%When you Engage in Combat with a firearm, roll +Coolness instead of +Violence, and add the following to your available attacks: %list:inline-attacks%"
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			"Weapon Master (Melee)": {
				name: "Weapon Master (Melee)",
				type: K4ItemType.advantage,
				img: "systems/kult4th/assets/icons/advantage/weapon-master-(melee).svg",
				data: {
					subItems: [
						{
							name: "Launching Attack",
							type: K4ItemType.attack,
							img: "systems/kult4th/assets/icons/advantage/weapon-master-(melee).svg",
							data: {
								lists: {
									gmoptions: {
										name: "GM Options",
										items: [
											"You're subjected to a counterattack.",
											"You do less damage than intended.",
											"You lose something important.",
											"You expend all your ammo.",
											"You're beset by a new threat.",
											"You'll be in trouble later on."
										]
									}
								},
								sourceItem: {
									name: "Weapon Master (Melee)",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When you engage an able opponent out of your reach but no farther than a few meters away in ranged combat,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You inflict 2 Harm to your opponent(s) and avoid counterattacks."
									},
									partialSuccess: {
										result: "You inflict 2 Harm, but at a cost. The GM chooses one:",
										listRefs: [
											"gmoptions"
										]
									},
									failure: {
										result: "Your attack doesn't go as anticipated. You might be subjected to bad luck, miss your target, or pay a high price for your assault. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence,
								range: [
									"room"
								],
								harm: 2
							}
						},
						{
							name: "Precision Attack",
							type: K4ItemType.attack,
							img: "systems/kult4th/assets/icons/advantage/weapon-master-(melee).svg",
							data: {
								lists: {
									gmoptions: {
										name: "GM Options",
										items: [
											"You're subjected to a counterattack.",
											"You do less damage than intended.",
											"You lose something important.",
											"You expend all your ammo.",
											"You're beset by a new threat.",
											"You'll be in trouble later on."
										]
									}
								},
								sourceItem: {
									name: "Weapon Master (Melee)",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When you engage an able opponent within arm's reach in close combat,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You inflict 2 Harm to your opponent(s) and avoid counterattacks. This Harm ignores Armor."
									},
									partialSuccess: {
										result: "You inflict 2 Harm, ignoring armor, but at a cost. The GM chooses one:",
										listRefs: [
											"gmoptions"
										]
									},
									failure: {
										result: "Your attack doesn't go as anticipated. You might be subjected to bad luck, miss your target, or pay a high price for your assault. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence,
								range: [
									"arm"
								],
								harm: 2
							}
						},
						{
							name: "Tripping Attack",
							type: K4ItemType.attack,
							img: "systems/kult4th/assets/icons/advantage/weapon-master-(melee).svg",
							data: {
								lists: {
									gmoptions: {
										name: "GM Options",
										items: [
											"You're subjected to a counterattack.",
											"You do less damage than intended.",
											"You lose something important.",
											"You expend all your ammo.",
											"You're beset by a new threat.",
											"You'll be in trouble later on."
										]
									}
								},
								sourceItem: {
									name: "Weapon Master (Melee)",
									type: K4ItemType.advantage
								},
								isCustom: false,
								rules: {
									trigger: "When you engage an able opponent within arm's reach in close combat,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You inflict 2 Harm to your opponent, who falls prone."
									},
									partialSuccess: {
										result: "You inflict 2 Harm to your opponent, intending to knock them prone, but at a cost. The GM chooses one:",
										listRefs: [
											"gmoptions"
										]
									},
									failure: {
										result: "Your attack doesn't go as anticipated. You might be subjected to bad luck, miss your target, or pay a high price for your assault. The GM makes a Move."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.violence,
								range: [
									"arm"
								],
								harm: 2
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are a master of armed melee combat.%n%When you Engage in Combat in close quarters, with or without a weapon, roll +Coolness instead of +Violence, and add the following to your available attacks: %list:inline-attacks%"
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			}
		}
	},
	[K4ItemType.disadvantage]: {
		[K4ItemSubType.activeRolled]: {
			"Bad Reputation": {
				name: "Bad Reputation",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/bad-reputation.svg",
				data: {
					subItems: [
						{
							name: "Check: Bad Reputation",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/bad-reputation.svg",
							data: {
								sourceItem: {
									name: "Bad Reputation",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first game session and whenever you attract the public's attention,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to make a Move representing how your bad reputation sticks to you. For example, people might react with fear and suspicion towards you, a lynch mob forms to bring you to justice, your property is vandalized, your allies turn against you, and you can lose your job, agreements, and relationships."
								},
								results: {
									completeSuccess: {
										result: "You blend in. Nobody is out to get you."
									},
									partialSuccess: {
										result: "You have been recognized. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "Several people have recognized you. Anger and fear control their actions. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "For some reason, you have attracted the public's disapproval—even animosity. Perhaps you've been spotlighted in the tabloids as a pedophile or murderer, falsely or otherwise.",
						holdText: "The GM can spend Hold to make a Move representing how your bad reputation sticks to you. For example, people might react with fear and suspicion towards you, a lynch mob forms to bring you to justice, your property is vandalized, your allies turn against you, and you can lose your job, agreements, and relationships."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Competitor": {
				name: "Competitor",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/competitor.svg",
				data: {
					subItems: [
						{
							name: "Check: Competitor",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/competitor.svg",
							data: {
								sourceItem: {
									name: "Competitor",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you neglect to protect your interests or are distracted elsewhere,",
									outro: "roll +%data.attribute% to see if your competitor managed to damage your business.",
									holdText: "The GM can spend Hold to make Moves for your competitor. For example, your competitor may take control of some of your business dealings, learn one of your secrets, sabotages one of your assets, or harms or buys off someone you care for and trust."
								},
								results: {
									completeSuccess: {
										result: "You are safe from your competitor, for the moment."
									},
									partialSuccess: {
										result: "You have been careless. Your competitor may strike against you. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "You hand your competitor a golden opportunity, and they move against your interests. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have a competitor in the criminal underworld, whose business niche is similar to yours.",
						holdText: "The GM can spend Hold to make Moves for your competitor. For example, your competitor may take control of some of your business dealings, learn one of your secrets, sabotages one of your assets, or harms or buys off someone you care for and trust."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Condemned": {
				name: "Condemned",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/condemned.svg",
				data: {
					subItems: [
						{
							name: "Check: Condemned",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/condemned.svg",
							data: {
								lists: {
									gmoptions: {
										name: "GM Options",
										items: [
											"You mark 1 Time.",
											"You're tortured by dreams or visions of your fate. Reduce Stability (−2).",
											"You're haunted by the entity or event that sealed your fate.",
											"Someone in your vicinity is negatively affected by your fate.",
											"Something provides you with false hope of escaping your fate."
										]
									}
								},
								sourceItem: {
									name: "Condemned",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "At the start of every game session,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You still have some time remaining."
									},
									partialSuccess: {
										result: "Your fate approaches. The GM chooses one option:",
										listRefs: [
											"gmoptions"
										]
									},
									failure: {
										result: "Your end approaches. The GM chooses two options, and may choose the same option twice:",
										listRefs: [
											"gmoptions"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "Your fate has already been sealed. Perhaps you're dying from a disease, been promised as the sacrificial offering to a forgotten god, or you've sold your soul to some entity, waiting to drag you off to hell when your time is up. When you finally run out of Time, you meet your ultimate fate.",
						effectFunctions: [
							">CreateTracker:Time,10"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Cursed": {
				name: "Cursed",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/cursed.svg",
				data: {
					subItems: [
						{
							name: "Check: Cursed",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/cursed.svg",
							data: {
								sourceItem: {
									name: "Cursed",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first session and whenever you're confronted by the supernatural,",
									outro: "roll +%data.attribute% to see how strongly the curse influences you.",
									holdText: "The GM can spend Hold to make a Move for the curse. For example, you or someone you care about have an accident, something of yours is taken from you, you experience terrifying visions, or you're forced to take certain actions with risk of dire consequences, if you refuse."
								},
								results: {
									completeSuccess: {
										result: "You temporarily avoid the curse's influence."
									},
									partialSuccess: {
										result: "The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are cursed.",
						holdText: "The GM can spend Hold to make a Move for the curse. For example, you or someone you care about have an accident, something of yours is taken from you, you experience terrifying visions, or you're forced to take certain actions with risk of dire consequences, if you refuse."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Depression": {
				name: "Depression",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/depression.svg",
				data: {
					subItems: [
						{
							name: "Check: Depression",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/depression.svg",
							data: {
								sourceItem: {
									name: "Depression",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever facing personal setbacks,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You remain in control."
									},
									partialSuccess: {
										result: "You experience temporary anxiety, decreased self-confidence, or lack of will. You take −1 to your next roll."
									},
									failure: {
										result: "You succumb to the sense of hopelessness or blame and punish yourself; reduce Stability (−2). Your lethargy and self-destructive urges do not go away until you numb your depression with medicine, drugs, or alcohol."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are constantly struggling with depression, which is only worsened by dejection and discouragement."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Drug Addict": {
				name: "Drug Addict",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/drug-addict.svg",
				data: {
					subItems: [
						{
							name: "Check: Drug Addict",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/drug-addict.svg",
							data: {
								sourceItem: {
									name: "Drug Addict",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first game session and whenever you have been using, or have the opportunity to use,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to make a Move for your addiction. For example, you cannot resist using the drug, run out of drugs, become indebted to a dangerous person, put yourself in danger while under the influence of drugs, or ruin something important to you—like a relationship—while under the influence."
								},
								results: {
									completeSuccess: {
										result: "You are in control of the urge, for now."
									},
									partialSuccess: {
										result: "The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are addicted to hard drugs; name at least one when you gain this Disadvantage.",
						holdText: "The GM can spend Hold to make a Move for your addiction. For example, you cannot resist using the drug, run out of drugs, become indebted to a dangerous person, put yourself in danger while under the influence of drugs, or ruin something important to you—like a relationship—while under the influence."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Experiment Gone Wrong": {
				name: "Experiment Gone Wrong",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/experiment-gone-wrong.svg",
				data: {
					subItems: [
						{
							name: "Check: Experiment Gone Wrong",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/experiment-gone-wrong.svg",
							data: {
								sourceItem: {
									name: "Experiment Gone Wrong",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first session and whenever things seem in control,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to make Moves on the experiment's behalf. For example, the experiment gives you a lead on the Truth, sabotages or otherwise disrupts your research, demands something from you under threat of retribution, or kidnaps someone you care for—possibly returning them dead or transformed."
								},
								results: {
									completeSuccess: {
										result: "Your experiment leaves you alone."
									},
									partialSuccess: {
										result: "Your experiment is close on your heels. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "Your experiment is in your vicinity and acts against you. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have carried out a scientific experiment, which went horribly awry. The experiment gave rise to something unnatural, which escaped and disappeared without a trace. Recently, the 'results' of your experiment tracked you down, reappearing in your life, and forcing you to either escape or confront it.",
						holdText: "The GM can spend Hold to make Moves on the experiment's behalf. For example, the experiment gives you a lead on the Truth, sabotages or otherwise disrupts your research, demands something from you under threat of retribution, or kidnaps someone you care for—possibly returning them dead or transformed."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Fanatic": {
				name: "Fanatic",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/fanatic.svg",
				data: {
					subItems: [
						{
							name: "Check: Fanatic",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/fanatic.svg",
							data: {
								sourceItem: {
									name: "Fanatic",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever someone questions your ideology,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You can keep your emotions in check."
									},
									partialSuccess: {
										result: "You become angry, confused, or frustrated. You take −1 to your next roll."
									},
									failure: {
										result: "You are forced to choose between taking steps to changing the person or situation to adhere to your ideology, or reduce Stability (−2)."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are a fervent adherent of an ideology, which you must define when you take this Disadvantage. You interpret the whole world in accordance with your ideology, which must not be questioned."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Greedy": {
				name: "Greedy",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/greedy.svg",
				data: {
					subItems: [
						{
							name: "Check: Greedy",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/greedy.svg",
							data: {
								sourceItem: {
									name: "Greedy",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "When an opportunity to increase your wealth arises,",
									outro: "roll +%data.attribute% to see if you are in control of your desire."
								},
								results: {
									completeSuccess: {
										result: "You keep your greed in check."
									},
									partialSuccess: {
										result: "The black void inside shrieks for more. As long as the opportunity exists and you do not take it, you suffer −1 ongoing to any rolls you make."
									},
									failure: {
										result: "You must take advantage of every opportunity to further your wealth, or reduce Stability (−2)."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are driven by an unquenchable desire for money and wealth, and are prepared to sacrifice your health, family, and friends to fill the emptiness inside."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Guilt": {
				name: "Guilt",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/guilt.svg",
				data: {
					subItems: [
						{
							name: "Check: Guilt",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/guilt.svg",
							data: {
								sourceItem: {
									name: "Guilt",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first game session and whenever everything appears okay,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to make Moves for your guilt. For example, relatives of the people you've hurt seek you out, demons and other creatures are attracted by your guilt, the dead haunt you with nightmares or visions, or you fall victim to anxiety and self-doubt."
								},
								results: {
									completeSuccess: {
										result: "Your guilt isn't on your mind at the moment."
									},
									partialSuccess: {
										result: "You are reminded of your guilt. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "Your guilt catches up to you. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You carry heavy guilt for your past sins, having harmed one or several people through your actions or inaction.",
						holdText: "The GM can spend Hold to make Moves for your guilt. For example, relatives of the people you've hurt seek you out, demons and other creatures are attracted by your guilt, the dead haunt you with nightmares or visions, or you fall victim to anxiety and self-doubt."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Harassed": {
				name: "Harassed",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/harassed.svg",
				data: {
					subItems: [
						{
							name: "Check: Harassed",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/harassed.svg",
							data: {
								sourceItem: {
									name: "Harassed",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first game session and whenever you draw attention to yourself,",
									outro: "roll +%data.attribute% to see if you're harassed.",
									holdText: "The GM can spend Hold to make Moves for the harassers. For example, someone destroys your property or possessions, you are bullied and attacked by people with a prejudice against you, the authorities forcefully take something from you (rights, property, assets), someone you care about is harmed for associating with you, or you are denied your basic rights due to your identity."
								},
								results: {
									completeSuccess: {
										result: "You've managed to keep clear of harassment."
									},
									partialSuccess: {
										result: "The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "For some reason, personal or otherwise, people tend to harass you; the authorities in particular.",
						holdText: "The GM can spend Hold to make Moves for the harassers. For example, someone destroys your property or possessions, you are bullied and attacked by people with a prejudice against you, the authorities forcefully take something from you (rights, property, assets), someone you care about is harmed for associating with you, or you are denied your basic rights due to your identity."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Haunted": {
				name: "Haunted",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/haunted.svg",
				data: {
					subItems: [
						{
							name: "Check: Haunted",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/haunted.svg",
							data: {
								sourceItem: {
									name: "Haunted",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first session and whenever you are distracted or weakened,",
									outro: "roll +%data.attribute% to see if the entity gains power over you.",
									holdText: "The GM can spend Hold to make a Move for the entity. For example, it requests a service from you and threatens retribution if you refuse, the entity possesses your body for the night, or the entity reveals a clue of what it is and what it wants from you."
								},
								results: {
									completeSuccess: {
										result: "The entity leaves you alone."
									},
									partialSuccess: {
										result: "The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are haunted by supernatural forces. With the GM's assistance, determine the nature of what you believe is haunting you.",
						holdText: "The GM can spend Hold to make a Move for the entity. For example, it requests a service from you and threatens retribution if you refuse, the entity possesses your body for the night, or the entity reveals a clue of what it is and what it wants from you."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Infirm": {
				name: "Infirm",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/infirm.svg",
				data: {
					subItems: [
						{
							name: "Check: Infirm",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/infirm.svg",
							data: {
								sourceItem: {
									name: "Infirm",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you are subjected to major physical or psychological stress,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "Your condition is under control."
									},
									partialSuccess: {
										result: "Your condition triggers, causing pain and daze (−1 to all rolls until the scene ends)."
									},
									failure: {
										result: "Your condition is aggravated with life threatening results (Endure Injury with 2 Harm)."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You suffer from a dangerous physical disease or condition, such as heart disease, hypertension, morbid obesity, or serious gastric ulcer."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Involuntary Medium": {
				name: "Involuntary Medium",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/involuntary-medium.svg",
				data: {
					subItems: [
						{
							name: "Check: Involuntary Medium",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/involuntary-medium.svg",
							data: {
								sourceItem: {
									name: "Involuntary Medium",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you encounter spiritual entities or haunted places,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to make Moves for the being possessing you. For example, the entity may give you a vision, make use of your body, communicate with or through you, try to harm someone else through you, follow you unseen, demand something from you, or drag you into another dimension."
								},
								results: {
									completeSuccess: {
										result: "You resist the possession."
									},
									partialSuccess: {
										result: "The entity gains influence over you. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "The entity gains control over you. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are an open vessel for any spirits or demonic entities who desire a medium to speak through or need a corporeal body to use for their purposes.",
						holdText: "The GM can spend Hold to make Moves for the being possessing you. For example, the entity may give you a vision, make use of your body, communicate with or through you, try to harm someone else through you, follow you unseen, demand something from you, or drag you into another dimension."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Jealousy": {
				name: "Jealousy",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/jealousy.svg",
				data: {
					subItems: [
						{
							name: "Check: Jealousy",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/jealousy.svg",
							data: {
								sourceItem: {
									name: "Jealousy",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you encounter the subject of your jealousy or their life's trappings (possessions, family, friends, etc),",
									outro: "roll +%data.attribute% to see if you can keep your cool."
								},
								results: {
									completeSuccess: {
										result: "You maintain control over your jealousy."
									},
									partialSuccess: {
										result: "You're afflicted by jealousy and take −1 ongoing for as long as you remain in the subject's vicinity, and you do not suppress your jealous desires."
									},
									failure: {
										result: "Your jealousy takes hold of you. You must Keep It Together to refrain from harming, destroying, or stealing from the subject of your jealousy."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "There is someone who has the life you want to have, and you would do anything to possess it."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Liar": {
				name: "Liar",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/liar.svg",
				data: {
					subItems: [
						{
							name: "Check: Liar",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/liar.svg",
							data: {
								sourceItem: {
									name: "Liar",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "At the start of every session,",
									outro: "roll +%data.attribute% to see what trouble your lies have gotten you into this time.",
									holdText: "The GM can spend Hold whenever a PC encounters someone they know to ask, \"What have you lied about to this person?\" or to invent a troublesome lie the PC has told in the past."
								},
								results: {
									completeSuccess: {
										result: "You have kept your lies tangle-free."
									},
									partialSuccess: {
										result: "You've told one too many lies. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "Your web of lies has come completely unraveled. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You're a compulsive liar, who invents stories at every opportunity, especially when it's beneficial for you.",
						holdText: "The GM can spend Hold whenever a PC encounters someone they know to ask, \"What have you lied about to this person?\" or to invent a troublesome lie the PC has told in the past."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Lost Identity": {
				name: "Lost Identity",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/lost-identity.svg",
				data: {
					subItems: [
						{
							name: "Check: Lost Identity",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/lost-identity.svg",
							data: {
								sourceItem: {
									name: "Lost Identity",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first game session and whenever you encounter something from your repressed past,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to make Moves for your true identity. For example, you recognize unknown people or places, organizations or individuals from your past life get in touch with you, your old identity influences your thought patterns or actions, or you suffer traumatic flashbacks."
								},
								results: {
									completeSuccess: {
										result: "You repress your true identity, remaining in the present."
									},
									partialSuccess: {
										result: "Your true identity is catching up to you. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "Your true identity resurfaces. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "Your true identity has been lost to a military or private-run secret agent program. You do not remember anything about your pre-employment life. Recently, memories of your true identity have started coming back to you.",
						holdText: "The GM can spend Hold to make Moves for your true identity. For example, you recognize unknown people or places, organizations or individuals from your past life get in touch with you, your old identity influences your thought patterns or actions, or you suffer traumatic flashbacks."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Marked": {
				name: "Marked",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/marked.svg",
				data: {
					subItems: [
						{
							name: "Check: Marked",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/marked.svg",
							data: {
								sourceItem: {
									name: "Marked",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you consciously Harm someone,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to make Moves for the darkness living inside of you. For example, the darkness feeds on your life energy to sustain itself, forces you to commit murder in order to replenish its life energy, takes charge of your body and leaves you with only memory fragments of what transpired, forces you to harm someone in your vicinity, or temporarily transforms your body into something inhuman. You may have to Keep It Together to resist the darkness' influence."
								},
								results: {
									completeSuccess: {
										result: "You are still in control."
									},
									partialSuccess: {
										result: "You feed the darkness. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "The darkness gains power over you. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are marked by the darkness. The mark can take the shape of a full-body tattoo, a demonic body part such as a vestigial arm, an extra eye or mouth, machine parts integrated with your flesh, or similar manifestations.",
						holdText: "The GM can spend Hold to make Moves for the darkness living inside of you. For example, the darkness feeds on your life energy to sustain itself, forces you to commit murder in order to replenish its life energy, takes charge of your body and leaves you with only memory fragments of what transpired, forces you to harm someone in your vicinity, or temporarily transforms your body into something inhuman. You may have to Keep It Together to resist the darkness' influence."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Mental Compulsion": {
				name: "Mental Compulsion",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/mental-compulsion.svg",
				data: {
					lists: {
						options: {
							name: "Options",
							items: [
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
					subItems: [
						{
							name: "Check: Mental Compulsion",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/mental-compulsion.svg",
							data: {
								lists: {
									options: {
										name: "Options",
										items: [
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
								sourceItem: {
									name: "Mental Compulsion",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In situations where you could be distracted by your compulsion,",
									outro: "roll +%data.attribute%.",
									listRefs: [
										"options"
									]
								},
								results: {
									completeSuccess: {
										result: "You control your compulsions and can focus on other things."
									},
									partialSuccess: {
										result: "You become distracted and take −1 ongoing to all rolls until you have removed yourself from the situation or succumbed to your compulsion, taking any actions it demands of you."
									},
									failure: {
										result: "You become completely obsessed with your compulsion. If you focus on anything else, reduce Stability (−2)."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are fixated on a particular idea or action, to the point of it strongly impacting your life. Choose a compulsion when you take this Disadvantage:",
						listRefs: [
							"options"
						]
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Nemesis": {
				name: "Nemesis",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/nemesis.svg",
				data: {
					subItems: [
						{
							name: "Check: Nemesis",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/nemesis.svg",
							data: {
								sourceItem: {
									name: "Nemesis",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first game session and whenever you let your guard down,",
									outro: "roll +%data.attribute% to see if your nemesis moves against you.",
									holdText: "The GM can spend Hold to make Moves on behalf of your nemesis. For example, your nemesis may strike when you're alone, use secrets they've uncovered to extort you, intimidate you, hire henchmen to capture you, or attack someone or something you hold dear."
								},
								results: {
									completeSuccess: {
										result: "You are safe from your nemesis for the moment."
									},
									partialSuccess: {
										result: "You have been careless and your nemesis moves against you. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "You have compromised your position and your nemesis strikes against you in full force. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "Through some terrible act you have made an enemy, who does everything in their power to take revenge. Decide who your nemesis is and what you have done to earn their vengeance.",
						holdText: "The GM can spend Hold to make Moves on behalf of your nemesis. For example, your nemesis may strike when you're alone, use secrets they've uncovered to extort you, intimidate you, hire henchmen to capture you, or attack someone or something you hold dear."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Nightmares": {
				name: "Nightmares",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/nightmares.svg",
				data: {
					subItems: [
						{
							name: "Check: Nightmares",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/nightmares.svg",
							data: {
								sourceItem: {
									name: "Nightmares",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "During any scene when you sleep,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You sleep in peace."
									},
									partialSuccess: {
										result: "The nightmares torment you. The GM may make a Move for your nightmares. For example, you are unable to sleep at all during the night (−1 ongoing until you sleep), something follows you back into reality, the nightmares provide you insight into the Truth, or you are forced to process some trauma (Keep It Together) when you wake up."
									},
									failure: {
										result: "The nightmares take over completely. You are trapped in the dream until you find a way to wake up, and everything that happens there also directly affects your sleeping body."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You suffer from recurring nightmares, probably connected to your Dark Secrets."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Oath of Revenge": {
				name: "Oath of Revenge",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/oath-of-revenge.svg",
				data: {
					subItems: [
						{
							name: "Check: Oath of Revenge",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/oath-of-revenge.svg",
							data: {
								sourceItem: {
									name: "Oath of Revenge",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever the target of your vengeance (or someone/something associated with them) appears,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You remain in control of your vengeful nature and can act rationally."
									},
									partialSuccess: {
										result: "You can't focus on anything, other than the target of your vengeance. Take −1 ongoing until the target's involvement in the scene ends."
									},
									failure: {
										result: "You become obsessed and can act only to further your revenge. Doing anything else requires you roll Keep It Together. Your obsession cannot be assuaged while the target remains in the same scene with you."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have sworn to avenge an unforgivable injustice. Decide who is the subject of your vengeance and what they have done to you. It could be a single individual, people who share a certain trait, or members of an organization."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Object of Desire": {
				name: "Object of Desire",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/object-of-desire.svg",
				data: {
					subItems: [
						{
							name: "Check: Object of Desire",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/object-of-desire.svg",
							data: {
								sourceItem: {
									name: "Object of Desire",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "At the first game session and whenever you meet one or more new people,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to ignite a person's desires, influencing their behavior. For example, someone can be afflicted with an uncontrollable passion for you, attempt to force themselves on you, strongly proposition you, become intensely jealous of you, or harm themselves or someone else because of their desire of you."
								},
								results: {
									completeSuccess: {
										result: "The desire is not awakened at this moment."
									},
									partialSuccess: {
										result: "Someone becomes desirous of you. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "A strong desire is awakened in one or several people. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "There is just something special about you. You ignite deep unhealthy desires in others, which they are unable to keep in check.",
						holdText: "The GM can spend Hold to ignite a person's desires, influencing their behavior. For example, someone can be afflicted with an uncontrollable passion for you, attempt to force themselves on you, strongly proposition you, become intensely jealous of you, or harm themselves or someone else because of their desire of you."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Obsession": {
				name: "Obsession",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/obsession.svg",
				data: {
					subItems: [
						{
							name: "Check: Obsession",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/obsession.svg",
							data: {
								sourceItem: {
									name: "Obsession",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "At the first game session and whenever you encounter something associated with your obsession,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to let your obsession creep into your daily life. You may be forced to choose between either engaging in your obsession or losing Stability. You may forget about important tasks and chores, miss meetings, or neglect your interpersonal relationships to solely focus on your obsession. Your obsession may even influence your dreams, giving you visions and revelations. In turn, the object of your obsession may also take note of you and try to stop your investigations."
								},
								results: {
									completeSuccess: {
										result: "You overcome your obsession for the moment."
									},
									partialSuccess: {
										result: "Your obsession influences your behavior. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "Your obsession takes over completely. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have discovered a conspiracy or supernatural phenomenon, and you can't stop yourself from getting to the bottom of it.",
						holdText: "The GM can spend Hold to let your obsession creep into your daily life. You may be forced to choose between either engaging in your obsession or losing Stability. You may forget about important tasks and chores, miss meetings, or neglect your interpersonal relationships to solely focus on your obsession. Your obsession may even influence your dreams, giving you visions and revelations. In turn, the object of your obsession may also take note of you and try to stop your investigations."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Owned": {
				name: "Owned",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/owned.svg",
				data: {
					subItems: [
						{
							name: "Check: Owned",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/owned.svg",
							data: {
								sourceItem: {
									name: "Owned",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first game session and whenever you draw attention to yourself in public,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to make Moves for your former owner. For example, they appear unexpectedly to convince you to return, send henchmen after you, kidnap or harm someone you care about, directly threaten you, destroy something important to you, try to mutilate you so nobody else would want you, or kill you outright so nobody else can have you."
								},
								results: {
									completeSuccess: {
										result: "For the moment, you are safe."
									},
									partialSuccess: {
										result: "Your former owner picks up your scent. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "Your owner finds you. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You used to be a dangerous person's private property, willingly or not. Since your escape, your former owner has been looking for you. Decide who your former owner is when you take this Disadvantage.",
						holdText: "The GM can spend Hold to make Moves for your former owner. For example, they appear unexpectedly to convince you to return, send henchmen after you, kidnap or harm someone you care about, directly threaten you, destroy something important to you, try to mutilate you so nobody else would want you, or kill you outright so nobody else can have you."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Repressed Memories": {
				name: "Repressed Memories",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/repressed-memories.svg",
				data: {
					subItems: [
						{
							name: "Check: Repressed Memories",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/repressed-memories.svg",
							data: {
								sourceItem: {
									name: "Repressed Memories",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In situations associated with your repressed memories,",
									outro: "roll +%data.attribute% to determine if the memories resurface."
								},
								results: {
									completeSuccess: {
										result: "You continue to suppress the memories."
									},
									partialSuccess: {
										result: "The memories partly resurface, taking the form of flashbacks and/or hallucinations. You must Keep It Together."
									},
									failure: {
										result: "You are overwhelmed by your repressed memories, completely losing yourself to them. The GM makes a hard Move and you reduce Stability (−2)."
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have repressed a particularly unpleasant event from your past, but the memory of it sometimes rises to the surface. It could be a crime or some horrible thing you have done, been subjected to, or witnessed. The GM decides the nature of your repressed memory, usually based on your Dark Secrets."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Rival": {
				name: "Rival",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/rival.svg",
				data: {
					subItems: [
						{
							name: "Check: Rival",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/rival.svg",
							data: {
								sourceItem: {
									name: "Rival",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first game session and whenever you make a mistake or let down your guard,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to make a Move on behalf of your rival. For example, the rival may get an important person on their side, sabotage one of your projects, extort you with evidence damaging to your reputation, or take desperate measures to get rid of you permanently."
								},
								results: {
									completeSuccess: {
										result: "All clear; your rival makes no moves against you."
									},
									partialSuccess: {
										result: "You've given your rival an opportunity. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "You've handed your rival whatever they needed to completely undermine you. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have an ambitious rival, who will do anything to be in your shoes. Choose who your rival is when you take this Disadvantage.",
						holdText: "The GM can spend Hold to make a Move on behalf of your rival. For example, the rival may get an important person on their side, sabotage one of your projects, extort you with evidence damaging to your reputation, or take desperate measures to get rid of you permanently."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Schizophrenia": {
				name: "Schizophrenia",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/schizophrenia.svg",
				data: {
					subItems: [
						{
							name: "Check: Schizophrenia",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/schizophrenia.svg",
							data: {
								sourceItem: {
									name: "Schizophrenia",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first game session and whenever you go through difficult experiences,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to make a Move for your schizophrenia. For example, one of your hallucinations takes on physical form, you view your current surroundings as being hostile to you, you're afflicted by terrifying hallucinations, you're subjected to dark visions (true or false), or someone in your vicinity turns out to not actually be real."
								},
								results: {
									completeSuccess: {
										result: "You maintain control of your insanity."
									},
									partialSuccess: {
										result: "The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "Schizophrenia overtakes you. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You struggle with recurring psychotic episodes and terrifying hallucinations.",
						holdText: "The GM can spend Hold to make a Move for your schizophrenia. For example, one of your hallucinations takes on physical form, you view your current surroundings as being hostile to you, you're afflicted by terrifying hallucinations, you're subjected to dark visions (true or false), or someone in your vicinity turns out to not actually be real."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Sexual Neurosis": {
				name: "Sexual Neurosis",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/sexual-neurosis.svg",
				data: {
					subItems: [
						{
							name: "Check: Sexual Neurosis",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/sexual-neurosis.svg",
							data: {
								lists: {
									gmoptions: {
										name: "GM Options",
										items: [
											"You hurt, or you are hurt by, your sexual partner (physically or psychologically).",
											"The boundaries between dimensions are weakened; an entity from beyond catches the scent of you or your lover.",
											"Your sexual partner becomes obsessed with you and starts stalking you."
										]
									}
								},
								sourceItem: {
									name: "Sexual Neurosis",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you have the opportunity to have consensual sex or take advantage of someone vulnerable to your advances,",
									outro: "roll +%data.attribute%."
								},
								results: {
									completeSuccess: {
										result: "You can control your urges."
									},
									partialSuccess: {
										result: "Choose between having sex with the person or reduce your Stability (−1)."
									},
									failure: {
										result: "You cannot resist having sex with the person and the GM chooses one option:",
										listRefs: [
											"gmoptions"
										]
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "Your sexuality is a destructive, controlling force in your life. You compulsively seek out superficial sexual encounters and are willing to perform degrading acts—or even commit crimes—to satisfy your fantasies."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Stalker": {
				name: "Stalker",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/stalker.svg",
				data: {
					subItems: [
						{
							name: "Check: Stalker",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/stalker.svg",
							data: {
								sourceItem: {
									name: "Stalker",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first game session and whenever you expose your current location,",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to make a Move for your pursuers. For example, a trusted associate has been paid off by them, one of your loved ones or allies disappears, something you are trying to do is undermined by your enemies, or they try to actively hurt you."
								},
								results: {
									completeSuccess: {
										result: "You are safe for now."
									},
									partialSuccess: {
										result: "Your enemies are on to you. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "Your enemies have caught up to you. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are hunted by a faceless enemy. Anyone you meet could be one of their minions—or even the stalker themselves. No one can be trusted. You must constantly change your address and be vigilant at all times to avoid leaving any tracks they can follow.",
						holdText: "The GM can spend Hold to make a Move for your pursuers. For example, a trusted associate has been paid off by them, one of your loved ones or allies disappears, something you are trying to do is undermined by your enemies, or they try to actively hurt you."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Victim of Passion": {
				name: "Victim of Passion",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/victim-of-passion.svg",
				data: {
					subItems: [
						{
							name: "Check: Victim of Passion",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/victim-of-passion.svg",
							data: {
								sourceItem: {
									name: "Victim of Passion",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "In the first game session and whenever you encounter the subject of your passions (or anything resembling it),",
									outro: "roll +%data.attribute%.",
									holdText: "The GM can spend Hold to let your passion steer your actions. For example, you yearn uncontrollably for the subject of your passion—you must seek it out or reduce Stability (−2), your desire drags the subject of your passion into your dreams (perhaps trapping them there), your passion becomes tainted with jealousy and anger—making you want to control and damage it (Keep It Together to resist), your longing leaves you feeble vis-à-vis the objective of this passion (−1 to all rolls while sharing the same scene), or your passion can attract creatures of lust wishing to feed off it or make pacts with you."
								},
								results: {
									completeSuccess: {
										result: "You keep your passion in check."
									},
									partialSuccess: {
										result: "The passion awakens within you. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "You are completely in the passion's grip. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You have an overwhelming passion for someone or something, seeking to possess it at any cost. Define the object of your passions when you take this Disadvantage.",
						holdText: "The GM can spend Hold to let your passion steer your actions. For example, you yearn uncontrollably for the subject of your passion—you must seek it out or reduce Stability (−2), your desire drags the subject of your passion into your dreams (perhaps trapping them there), your passion becomes tainted with jealousy and anger—making you want to control and damage it (Keep It Together to resist), your longing leaves you feeble vis-à-vis the objective of this passion (−1 to all rolls while sharing the same scene), or your passion can attract creatures of lust wishing to feed off it or make pacts with you."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			},
			"Wanted": {
				name: "Wanted",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/wanted.svg",
				data: {
					subItems: [
						{
							name: "Check: Wanted",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/wanted.svg",
							data: {
								sourceItem: {
									name: "Wanted",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you attract attention to yourself or forget to keep your head down,",
									outro: "roll +%data.attribute% to see if you've been discovered.",
									holdText: "The GM can spend Hold to make a Move for the authorities. For example, your mugshot appears on the TV news and in newspapers, law enforcement officers attempt to trap and catch you, or the authorities detain and interrogate someone you care about, confiscate your possessions, or turn your friends/family against you."
								},
								results: {
									completeSuccess: {
										result: "You are safe, for now."
									},
									partialSuccess: {
										result: "You have made a mistake. The GM takes 1 Hold.",
										hold: 1
									},
									failure: {
										result: "All eyes are on you. The GM takes 3 Hold.",
										hold: 3
									}
								},
								subType: K4ItemSubType.activeRolled,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You are wanted by the authorities—local, state, or federal—for crimes you have committed. Determine the nature of the allegations against you when you take this Disadvantage.",
						holdText: "The GM can spend Hold to make a Move for the authorities. For example, your mugshot appears on the TV news and in newspapers, law enforcement officers attempt to trap and catch you, or the authorities detain and interrogate someone you care about, confiscate your possessions, or turn your friends/family against you."
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.zero
				}
			}
		},
		[K4ItemSubType.activeStatic]: {
			Phobia: {
				name: "Phobia",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/phobia.svg",
				data: {
					subItems: [
						{
							name: "Face Fears",
							type: K4ItemType.move,
							img: "systems/kult4th/assets/icons/disadvantage/phobia.svg",
							data: {
								sourceItem: {
									name: "Phobia",
									type: K4ItemType.disadvantage
								},
								isCustom: false,
								rules: {
									trigger: "Whenever you're confronted by the object of your phobia,",
									outro: "you must Keep It Together."
								},
								subType: K4ItemSubType.activeStatic,
								attribute: K4Attribute.zero
							}
						}
					],
					isCustom: false,
					rules: {
						intro: "You harbor an overpowering fear of something. Choose the stimulus that frightens you when you take this Disadvantage."
					},
					subType: K4ItemSubType.activeStatic,
					attribute: K4Attribute.zero
				}
			}
		},
		[K4ItemSubType.passive]: {
			Broken: {
				name: "Broken",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/broken.svg",
				data: {
					notes: "SetTrait:actor/data.stability.max,6",
					isCustom: false,
					rules: {
						intro: "Some experience in your past has broken your psyche so badly you've been unable to recuperate from it.%n%Your Stability can never increase beyond Distressed (6).",
						effectFunctions: [
							"SetTrait:actor/data.stability.max,6"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			},
			Rationalist: {
				name: "Rationalist",
				type: K4ItemType.disadvantage,
				img: "systems/kult4th/assets/icons/disadvantage/rationalist.svg",
				data: {
					lists: {
						gmoptions: {
							name: "GM Options",
							items: [
								"Your presence nurtures the Illusion, making it more powerful and impenetrable.",
								"Your bewildered psyche starts creating mirror images of familiar places and people in the Illusion.",
								"You attract extradimensional entities.",
								"You consciously deny what you see, even to your own detriment."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You refuse to believe in anything not confirmed as fact by modern science, even when it is right in front of you.%n%in addition to the standard effects, the GM may choose one option:",
						listRefs: [
							"gmoptions"
						]
					},
					subType: K4ItemSubType.passive,
					attribute: K4Attribute.zero
				}
			}
		}
	},
	[K4ItemType.move]: {
		[K4ItemSubType.activeRolled]: {
			"Act Under Pressure": {
				name: "Act Under Pressure",
				type: K4ItemType.move,
				img: "systems/kult4th/assets/icons/move/act-under-pressure.svg",
				data: {
					isCustom: false,
					rules: {
						trigger: "When you do something risky, under time pressure, or try to avoid danger,",
						outro: "the GM will explain what the consequences for failure are and you roll +%data.attribute%."
					},
					results: {
						completeSuccess: {
							result: "You do what you intended."
						},
						partialSuccess: {
							result: "You do it, but hesitate, are delayed, or must deal with a complication—the GM reveals an unexpected outcome, a high price, or a difficult choice."
						},
						failure: {
							result: "There are serious consequences, you make a mistake, or you're exposed to the danger. The GM makes a Move."
						}
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.coolness
				}
			},
			"Avoid Harm": {
				name: "Avoid Harm",
				type: K4ItemType.move,
				img: "systems/kult4th/assets/icons/move/avoid-harm.svg",
				data: {
					isCustom: false,
					rules: {
						trigger: "When you dodge, parry, or block Harm,",
						outro: "roll +%data.attribute%."
					},
					results: {
						completeSuccess: {
							result: "You emerge completely unharmed."
						},
						partialSuccess: {
							result: "You avoid the worst of it, but the GM decides if you end up in a bad spot, lose something, or partially sustain Harm."
						},
						failure: {
							result: "You were too slow to react or you made a bad judgment call. Perhaps you didn't avoid any Harm at all, or you ended up in an even worse spot than before. The GM makes a Move."
						}
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reflexes
				}
			},
			"Endure Injury": {
				name: "Endure Injury",
				type: K4ItemType.move,
				img: "systems/kult4th/assets/icons/move/endure-injury.svg",
				data: {
					lists: {
						options: {
							name: "Consequences",
							items: [
								"Are knocked out (the GM may also choose to inflict a Serious Wound).",
								"Receive a Critical Wound, but may continue to act (if you already have a Critical Wound, you may not choose this option again).",
								"Die."
							]
						},
						gmoptions: {
							name: "GM Options",
							items: [
								"The injury throws you off balance.",
								"You lose something.",
								"You receive a Serious Wound."
							]
						}
					},
					isCustom: false,
					rules: {
						trigger: "When enduring an injury,",
						outro: "roll +%data.attribute% +Armor −Harm.",
						effectFunctions: [
							"Add Armor and subtract Harm from Fortitude roll"
						]
					},
					results: {
						completeSuccess: {
							result: "You ride out the pain and keep going."
						},
						partialSuccess: {
							result: "You are still standing, but the GM picks one condition:",
							listRefs: [
								"gmoptions"
							]
						},
						failure: {
							result: "The injury is overwhelming. You choose if you:",
							listRefs: [
								"options"
							]
						}
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.fortitude
				}
			},
			"Engage in Combat": {
				name: "Engage in Combat",
				type: K4ItemType.move,
				img: "systems/kult4th/assets/icons/move/engage-in-combat.svg",
				data: {
					lists: {
						gmoptions: {
							name: "GM Options",
							items: [
								"You're subjected to a counterattack.",
								"You do less damage than intended.",
								"You lose something important.",
								"You expend all your ammo.",
								"You're beset by a new threat.",
								"You'll be in trouble later on."
							]
						}
					},
					isCustom: false,
					rules: {
						trigger: "When you engage an able opponent in combat,",
						outro: "explain how and roll +%data.attribute%."
					},
					results: {
						completeSuccess: {
							result: "You inflict damage to your opponent and avoid counterattacks."
						},
						partialSuccess: {
							result: "You inflict damage, but at a cost. The GM chooses one:",
							listRefs: [
								"gmoptions"
							]
						},
						failure: {
							result: "Your attack doesn't go as anticipated. You might be subjected to bad luck, miss your target, or pay a high price for your assault. The GM makes a Move."
						}
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.violence
				}
			},
			"Help Other": {
				name: "Help Other",
				type: K4ItemType.move,
				img: "systems/kult4th/assets/icons/move/help-other.svg",
				data: {
					isCustom: false,
					rules: {
						trigger: "When you help another player character's Move,",
						outro: "explain how before their roll and roll +Attribute, where the Attribute is the same as the other player is rolling."
					},
					results: {
						completeSuccess: {
							result: "You may modify the subsequent roll by +2."
						},
						partialSuccess: {
							result: "You may modify the subsequent roll by +1."
						},
						failure: {
							result: "Your interference has unintended consequences. The GM makes a Move."
						}
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.ask
				}
			},
			"Hinder Other": {
				name: "Hinder Other",
				type: K4ItemType.move,
				img: "systems/kult4th/assets/icons/move/hinder-other.svg",
				data: {
					isCustom: false,
					rules: {
						trigger: "When you hinder another player character's Move,",
						outro: "explain how before their roll and roll +Attribute, where the Attribute is the same as the other player is rolling."
					},
					results: {
						completeSuccess: {
							result: "You may modify the subsequent roll by −2."
						},
						partialSuccess: {
							result: "You may modify the subsequent roll by −1."
						},
						failure: {
							result: "Your interference has unintended consequences. The GM makes a Move."
						}
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.ask
				}
			},
			"Influence Other NPC": {
				name: "Influence Other NPC",
				type: K4ItemType.move,
				img: "systems/kult4th/assets/icons/move/influence-other-npc.svg",
				data: {
					lists: {
						gmoptions: {
							name: "GM Options",
							items: [
								"She demands better compensation.",
								"Complications will arise at a future time.",
								"She gives in for the moment, but will change her mind and regret it later."
							]
						}
					},
					isCustom: false,
					rules: {
						trigger: "When you influence an NPC through negotiation, argument, or from a position of power,",
						outro: "roll +%data.attribute%."
					},
					results: {
						completeSuccess: {
							result: "She does what you ask."
						},
						partialSuccess: {
							result: "She does what you ask, but the GM chooses one:",
							listRefs: [
								"gmoptions"
							]
						},
						failure: {
							result: "Your attempt has unintended repercussions. The GM makes a Move."
						}
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Influence Other PC": {
				name: "Influence Other PC",
				type: K4ItemType.move,
				img: "systems/kult4th/assets/icons/move/influence-other-pc.svg",
				data: {
					lists: {
						options: {
							name: "Options",
							items: [
								"She's motivated to do what you ask, and recieves +1 for her next roll, if she does it.",
								"She's worried of the consequences if she doesn't do what you ask, and gets −1 Stability if she doesn't do it."
							]
						}
					},
					isCustom: false,
					rules: {
						trigger: "When you influence another PC,",
						outro: "roll +%data.attribute%."
					},
					results: {
						completeSuccess: {
							result: "Both options below.",
							listRefs: [
								"options"
							]
						},
						partialSuccess: {
							result: "Choose one option below.",
							listRefs: [
								"options"
							]
						},
						failure: {
							result: "The character gets +1 on her next roll against you. The GM makes a Move."
						}
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.charisma
				}
			},
			"Investigate": {
				name: "Investigate",
				type: K4ItemType.move,
				img: "systems/kult4th/assets/icons/move/investigate.svg",
				data: {
					lists: {
						questions: {
							name: "Questions",
							items: [
								"How can I find out more about what I'm investigating?",
								"What is my gut feel about what I'm investigating?",
								"Is there anything weird about what I'm investigating?"
							]
						}
					},
					isCustom: false,
					rules: {
						trigger: "When you investigate something,",
						outro: "roll +%data.attribute%."
					},
					results: {
						completeSuccess: {
							result: "You uncover all direct leads, and may additionally ask two questions from the list below.",
							listRefs: [
								"questions"
							]
						},
						partialSuccess: {
							result: "You uncover all direct leads, and may additionally ask one question from the list below. The information comes at a cost, determined by the GM, such as requiring someone or something for the answer, exposing yourself to danger, or needing to expend extra time or resources. Will you do what it takes?.",
							listRefs: [
								"questions"
							]
						},
						failure: {
							result: "You may get some information anyway, but you pay a price for it. You may expose yourself to dangers or costs. The GM makes a Move."
						}
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.reason
				}
			},
			"Keep It Together": {
				name: "Keep It Together",
				type: K4ItemType.move,
				img: "systems/kult4th/assets/icons/move/keep-it-together.svg",
				data: {
					lists: {
						options: {
							name: "Options",
							items: [
								"You become angry (−1 Stability).",
								"You become sad (−1 Stability).",
								"You become scared (−1 Stability).",
								"You become guilt-ridden (−1 Stability).",
								"You become obsessed (+1 Relation to whatever caused the condition).",
								"You become distracted (−2 in situations where the condition limits you).",
								"You will be haunted by the experience at a later time."
							]
						},
						gmoptions: {
							name: "GM Options",
							items: [
								"You cower powerless in the threat's presence.",
								"You panic with no control of your actions.",
								"You suffer emotional trauma (−2 Stability).",
								"You suffer life-changing trauma (−4 Stability)."
							]
						}
					},
					isCustom: false,
					rules: {
						trigger: "When you exercise self-control to keep from succumbing to stress, traumatic experiences, psychic influence, or supernatural forces,",
						outro: "roll +%data.attribute%."
					},
					results: {
						completeSuccess: {
							result: "You grit your teeth and stay the course."
						},
						partialSuccess: {
							result: "The effort to resist instills a condition, which remains with you until you have had time to recuperate. You get −1 in situations where this condition would be a hindrance to you. Choose one:",
							listRefs: [
								"options"
							]
						},
						failure: {
							result: "The strain is too much for your mind to handle. The GM chooses your reaction:",
							listRefs: [
								"gmoptions"
							]
						}
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.willpower
				}
			},
			"Observe a Situation": {
				name: "Observe a Situation",
				type: K4ItemType.move,
				img: "systems/kult4th/assets/icons/move/observe-a-situation.svg",
				data: {
					lists: {
						questions: {
							name: "Questions",
							items: [
								"What is my best way through this?",
								"What currently poses the biggest threat?",
								"What can I use to my advantage?",
								"What should I be on the lookout for?",
								"What is being hidden from me?",
								"What seems strange about this?"
							]
						}
					},
					isCustom: false,
					rules: {
						trigger: "When you observe a situation,",
						outro: "roll +%data.attribute%."
					},
					results: {
						completeSuccess: {
							result: "Ask two questions from the list below. When you act on these answers, gain +1 to your rolls.",
							listRefs: [
								"questions"
							]
						},
						partialSuccess: {
							result: "Ask one question from the list below. When you act on the answer, gain +1 to your rolls.",
							listRefs: [
								"questions"
							]
						},
						failure: {
							result: "Ask one question from the list below, but you get no bonus for it and miss something, attract unwanted attention or expose yourself to danger. The GM makes a Move.",
							listRefs: [
								"questions"
							]
						}
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.perception
				}
			},
			"Read a Person": {
				name: "Read a Person",
				type: K4ItemType.move,
				img: "systems/kult4th/assets/icons/move/read-a-person.svg",
				data: {
					lists: {
						questions: {
							name: "Questions",
							items: [
								"Are you lying?",
								"How do you feel right now?",
								"What are you about to do?",
								"What do you wish I would do?",
								"How could I get you to […]?"
							]
						}
					},
					isCustom: false,
					rules: {
						trigger: "When you read a person,",
						outro: "roll +%data.attribute%."
					},
					results: {
						completeSuccess: {
							result: "Ask two questions from the list below any time you are in conversation with the subject of your scrutiny during this scene.",
							listRefs: [
								"questions"
							]
						},
						partialSuccess: {
							result: "Ask one question from the list below any time you are in conversation with the subject of your scrutiny during this scene.",
							listRefs: [
								"questions"
							]
						},
						failure: {
							result: "You accidentally reveal your own intentions to the person you're trying to read. Tell the GM/player what these intentions are. The GM makes a Move."
						}
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.intuition
				}
			},
			"See Through the Illusion": {
				name: "See Through the Illusion",
				type: K4ItemType.move,
				img: "systems/kult4th/assets/icons/move/see-through-the-illusion.svg",
				data: {
					lists: {
						gmoptions: {
							name: "GM Options",
							items: [
								"Something senses you.",
								"The Illusions tears around you."
							]
						}
					},
					isCustom: false,
					rules: {
						trigger: "When you suffer shock, injuries, or distort your perception through drugs or rituals,",
						outro: "roll +%data.attribute%."
					},
					results: {
						completeSuccess: {
							result: "You perceive things as they truly are."
						},
						partialSuccess: {
							result: "You see Reality, but you also affect the Illusion. The GM chooses one:",
							listRefs: [
								"gmoptions"
							]
						},
						failure: {
							result: "The GM explains what you see. The GM makes a Move."
						}
					},
					subType: K4ItemSubType.activeRolled,
					attribute: K4Attribute.soul
				}
			}
		}
	},
	[K4ItemType.darksecret]: {
		[K4ItemSubType.passive]: {
			"Chosen One": {
				name: "Chosen One",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/chosen-one.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Avoid your pursuers.",
								"Fight the cult and/or their god.",
								"Fulfill your god's desire.",
								"Expand the cult's membership.",
								"Find out the truth about your destiny."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You have been chosen by a god to become its advocate or sacrificial lamb.",
						outro: "The god's disciples watch over you, waiting for the day of your ascension. You may have grown up in their cult, or were discovered by them well into your adulthood. Whichever the case, you're sure the cult has terrible plans for you. You've tried escaping from these disciples, but they always end up finding you again.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Curse": {
				name: "Curse",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/curse.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Find out what the curse is.",
								"Discover how to break the curse.",
								"Transfer the curse to someone else.",
								"Find some way to accept your fate.",
								"Take revenge on the person responsible for the curse."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You are afflicted by a curse, knowingly or not.",
						outro: "The curse has started influencing your life and you must find a way to get rid of it. The curse may have been inherited or brought upon yourself through your own actions. Its effects are starting to make you lose your grasp on reality and threaten to harm those closest to you.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Family Secret": {
				name: "Family Secret",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/family-secret.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Keep the secret.",
								"Avoid your family.",
								"Confront your family.",
								"Help your family.",
								"Find out the entire truth."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "Your family has a well-kept secret, which has haunted you for your entire life.",
						outro: "They may have been members of an obscure sect or exposed to some dreadful horror. You may have been initiated into this secret as a child, or only recently found out the truth as an adult. This secret keeps you on edge and threatens to destroy your life. You likely have to take action to save yourself and your family.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Forbidden Knowledge": {
				name: "Forbidden Knowledge",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/forbidden-knowledge.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Reveal the Truth to the world.",
								"Acquire power or knowledge.",
								"Explore the forbidden truth.",
								"Fight the enemy.",
								"Escape your pursuers."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You have uncovered some horrid truth, which brings reality's very nature into question.",
						outro: "It might be unlocking some way to move between dimensions, exposing the mayor's true demonic visage, finding proof that history has been rewritten, or discovering that the world as we know it is actually an illusion. The Illusion's keepers are now after you and it is only a matter of time before they find you.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Guardian": {
				name: "Guardian",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/guardian.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Keep what you are guarding safe.",
								"Find out more about the previous guardians and what you are protecting.",
								"Pass the guardianship over to a worthy individual.",
								"Fulfill your purpose."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You have been chosen to protect an important object, place, or person.",
						outro: "This sacred duty could have been inherited, assigned to you specifically, or granted to you at your own request. What you are protecting may be intended for accomplishing some great task in the future, or you may be safeguarding it to ensure it doesn't fall into the wrong hands.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Guilty of Crime": {
				name: "Guilty of Crime",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/guilty-of-crime.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Avoid justice.",
								"Confront the victim or their relatives.",
								"Punish yourself.",
								"Help other people.",
								"Bring the other perpetrators to justice—be it of the legal or personal variety.",
								"Take revenge on those who made you commit the crime."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You feel constant remorse for a crime you have committed.",
						outro: "Regardless if you committed the crime on your own initiative or because you were coerced by others, you feel you are solely to blame. The victim, their relatives, and/or the police are probably looking for you.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Heir": {
				name: "Heir",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/heir.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Discover the truth about your inheritance.",
								"Protect your inheritance.",
								"Investigate what happened to its previous owner.",
								"Confront those who seek to acquire your inheritance."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You have been granted a unique inheritance from relatives or friends.",
						outro: "It could be a small object or something more substantial, such as a house. The inheritance has instilled an unnatural obsession within you. You know it hides secrets and perhaps unknown forces. Might it reveal what happened to its previous owner? Others want to possess your inheritance also, and you suspect they will stop at nothing to acquire it.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Mental Illness": {
				name: "Mental Illness",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/mental-illness.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Explore the Illusion.",
								"Expose the conspiracy.",
								"Take revenge on your doctors and other caregivers.",
								"Find out the truth about your relative.",
								"Find your missing mentally ill relative."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You or one of your close relations suffer from mental illness.",
						outro: "There's a good chance you have seen with your own eyes (or heard from your relative) that reality is simply an illusion. But who would believe a crazy person? Psychiatric institutions hold many secrets and many doctors have hidden motives. For the insane who end up on the streets, disturbed mentors gladly take newcomers under their wing to initiate them in the Truth.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Occult Experience": {
				name: "Occult Experience",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/occult-experience.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Uncover more of the Truth.",
								"Seek atonement for your actions.",
								"Help others realize the Truth.",
								"Seek out more occult knowledge and power.",
								"Fight the demons."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You have witnessed occult proceedings, which changed your view of reality.",
						outro: "You may have participated in arcane rituals, exposed cults serving disturbing entities, or seen things revealing that the world is not what it seems. Your experiences make it difficult for you to accept the Illusion that most others live in.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Pact with Dark Forces": {
				name: "Pact with Dark Forces",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/pact-with-dark-forces.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Find a way to break the pact.",
								"Cheat death.",
								"Slay the being.",
								"Achieve further power or success.",
								"Take revenge on whoever tricked you into the pact."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You have sealed a pact with a powerful entity.",
						outro: "You may have made the pact willingly or been tricked into it. Regardless, you are now under the being's spell. You may have benefited greatly from this pact, but the cost could be your literal soul. Deep inside you understand you must find a way to trick the being into breaking the pact. The question is how?.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Responsible for Medical Experiments": {
				name: "Responsible for Medical Experiments",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/responsible-for-medical-experiments.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Avoid taking responsibility for the experiments.",
								"Seek forgiveness from subjects and/or their relatives.",
								"Gather evidence to expose your former employer.",
								"Conclude interrupted or failed experiments.",
								"Continue researching your findings.",
								"Restore the test subjects to their former selves."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You were responsible for or assisted in shady medical experiments, which ended in horrifying results.",
						outro: "Regardless of whether the subjects were willing or not, the experiments destroyed their lives and they are now dead, missing, or transformed into something inhuman. In addition to your pangs of guilt, you may be pursued by your former test subjects, their relatives, the law, former colleagues, employers, or nameless forces trying to silence you.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Returned from the Other Side": {
				name: "Returned from the Other Side",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/returned-from-the-other-side.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Discover the truth about the event.",
								"Expose what happened to you to the world.",
								"Elude your fate.",
								"Return to the scene.",
								"Find lost relatives or friends."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You experienced an event where the Illusion shattered completely, and you were the only one who returned.",
						outro: "Your apartment block may have slipped into another dimension, its existence wiped from history. An airplane may have disappeared and you were found twenty years later, without memories and having not aged a day. A company of soldiers in Afghanistan may have literally walked into hell and only you returned, covered in your comrades' blood. Deep down you feel you were not meant to have survived, and that something is coming for you to restore balance and order.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Rootless": {
				name: "Rootless",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/rootless.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Find out what is pursuing you.",
								"Find a place where you can stop and breathe.",
								"Escape what is pursuing you.",
								"Find your parents.",
								"Figure out why this is happening."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "Your family always moved around.",
						outro: "Your parents never told you why, but the haunted look in their eyes and hushed conversations hinted that you were running away from something terrifying. They would rouse you in the middle of night, leaving behind everything you owned, simply to escape. Eventually, they even abandoned you. Maybe they're still on the run, or maybe whatever they feared finally caught up with them. The feeling of being followed never truly lets go, and wherever you end up it's not long before you're on the road again. You don't know exactly what would happen if you stopped, but you feel it's something terrible.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Strange Disappearance": {
				name: "Strange Disappearance",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/strange-disappearance.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Figure out whatever became of the missing person.",
								"Finish the investigation they started.",
								"Escape your pursuers.",
								"Bring the guilty to justice.",
								"Reveal the truth to the public."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "Someone close to you disappeared after getting too close to the truth while investigating something.",
						outro: "You have no idea what happened, but someone recently sent you cryptic information, urging you to finish what your colleague started. Since your associate disappeared, you've become the victim of unknown stalkers.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Victim of Crime": {
				name: "Victim of Crime",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/victim-of-crime.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Get revenge on the perpetrator.",
								"Re-experience the crime again (as victim or as perpetrator).",
								"Find out why it happened to you.",
								"Stop similar crimes.",
								"Confront and forgive the perpetrator."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You have endured a terrible crime.",
						outro: "Your whole life is marred by this event and you cannot mentally suppress the violation, no matter how hard you try. Fear, shame, anger, and a sense of helplessness torment you, and in order to survive this trauma, you must find a way to heal your wounds.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Victim of Medical Experiments": {
				name: "Victim of Medical Experiments",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/victim-of-medical-experiments.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Track down those responsible.",
								"Restore yourself to the state you were in before.",
								"Get revenge on the person(s) responsible.",
								"Find a way to accept the person you are now.",
								"Explore other dimensions.",
								"Expose the truth to the world."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You were subjected to medical experiments with unexpected outcomes, with or without your consent and knowledge.",
						outro: "The experiments have had enduring mental and/or physical side effects. They may have shown you windows into alternate dimensions—resulting in madness. The side effects still torment you, and ridding yourself of them requires you to find the responsible parties. It's also possible your parents were the test subjects and you inherited the experimental effects, as a result.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			},
			"Visitations": {
				name: "Visitations",
				type: K4ItemType.darksecret,
				img: "systems/kult4th/assets/icons/darksecret/visitations.svg",
				data: {
					lists: {
						drives: {
							name: "Suggested Drives",
							items: [
								"Figure out why you are haunted in this way.",
								"Help spirits find peace after death.",
								"Fight evil beings.",
								"Help people communicate with the dead.",
								"Escape the entity pursuing you."
							]
						}
					},
					isCustom: false,
					rules: {
						intro: "You have a history of encounters with beings from the other side.",
						outro: "They could be family members or friends tracking you down post-mortem, entities discovered at haunted locations, or inhuman forces taking an interest in you. Regardless of what you do, you can't seem to escape them. Every time you think it's finally over, they reappear in your life—you are never truly free.",
						listRefs: [
							"drives"
						]
					},
					subType: K4ItemSubType.passive
				}
			}
		}
	}
};

export default ITEM_DATA;