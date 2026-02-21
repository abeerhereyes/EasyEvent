// MAIN PAGE LOADER
function loadScreen(file) {
    fetch(file)
        .then(res => res.text())
        .then(html => {

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // First, inject DOM
            document.getElementById("app").innerHTML = doc.body.innerHTML;

            // Reset init function
            window.__pageInitFunction__ = null;

            const scripts = doc.querySelectorAll("script");

            let pending = scripts.length;

            // If there are NO scripts, run init immediately
            if (pending === 0) {
                if (typeof window.__pageInitFunction__ === "function") {
                    window.__pageInitFunction__();
                    window.__pageInitFunction__ = null;
                }
                return;
            }

            // Load scripts
            scripts.forEach(oldScript => {
                const newScript = document.createElement("script");

                if (oldScript.src) {
                    newScript.src = oldScript.src;
                    newScript.onload = checkDone;
                } else {
                    newScript.textContent = `
                        (() => {
                            ${oldScript.textContent}
                        })();
                    `;
                    // inline scripts execute immediately; mark as done
                    checkDone();
                }

                document.body.appendChild(newScript);
            });

            function checkDone() {
                pending--;
                if (pending === 0) {
                    // DOM EXISTS + scripts LOADED → run init now
                    if (typeof window.__pageInitFunction__ === "function") {
                        window.__pageInitFunction__();
                        window.__pageInitFunction__ = null;
                    }
                }
            }
        });
}