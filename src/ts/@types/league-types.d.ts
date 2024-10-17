import K4Actor, {K4ActorType} from "../documents/K4Actor";

declare module "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData" {
  // Extract the unexported interface for ActiveEffect changes data
  export interface EffectChangeDataProperties {
    key: string;
    value: string;
    mode: number;
    priority: number | null | undefined;
  }
}

declare global {
  /**
   * Retrieves the current Game instance.
   * @returns The current Game instance.
   * @throws Error if the Game is not ready.
 */
  function getGame(): ReadyGame;

  /**
   * Retrieves the current User instance.
   * @returns The current User instance.
   * @throws Error if the User is not ready.
   */
  function getUser(): User;

  /**
   * Retrieves the PC actor owned by the current user.
   * @returns The current Actor instance.
   * @throws Error if the Actor is not ready.
   */
  function getActor(): K4Actor<K4ActorType.pc>;

  /**
   * Retrieves the current I18n instance.
   * @returns The current I18n instance.
   * @throws Error if the I18n is not ready.
   */
  function getLocalizer(): Localization;

  /**
   * Retrieves the current Notifications instance.
   * @returns The current Notifications instance.
   * @throws Error if the Notifications are not ready.
   */
  function getNotifier(): Notifications;
}