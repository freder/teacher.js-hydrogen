export function loadOrLoginHandler(navigation) {
    window.postMessage({ type: 'HYDROGEN_READY' }, '*');

    // directly go to a specific room
    // TODO: receive room id from parent window
    const roomId = '!MnnWYJyaHwOLoMoWZV:m3x.baumhaus.digital';
    navigation.push('room', roomId);
}
