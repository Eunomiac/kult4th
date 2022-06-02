import C from "../../scripts/constants";
import "./documents";
import "./scripts";

declare global {
	type K4Color = ValueOf<typeof C.Colors>;
}