// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import C from "../../../scripts/constants";

import K4ActiveEffect from "../../../documents/K4ActiveEffect";

import K4PCSheet from "../../../documents/K4PCSheet";
import K4NPCSheet from "../../../documents/K4NPCSheet";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

/**
 * == Edges ==
 * Edges are subMoves that become active under specific conditions:
 *  - (a) The owning actor's system.edges.source matches the name of the parent item.
 *  - (b) The owning actor's system.edges.value is greater than zero.
 *
 * K4Items methods:
 *  - `enableEdges(count: PosInteger): Promise<void>`: Sets the parent actor's system.edges to {source: this.name, value: count, max: 3, min: 0}.
 *
 * K4Actors methods:
 *  - `get activeEdges(): K4SubItem.move[]`: Checks owned items against system.edges.source and returns a list of edges or an empty array.
 *  - `Hooks.on("K4EndScene")`: Resets system.edges to {source: "", value: 0, max: 3, min: 0}.
 *
 * == K4 Active Effects ==
 *
 * Active Effects are a powerful and flexible system for applying various modifications to actors, rolls, and other game elements. Here are some key concepts and design considerations:
 *
 * TERMS:
 *  - "ActiveEffect": The K4ActiveEffect instance.
 *  - "Change": A single discrete modification applied by the ActiveEffect.
 *
 * TARGET: Specifies what the Changes on the ActiveEffect apply to. Possible values include:
 *  - "roll:<type(s)>": Changes add or subtract from applicable rolls.
 *  - "move:<name(s)>": Changes modify moves (e.g., adding questions to a list, adding notes/remarks).
 *  - "actor": Changes directly modify values in the actor's system schema or add items.
 *  - "gm": Changes apply notifications or flags to the GM Screen.
 *  - "custom": Changes are handled by a custom function.
 *
 * DURATION: Specifies how long the ActiveEffect lasts. Possible values include:
 *  - "ongoing": The ActiveEffect is permanent until removed.
 *    - Automatic removal occurs in certain cases depending on SOURCETYPE:
 *      - "item": Removed if the item is removed from the actor.
 *      - "wound": Removed if all wounds are stabilized.
 *      - "stability": Removed if Stability rises above the threshold for penalties.
 *  - "multiuse": The ActiveEffect can be used a fixed number of times, then is removed.
 *  - "singleuse": The ActiveEffect is removed after it is used once.
 *  - "scene": The ActiveEffect is removed when the GM indicates a scene change.
 *  - "session": The ActiveEffect is removed when the GM indicates a new session.
 *    - If multiple durations are given in a comma-delimited list, the ActiveEffect is removed when any condition is met.
 *
 * SOURCE: Specifies where the ActiveEffect originates from. Possible values include:
 *  - "item": Applied automatically by an owned item, subMove (including edges), or subAttack.
 *  - "roll": Applied by a roll result.
 *
 * FLAGS: Boolean values that change the behavior of the ActiveEffect. Possible values include:
 *  - "isGlobal": The ActiveEffect applies to all actors in the scene.
 *    - "singleuse"/"multiuse" ActiveEffects are removed from all actors if any actor(s) use it up.
 *  - "isDefaultDisabled": The ActiveEffect is disabled by default (the actor must toggle it on before each use).
 *  - "isRepeatable": The ActiveEffect can be applied multiple times (e.g., multiple "roll"-source ActiveEffects).
 *
 *
 * == ADVICE AND SUGGESTIONS ==
 *
 * 1. **Start Super Small**: Begin with a very basic implementation. For example, start with just 'ongoing'/'item' effects and ensure they apply correctly to rolls or other simple game mechanics. Gradually add more features and complexity.
 *    - **Example**: Implement an effect that adds a fixed bonus to a specific type of roll. Test it thoroughly before moving on.
 *    - **Insight**: Starting small helps build confidence and provides a solid foundation. It reduces the risk of overwhelming complexity early on.
 *    - **Tip**: Use mock data to simulate different scenarios and ensure your basic implementation works under various conditions.
 *    - **Psychological Insight**: Small wins can boost motivation and morale, making the development process more enjoyable and less daunting.
 *
 * 2. **Incremental Development**: Add new features one at a time. This will help you isolate issues and understand the impact of each new feature.
 *    - **Example**: After implementing basic 'ongoing' effects, add support for 'singleuse' effects. Test each new feature in isolation.
 *    - **Insight**: Incremental development allows for easier debugging and ensures that each feature is stable before adding more complexity.
 *    - **Tip**: Use version control to manage incremental changes. Commit frequently and use branches to experiment with new features.
 *    - **Psychological Insight**: Incremental progress can reduce anxiety and prevent burnout by making the workload more manageable.
 *
 * 3. **Modular Design**: Break down the ActiveEffect system into smaller, manageable modules. For example, separate modules for handling different TARGET types, DURATION types, and FLAGS. This will make the system easier to understand, test, and maintain.
 *    - **Example**: Create separate modules for handling 'roll' effects, 'actor' effects, and 'custom' effects. Each module should have a clear responsibility.
 *    - **Insight**: Modular design promotes code reusability and makes it easier to isolate and fix bugs.
 *    - **Tip**: Define clear interfaces for each module to ensure they can interact seamlessly.
 *    - **Psychological Insight**: Working on smaller, well-defined modules can make the development process feel less overwhelming and more structured.
 *
 * 4. **Type Safety**: Use TypeScript's type system to enforce the structure and constraints of ActiveEffects. Define types and interfaces for each component. This will help catch errors early and make the code more robust.
 *    - **Example**: Define interfaces for different effect types, such as `OngoingEffect`, `SingleUseEffect`, and `MultiUseEffect`.
 *    - **Insight**: Type safety can prevent a wide range of runtime errors and make the codebase more maintainable.
 *    - **Tip**: Use TypeScript's advanced features, such as union types and type guards, to handle complex type scenarios.
 *    - **Psychological Insight**: Knowing that the type system has your back can reduce stress and increase confidence in the code's correctness.
 *
 * 5. **Event-Driven Architecture**: Utilize an event-driven approach to handle the application and removal of ActiveEffects. This can help manage complex interactions and dependencies. For example, use events to trigger changes when an ActiveEffect is applied or removed.
 *    - **Example**: Implement an event system where effects can subscribe to events like `onApply`, `onRemove`, and `onExpire`.
 *    - **Insight**: Event-driven architecture can decouple components and make the system more flexible and scalable.
 *    - **Tip**: Use a well-established event library or framework to handle event management.
 *    - **Psychological Insight**: An event-driven approach can make the system feel more dynamic and responsive, which can be satisfying to develop and use.
 *
 * 6. **Configuration and Extensibility**: Allow for easy configuration and extension of ActiveEffects. Provide hooks or callback functions for custom behavior. This will make the system more flexible and adaptable to different game mechanics.
 *    - **Example**: Allow developers to define custom effect behaviors through configuration files or scripts.
 *    - **Insight**: Extensibility ensures that the system can adapt to future requirements without major rewrites.
 *    - **Tip**: Document the extension points clearly to make it easy for other developers to add custom behavior.
 *    - **Psychological Insight**: A flexible system can foster creativity and innovation, making the development process more engaging.
 *
 * 7. **Testing and Validation**: Implement thorough testing and validation to ensure the correctness and stability of the ActiveEffect system. Use unit tests, integration tests, and type checks. This will help you catch issues early and ensure the system works as expected.
 *    - **Example**: Write unit tests for each effect type and integration tests for the overall system.
 *    - **Insight**: Comprehensive testing can prevent regressions and ensure that new features do not break existing functionality.
 *    - **Tip**: Use automated testing tools to run tests frequently and catch issues early.
 *    - **Psychological Insight**: Knowing that the system is well-tested can reduce anxiety and increase confidence in making changes.
 *
 * 8. **Documentation**: Maintain comprehensive documentation for the ActiveEffect system, including usage examples, API references, and design rationale. This will help other developers understand and work with the system.
 *    - **Example**: Create a documentation site with sections for getting started, API reference, and advanced usage.
 *    - **Insight**: Good documentation can reduce the learning curve and make the system more accessible to new developers.
 *    - **Tip**: Keep the documentation up-to-date with code changes to prevent discrepancies.
 *    - **Psychological Insight**: Clear documentation can reduce frustration and increase satisfaction for both developers and users.
 *
 * 9. **User Feedback**: If possible, get feedback from users or other developers early in the development process. This can provide valuable insights and help you identify potential issues or improvements.
 *    - **Example**: Conduct user testing sessions or gather feedback through surveys and forums.
 *    - **Insight**: Early feedback can help you catch usability issues and make informed design decisions.
 *    - **Tip**: Create a feedback loop where user input is regularly reviewed and incorporated into the development process.
 *    - **Psychological Insight**: Engaging with users can provide a sense of purpose and validation, making the development process more rewarding.
 *
 * 10. **Stay Organized**: Keep your code, documentation, and notes well-organized. This will make it easier to track your progress, understand your design decisions, and collaborate with others.
 *    - **Example**: Use project management tools to track tasks, bugs, and feature requests.
 *    - **Insight**: Organization can improve productivity and reduce the risk of overlooking important details.
 *    - **Tip**: Regularly review and clean up your codebase to maintain a high level of organization.
 *    - **Psychological Insight**: An organized workspace can reduce stress and increase focus, leading to better overall performance.
 *
 * By following these principles and leveraging TypeScript's features, you can create a robust and flexible ActiveEffect system that can handle a wide variety of use cases and conditions.
 */
enum K4ActiveEffectSourceType {
  actor = "actor", // For effects originating from other actors (e.g. NPC powers, Influence Other PC, Help/Hinder, etc.)
  item = "item", // For effects originating from an item owned by the actor
  stability = "stability", // For penalties derived from low stability
  wound = "wound", // For penalties derived from wounds
  edge = "edge", // For beneficial effects originating from the use of an edge
  none = "none" // For 'floating' effects without a defined source; logic should exist to handle removal/expiration
}




declare global {

  namespace K4ActiveEffect {

    namespace Schema {
      interface Base {
        id: IDString,
        sourceType: K4ActiveEffectSourceType
      }
    }
  }

}