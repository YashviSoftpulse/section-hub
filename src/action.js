export const fetchData = function (url, data, dataType, queryParams) {
  return new Promise((resolve, reject) => {
    const method = "post";
    data = !data ? {} : data;
    dataType = !dataType ? "json" : dataType;
    if (!url) {
      return resolve({
        status: false,
        message: `Request url is required or invalid! ${url}`,
      });
    }
    /* API REQUEST URL START */
    /*if (apiPath.indexOf(process.env.APP_PROXY_PATH) === -1 && apiPath[0] !== '/')
            apiPath = `/${apiPath}`;
        const url = (apiPath.indexOf(process.env.APP_PROXY_PATH) !== -1) ? apiPath : `${process.env.APP_URL}/api${apiPath}`;*/
    /* API REQUEST URL END */

    var headerContentType = "text/plain;charset=UTF-8";
    if (dataType === "json" || dataType === "text")
      headerContentType = "application/json";

    var isFormData = data instanceof FormData;
    if (isFormData !== true) {
      data = JSON.stringify(data);
    }

    const myheaders = new Headers();
    myheaders.append("Content-Type", headerContentType);

    const fetchBody = {
      method: method,
      body: data,
    };

    if (isFormData !== true) fetchBody.headers = myheaders;
    fetch(url, fetchBody)
      .then(function (response) {
        return response.text();
      })
      .then(
        function (response) {
          if (dataType == "json") {
            try {
              response = JSON.parse(response);
            } catch (errorMessage) {
              errorMessage = errorMessage.stack
                ? errorMessage.stack
                : errorMessage;
              errorMessage += `\n Request URL at ${url}`;

              return resolve({
                status: false,
                message: "Something went wrong. Please try after sometime",
              });
            }
          }
          return resolve(response);
        },
        function (errorMessage) {
          errorMessage = errorMessage.stack ? errorMessage.stack : errorMessage;
          errorMessage += `\n Request URL at ${url}`;

          return resolve({
            status: false,
            message: "Something went wrong. Please try after sometime",
          });
        }
      );
  });
};

