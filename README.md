# 🎭 AI 소개팅 시뮬레이션

긴장한 여성과의 소개팅 대화를 시뮬레이션하는 AI 챗봇 시스템입니다. GPT-4o-mini와 OpenAI TTS를 활용하여 자연스러운 대화와 음성을 제공합니다.

## ✨ 주요 기능

- **실시간 음성 대화**: 사용자의 음성을 인식하고 AI가 음성으로 응답
- **자연스러운 AI 페르소나**: 긴장한 20대 후반 여성의 특징을 살린 대화 스타일
- **STT → GPT → TTS 파이프라인**: 완전한 음성 대화 경험
- **웹 인터페이스**: React 기반 프론트엔드 제공

## 🏗️ 시스템 아키텍처

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   Client    │ ───► │  Main API    │ ───► │  STT Server  │
│  (React)    │      │  (FastAPI)   │      │  (Whisper)   │
└─────────────┘      └──────────────┘      └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   OpenAI     │
                     │ GPT + TTS    │
                     └──────────────┘
```

### 구성 요소

1. **Main API Server** ([main.py](main.py))
   - FastAPI 기반 메인 서버
   - GPT-4o-mini를 통한 대화 생성
   - OpenAI TTS-1을 통한 음성 합성
   - 포트: `8000`

2. **STT Server** ([stt_server.py](stt_server.py))
   - Whisper 모델을 사용한 음성 인식
   - MP3/WebM 파일을 텍스트로 변환
   - 포트: `5001`

3. **Client** (hackathon1024Full/client/)
   - React + Vite 기반 웹 인터페이스
   - 음성 녹음 및 재생 기능
   - 실시간 대화 UI

## 🚀 빠른 시작

### 필수 요구사항

- Python 3.8+
- Node.js 16+
- OpenAI API Key

### 1. 백엔드 서버 설정

#### 의존성 설치

```bash
pip install fastapi uvicorn python-dotenv
pip install langchain langchain-openai openai
pip install openai-whisper
pip install requests python-multipart
```

#### 환경 변수 설정

[main.py](main.py:37)의 `YOUR_API_KEY`를 실제 OpenAI API 키로 변경하거나, `.env` 파일을 생성:

```bash
OPENAI_API_KEY=your_api_key_here
```

### 2. 서버 실행

**터미널 1: STT 서버**
```bash
python stt_server.py
```
- 서버 주소: http://localhost:5001
- API 문서: http://localhost:5001/docs

**터미널 2: 메인 API 서버**
```bash
python main.py
```
- 서버 주소: http://localhost:8000
- API 문서: http://localhost:8000/docs

### 3. 프론트엔드 실행 (선택사항)

```bash
cd hackathon1024Full/client
npm install
npm run dev
```

## 📡 API 엔드포인트

### Main API (Port 8000)

#### `POST /chat`
텍스트 메시지를 받아 AI 응답과 음성을 반환합니다.

**요청:**
```json
{
  "message": "안녕하세요, 반가워요!"
}
```

**응답:**
```json
{
  "audio": "base64_encoded_mp3_audio"
}
```

#### `POST /voice-chat`
음성 파일을 받아 텍스트 변환 → AI 응답 → 음성 생성의 전체 파이프라인을 실행합니다.

**요청:**
- `file`: MP3 또는 WebM 오디오 파일

**응답:**
```json
{
  "recognized_text": "사용자가 말한 내용",
  "audio": "base64_encoded_mp3_audio"
}
```

### STT API (Port 5001)

#### `POST /transcribe`
오디오 파일을 한국어 텍스트로 변환합니다.

**요청:**
- `file`: MP3 또는 WebM 오디오 파일

**응답:**
```json
{
  "text": "인식된 텍스트",
  "language": "ko",
  "filename": "uploaded_file.mp3"
}
```

## 🎯 AI 페르소나 특징

프롬프트 엔지니어링을 통해 구현된 AI 캐릭터 특징:

- **성격**: 수줍음이 많고 조심스럽지만 친절함
- **말투**: "음...", "저기...", "그게..." 등 자연스러운 주저함 표현
- **대화 스타일**:
  - 2-3문장의 짧은 응답
  - 공감과 호응을 통한 대화 이어가기
  - 상대방을 배려하는 태도
- **음성**:
  - OpenAI TTS-1 "nova" 보이스 사용
  - 0.9배속으로 긴장감 표현

## 🛠️ 기술 스택

### Backend
- **FastAPI**: 고성능 웹 프레임워크
- **LangChain**: LLM 애플리케이션 개발 프레임워크
- **OpenAI GPT-4o-mini**: 대화 생성
- **OpenAI TTS-1**: 음성 합성
- **Whisper (base)**: 음성 인식

### Frontend
- **React**: UI 라이브러리
- **Vite**: 빌드 도구
- **TanStack Router**: 라우팅

## 📁 프로젝트 구조

```
.
├── main.py                    # 메인 API 서버
├── stt_server.py             # STT 서버
├── hackathon1024Full/
│   └── client/               # React 프론트엔드
│       ├── src/
│       │   ├── features/     # 기능별 컴포넌트
│       │   ├── routes/       # 페이지 라우트
│       │   └── shared/       # 공통 컴포넌트
│       └── public/           # 정적 파일
└── README.md
```

## ⚠️ 주의사항

1. **API 키 보안**: 프로덕션 환경에서는 API 키를 환경 변수로 관리하세요
2. **CORS 설정**: 현재 모든 Origin을 허용하고 있으므로, 프로덕션에서는 특정 도메인으로 제한하세요
3. **STT 서버 필수**: `/voice-chat` 엔드포인트 사용 시 STT 서버가 실행 중이어야 합니다
4. **오디오 파일 크기**: 최소 5KB 이상의 오디오 파일이 필요합니다

## 🔧 트러블슈팅

### STT 서버 연결 오류
```
STT 서버에 연결할 수 없습니다
```
→ `python stt_server.py`로 STT 서버가 실행 중인지 확인하세요

### Whisper 모델 로딩 오류
→ `pip install openai-whisper`로 Whisper를 재설치하세요

### API 키 오류
→ [main.py](main.py:37)의 `OPENAI_API_KEY` 설정을 확인하세요

## 📝 라이선스

이 프로젝트는 교육 및 연구 목적으로 제작되었습니다.

## 🤝 기여

버그 리포트 및 기능 제안은 Issues를 통해 제출해 주세요.

---

**Made with ❤️ for Hackathon 2024**
