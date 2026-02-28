import json
import random
import re
from datetime import datetime

# FIXED JSON loading
try:
    with open('intents.json', 'r', encoding='utf-8') as f:
        intents_data = json.load(f)
    print("✅ intents.json loaded successfully!")
except Exception as e:
    print(f"❌ JSON Error: {e}")
    print("Creating backup intents...")
    intents_data = {"intents": []}

COURSE_FEES = {"btech": "Rs.1.5 Lakh/year", "mba": "Rs.2 Lakh/year"}
EXAM_DATES = {"midterms": "March 15-20", "endterms": "May 10-20"}

def chatbot_response(text):
    msg = text.lower().strip()
    
    # Smart greetings
    if any(g in msg for g in ["hi", "hello", "hey", "namaste"]):
        hour = datetime.now().hour
        greeting = "Good Morning!" if hour < 12 else "Good Afternoon!" if hour < 17 else "Good Evening!"
        return f"{greeting} Welcome to College Helpdesk! Ask about admissions, fees, exams or type 'menu'"
    
    # Menu help
    if "menu" in msg or "help" in msg:
        return "Topics: admissions, fees, exams, hostel, library, placements, canteen, labs, wifi"
    
    # Pattern matching
    for intent in intents_data.get('intents', []):
        for pattern in intent['patterns']:
            if re.search(r'\b' + re.escape(pattern.lower()) + r'\b', msg, re.IGNORECASE):
                response = random.choice(intent['responses'])
                
                # Add dynamic info
                if "fees" in pattern.lower():
                    response += f" (B.Tech: {COURSE_FEES['btech']})"
                elif "exam" in pattern.lower():
                    response += f" (Midterms: {EXAM_DATES['midterms']})"
                    
                return response
    
    return "Try: 'admission process', 'B.Tech fees', 'exam dates', 'hostel info' or 'menu' for options!"

if __name__ == "__main__":
    print("✅ Bot ready! Test queries:")
    tests = ["hi", "admission process", "btech fees"]
    for test in tests:
        print(f"Q: '{test}' →", chatbot_response(test))
