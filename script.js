const stretchingTip =
document.getElementById(
    "stretchingTip"
);

let goodPostureStart =
Date.now();

const postureScore =
document.getElementById(
    "postureScore"
);

const bestPostureTime =
document.getElementById(
    "bestPostureTime"
);

let bestTime = 0;

const dailyReport =
document.getElementById(
    "dailyReport"
);

const goodPostureTime =
document.getElementById(
    "goodPostureTime"
);

const resetBtn =
document.getElementById("resetBtn");

let currentTip =
"좋은 자세를 유지하세요 👍";

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
    goodPostureStart =
    Date.now();

    if(!badPostureStart)
{
    badPostureStart =
    Date.now();

    const tips = [

    "목 뒤로 젖히기 5초",

    "어깨 돌리기 10회",

    "목 좌우 스트레칭",

    "가슴 펴고 어깨 뒤로 당기기",

    "턱 당기기 운동 10회"

    ];

    currentTip =
    tips[
        Math.floor(
            Math.random() *
            tips.length
        )
    ];

    stretchingTip.textContent =
    currentTip;
}


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

 stretchingTip.textContent =
"좋은 자세를 유지하세요 👍";

    statusText.textContent =
"현재 자세 : 정상 ✅";

statusText.style.color =
"#22c55e";

badPostureStart = null;

const elapsed =
Math.floor(
(
Date.now() -
goodPostureStart
)
/1000
);

if(elapsed > bestTime)
{
    bestTime = elapsed;
}

const minutes =
Math.floor(
elapsed / 60
);

const seconds =
elapsed % 60;

goodPostureTime.textContent =
`${minutes}:${String(seconds).padStart(2,"0")}`;

const bestMinutes =
Math.floor(bestTime / 60);

const bestSeconds =
bestTime % 60;

bestPostureTime.textContent =
`${bestMinutes}:${String(bestSeconds).padStart(2,"0")}`;

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
resetBtn.addEventListener(
    "click",
    () =>
    {
        baseline = null;
        baselineSamples = [];
        baselineReady = false;
        goodPostureStart =
        Date.now();

        statusText.textContent =
        "기준 자세 측정 중...";
        statusText.style.color =
        "#f39c12";

    }
);
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

   let score =
    100 - warningCount * 5;
    if(score < 0)
{
    score = 0;
}

postureScore.textContent =
`${score}점`;

warningCountText.textContent =
warningCount;

let grade = "A";

if(score < 90)
{
grade = "B";
}

if(score < 80)
{
grade = "C";
}

if(score < 70)
{
grade = "D";
}

dailyReport.innerHTML =
`자세 점수 : ${score}점<br>
경고 횟수 : ${warningCount}회<br>
등급 : ${grade}`;


    const msg =
    new SpeechSynthesisUtterance(
        "자세를 바르게 해주세요."
    );

    speechSynthesis.speak(msg);
}