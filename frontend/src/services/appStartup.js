const apiUrl = import.meta.env.VITE_API;

let startupRequestPromise;

export function triggerStartupRequest() {
  if (startupRequestPromise) {
    return startupRequestPromise;
  }

  if (!apiUrl) {
    startupRequestPromise = Promise.resolve({
      success: false,
      skipped: true,
      message: 'VITE_API is not configured.',
    });
    return startupRequestPromise;
  }

  startupRequestPromise = fetch(`${apiUrl}/api/system/startup`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Startup request failed');
      }

      return data;
    })
    .catch((error) => {
      console.error('Startup API request failed:', error);
      return {
        success: false,
        message: error.message,
      };
    });

  return startupRequestPromise;
}
