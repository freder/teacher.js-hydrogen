export function loadOrLoginHandler(navigation, sessionInfo) {
    console.log(sessionInfo);
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
            // console.log(displayname);
            window.postMessage(
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

    // directly go to a specific room
    // TODO: receive room id from parent window
    window.addEventListener('message', ({ data }) => {
        console.log(data);
    });
    const roomId = '!MnnWYJyaHwOLoMoWZV:m3x.baumhaus.digital';
    navigation.push('room', roomId);
}
