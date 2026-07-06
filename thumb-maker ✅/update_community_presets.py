import urllib.request
import csv
import json
import os
import io

# ==========================================
# IMPORTANT: PASTE YOUR GOOGLE SHEET ID HERE
# ==========================================
SHEET_ID = "16wD7IoQClZ8Nq-BgURmUvhUS3mZimIIl-dZE4YJ6-u0"
# ==========================================

def fetch_and_update_presets():
    if SHEET_ID == "YOUR_GOOGLE_SHEET_ID_HERE":
        print("ERROR: Please set your Google Sheet ID in the script!")
        return

    url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        csv_text = response.read().decode('utf-8')
    except Exception as e:
        print(f"Failed to fetch CSV: {e}")
        return

    reader = csv.reader(io.StringIO(csv_text))
    headers = next(reader, [])
    
    # Dynamically find column indices
    creator_idx = -1
    json_idx = -1
    
    for i, col in enumerate(headers):
        col_lower = col.lower()
        if 'creator' in col_lower:
            creator_idx = i
        elif 'json' in col_lower or 'data' in col_lower:
            json_idx = i
            
    if json_idx == -1:
        print("Could not find the JSON data column in the CSV.")
        return

    presets = {
        "text": [],
        "shape": []
    }

    valid_count = 0
    for row in reader:
        if not row or len(row) <= json_idx:
            continue
            
        creator = row[creator_idx].strip() if creator_idx != -1 and len(row) > creator_idx else "Anonymous"
        if not creator:
            creator = "Anonymous"
            
        json_str = row[json_idx].strip()
        if not json_str:
            continue
            
        try:
            data = json.loads(json_str)
            if 'id' in data and 'type' in data:
                # Basic validation passed
                preset_type = 'text' if data.get('type') == 'text' else 'shape'
                
                # We store the preset in the structure the UI expects
                presets[preset_type].append({
                    "creator": creator,
                    "data": data
                })
                valid_count += 1
        except json.JSONDecodeError:
            # Skip invalid JSON rows silently to prevent breaking the live app
            pass

    # Reverse arrays so newest is first (assuming Google Forms appends to bottom)
    presets["text"].reverse()
    presets["shape"].reverse()

    # Output path relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, 'community-presets.json')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(presets, f, indent=2)
        
    print(f"Successfully processed {valid_count} presets!")

if __name__ == "__main__":
    fetch_and_update_presets()
