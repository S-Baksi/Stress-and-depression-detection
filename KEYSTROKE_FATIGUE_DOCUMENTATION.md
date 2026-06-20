# Keystroke Fatigue Detection System

## Overview
Real-time fatigue detection through typing pattern analysis using LSTM deep learning model. Analyzes keystroke timing to identify fatigue levels.

## How It Works

### User Flow
1. User clicks "Start Test"
2. System displays a random paragraph (~150 characters)
3. User types the paragraph exactly as shown
4. System records keystroke timing data:
   - Key pressed
   - Press timestamp
   - Release timestamp
5. After 150 keystrokes, system sends data to backend
6. AI model analyzes patterns and returns fatigue level
7. Results displayed with confidence score

### Frontend Component
**File:** `src/KeystrokeFatigue.jsx`

**Features:**
- Typing test interface
- Real-time keystroke recording
- Progress tracking (keystrokes/150)
- WPM (Words Per Minute) calculation
- Error counting
- Visual feedback for correct/incorrect typing
- Fatigue analysis results display

## API Integration

### Endpoint
```
POST http://localhost:5005/predict-fatigue/keystrokes
```

### Request Format
```json
{
  "keystrokes": [
    {
      "Key": "T",
      "Press_Time": "2025-01-15 10:00:00.100",
      "Relase_Time": "2025-01-15 10:00:00.220"
    },
    {
      "Key": "h",
      "Press_Time": "2025-01-15 10:00:00.450",
      "Relase_Time": "2025-01-15 10:00:00.560"
    }
    // ... 148 more keystrokes
  ]
}
```

**Note:** API expects exactly 150 keystrokes

### Response Format
```json
{
  "fatigue_class": "Low",
  "confidence": 87.45,
  "predicted_class_index": 3,
  "probabilities": {
    "Above_Avg": 0.0234,
    "Avg": 0.0567,
    "Below_Avg": 0.0891,
    "Low": 0.8745,
    "No": 0.0345,
    "V_High": 0.0218
  }
}
```

## Fatigue Level Classification

