import {
    FilesetResolver,
    HandLandmarker
} from
"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1";


// ==================================================
// HTML ELEMENTS
// ==================================================

const video =
    document.getElementById("video");


const overlay =
    document.getElementById("overlay");
    
    overlay.style.display = "none";


const overlayCtx =
    overlay.getContext("2d");


const captureCanvas =
    document.getElementById(
        "captureCanvas"
    );


const captureCtx =
    captureCanvas.getContext("2d");


const cropPreview =
    document.getElementById(
        "cropPreview"
    );


const cropCtx =
    cropPreview.getContext("2d");


const startBtn =
    document.getElementById(
        "startBtn"
    );


const captureBtn =
    document.getElementById(
        "captureBtn"
    );


const stopBtn =
    document.getElementById(
        "stopBtn"
    );


const status =
    document.getElementById(
        "status"
    );


const prediction =
    document.getElementById(
        "prediction"
    );


const confidence =
    document.getElementById(
        "confidence"
    );


const agreement =
    document.getElementById(
        "agreement"
    );


// ==================================================
// PROBABILITY ELEMENTS
// ==================================================

const paperBar =
    document.getElementById(
        "paperBar"
    );


const rockBar =
    document.getElementById(
        "rockBar"
    );


const scissorsBar =
    document.getElementById(
        "scissorsBar"
    );


const paperValue =
    document.getElementById(
        "paperValue"
    );


const rockValue =
    document.getElementById(
        "rockValue"
    );


const scissorsValue =
    document.getElementById(
        "scissorsValue"
    );


// ==================================================
// MODEL ELEMENTS
// ==================================================

const modelElements = [

    document.getElementById(
        "model1"
    ),

    document.getElementById(
        "model2"
    ),

    document.getElementById(
        "model3"
    ),

    document.getElementById(
        "model4"
    )

];


// ==================================================
// VARIABLES
// ==================================================

let handLandmarker = null;

let cameraStream = null;

let cameraRunning = false;

let processingCapture = false;

let lastVideoTime = -1;


// ==================================================
// LOAD MEDIAPIPE
// ==================================================

async function loadHandDetector() {

    status.textContent =
        "Loading hand detector...";


    try {

        const vision =
            await FilesetResolver
            .forVisionTasks(

                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm"

            );


        handLandmarker =
            await HandLandmarker
            .createFromOptions(

                vision,

                {

                    baseOptions: {

                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"

                    },


                    runningMode:
                        "VIDEO",


                    numHands:
                        1,


                    minHandDetectionConfidence:
                        0.5,


                    minHandPresenceConfidence:
                        0.5,


                    minTrackingConfidence:
                        0.5

                }

            );


        status.textContent =
            "Hand detector ready.";

    }

    catch (error) {

        console.error(
            error
        );


        status.textContent =
            "MediaPipe error: " +
            error.message;

        throw error;

    }

}


// ==================================================
// START CAMERA
// ==================================================

async function startCamera() {

    try {

        startBtn.disabled =
            true;


        status.textContent =
            "Starting camera...";


        if (!handLandmarker) {

            await loadHandDetector();

        }


        cameraStream =
            await navigator
            .mediaDevices
            .getUserMedia({

                video: {

                    facingMode:
                        "user",

                    width: {
                        ideal: 1280
                    },

                    height: {
                        ideal: 720
                    }

                },

                audio: false

            });


        video.srcObject =
            cameraStream;


        await video.play();


        // ==================================================
        // WAIT FOR VIDEO SIZE
        // ==================================================

        await new Promise(
            resolve => {

                if (
                    video.videoWidth > 0 &&
                    video.videoHeight > 0
                ) {

                    resolve();

                    return;

                }


                video.onloadedmetadata =
                    () => {

                        resolve();

                    };

            }
        );


        // ==================================================
        // CANVAS SIZE
        // ==================================================

        overlay.width =
            video.videoWidth;


        overlay.height =
            video.videoHeight;


        captureCanvas.width =
            video.videoWidth;


        captureCanvas.height =
            video.videoHeight;


        // ==================================================
        // BUTTONS
        // ==================================================

        startBtn.disabled =
            true;


        captureBtn.disabled =
            false;


        stopBtn.disabled =
            false;


        cameraRunning =
            true;


        status.textContent =
            "Camera ready. Show your hand.";


        requestAnimationFrame(
            detectFrame
        );

    }

    catch (error) {

        console.error(
            "Camera error:",
            error
        );


        startBtn.disabled =
            false;


        status.textContent =
            "Camera error: " +
            error.message;

    }

}


// ==================================================
// STOP CAMERA
// ==================================================

function stopCamera() {

    cameraRunning =
        false;


    if (cameraStream) {

        cameraStream
        .getTracks()
        .forEach(
            track => {

                track.stop();

            }
        );


        cameraStream =
            null;

    }


    video.srcObject =
        null;


    overlayCtx.clearRect(

        0,
        0,

        overlay.width,
        overlay.height

    );


    startBtn.disabled =
        false;


    captureBtn.disabled =
        true;


    stopBtn.disabled =
        true;


    status.textContent =
        "Camera stopped.";

}


