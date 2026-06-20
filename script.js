let baseline = null;

let baselineSamples = [];

let baselineReady = false;

const alertTimeSelect =
document.getElementById("alertTime");

const warningCountText =
document.getElementById("warningCount");

let badPostureStart = null;

let warningCount = 0;

let lastAlertTime = 0;

const cooldown = 30000;

const statusText =
document.getElementById("status");
const video = document.getElementById("video");

const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");

navigator.mediaDevices.getUserMedia({
    video:true
})
.then((stream)=>{

    video.srcObject = stream;

});
const pose = new Pose({

    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }

});
pose.setOptions({

    modelComplexity:1,

    smoothLandmarks:true,

    minDetectionConfidence:0.5,

    minTrackingConfidence:0.5

});
pose.onResults(onResults);
function onResults(results){

    canvas.width =
    video.videoWidth;

    canvas.height =
    video.videoHeight;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.drawImage(
        results.image,
        0,
        0,
        canvas.width,
        canvas.height
    );

    if(results.poseLandmarks)
    {
        const nose =
results.poseLandmarks[0];

const leftEar =
results.poseLandmarks[7];

const rightEar =
results.poseLandmarks[8];

const faceWidth =
Math.abs(
    leftEar.x - rightEar.x
);

if(!baselineReady)
{
    baselineSamples.push(faceWidth);

    if(baselineSamples.length >= 90)
    {
        baseline =
        baselineSamples.reduce(
            (a,b)=>a+b,
            0
        ) / baselineSamples.length;

        baselineReady = true;

        console.log(
            "기준 얼굴 크기 저장:",
            baseline
        );
    }

    statusText.textContent =
    "기준 자세 측정 중...";

    statusText.style.color =
    "orange";

    return;
}

const ratio =
faceWidth / baseline;

console.log(
    "얼굴비율:",
    ratio
);

const isBadPosture =
ratio > 1.12;

        if(isBadPosture)
{
    statusText.textContent =
    "현재 자세 : 거북목";
    statusText.style.color =
    "#e74c3c";

    if(!badPostureStart)
    {
        badPostureStart =
        Date.now();
    }

    const selectedSeconds =
    Number(alertTimeSelect.value);

    const elapsedTime =
    Date.now() -
    badPostureStart;

    if(
        elapsedTime >
        selectedSeconds * 1000
    )
    {
        triggerWarning();
    }
}
else
{
    statusText.textContent =
    "현재 자세 : 정상";
    statusText.style.color =
    "#27ae60";

    badPostureStart = null;
}

         drawConnectors(
            ctx,
            results.poseLandmarks,
            POSE_CONNECTIONS,
            {
                lineWidth:3
            }
        );

        drawLandmarks(
            ctx,
            results.poseLandmarks,
            {
                radius:4
            }
        );
}
}
const camera = new Camera(
    video,
    {
        onFrame: async () => {

            await pose.send({
                image: video
            });

        },

        width:640,
        height:480
    }
);

camera.start();
function triggerWarning()
{
    const now =
    Date.now();

    if(
        now -
        lastAlertTime <
        cooldown
    )
    {
        return;
    }

    lastAlertTime = now;

    warningCount++;

    warningCountText.textContent =
    `오늘 경고 횟수 : ${warningCount}`;

    const msg =
    new SpeechSynthesisUtterance(
        "자세를 바르게 해주세요."
    );

    speechSynthesis.speak(msg);
}