import { HomeServerApi } from "./matrix/net/HomeServerApi.js";


export const defaultHomeServer = 'medienhaus.udk-berlin.de';


export function loadOrLoginHandler(navigation, sessionInfo, platform) {
    /*
        sessionInfo:
        - accessToken
        - deviceId
        - homeServer
        - id
        - lastUsed
        - userId
    */
    fetch(
        `${sessionInfo.homeServer}/_matrix/client/r0/profile/${sessionInfo.userId}/displayname`,
        {
            headers: {
                authorization: `Bearer ${sessionInfo.accessToken}`
            }
        }
    )
        .then((res) => res.json())
        .then(({ displayname }) => {
            window.parent.postMessage(
            // window.top.postMessage(
                {
                    type: 'HYDROGEN_READY',
                    payload: {
                        userId: sessionInfo.userId,
                        displayName: displayname
                    }
                },
                '*'
            );
        })
        .catch((err) => {
            console.error(err);
        });

    const hsApi = new HomeServerApi({
        homeServer: sessionInfo.homeServer,
        accessToken: sessionInfo.accessToken,
        request: platform.request,
    });

    // receive room id from parent window + load it
    window.addEventListener('message', ({ data }) => {
        if (data.type === 'HYDROGEN_LOAD_ROOM') {
            navigation.push('room', data.payload.roomId);
        } else if (data.type === 'HYDROGEN_SEND_MESSAGE') {
            const { roomId, content } = data.payload;
            const eventType = 'm.room.message';
            const txnId = Date.now(); // transaction id
            const options = null;
            hsApi.send(
                roomId,
                eventType,
                txnId,
                { msgtype: 'm.text', body: content },
                options
            );
        }
    });
}