// ==================================================
// DRAW HAND
// ==================================================


function drawHand(landmarks) {
    // Tracking continues; visual landmarks are disabled.
    overlayCtx.clearRect(
        0,
        0,
        overlay.width,
        overlay.height
    );
}



    // ==================================================
    // HAND CONNECTIONS
    // ==================================================

    const connections = [

        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],

        [0, 5],
        [5, 6],
        [6, 7],
        [7, 8],

        [5, 9],
        [9, 10],
        [10, 11],
        [11, 12],

        [9, 13],
        [13, 14],
        [14, 15],
        [15, 16],

        [13, 17],
        [17, 18],
        [18, 19],
        [19, 20],

        [0, 17]

    ];


    // ==================================================
    // DRAW LINES
    // ==================================================

    overlayCtx.strokeStyle =
        "#00ff88";


    overlayCtx.lineWidth =
        3;


    for (
        const [a, b]
        of connections
    ) {

        const pointA =
            landmarks[a];


        const pointB =
            landmarks[b];


        overlayCtx.beginPath();


        overlayCtx.moveTo(

            pointA.x *
                overlay.width,

            pointA.y *
                overlay.height

        );


        overlayCtx.lineTo(

            pointB.x *
                overlay.width,

            pointB.y *
                overlay.height

        );


        overlayCtx.stroke();

    }


    // ==================================================
    // DRAW 21 DOTS
    // ==================================================

    overlayCtx.fillStyle =
        "#ff0000";


    for (
        const point
        of landmarks
    ) {

        const x =
            point.x *
            overlay.width;


        const y =
            point.y *
            overlay.height;


        overlayCtx.beginPath();


        overlayCtx.arc(

            x,
            y,

            5,

            0,

            Math.PI * 2

        );


        overlayCtx.fill();

    }




// ==================================================
// DETECT HAND
// ==================================================

function detectFrame() {

    if (
        !cameraRunning ||
        !handLandmarker
    ) {

        return;

    }


    if (
        video.readyState >= 2
    ) {

        if (
            video.currentTime !==
            lastVideoTime
        ) {

            lastVideoTime =
                video.currentTime;


            const result =
                handLandmarker
                .detectForVideo(

                    video,

                    performance.now()

                );


            if (
                result.landmarks &&
                result.landmarks.length > 0
            ) {

                drawHand(
                    result.landmarks[0]
                );


                status.textContent =
                    "Hand detected. Click Capture & Predict.";

            }

            else {

                overlayCtx.clearRect(

                    0,
                    0,

                    overlay.width,
                    overlay.height

                );


                status.textContent =
                    "No hand detected.";

            }

        }

    }


    requestAnimationFrame(
        detectFrame
    );

}


// ==================================================
// GET HAND BOUNDING BOX
// ==================================================

function getHandBox(
    landmarks
) {

    let minX =
        video.videoWidth;


    let minY =
        video.videoHeight;


    let maxX =
        0;


    let maxY =
        0;


    for (
        const point
        of landmarks
    ) {

        const x =
            point.x *
            video.videoWidth;


        const y =
            point.y *
            video.videoHeight;


        minX =
            Math.min(
                minX,
                x
            );


        minY =
            Math.min(
                minY,
                y
            );


        maxX =
            Math.max(
                maxX,
                x
            );


        maxY =
            Math.max(
                maxY,
                y
            );

    }


    const width =
        maxX - minX;


    const height =
        maxY - minY;


    if (
        width <= 0 ||
        height <= 0
    ) {

        return null;

    }


    // ==================================================
    // PADDING
    // ==================================================

    const paddingX =
        width * 0.25;


    const paddingY =
        height * 0.25;


    minX =
        Math.max(
            0,
            minX - paddingX
        );


    minY =
        Math.max(
            0,
            minY - paddingY
        );


    maxX =
        Math.min(
            video.videoWidth,
            maxX + paddingX
        );


    maxY =
        Math.min(
            video.videoHeight,
            maxY + paddingY
        );


    return {

        x:
            Math.floor(
                minX
            ),

        y:
            Math.floor(
                minY
            ),

        width:
            Math.floor(
                maxX - minX
            ),

        height:
            Math.floor(
                maxY - minY
            )

    };

}


// ==================================================
// CAPTURE BUTTON
// ==================================================

