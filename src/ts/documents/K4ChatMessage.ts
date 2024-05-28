// #region IMPORTS ~
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
// #endregion

// #region TYPES ~
namespace K4ChatMessage {

  export interface ConstructorData extends ChatMessageDataConstructorData { }

}
// #endregion

// #region === K4ChatMessage CLASS ===
class K4ChatMessage extends ChatMessage {
  // #region INITIALIZATION ~
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

    // Register a hook to run when the chat log is rendered
    Hooks.on("renderChatLog", async (_log: ChatLog, html: JQuery, _options: unknown) => {
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
    });

    // Register a hook to run when a chat message is rendered
    Hooks.on("renderChatMessage", (message: ChatMessage, html) => {
      const cssClasses = message.getFlag("kult4th", "cssClasses") as Maybe<string[]>;
      if (Array.isArray(cssClasses)) {
        html.addClass(cssClasses.join(" "));
      }
    });
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
