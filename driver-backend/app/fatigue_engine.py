import cv2
import numpy as np
import time
from collections import deque
from scipy.spatial import distance as dist
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from mediapipe.tasks.python.vision.core import image as mp_image_module

from .config import (
    EYE_AR_CONSEC_FRAMES,
    PERCLOS_WINDOW,
    DROWSY_CONFIRM_FRAMES
)


class FatigueEngine:
    def __init__(self, model_path):
        base_options = python.BaseOptions(model_asset_path=model_path)
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            num_faces=1
        )
        self.detector = vision.FaceLandmarker.create_from_options(options)

        # State Variables
        self.COUNTER = 0
        self.perclos_window = deque(maxlen=PERCLOS_WINDOW)
        self.blink_times = deque()
        self.yawn_events = 0
        self.smoothed_fatigue = 0
        self.drowsy_counter = 0
        self.prev_eye_closed = False

        self.LEFT_EYE = [33, 160, 158, 133, 153, 144]
        self.RIGHT_EYE = [362, 385, 387, 263, 373, 380]

        self.EYE_AR_THRESH = 0.25

        # NOTE: Face landmarker task file should be in the same folder as main.py (project root driver-backend)

    def eye_aspect_ratio(self, eye):
        A = dist.euclidean(eye[1], eye[5])
        B = dist.euclidean(eye[2], eye[4])
        C = dist.euclidean(eye[0], eye[3])
        return (A + B) / (2.0 * C)

    def update_blink_detection(self, eye_closed):
        """Update blink detection and return blink rate."""
        current_time = time.time()
        if self.prev_eye_closed and not eye_closed:
            self.blink_times.append(current_time)
        self.prev_eye_closed = eye_closed

        # Remove old blink times outside 60s window
        while self.blink_times and current_time - self.blink_times[0] > 60:
            self.blink_times.popleft()

        return len(self.blink_times)

    def calculate_perclos(self, eye_closed):
        """Calculate PERCLOS (percentage of eye closure)."""
        self.perclos_window.append(1 if eye_closed else 0)
        return (sum(self.perclos_window) / len(self.perclos_window)) * 100

    def calculate_fatigue_score(self, perclos, blink_rate, eye_closed):
        """Calculate fatigue score based on multiple metrics."""
        # Eye Closure Counter
        if eye_closed:
            self.COUNTER += 1
        else:
            self.COUNTER = 0

        # Fatigue Score Fusion
        fatigue_score = min(perclos, 40)

        if blink_rate < 8:
            fatigue_score += 20
        elif blink_rate < 12:
            fatigue_score += 10

        if self.COUNTER >= EYE_AR_CONSEC_FRAMES:
            fatigue_score += 20

        return min(fatigue_score, 100)

    def classify_status(self, fatigue_score):
        """Classify fatigue status based on smoothed score."""
        self.smoothed_fatigue = 0.8 * self.smoothed_fatigue + 0.2 * fatigue_score

        if self.smoothed_fatigue < 30:
            self.drowsy_counter = 0
            return "NORMAL"
        if self.smoothed_fatigue < 60:
            self.drowsy_counter = 0
            return "TIRED"
        
        self.drowsy_counter += 1
        if self.drowsy_counter >= DROWSY_CONFIRM_FRAMES:
            return "DROWSY"
        return "TIRED"

    def process_frame(self, frame):
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        mp_image = mp_image_module.Image(
            image_format=mp_image_module.ImageFormat.SRGB,
            data=rgb
        )

        result = self.detector.detect(mp_image)

        status = "NO_FACE"
        fatigue_score = 0

        if result.face_landmarks:
            landmarks = result.face_landmarks[0]
            h, w, _ = frame.shape

            left_eye = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in self.LEFT_EYE]
            right_eye = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in self.RIGHT_EYE]

            ear = (self.eye_aspect_ratio(left_eye) +
                   self.eye_aspect_ratio(right_eye)) / 2.0

            eye_closed = ear < self.EYE_AR_THRESH

            # Update blink detection
            blink_rate = self.update_blink_detection(eye_closed)

            # Calculate PERCLOS
            perclos = self.calculate_perclos(eye_closed)

            # Calculate fatigue score
            fatigue_score = self.calculate_fatigue_score(perclos, blink_rate, eye_closed)

            # Classify status
            status = self.classify_status(fatigue_score)

        return {
            "status": status,
            "fatigue_score": round(self.smoothed_fatigue, 2)
        }

