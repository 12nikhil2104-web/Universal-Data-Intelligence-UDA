import shutil
import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import math

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # Changed to "*" to guarantee React can talk to it regardless of localhost vs 127.0.0.1
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
os.makedirs("uploads", exist_ok=True)
current_file_path = "practice_models.csv"

@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    global current_file_path
    
    try:
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        current_file_path = file_path
        
        # Updated to match exactly what UploadPage.jsx is expecting
        return {
            "status": "success", 
            "message": f"Successfully processed {file.filename}"
        }
        
    except Exception as e:
        # If the upload fails, tell React exactly what went wrong
        return {
            "status": "error", 
            "message": str(e)
        }

@app.get("/api/models")
def get_generic_data():
    try:
        if not os.path.exists(current_file_path):
            return {"columns": [], "data": []}
            
        # 1. Read the uploaded CSV
        df = pd.read_csv(current_file_path)
        
        # 2. Sanitize column names (remove hidden spaces)
        df.columns = df.columns.str.strip()
        
        # 3. Replace NaN (Not a Number) with None so it converts to valid JSON
        df = df.where(pd.notnull(df), None)
        
        # 4. Return BOTH the list of columns and the actual data
        return {
            "columns": df.columns.tolist(),
            "data": df.to_dict(orient="records")
        }
    except Exception as e:
        return {"error": str(e)}