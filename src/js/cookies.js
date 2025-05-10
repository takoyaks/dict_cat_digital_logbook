// 🍪 Set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/";
}

// 🍪 Get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';'); // Split all cookies
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length); // Remove starting spaces
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null; // Cookie not found
}

// 🍪 Delete a cookie
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}
