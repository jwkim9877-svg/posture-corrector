# AI Posture Corrector

실시간 웹캠 기반 AI 자세 교정 시스템입니다.

MediaPipe Pose를 활용하여 사용자의 자세를 분석하고, 거북목 자세가 일정 시간 이상 지속되면 음성 경고를 제공합니다.

---

## 주요 기능

### 실시간 자세 분석

* 웹캠을 통해 사용자의 자세를 실시간으로 분석
* MediaPipe Pose 랜드마크 활용

### 거북목 감지

* 사용자의 기준 자세를 저장
* 얼굴 크기 변화를 이용하여 거북목 여부 판단

### 음성 경고 시스템

* 잘못된 자세가 일정 시간 이상 지속될 경우 음성 알림 제공
* 경고 시간 설정 가능 (5초 / 30초 / 1분)

### 자세 점수 시스템

* 경고 발생 횟수를 기반으로 자세 점수 계산
* 점수는 100점부터 시작

### 자세 유지 시간 측정

* 바른 자세를 유지한 시간 실시간 표시

### 최고 기록 측정

* 가장 오래 바른 자세를 유지한 기록 저장

### 추천 스트레칭

* 거북목 감지 시 스트레칭 방법 추천

### 일일 자세 리포트

* 자세 점수
* 경고 횟수
* 등급(A~D)

---

## 사용 기술

* HTML5
* CSS3
* JavaScript
* MediaPipe Pose
* Web Speech API

---

## 실행 방법

### GitHub Pages

아래 주소에서 실행 가능합니다.

https://jwkim9877-svg.github.io/posture-corrector/

### 로컬 실행

1. 프로젝트 다운로드
2. Visual Studio Code 실행
3. Live Server 실행
4. 웹캠 권한 허용

---

## 프로젝트 구조

text
AI-Posture-Corrector
│
├── index.html
├── style.css
├── script.js
└── README.md

---

## 개발자

김지원

2026 Software Project
