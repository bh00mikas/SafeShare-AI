const upload =
    document.getElementById("imageUpload");

const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d");

const results =
    document.getElementById("results");


const totalThreats =
    document.getElementById("totalThreats");

const scanCount =
    document.getElementById("scanCount");

const protectedData =
    document.getElementById("protectedData");

const riskScore =
    document.getElementById("riskScore");

const liveScans =
    document.getElementById("liveScans");


let emailCount = 0;

let passwordCount = 0;

let apiCount = 0;


/* LOAD GLOBAL STATS */

function loadStats() {

    chrome.storage.local.get(
        [
            "totalThreats",
            "totalScans"
        ],

        (data) => {

            const threats =
                data.totalThreats || 0;

            const scans =
                data.totalScans || 0;


            totalThreats.innerText =
                threats;

            scanCount.innerText =
                scans;

            protectedData.innerText =
                threats;

            riskScore.innerText =
                Math.min(
                    threats * 10,
                    100
                );

            liveScans.innerText =
                scans;
        }
    );
}


/* INITIAL LOAD */

loadStats();


/* AUTO REFRESH DASHBOARD */

setInterval(() => {

    loadStats();

}, 1000);




/* OCR IMAGE SCANNER */

upload.addEventListener(
    "change",

    async (e) => {

        const file =
            e.target.files[0];

        if (!file) return;

        const img =
            new Image();

        img.src =
            URL.createObjectURL(file);


        img.onload = async () => {

            canvas.width =
                img.width;

            canvas.height =
                img.height;

            ctx.drawImage(
                img,
                0,
                0
            );

            results.innerHTML =
                "<p>Scanning image...</p>";

            try {

                const formData =
                    new FormData();

                formData.append(
                    "file",
                    file
                );

                formData.append(
                    "apikey",
                    "K84297747588957"
                );

                formData.append(
                    "language",
                    "eng"
                );


                const response =
                    await fetch(
                        "https://api.ocr.space/parse/image",
                        {
                            method: "POST",

                            body: formData
                        }
                    );


                const data =
                    await response.json();


                console.log(data);


                if (
                    data.IsErroredOnProcessing
                ) {

                    results.innerHTML = `
                        <p>
                            OCR Error:
                            ${data.ErrorMessage}
                        </p>
                    `;

                    return;
                }


                if (
                    !data.ParsedResults ||
                    !data.ParsedResults[0]
                ) {

                    results.innerHTML = `
                        <p>
                            OCR Failed:
                            No text detected.
                        </p>
                    `;

                    return;
                }


                const text =
                    data.ParsedResults[0]
                    .ParsedText;


                const detections =
                    detectSensitiveData(
                        text
                    );


                if (
                    detections.length === 0
                ) {

                    results.innerHTML =
                        "<p>No threats detected.</p>";

                    return;
                }


                results.innerHTML = "";


                detections.forEach(
                    (item) => {

                        /* UPDATE GLOBAL COUNTS */

                        chrome.storage.local.get(
                            [
                                "totalThreats",
                                "totalScans"
                            ],

                            (storageData) => {

                                let threats =
                                    storageData.totalThreats || 0;

                                let scans =
                                    storageData.totalScans || 0;

                                threats++;

                                scans++;

                                chrome.storage.local.set({

                                    totalThreats:
                                        threats,

                                    totalScans:
                                        scans
                                });
                            }
                        );


                        /* CATEGORY BARS */

                        if (
                            item.type ===
                            "Email"
                        ) {

                            emailCount++;

                            document
                                .getElementById(
                                    "emailBar"
                                )
                                .style.width =
                                `${emailCount * 15}%`;
                        }


                        if (
                            item.type ===
                            "Password"
                        ) {

                            passwordCount++;

                            document
                                .getElementById(
                                    "passwordBar"
                                )
                                .style.width =
                                `${passwordCount * 15}%`;
                        }


                        if (
                            item.type ===
                            "API Key"
                        ) {

                            apiCount++;

                            document
                                .getElementById(
                                    "apiBar"
                                )
                                .style.width =
                                `${apiCount * 15}%`;
                        }


                        /* DISPLAY RESULTS */

                        results.innerHTML += `
                            <p>
                                Threat:
                                ${item.type}
                                →
                                ${item.value}
                            </p>
                        `;
                    }
                );


                /* REDACTION BOX */

                ctx.fillStyle =
                    "black";

                ctx.fillRect(
                    40,
                    120,
                    520,
                    150
                );

            } catch (err) {

                console.error(err);

                results.innerHTML = `
                    <p>
                        OCR Failed:
                        ${err}
                    </p>
                `;
            }
        };
    }
);