from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from .fatigue_engine import FatigueEngine
from .utils import base64_to_frame
import os

app = FastAPI()

model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "face_landmarker.task")
engine = FatigueEngine(model_path)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connected")

    try:
        while True:
            data = await websocket.receive_text()

            frame = base64_to_frame(data)
            result = engine.process_frame(frame)

            await websocket.send_json(result)

    except WebSocketDisconnect:
        print("Client disconnected safely")

    except Exception as e:
        print("Unexpected WebSocket error:", e)

