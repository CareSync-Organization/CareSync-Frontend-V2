declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

let sdkLoadingPromise: Promise<void> | null = null;

export function initFacebookSdk(): Promise<void> {
  if (sdkLoadingPromise) {
    return sdkLoadingPromise;
  }

  sdkLoadingPromise = new Promise<void>((resolve, reject) => {
    if (window.FB) {
      resolve();
      return;
    }

    const timeoutId = setTimeout(() => {
      reject(new Error("Facebook SDK load timeout. An ad-blocker or privacy extension may be blocking it."));
    }, 6000);

    // Set callback to initialize once script is loaded
    window.fbAsyncInit = function () {
      clearTimeout(timeoutId);
      try {
        window.FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID ?? "922547900244406",
          cookie: true,
          xfbml: true,
          version: import.meta.env.VITE_FACEBOOK_GRAPH_API_VERSION ?? "v20.0",
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    };

    // Inject SDK script
    (function (d, s, id) {
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.async = true;
      js.defer = true;
      js.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error("Facebook SDK script failed to load. Likely blocked by an ad-blocker or browser shield."));
      };
      
      const fjs = d.getElementsByTagName(s)[0];
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      } else {
        d.head.appendChild(js);
      }
    })(document, "script", "facebook-jssdk");
  }).catch((err) => {
    sdkLoadingPromise = null; // Reset promise so user can retry after disabling ad-blocker
    throw err;
  });

  return sdkLoadingPromise;
}
