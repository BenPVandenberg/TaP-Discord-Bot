import StreamManager from "../utilities/streamManager";
const config = require("../config.json");

/**
 * Maintenace loop for the bot
 */
export default async function startMaintainance() {
    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    while (config.maintainance_loop_min) {
        await delay(config.maintainance_loop_min * 60000);

        StreamManager.checkTimeout();
    }
}
