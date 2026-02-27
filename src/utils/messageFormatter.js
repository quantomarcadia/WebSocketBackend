function formatMessage(type, payload) {
  return JSON.stringify({
    type,
    timestamp: new Date().toISOString(),
    ...payload
  });
}

export default formatMessage;