| Index | Label | Color | Description |
|-------|-------|-------|-------------|
| 0 | Above Average | Red (#ef4444) | High fatigue detected |
| 1 | Average | Orange (#f59e0b) | Moderate fatigue |
| 2 | Below Average | Yellow (#eab308) | Mild fatigue |
| 3 | Low | Light Green (#84cc16) | Low fatigue |
| 4 | No Fatigue | Green (#10b981) | No fatigue detected |
| 5 | Very High | Dark Red (#dc2626) | Critical fatigue level |

## Sample Texts

Three predefined paragraphs are used (randomly selected):

1. **Technology & Innovation**
   - About modern computing and technology
   
2. **AI & Data Science**
   - About artificial intelligence and machine learning
   
3. **Software Development**
   - About programming and software practices

Each text is approximately 150-200 characters to ensure enough keystrokes for analysis.

## Keystroke Recording

### Data Captured
- **Key**: The character pressed
- **Press_Time**: Timestamp when key is pressed (ISO format)
- **Relase_Time**: Timestamp when key is released (ISO format)

### Timing Precision
- Millisecond precision
- Format: `YYYY-MM-DD HH:MM:SS.mmm`
- Example: `2025-01-15 10:00:00.123`

### Event Handlers
```javascript
handleKeyDown(e) // Records press time
handleKeyUp(e)   // Records release time
```

## Statistics Tracked

### Real-Time Metrics
1. **Keystroke Count**: Current/150
2. **WPM**: Words per minute
   - Calculated as: `(characters / 5) / (time in minutes)`
3. **Errors**: Mismatched characters
4. **Progress Bar**: Visual progress indicator

## Backend Requirements

### Python Environment
```bash
pip install tensorflow flask flask-cors pandas numpy scikit-learn
```

### Start Backend
```bash
cd src
python keystroke_app.py
```

Server runs on: `http://localhost:5005`

### Model File
Required: `lstm_model.keras` in the same directory as `keystroke_app.py`

## Frontend Features

### Visual Feedback
- **Green text**: Correctly typed characters
- **Red text**: Incorrectly typed characters
- **Gray text**: Characters not yet typed

### Button States
- **Start Test**: Begin typing test
- **Analyzing...**: Processing keystrokes (disabled)
- **Try Again**: Reset and start new test

### Progress Indicators
- Keystroke counter with progress bar
- WPM display (updates in real-time)
- Error counter (highlights in red if > 0)

## Error Handling

### Common Issues

**Insufficient Keystrokes**
```
Error: "Need at least 150 keystrokes. You typed X keys."
Solution: Complete the typing test
```

**API Not Running**
```
Error: "Failed to analyze keystrokes. Ensure API is running on port 5005."
Solution: Start keystroke_app.py backend
```

**Network Error**
```
Error: "API error: 500"
Solution: Check backend logs for model/data issues
```

## Usage Instructions

### For Users

1. **Navigate to Page**
   - Click "Keystroke Analysis" in header
   - Or visit: `/keystroke-fatigue`

2. **Start Test**
   - Click "Start Test" button
   - Read the displayed text

3. **Type Accurately**
   - Type exactly as shown
   - Match capitalization and punctuation
   - Correct = Green, Wrong = Red

4. **Complete Test**
   - Type at least 150 characters
   - System auto-submits when complete

5. **View Results**
   - See fatigue level classification
   - Check confidence percentage
   - Read recommendations

6. **Try Again**
   - Click "Try Again" for new test
   - Get different paragraph

## Technical Implementation

### State Management
```javascript
- sampleText: Random paragraph to type
- typedText: User's input
- keystrokes: Array of keystroke data
- isTyping: Test in progress
- isAnalyzing: Sending to backend
- result: Analysis results
- wpm: Words per minute
- errors: Error count
```

### Key Functions

**handleStart()**
- Resets all state
- Focuses input field
- Starts timing

**handleKeyDown(e)**
- Records key press timestamp
- Adds to keystrokes array

**handleKeyUp(e)**
- Records key release timestamp
- Updates last keystroke

**handleInputChange(e)**
- Updates typed text
- Calculates errors
- Calculates WPM
- Checks completion

**handleTestComplete()**
- Validates 150+ keystrokes
- Formats data for API
- Sends POST request
- Displays results

## Styling

**File:** `src/KeystrokeFatigue.css`

**Features:**
- Responsive grid layout
- Card-based design
- Progress animations
- Color-coded feedback
- Hover effects
- Mobile-friendly

## Integration Points

### Routes
- Added to `App.jsx` as protected route
- Requires authentication
- Available after login

### Navigation
- Added to Header.jsx
- Appears between "Driver Analytics" and logout
- Label: "Keystroke Analysis"

### Authentication
- Protected by ProtectedRoute component
- Redirects to login if not authenticated
- Maintains session across refreshes

## Performance

### Frontend
- Lightweight component (~500 lines)
- Real-time keystroke recording
- Minimal re-renders
- Efficient state updates

### Backend
- Response time: ~200-500ms
- Depends on model inference speed
- TensorFlow LSTM model

## Future Enhancements

1. **Multiple Languages**
   - Support non-English texts
   - Different character sets

2. **Difficulty Levels**
   - Easy: Simple words
   - Medium: Current paragraphs
   - Hard: Technical jargon

3. **History Tracking**
   - Save past results
   - Show improvement over time
   - Analytics dashboard

4. **Custom Texts**
   - Let users input own paragraphs
   - Import from files

5. **Real-Time Feedback**
   - Live fatigue indication
   - Warning if typing slows
   - Suggest breaks

## Testing

### Manual Testing Steps

1. Start backend: `python keystroke_app.py`
2. Login to application
3. Navigate to Keystroke Analysis
4. Click "Start Test"
5. Type at least 150 characters
6. Verify results display
7. Check confidence score
8. Test "Try Again" button

### Expected Behavior
- ✅ Progress bar updates
- ✅ WPM calculates correctly
- ✅ Errors count accurately
- ✅ Green/red character highlighting
- ✅ Results show fatigue level
- ✅ Confidence displayed as percentage

## Troubleshooting

### Issue: No response from API
**Check:**
- Backend running on port 5005
- CORS enabled in flask app
- Model file exists

### Issue: Incorrect character count
**Check:**
- All keystrokes have release time
- Filter excludes invalid entries
- Using first 150 valid keystrokes

### Issue: Inaccurate results
**Check:**
- Model file is correct version
- Input format matches training data
- Timestamps properly formatted

## Dependencies

### Frontend
```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "react-hot-toast": "^2.x",
  "lucide-react": "^0.x"
}
```

### Backend
```
tensorflow>=2.10.0
flask>=2.0.0
flask-cors>=3.0.0
pandas>=1.3.0
numpy>=1.21.0
scikit-learn>=1.0.0
```

## Conclusion

Complete keystroke-based fatigue detection system with:
- ✅ Clean typing test interface
- ✅ Real-time keystroke recording
- ✅ AI-powered analysis
- ✅ Clear result visualization
- ✅ Error handling
- ✅ Professional UX

Ready for production use!
