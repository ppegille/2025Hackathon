# main.py
 
import os
import base64
import requests
import tempfile

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from openai import OpenAI

# 환경 변수 로드
load_dotenv()

# FastAPI 앱 초기화
app = FastAPI(
    title="소개팅 시뮬레이션 API",
    description="긴장한 여성과의 소개팅 대화 시뮬레이션",
    version="1.0.0"
)

# CORS 설정 (필요한 경우)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인으로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI API 키 확인
OPENAI_API_KEY = "YOUR_API_KEY"
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.")

# OpenAI 클라이언트 초기화
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# LangChain ChatOpenAI 초기화
llm = ChatOpenAI(
    model="gpt-4o-mini",  # GPT-4.1 mini
    temperature=0.8,  # 자연스러운 대화를 위해 약간 높은 temperature
    openai_api_key=OPENAI_API_KEY
)

# 프롬프트 템플릿 설정
PROMPT_TEMPLATE = ChatPromptTemplate.from_messages([
    ("system", """당신은 소개팅에 나온 긴장한 20대 후반 여성입니다.

성격 및 특징:
- 수줍음이 많고 조심스럽지만 친절한 성격
- 진지하게 대화하려고 노력하지만 긴장감이 느껴짐
- 상대방에게 관심이 있어서 대화를 이어가려고 노력함
- 가끔 눈을 마주치기 어려워하거나 말끝을 흐림

말투 가이드:
- "음...", "저기...", "그게...", "아..." 같은 표현을 자연스럽게 사용
- 문장을 너무 길게 만들지 않음 (2-3문장 정도)
- 가끔 말을 더듬거나 멈칫거리는 느낌
- 상대방의 말에 공감하고 호응하며, 질문으로 대화를 이어감
- 예: "네, 그러니까… 저도 그런 거 좋아해요.", "아, 정말요? 어떤 게 제일 재미있으셨어요?"

주의사항:
- 너무 적극적이거나 대담하지 않음
- 자연스럽게 긴장한 느낌을 유지
- 상대방을 배려하는 태도
- 진부한 표현보다는 자연스러운 대화체 사용"""),
    ("human", "{message}")
])

# 요청/응답 모델
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500, description="사용자의 메시지")

class ChatResponse(BaseModel):
    audio: str = Field(..., description="Base64 인코딩된 MP3 오디오")

# 헬스 체크 엔드포인트
@app.get("/")
async def root():
    return {
        "message": "소개팅 시뮬레이션 API가 정상 작동 중입니다.",
        "endpoints": {
            "chat": "POST /chat - 메시지를 보내고 답변과 음성을 받습니다."
        }
    }

# 메인 챗 엔드포인트
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    사용자의 메시지를 받아 GPT-4.1 mini로 답변을 생성하고,
    OpenAI TTS-1로 음성을 생성하여 Base64로 인코딩하여 반환합니다.
    """
    try:
        # 1. LangChain을 사용한 GPT 답변 생성
        chain = PROMPT_TEMPLATE | llm
        response = chain.invoke({"message": request.message})
        answer_text = response.content.strip()

        # 2. OpenAI TTS-1을 사용한 음성 생성
        tts_response = openai_client.audio.speech.create(
            model="tts-1",
            voice="nova",  # 자연스러운 여성 목소리 (shimmer, alloy도 가능)
            speed=0.9,  # 약간 느리게 (긴장감 표현)
            input=answer_text,
            response_format="mp3"
        )

        # 3. 음성 데이터를 Base64로 인코딩
        audio_bytes = tts_response.content
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')

        # 4. 응답 반환 (오디오만)
        return ChatResponse(
            audio=audio_base64
        )

    except Exception as e:
        # 에러 처리
        raise HTTPException(
            status_code=500,
            detail=f"처리 중 오류가 발생했습니다: {str(e)}"
        )

# 음성 채팅 엔드포인트 (MP3 파일 업로드)
@app.post("/voice-chat")
async def voice_chat(file: UploadFile = File(...)):
    """
    MP3 오디오 파일을 받아서:
    1. STT API로 텍스트 변환
    2. GPT로 답변 생성
    3. TTS로 음성 생성
    4. 모든 결과를 반환

    Parameters:
    - file: MP3 오디오 파일

    Returns:
    - recognized_text: STT로 인식된 텍스트
    - answer: GPT가 생성한 답변
    - audio: Base64 인코딩된 TTS 음성
    """

    # 파일 형식 검증 (audio/ 또는 video/webm 허용)
    if not (file.content_type.startswith('audio/') or file.content_type == 'video/webm'):
        raise HTTPException(
            status_code=400,
            detail=f"오디오 파일만 업로드 가능합니다. 현재 타입: {file.content_type}"
        )

    try:
        # Step 1: STT API로 음성을 텍스트로 변환
        print(f"📤 STT API로 파일 전송: {file.filename}")

        # 파일을 multipart/form-data로 STT API에 전송
        file_content = await file.read()
        files = {
            'file': (file.filename, file_content, file.content_type)
        }

        stt_response = requests.post(
            'http://localhost:5001/transcribe',
            files=files,
            timeout=30  # 30초 타임아웃
        )

        if stt_response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"STT API 오류: {stt_response.text}"
            )

        stt_data = stt_response.json()
        recognized_text = stt_data['text']
        print(f"✅ 인식된 텍스트: {recognized_text}")

        # Step 2: GPT로 답변 생성
        print("🤖 GPT 답변 생성 중...")
        chain = PROMPT_TEMPLATE | llm
        response = chain.invoke({"message": recognized_text})
        answer_text = response.content.strip()
        print(f"✅ GPT 답변: {answer_text}")

        # Step 3: TTS로 음성 생성
        print("🔊 TTS 음성 생성 중...")
        tts_response = openai_client.audio.speech.create(
            model="tts-1",
            voice="nova",
            speed=0.9,
            input=answer_text,
            response_format="mp3"
        )

        # Base64 인코딩
        audio_bytes = tts_response.content
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        print("✅ 음성 생성 완료")

        # Step 4: 통합 응답 반환 (유저 텍스트 + AI 오디오)
        return {
            "recognized_text": recognized_text,  # 사용자가 말한 내용
            "audio": audio_base64                 # AI 음성 (Base64)
        }

    except requests.exceptions.RequestException as e:
        print(f"❌ STT API 연결 오류: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail=f"STT 서버에 연결할 수 없습니다. STT 서버가 실행 중인지 확인하세요. (http://localhost:5001)"
        )
    except Exception as e:
        print(f"❌ 처리 중 오류: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"처리 중 오류가 발생했습니다: {str(e)}"
        )


# 개발 서버 실행을 위한 코드 (선택사항)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )