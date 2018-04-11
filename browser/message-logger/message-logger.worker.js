let messageCount = 0

onmessage = event => {
    console.log(++messageCount, event.data)
    postMessage('ack')
}