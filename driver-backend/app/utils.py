import base64
import numpy as np
import cv2


def base64_to_frame(data: str):
    """
    Convert base64 image string to OpenCV frame
    """
    img_bytes = base64.b64decode(data.split(",")[1])
    np_arr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return frame

