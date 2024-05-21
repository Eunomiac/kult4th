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
  * - Registers a "renderChatLog" hook to add a control panel to the chat input panel for players to select the message type.
  *
  * @returns {Promise<void>} A promise that resolves when the hook is registered.
  */
  static async PreInitialize(): Promise<void> {

    // Register the K4ChatMessage class as the document type for ChatMessage
    CONFIG.ChatMessage.documentClass = K4ChatMessage;

    // Register a hook to run when the chat log is rendered
    Hooks.on("renderChatLog", async (_log: ChatLog, html: JQuery, _options: unknown) => {
      // Load the template for the chat input control panel
      const template = await getTemplate(U.getTemplatePath("sidebar", "chat-input-control-panel"));
      // Convert the template into a jQuery object
      const buttonHtml = $(template({}));
      // Find the chat form in the rendered HTML
      const chatForm = html.find("#chat-form");
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
    Hooks.on("renderChatMessage", (message, html) => {
      const cssClasses = message.getFlag("kult4th", "cssClasses") as Maybe<string[]>;
      if (cssClasses) {
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

}

// #region -- K4ChatMessage INTERFACE -- ~

// #endregion

// #ENDREGION

// #region EXPORTS ~
export default K4ChatMessage;
// #endregion
