import cv2
import mediapipe as mp
import numpy as np

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    smooth_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
)
mp_drawing = mp.solutions.drawing_utils

# Function to determine visible side
def get_visible_side(landmarks):
    if landmarks:
        left_depth = landmarks[11].z
        right_depth = landmarks[12].z
        return "left" if left_depth < right_depth else "right"
    return None

# Calculate distance between two landmarks (scaled with distance from camera)
# Calculate distance based only on Y-coordinates
def calculate_distance_y(landmarks, index1, index2, frame_shape):
    if landmarks:
        y1 = landmarks[index1].y * frame_shape[0]
        y2 = landmarks[index2].y * frame_shape[0]
        return abs(y2 - y1)  # Absolute difference in Y-coordinates
    return None


# Function to draw the arm with conditional coloring
def draw_side_arm(frame, landmarks, side, frame_shape, color):
    arm_points = [11, 13, 15] if side == "left" else [12, 14, 16]
    for i in range(len(arm_points) - 1):
        point1 = (
            int(landmarks[arm_points[i]].x * frame_shape[1]),
            int(landmarks[arm_points[i]].y * frame_shape[0]),
        )
        point2 = (
            int(landmarks[arm_points[i + 1]].x * frame_shape[1]),
            int(landmarks[arm_points[i + 1]].y * frame_shape[0]),
        )
        cv2.line(frame, point1, point2, color, 2)
        cv2.circle(frame, point1, 5, color, -1)

# Function to get coordinates of a specific body part
def get_landmark_coordinates(landmarks, part_index, frame_shape):
    if landmarks:
        x = int(landmarks[part_index].x * frame_shape[1])  # Scale x by frame width
        y = int(landmarks[part_index].y * frame_shape[0])  # Scale y by frame height
        return (x, y)
    return None

# Function for ear-hip calibration using Y-axis only
def calculate_ear_hip_distance_y(landmarks, frame_shape, side):
    if landmarks:
        ear_index = 3 if side == "left" else 4
        hip_index = 23 if side == "left" else 24
        return calculate_distance_y(landmarks, ear_index, hip_index, frame_shape)
    return None

# Dynamic threshold based on shoulder-to-hip distance
def get_dynamic_threshold(ear_hip_distance, side_distance):
    return side_distance/ear_hip_distance  # Adjust multiplier based on experimentation

# Draw rectangle around incorrect body parts
def draw_feedback_rectangle(frame, coordinates, label, color):
    if coordinates:
        x, y = coordinates
        rect_start = (x - 20, y - 20)
        rect_end = (x + 20, y + 20)
        cv2.rectangle(frame, rect_start, rect_end, color, 2)
        cv2.putText(frame, label, (x + 25, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

# Calculate moving average for smoothing distances
distance_history_ear_hip = []
distance_history_side = []
def smooth_distance(current_distance, history, window_size=5):
    history.append(current_distance)
    if len(history) > window_size:
        history.pop(0)
    return np.mean(history)

def calculate_scaling_factor(observed_ear_hip_distance, known_ear_hip_distance=216):
    return known_ear_hip_distance / observed_ear_hip_distance

# Initialize Video Capture
cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image.flags.writeable = False
    results = pose.process(image)

    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        frame_shape = frame.shape
        visible_side = get_visible_side(landmarks)

        # Calculate elbow-to-chin distance for visible side
        shoulder_index = 11 if visible_side == "left" else 12
        elbow_index = 13 if visible_side == "left" else 14
        hip_index = 23 if visible_side == "left" else 24
        chin_index = 0  # Nose acts as chin in this estimation
        side_distance = calculate_distance_y(landmarks, elbow_index, chin_index, frame_shape)
        smoothed_side_distance = smooth_distance(side_distance, distance_history_side)

        # Get coordinates for key landmarks
        shoulder = get_landmark_coordinates(landmarks, shoulder_index, frame.shape)

        # Calibration based on ear-hip distance
        ear_hip_distance = calculate_ear_hip_distance_y(landmarks, frame.shape, visible_side)
        smoothed_ear_hip_distance = smooth_distance(ear_hip_distance, distance_history_ear_hip)

        # Calculate sclaing factor based on know ear hip distance at 1m from camera
        scaling_factor = calculate_scaling_factor(smoothed_ear_hip_distance)

        if ear_hip_distance:
            dynamic_threshold = get_dynamic_threshold(smoothed_ear_hip_distance*scaling_factor, smoothed_side_distance*scaling_factor)

        # Check if technique is correct
        estimated_threshold = 0.14 # pixel; adjust as needed
        if dynamic_threshold:
            is_correct = smoothed_side_distance and dynamic_threshold < estimated_threshold

        # Draw the arm with respective color
        arm_color = (0, 255, 0) if is_correct else (0, 0, 255)
        draw_side_arm(image, landmarks, visible_side, frame_shape, arm_color)

        # Visual feedback
        if is_correct:
            cv2.putText(image, "Great Jab!", (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        if not is_correct:
            draw_feedback_rectangle(image, shoulder, "Adjust Shoulder", (0, 0, 255))
            cv2.putText(image, "Technique Incorrect: Fix Jab", (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        # Display the side distance
        display_measurments = False
        if display_measurments:
            cv2.putText(
                image,
                f"{visible_side.capitalize()} Side Distance: {smoothed_side_distance:.2f} {smoothed_ear_hip_distance:.2f} {dynamic_threshold:.2f}px"
                #f"Shoulder Distance: {shoulder_elbow_distance:.2f} px"
                if side_distance
                else "N/A",
                (10, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 255, 0),
                2,
            )

    cv2.imshow("Side-View Jab Tracking", image)

    if cv2.waitKey(10) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()