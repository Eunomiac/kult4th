import K4Alert from "./K4Alert.js";
import K4Dialog from "./K4Dialog";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class K4Socket {


// #region ░░░░░░░[SocketLib]░░░░ SocketLib Initialization ░░░░░░░ ~

// #endregion ░░░░[SocketLib]░░░░

  private static SocketFunctions: Record<string, SocketFunction> = {};

  static RegisterSocketFunctions(funcs: Record<string, SocketFunction>) {
    for (const [fName, func] of Object.entries(funcs)) {
      socketlib.system.register(fName, func);
      K4Socket.SocketFunctions[fName] = func;
    }
  }

  static async Call<RT>(funcName: string, userID: IDString, ...funcParameters: unknown[]): Promise<RT|false> {
    if (!getGame().users.get(userID)?.active) { return false; }
    if (!(funcName in K4Socket.SocketFunctions)) {
      throw new Error(`[K4Socket.Call] No Such Function Registered: ${funcName}`);
    }
    const func = K4Socket.SocketFunctions[funcName] as SocketFunction & AsyncFunc<RT>;

    return socketlib.system.executeAsUser(
      func,
      userID,
      ...funcParameters
    );
  }
}

export default K4Socket;