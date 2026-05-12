const SENSITIVE_PATTERNS = {

    email:
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,

    phone:
    /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,

    apiKey:
    /(?:key|api|token|secret|auth)(?:[\s=:'"]+)([a-zA-Z0-9]{16,})/gi,

    pin:
    /\b\d{4}(?:\d{2})?\b/g,

    keywords:
    /\b(password|dob|date-of-birth|otp|pw|pwd|credentials|secret|confidential|internal-only|private-key)\b/gi
};


let typingTimer;

let isAsking = false;


/* DASHBOARD COUNTER UPDATE */

function updateThreatStats(type) {

    chrome.storage.local.get(

        [
            "totalThreats",
            "totalScans"
        ],

        (data) => {

            let threats =
                data.totalThreats || 0;

            let scans =
                data.totalScans || 0;

            threats++;

            scans++;

            chrome.storage.local.set({

                totalThreats:
                    threats,

                totalScans:
                    scans,

                lastThreatType:
                    type
            });
        }
    );
}


/* MAIN DETECTION */

function scanAndAsk(element) {

    if (isAsking) return;

    let text =
        element.isContentEditable
        ? element.innerText
        : element.value;

    if (!text) return;

    let hasSecrets = false;

    let detectedType =
        "Sensitive Data";


    for (

        let [type, regex]

        of Object.entries(
            SENSITIVE_PATTERNS
        )
    ) {

        regex.lastIndex = 0;

        if (regex.test(text)) {

            hasSecrets = true;

            detectedType = type;

            break;
        }
    }


    if (hasSecrets) {

        /* RED WARNING STYLE */

        element.style.outline =
            "4px solid red";

        element.style.backgroundColor =
            "#fff0f0";

        element.style.boxShadow =
            "0 0 12px red";


        /* UPDATE DASHBOARD */

        updateThreatStats(
            detectedType
        );


        /* WAIT BEFORE POPUP */

        clearTimeout(
            typingTimer
        );


        typingTimer =
            setTimeout(() => {

                isAsking = true;


                const confirmMask =
                    confirm(
                        "⚠️ AI Safe Share:\n\nSensitive information detected.\n\nMask it now?"
                    );


                if (confirmMask) {

                    let maskedText =
                        text;


                    for (

                        let regex

                        of Object.values(
                            SENSITIVE_PATTERNS
                        )
                    ) {

                        maskedText =
                            maskedText.replace(

                                regex,

                                (match) =>
                                    "*".repeat(
                                        match.length
                                    )
                            );
                    }


                    /* APPLY MASK */

                    if (
                        element.isContentEditable
                    ) {

                        element.innerText =
                            maskedText;

                    } else {

                        element.value =
                            maskedText;
                    }


                    /* GREEN SAFE STYLE */

                    element.style.outline =
                        "4px solid #22c55e";

                    element.style.backgroundColor =
                        "#f0fff4";

                    element.style.boxShadow =
                        "0 0 12px #22c55e";

                } else {

                    /* USER IGNORED */

                    element.style.outline =
                        "4px solid orange";

                    element.style.boxShadow =
                        "0 0 12px orange";
                }

                isAsking = false;

            }, 1000);

    } else {

        /* RESET */

        element.style.outline = "";

        element.style.backgroundColor = "";

        element.style.boxShadow = "";
    }
}


/* INPUT LISTENER */

document.addEventListener(

    "input",

    (e) => {

        scanAndAsk(
            e.target
        );
    }
);