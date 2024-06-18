// #region IMPORTS ~
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
// #endregion

// #region TYPES ~
namespace K4ChatMessage {

  export interface ConstructorData extends ChatMessageDataConstructorData { }

}
// #endregion
const GSAPEFFECTS = {
  rollMiddleGear: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const target$ = $(target);
      return U.gsap.timeline()
        .fromTo(target$, {
          filter: `blur(3px) brightness(5) drop-shadow(0px 0px 0px ${C.Colors.dBLACK})`,
          scale: 2
      }, {
          rotation: "+=360",
          filter: `blur(0px) brightness(0.75) drop-shadow(0px 0px 2px ${C.Colors.dGOLD})`,
          scale: 1,
          autoAlpha: 1,
          ease: "power3.out",
          duration: 1
      })
      .to(target$, {
          filter: `blur(0px) brightness(2) drop-shadow(0px 0px 5px ${C.Colors.bGOLD})`,
          scale: 1.25,
          duration: 0.5,
          repeat: 1,
          ease: "power2.in",
          yoyo: true
      })
      .to(target$, {
          rotation:      "-=20",
          duration:      0.4,
          repeatRefresh: true,
          repeatDelay:   1.6,
          ease:          "back.out(5)",
          repeat:        -1
        });
    },
    defaults: {},
    extendTimeline: true
  },
  rollOuterGear: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const target$ = $(target);
      return U.gsap.timeline()
        .fromTo(target$, {
          scale: 5,
          filter: "blur(15px)"
      }, {
          autoAlpha: 0.85,
          scale: 1,
          filter: "blur(1.5px)",
          ease: "power2.inOut",
          duration: 1
      })
      .to(target$, {
          rotation: "+=360",
          repeat: -1,
          duration: 30,
          ease: "none"
      })
    },
    defaults: {},
    extendTimeline: true
  },
  bounceInDice: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const target$ = $(target);
      return U.gsap.timeline()
        .fromTo(target$, {
          transformOrigin: "center center",
          scale: 1.5,
          y: -20,
          filter: "brightness(2) blur(5px)"
        }, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          filter: "brightness(1) blur(0px)",
          ease: "power2.out",
          duration: 1,
          stagger: 0.25
        });
    },
    defaults: {},
    extendTimeline: true
  },
  slideIn: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const target$ = $(target);
      return U.gsap.timeline()
        .fromTo(target$, {
          transformOrigin: "center center",
          skewX: -25,
          scale: 1,
          x: 100,
          autoAlpha: 0,
          filter: "blur(50px)"
      }, {
          autoAlpha: 1,
          skewX: 0,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          ease: "power2.inOut",
          duration: 1
      });
    },
    defaults: {},
    extendTimeline: true
  },
  staggerInResults: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const target$ = $(target);
      return U.gsap.timeline()
        .fromTo(target$, {
          autoAlpha: 0,
          filter: "blur(10px)"
      }, {
          autoAlpha: 1,
          filter: "blur(0px)",
          ease: "power2.out",
          duration: 1,
          stagger: 0.25
      });
    },
    defaults: {},
    extendTimeline: true
  }
}
const ANIMATIONS = {
  rollGearsIn(target: HTMLElement): GSAPAnimation {
    const target$ = $(target);

    const gearContainer$ = target$.find(".roll-total-gear");
    const middleGear$ = gearContainer$.find("[class*='middle-ring']");
    const outerGear$ = gearContainer$.find("[class*='outer-ring']");
    const totalNum$ = target$.find(".roll-total-number");

    const d10s$ = target$.find(".roll-d10");
    const outcome$ = target$.find(".roll-outcome > *");
    const results$ = target$.find(".roll-dice-results ~ div, .roll-dice-results ~ label, .roll-dice-results ~ h2, .roll-dice-results ~ ul li");

    gsap.registerEffect

    // First kill any existing timelines or tweens on animated elements
    U.gsap.killTweensOf([middleGear$, outerGear$, totalNum$]);

    return U.gsap.timeline()
      // Allow overflow visibility for scaling in of animation
      .set(gearContainer$, {overflow: "visible"})

      // Timeline: Middle Gear Component
      .rollMiddleGear(middleGear$)

      // Timeline: Outer Gear Component
      .rollOuterGear(outerGear$, {}, 0)

      // Hide overflow visibility once scaling in nears completion
      .set(gearContainer$, {overflow: "hidden"}, 1.5)

      // Timeline: Dice
      .bounceInDice(d10s$, {}, 0.75)

      // Timeline: Total Number Component
      .slideIn(totalNum$, {}, 1)

      // Timeline: Outcome Component
      .slideIn(outcome$, {}, 1.25)

      // Timeline: Stagger In Results
      .staggerInResults(results$, {}, 1.5);
  }
}
// #region === K4ChatMessage CLASS ===
class K4ChatMessage extends ChatMessage {
  // #region INITIALIZATION ~
  static async GenerateInputPanel(html: JQuery): Promise<void> {
    // Load the template for the chat input control panel
    const template = await getTemplate(U.getTemplatePath("sidebar", "chat-input-control-panel"));
    // Convert the template into a jQuery object
    const buttonHtml = $(template({}));
    // Find the chat form in the rendered HTML
    const chatForm = html.find("#chat-form").attr("data-type", "ic");
    // Append the control panel to the chat form
    chatForm.append(buttonHtml);

    // Add click event listener for the In-Character button
    buttonHtml.find("#ic").on("click", (event: ClickEvent) => {
      event.preventDefault(); // Prevent the default form submission
      ui.notifications.info("Message is In-Character"); // Notify the user
      chatForm.attr("data-type", "ic"); // Set the data-type attribute to "ic"
    });
    // Add click event listener for the Out-of-Character button
    buttonHtml.find("#ooc").on("click", (event: ClickEvent) => {
      event.preventDefault(); // Prevent the default form submission
      ui.notifications.info("Message is Out-of-Character"); // Notify the user
      chatForm.attr("data-type", "ooc"); // Set the data-type attribute to "ooc"
    });
    // Add click event listener for the GM Whisper button
    buttonHtml.find("#gm").on("click", (event: ClickEvent) => {
      event.preventDefault(); // Prevent the default form submission
      ui.notifications.info("Message will be Whispered to the GM"); // Notify the user
      chatForm.attr("data-type", "gm"); // Set the data-type attribute to "gm"
    });
  }

