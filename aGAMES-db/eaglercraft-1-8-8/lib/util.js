function getCoreElements() {
  const loadingScreen = document.getElementById("loading-div");
  const loadingScreenText = document.getElementById("action-block");
  const loadingScreenContextText = document.getElementById("context-block");
  const loadingScreenProgress = document.getElementById("progress-bar");
  const loadingScreenProgressContainer = document.getElementById("progress-bar-container");

  return {
    loadingScreen,
    loadingScreenText,
    loadingScreenContextText,
    loadingScreenProgress,
    loadingScreenProgressContainer,
  };
}

async function loadCachedAssetUI(assetName, url = true, namespace = null) {
  const { loadingScreenText: text, loadingScreenProgress: progress, loadingScreenProgressContainer: container } = getCoreElements();
  text.textContent = "Loading...";
  const ui = (message, progressPercent) => {
    if (progress != undefined) {
      container.hidden = false;
      text.textContent = message;
      progress.style.width = `${progressPercent}%`;
    } else {
      text.textContent = message;
    }
  };
  const hit = await loadCachedAsset(assetName, ui, url, namespace);
  container.hidden = true;
  return hit;
}

async function loadCachedAsset(name, messageStream, url = true, namespace = null) {
  const md = await new EPKLib.LargeEPK(name, "URL").fetchMetadata();
  name = namespace == null ? name : `${namespace}:${name}`;
  let hit = await EasyDatabase.INSTANCE.getDBAsset(`@file:${name}`);
  messageStream(`Loading asset...`);
  if (hit) {
    let selfHash = await EasyDatabase.INSTANCE.getDBAsset(`@hash:${name}`);
    if (!selfHash) {
      selfHash = await generateHash(hit);
      await EasyDatabase.INSTANCE.setDBAsset(`@hash:${name}`, selfHash);
    }
    if (md.hash === selfHash) {
      return url ? URL.createObjectURL(new Blob([hit], { type: "application/octet-stream" })) : hit;
    } else {
      messageStream(`Updating asset...`);

      const progress = md.fetch();
      progress.progressCallback.addEventListener("progress", (event) => {
        messageStream(`Updating asset... (${event.overallPercent.toFixed(2)}%)`, event.overallPercent.toFixed(2));
      });
      await progress.promise;

      const data = md.getComplete();
      await EasyDatabase.INSTANCE.setDBAsset(`@file:${name}`, data);
      await EasyDatabase.INSTANCE.setDBAsset(`@hash:${name}`, md.hash);
      return url ? URL.createObjectURL(new Blob([data], { type: "application/octet-stream" })) : data;
    }
  } else {
    if (!isOnline()) throw new Error("Your game files are missing, and you are offline. Please go online to download your game files.");
    messageStream(`Downloading asset...`);

    const progress = md.fetch();
    progress.progressCallback.addEventListener("progress", (event) => {
      messageStream(`Downloading asset... (${event.overallPercent.toFixed(2)}%)`, event.overallPercent.toFixed(2));
    });
    await progress.promise;

    const data = md.getComplete();
    await EasyDatabase.INSTANCE.setDBAsset(`@file:${name}`, data);
    await EasyDatabase.INSTANCE.setDBAsset(`@hash:${name}`, md.hash);
    return url ? URL.createObjectURL(new Blob([data], { type: "application/octet-stream" })) : data;
  }
}

function utf8ToString(array) {
  var out, i, len, c;
  var char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0));
        break;
    }
  }

  return out;
}

function checkServiceWorker() {
  return;
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistration("/sw.js")
      .then((existingRegistration) => {
        if (!existingRegistration) {
          navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
              console.log(`[bootstrap] Service worker registered under scope (${registration.scope})! Offline support enabled.`);
            })
            .catch((error) => {
              console.error("[bootstrap] Service worker registration failed :(. Offline support will not work.");
              console.error("[bootstrap] Possible fixes: update/change browser, or properly configure your HTTPS setup (if you are the website operator).");
              console.error(error.stack);
            });
        } else {
          console.log("[bootstrap] Service worker is already registered.");
        }
      })
      .catch((error) => {
        console.error("[bootstrap] Error checking existing service worker registration.");
        console.error(error.stack);
      });
  } else {
    console.error("[bootstrap] Your browser/website configuration does not support service workers, :(. Offline support will not work.");
    console.error("[bootstrap] Possible fixes: update/change browser, or properly configure your HTTPS setup (if you are the website operator).");
  }
}

async function generateHash(arrayBuffer) {
  if (!window.crypto || !window.crypto.subtle) {
    return new jsSHA("SHA-256", "ARRAYBUFFER").update(arrayBuffer).getHash("HEX");
  }
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

function isOnline() {
  return window.navigator.onLine;
}

class EasyDatabase {
  dbName = "easydb";
  dbVersion = 1;

  static INSTANCE = new EasyDatabase();

  async setDBAsset(name, value) {
    const db = await this.openDatabase();
    const transaction = db.transaction("cache", "readwrite");
    const objectStore = transaction.objectStore("cache");
    objectStore.put(value, name);
    transaction.oncomplete = () => {
      db.close();
    };
  }

  async getDBAsset(name) {
    const db = await this.openDatabase();
    const transaction = db.transaction("cache", "readonly");
    const objectStore = transaction.objectStore("cache");
    const getRequest = objectStore.get(name);
    return new Promise((resolve, reject) => {
      getRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };
      getRequest.onerror = (event) => {
        reject(event.target.error);
      };
    }).finally(() => {
      db.close();
    });
  }

  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onerror = () => {
        reject(request.error);
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("cache");
      };
      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };
    });
  }
}