async function captureAndPredict() {

    if (
        !cameraRunning ||
        processingCapture
    ) {

        return;

    }


    processingCapture =
        true;


    captureBtn.disabled =
        true;


    status.textContent =
        "Capturing hand...";


    try {

        // ==================================================
        // DETECT HAND RIGHT NOW
        // ==================================================

        const result =
            handLandmarker
            .detectForVideo(

                video,

                performance.now()

            );


        if (
            !result.landmarks ||
            result.landmarks.length === 0
        ) {

            throw new Error(
                "No hand detected. Show your hand clearly."
            );

        }


        const landmarks =
            result.landmarks[0];


        // Draw current landmarks

        drawHand(
            landmarks
        );


        // ==================================================
        // GET HAND BOX
        // ==================================================

        const box =
            getHandBox(
                landmarks
            );


        if (!box) {

            throw new Error(
                "Could not calculate hand area."
            );

        }


        // ==================================================
        // CAPTURE FULL FRAME
        // ==================================================

        captureCtx.drawImage(

            video,

            0,
            0,

            video.videoWidth,
            video.videoHeight

        );


        // ==================================================
        // CLEAR PREVIOUS CROP
        // ==================================================

        cropCtx.clearRect(

            0,
            0,

            224,
            224

        );


        // ==================================================
        // CROP ONLY HAND
        // ==================================================

        cropCtx.drawImage(

            captureCanvas,

            box.x,
            box.y,

            box.width,
            box.height,

            0,
            0,

            224,
            224

        );


        status.textContent =
            "Hand captured. Sending to 4 models...";


        // ==================================================
        // SEND TO DJANGO
        // ==================================================

        await sendPrediction();


    }

    catch (error) {

        console.error(
            "Capture error:",
            error
        );


        status.textContent =
            "Error: " +
            error.message;

    }

    finally {

        processingCapture =
            false;


        if (cameraRunning) {

            captureBtn.disabled =
                false;

        }

    }

}


// ==================================================
// SEND IMAGE TO DJANGO
// ==================================================

async function sendPrediction() {

    // ==================================================
    // CONVERT CROP TO IMAGE
    // ==================================================

    const blob =
        await new Promise(
            resolve => {

                cropPreview.toBlob(

                    resolve,

                    "image/jpeg",

                    0.90

                );

            }
        );


    if (!blob) {

        throw new Error(
            "Could not create image."
        );

    }


    // ==================================================
    // FORM DATA
    // ==================================================

    const formData =
        new FormData();


    formData.append(

        "image",

        blob,

        "hand_capture.jpg"

    );


    // ==================================================
    // CSRF
    // ==================================================

    const csrfElement =
        document.querySelector(
            'meta[name="csrf-token"]'
        );


    if (!csrfElement) {

        throw new Error(
            "CSRF token not found."
        );

    }


    const csrfToken =
        csrfElement.content;


    // ==================================================
    // SEND
    // ==================================================

    const response =
        await fetch(

            "/predict/",

            {

                method:
                    "POST",

                headers: {

                    "X-CSRFToken":
                        csrfToken

                },

                body:
                    formData

            }

        );


    // ==================================================
    // RESPONSE
    // ==================================================

    let data;


    try {

        data =
            await response.json();

    }

    catch (error) {

        throw new Error(
            "Django returned an invalid response."
        );

    }


    // ==================================================
    // SERVER ERROR
    // ==================================================

    if (
        !response.ok ||
        !data.ok
    ) {

        throw new Error(

            data.error ||
            `Server error: ${response.status}`

        );

    }


    // ==================================================
    // FINAL RESULT
    // ==================================================

    prediction.textContent =
        String(
            data.prediction
        ).toUpperCase();


    confidence.textContent =
        `Confidence: ${data.confidence}%`;


    agreement.textContent =
        `Model Agreement: ${data.agreement}/4`;


    // ==================================================
    // PROBABILITIES
    // ==================================================

    if (
        data.probabilities
    ) {

        const paper =
            Number(
                data.probabilities.paper
            );


        const rock =
            Number(
                data.probabilities.rock
            );


        const scissors =
            Number(
                data.probabilities.scissors
            );


        paperBar.style.width =
            `${paper}%`;


        rockBar.style.width =
            `${rock}%`;


        scissorsBar.style.width =
            `${scissors}%`;


        paperValue.textContent =
            `${paper}%`;


        rockValue.textContent =
            `${rock}%`;


        scissorsValue.textContent =
            `${scissors}%`;

    }


    // ==================================================
    // 4 MODEL RESULTS
    // ==================================================

    if (
        Array.isArray(
            data.models
        )
    ) {

        data.models.forEach(

            (model, index) => {

                if (
                    !modelElements[index]
                ) {

                    return;

                }


                const name =
                    model.model ||
                    `Model ${index + 1}`;


                const result =
                    String(
                        model.prediction ||
                        "unknown"
                    ).toUpperCase();


                const conf =
                    model.confidence ??
                    0;


                modelElements[index]
                    .textContent =

                    `${name}: ` +
                    `${result} ` +
                    `(${conf}%)`;

            }

        );

    }


    status.textContent =
        "Prediction complete.";

}


// ==================================================
// BUTTON EVENTS
// ==================================================

startBtn.addEventListener(

    "click",

    startCamera

);


captureBtn.addEventListener(

    "click",

    captureAndPredict

);


stopBtn.addEventListener(

    "click",

    stopCamera

);


// ==================================================
// PAGE CLOSE
// ==================================================

window.addEventListener(

    "beforeunload",

    stopCamera

);
