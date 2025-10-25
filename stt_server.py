"""
STT 서버 - Whisper 모델을 사용한 음성-텍스트 변환
MP3 파일을 받아서 텍스트로 변환하는 API 서버
"""

import os
import whisper
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile

# FastAPI 앱 초기화
app = FastAPI(
    title="STT API with Whisper",
    description="MP3 파일을 받아 텍스트로 변환하는 STT 서버",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Whisper 모델 로드 (서버 시작 시 1번만 로드)
print("🔄 Whisper 모델 로딩 중…")
# base: 빠른 속도, small/medium: 정확도 향상, large: 최고 정확도
model = whisper.load_model("base")
print("✅ Whisper 모델 로딩 완료!")

@app.get("/")
async def root():
    """헬스 체크"""
    return {
        "status": "running",
        "message": "STT API 서버가 정상 작동 중입니다.",
        "model": "whisper-base",
        "endpoint": "POST /transcribe - MP3 파일을 업로드하여 텍스트로 변환"
    }

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    MP3 파일을 받아서 한국어 텍스트로 변환

    Parameters:
    - file: MP3 오디오 파일

    Returns:
    - text: 인식된 텍스트
    """

    # 파일 형식 검증 (audio/ 또는 video/webm 허용)
    if not (file.content_type.startswith('audio/') or file.content_type == 'video/webm'):
        raise HTTPException(
            status_code=400,
            detail=f"오디오 파일만 업로드 가능합니다. 현재 타입: {file.content_type}"
        )

    try:
        # 파일 확장자 결정 (WebM은 .webm, 나머지는 원본 확장자 사용)
        file_ext = '.webm' if 'webm' in file.content_type else '.mp3'

        # 임시 파일로 저장 (Whisper가 파일 경로를 필요로 함)
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            # 업로드된 파일 내용을 임시 파일에 쓰기
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        print(f"📝 파일 수신: {file.filename} ({len(content)} bytes)")

        # 파일 크기 검증 (WebM 헤더를 포함한 최소 크기)
        if len(content) < 5000:
            raise HTTPException(
                status_code=400,
                detail=f"오디오 파일이 너무 작습니다 ({len(content)} bytes). 최소 5KB 이상이어야 합니다."
            )

        # Whisper로 음성 인식
        print("🎤 음성 인식 시작...")
        try:
            result = model.transcribe(
                temp_file_path,
                language="ko",  # 한국어 지정
                task="transcribe",  # 번역이 아닌 전사(transcription)로 명시
                initial_prompt="한국어로 말하고 있습니다.",  # 한국어 힌트 제공
                temperature=0,  # 일관성 향상, 환각(hallucination) 감소
                fp16=False      # CPU 사용 시 False
            )

            recognized_text = result["text"].strip()
            print(f"✅ 인식 완료: {recognized_text}")
        except Exception as whisper_error:
            print(f"❌ Whisper 오류: {str(whisper_error)}")
            # 파일 손상 가능성 처리
            raise HTTPException(
                status_code=422,
                detail=f"오디오 파일 처리 실패. 파일이 손상되었거나 지원하지 않는 형식일 수 있습니다."
            )

        # 임시 파일 삭제
        os.unlink(temp_file_path)

        return {
            "text": recognized_text,
            "language": "ko",
            "filename": file.filename
        }

    except Exception as e:
        # 에러 발생 시 임시 파일 정리
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
            except:
                pass

        print(f"❌ 에러: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"음성 인식 중 오류 발생: {str(e)}"
        )

# 서버 실행
if __name__ == "__main__":
    import uvicorn
    print("🚀 STT 서버 시작...")
    print("📍 URL: http://0.0.0.0:5001")
    print("📍 API 문서: http://localhost:5001/docs")
    uvicorn.run(
        "stt_server:app",
        host="0.0.0.0",
        port=5001,
        reload=True
    )