  static RegisterGsapEffects() {
    Object.entries(GSAPEFFECTS).forEach(([name, effect]) => {
      U.gsap.registerEffect({name, ...effect});
    });
  }

  static get ChatLog$(): JQuery {
    return $("#chat-log");
  }

  static GetMessage(ref: string|JQuery|HTMLElement): Maybe<K4ChatMessage> {
    if (typeof ref === "string") {
      return game.messages.get(ref) as Maybe<K4ChatMessage>;
    } else if (ref instanceof HTMLElement) {
      const message$ = $(ref).closest(".chat-message");
      const messageId = message$.data("messageId");
      return game.messages.get(messageId) as Maybe<K4ChatMessage>;
    } else {
      const messageId = $(ref).data("messageId");
      return game.messages.get(messageId) as Maybe<K4ChatMessage>;
    }
  }
  /**
  * Pre-Initialization of the K4ChatMessage class. This method should be run during the "init" hook.
  *
  * - Registers the K4ChatMessage class as the system's ChatMessage document class.
  * - Sets the sidebar icon for the Chat tab to a microphone icon.
  * - Sets the default template for system chat messages to the "sidebar/chat-message" template.
  * - Registers a "renderChatLog" hook to add a control panel to the chat input panel for players to select the message type.
  * - Registers a "renderChatMessage" hook to apply custom CSS classes to chat messages based on their flags.
  *
  * @returns {Promise<void>} A promise that resolves when the hook is registered.
  */
  static async PreInitialize(): Promise<void> {

    // Register the K4ChatMessage class as the document type for ChatMessage
    CONFIG.ChatMessage.documentClass = K4ChatMessage;

    // Customize the sidebar icon for the Chat tab
    CONFIG.ChatMessage.sidebarIcon = "fa-regular fa-microphone-lines";

    // Set the default template for system chat messages
    CONFIG.ChatMessage.template = U.getTemplatePath("sidebar", "chat-message");

    // Register GSAP effects
    K4ChatMessage.RegisterGsapEffects();

    // Register a hook to run when the chat log is rendered
    Hooks.on("renderChatLog", async (_log: ChatLog, html: JQuery, _options: unknown) => {
      // Generate the button panel for setting input type
      K4ChatMessage.GenerateInputPanel(html);
    });

    // Register a hook to run when a chat message is rendered
    Hooks.on("renderChatMessage", (message: K4ChatMessage, html) => {
      // Introduce a brief pause to let the DOM settle
      setTimeout(() => {

        // Apply custom CSS classes to the chat message based on its flags
        message.applyFlagCSSClasses();

        // If this is the last chat message, animate its gears
        if (message.isLastMessage) {
          message.animateGears();
        }
      }, 1500)
    });
  }
  // #endregion

  applyFlagCSSClasses() {
    const cssClasses = this.getFlag("kult4th", "cssClasses") as Maybe<string[]>;
    if (Array.isArray(cssClasses)) {
      this.elem$.addClass(cssClasses.join(" "));
    }
  }

  animateGears() {
    if(this.elem$.find(".roll-total-gear").length) {
      setTimeout(() => ANIMATIONS.rollGearsIn(this.elem$[0]), 500);
    }
  }

  get elem$(): JQuery {
    return K4ChatMessage.ChatLog$.find(`[data-message-id="${this.id}"]`);
  }

  get isLastMessage(): boolean {
    return this.id === K4ChatMessage.ChatLog$.find(".chat-message").last().data("messageId");
  }

  // #region STATIC METHODS ~
  /**
   * Given a string, will return the URL to the drop cap image for the first character of that string.
   * @param {string} content - The string to extract the first character from.
   * @returns {string} The URL to the drop cap image for the first character of the string.
   */
  static GetDropCap(content: string): string {
    if (!content || !content.length) {
      return ""
    };
    return `systems/kult4th/assets/chat/dropcaps/${content.slice(0, 1).toUpperCase()}.png`;
  }
  // #endregion

  // #region CONSTRUCTOR ~
  constructor(data: K4ChatMessage.ConstructorData, context?: Context) {

    super(data, context);

  }
  // #endregion

  // #region GETTERS & SETTERS ~

  // #endregion

  // #region HTML PARSING
  static CapitalizeFirstLetter(content: string): string {

    // Parse the stringified HTML content into a DOM element
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    // Function to capitalize the first letter of a text node
    const capitalizeTextNode = (textNode: Text) => {
      if (textNode.textContent) {
        textNode.textContent = textNode.textContent.charAt(0).toUpperCase() + textNode.textContent.slice(1);
      }
    };

    // Find the element that immediately follows .roll-source-header
    const rollSourceHeader = doc.querySelector(".roll-source-header");

    if (rollSourceHeader) {
      const nextElement = rollSourceHeader.nextElementSibling;

      if (nextElement) {
        // Traverse the child nodes to find the first text node with content
        const walker = document.createTreeWalker(nextElement, NodeFilter.SHOW_TEXT, {
          acceptNode: (node) => {
            // Only accept text nodes with non-whitespace content
            return node.nodeType === Node.TEXT_NODE && node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        });

        const firstTextNode = walker.nextNode();

        if (firstTextNode) {
          capitalizeTextNode(firstTextNode as Text);
        }
      }
    }

    // Serialize the modified DOM back to a string
    return doc.body.innerHTML;
  }
  // #endregion

}

// #region -- K4ChatMessage INTERFACE -- ~
interface K4ChatMessage {
  content: string;
}
// #endregion

// #ENDREGION

// #region EXPORTS ~
export default K4ChatMessage;
// #endregion