export const fetchJsonData = async function (
  url,
  data = {},
  dataType = "json",
  queryParams = {}
) {
  if (!url) {
    throw new Error(`Request URL is required or invalid! ${url}`);
  }

  const isFormData = data instanceof FormData;
  let body = isFormData ? data : JSON.stringify(data);

  const headers = new Headers();
  if (!isFormData) {
    headers.append(
      "Content-Type",
      dataType === "json" ? "application/json" : "text/plain;charset=UTF-8"
    );
  }

  // Append query parameters to URL if any
  if (queryParams && Object.keys(queryParams).length > 0) {
    const queryString = new URLSearchParams(queryParams).toString();
    url += `?${queryString}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response;
};

const isset = function (accessor, compare = null) {
  try {
    const isExists = !["[object Undefined]"].includes(
      Object.prototype.toString.call(accessor())
    );
    if (
      ["[object Undefined]", "[object Null]"].includes(
        Object.prototype.toString.call(compare)
      ) === false
    )
      return accessor() === compare;
    return isExists;
  } catch (ex) {}
  return false;
};

const getTypeOf = function (value) {
  const valueName = Object.prototype.toString.call(value);
  const valueNameExtract = /\b(object) (\w+)\b/.exec(valueName);
  if (isset(() => valueNameExtract[2]))
    return valueNameExtract[2].toLowerCase();
  return "undefined";
};

/* ENCODE REQUEST STRING START */
export const encode = function (string, increment = 2) {
  string = JSON.stringify({
    data: string,
    type: getTypeOf(string),
  });

  if (!string) return false;
  string = btoa(unescape(encodeURIComponent(string)));

  var encodeString = "";
  string.split("").forEach(function (charcter) {
    encodeString += charcterIncrement(charcter, increment);
  });

  /* CHARCHTER CODE INCREAMENT HANDLER START */
  function charcterIncrement(charcter, increment) {
    if (/[a-zA-Z]/.test(charcter) !== true) return charcter;

    var range = alphaRange();
    if (/[A-Z]/.test(charcter)) range = alphaRange(true);

    var charIndex = range.indexOf(charcter);
    for (var i = 1; i <= increment; i++) {
      charIndex = range[parseInt(charIndex) + 1] ? parseInt(charIndex) + 1 : 0;
    }

    return range[charIndex];
  }
  /* CHARCHTER CODE INCREAMENT HANDLER END */

  /* ALPHA RANDGE RANGE HANDLER START */
  function alphaRange(capital = false) {
    var rangeArray = [];
    var charcter = "a";
    if (capital === true) var charcter = "A";
    for (const x of Array(26).keys()) {
      rangeArray.push(String.fromCharCode(charcter.charCodeAt(0) + x));
    }
    return rangeArray;
  }
  /* ALPHA RANDGE RANGE HANDLER END */
  return encodeString;
};
/* ENCODE REQUEST STRING END */

/* DECODE REQUEST STRING START */
export const decode = function (string, decrement = 2) {
  if (!string) return false;

  var decodeString = "";
  string.split("").forEach(function (charcter) {
    decodeString += charcterDecrement(charcter, decrement);
  });
  decodeString = decodeURIComponent(escape(atob(decodeString)));

  decodeString = JSON.parse(decodeString);

  /* CHARCHTER CODE INCREAMENT HANDLER START */
  function charcterDecrement(charcter, increment) {
    if (/[a-zA-Z]/.test(charcter) !== true) return charcter;

    var range = alphaRange();
    if (/[A-Z]/.test(charcter)) range = alphaRange(true);

    var charIndex = range.indexOf(charcter);
    for (var i = 1; i <= increment; i++) {
      charIndex = range[parseInt(charIndex) - 1] ? parseInt(charIndex) - 1 : 25;
    }

    return range[charIndex];
  }
  /* CHARCHTER CODE INCREAMENT HANDLER END */

  /* ALPHA RANDGE RANGE HANDLER START */
  function alphaRange(capital = false) {
    var rangeArray = [];
    var charcter = "a";
    if (capital === true) var charcter = "A";
    for (const x of Array(26).keys()) {
      rangeArray.push(String.fromCharCode(charcter.charCodeAt(0) + x));
    }
    return rangeArray;
  }
  /* ALPHA RANDGE RANGE HANDLER END */
  return decodeString.data;
};
/* DECODE REQUEST STRING END */

/* GET API URL HANDLER START */
export const getApiURL = (path) => {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }

  const url = `${API_URL}/api${path}?${new URLSearchParams(params)}`;

  return url;
};
/* GET API URL HANDLER END */

/* CHECK OBJECT PROPERTY HANDLER START */
export const hasProperty = (object, key, compare) => {
  if (typeof key != "string") return false;

  var value = key.split(".").reduce(function (o, x) {
    return typeof o === "undefined" || o === null ? undefined : o[x];
  }, object);

  if (typeof compare != "undefined")
    return typeof value != "undefined" && value === compare;
  return typeof value != "undefined";
};
/* CHECK OBJECT PROPERTY HANDLER END */

export class MyEncryption {
  encode(string, increment = 2) {
    if (!string) return false;

    // Convert the string to JSON format
    const jsonString = JSON.stringify({
      data: string,
      type: typeof string,
    });

    // Base64 encode the JSON string
    const base64String = btoa(jsonString);
    let encodedString = "";

    // Increment each character
    for (let char of base64String) {
      encodedString += this.increment(char, increment);
    }

    return encodedString;
  }

  decode(string, decrement = 2) {
    if (!string) return false;

    let decodedString = "";

    // Decrement each character
    for (let char of string) {
      decodedString += this.decrement(char, decrement);
    }

    // Decode from Base64 and parse JSON
    const jsonString = atob(decodedString);
    const decodedData = JSON.parse(jsonString);

    return decodedData.data || decodedData;
  }

  increment(char, increment = 2) {
    if (!/[a-zA-Z]/.test(char)) return char;

    const range =
      char === char.toUpperCase()
        ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        : "abcdefghijklmnopqrstuvwxyz";
    const charIndex = range.indexOf(char);
    return range[(charIndex + increment) % range.length];
  }

  decrement(char, decrement = 2) {
    if (!/[a-zA-Z]/.test(char)) return char;

    const range =
      char === char.toUpperCase()
        ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        : "abcdefghijklmnopqrstuvwxyz";
    const charIndex = range.indexOf(char);
    return range[(charIndex - decrement + range.length) % range.length];
  }
}

export function capitalizeFirstLetter(string = "") {
  if (string == "") return string;
  string = string.replace(/_/g, " ");
  return string.charAt(0)?.toUpperCase() + string?.slice(1);
}
