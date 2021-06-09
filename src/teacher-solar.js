export const defaultHomeServer = 'medienhaus.udk-berlin.de';


export function loadOrLoginHandler(navigation, sessionInfo) {
    /*
        accessToken
        deviceId
        homeServer
        id
        lastUsed
        userId
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
                        displayName: displayname
                    }
                },
                '*'
            );
        })
        .catch((err) => {
            console.error(err);
        });

    // receive room id from parent window + load it
    window.addEventListener('message', ({ data }) => {
        if (data.type === 'HYDROGEN_LOAD_ROOM') {
            navigation.push('room', data.payload.roomId);
        }
    });
}
