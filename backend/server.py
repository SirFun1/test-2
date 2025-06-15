from fastapi import FastAPI, HTTPException, Depends, status, APIRouter
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import requests
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# JWT Configuration
JWT_SECRET_KEY = "your-secret-key-change-in-production"
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# In-memory storage (replace with database in production)
users_db = {}
courses_db = {}
user_progress_db = {}
user_achievements_db = {}

# Models
class GoogleTokenRequest(BaseModel):
    token: str

class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    picture: str
    age: Optional[int] = None
    description: Optional[str] = None
    contact_info: Optional[str] = None
    achievements: List[str] = []

class UserProfileUpdate(BaseModel):
    age: Optional[int] = None
    description: Optional[str] = None
    contact_info: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserProfile

class CourseSession(BaseModel):
    id: int
    title: str
    duration: str
    description: str

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct: int

class CourseUpload(BaseModel):
    title: str
    description: str
    instructor: str
    level: str
    tags: List[str]
    sessions: List[CourseSession]
    quiz: List[QuizQuestion]

class Achievement(BaseModel):
    id: str
    name: str
    description: str
    badge_image: str
    course_id: Optional[str] = None
    course_category: Optional[str] = None

# Original models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Predefined achievements
ACHIEVEMENTS = {
    "javascript_master": Achievement(
        id="javascript_master",
        name="JavaScript Master",
        description="Completed an advanced JavaScript course",
        badge_image="🟨"
    ),
    "react_expert": Achievement(
        id="react_expert",
        name="React Expert",
        description="Mastered React development",
        badge_image="⚛️"
    ),
    "python_programmer": Achievement(
        id="python_programmer",
        name="Python Programmer",
        description="Completed Python programming course",
        badge_image="🐍"
    ),
    "database_architect": Achievement(
        id="database_architect",
        name="Database Architect",
        description="Mastered database design",
        badge_image="🗄️"
    ),
    "system_designer": Achievement(
        id="system_designer",
        name="System Designer",
        description="Completed system design course",
        badge_image="🏗️"
    ),
    "ai_ml_specialist": Achievement(
        id="ai_ml_specialist",
        name="AI/ML Specialist",
        description="Completed AI/ML course",
        badge_image="🤖"
    ),
    "cloud_expert": Achievement(
        id="cloud_expert",
        name="Cloud Expert",
        description="Mastered cloud architecture",
        badge_image="☁️"
    ),
    "devops_engineer": Achievement(
        id="devops_engineer",
        name="DevOps Engineer",
        description="Completed DevOps career path",
        badge_image="⚙️"
    ),
    "full_stack_developer": Achievement(
        id="full_stack_developer",
        name="Full Stack Developer",
        description="Completed full-stack development path",
        badge_image="🌐"
    ),
    "product_manager": Achievement(
        id="product_manager",
        name="Product Manager",
        description="Completed product management journey",
        badge_image="📊"
    ),
    "data_scientist": Achievement(
        id="data_scientist",
        name="Data Scientist",
        description="Completed data science career guide",
        badge_image="📈"
    ),
    "ux_designer": Achievement(
        id="ux_designer",
        name="UX Designer",
        description="Completed UX/UI design path",
        badge_image="🎨"
    ),
    "tech_leader": Achievement(
        id="tech_leader",
        name="Tech Leader",
        description="Completed tech leadership journey",
        badge_image="👑"
    ),
    "git_master": Achievement(
        id="git_master",
        name="Git Master",
        description="Mastered version control",
        badge_image="📁"
    ),
    "docker_expert": Achievement(
        id="docker_expert",
        name="Docker Expert",
        description="Mastered containerization",
        badge_image="🐳"
    ),
    "sql_specialist": Achievement(
        id="sql_specialist",
        name="SQL Specialist",
        description="Mastered database queries",
        badge_image="🗃️"
    )
}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def verify_google_token(token: str):
    """Verify Google OAuth token and get user info"""
    try:
        # Get user profile using the access token
        profile_response = requests.get(
            f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={token}"
        )
        
        if profile_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user profile")
        
        user_info = profile_response.json()
        return user_info
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Token verification failed: {str(e)}")

# Original API routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# New authentication and user routes
@api_router.post("/auth/google", response_model=TokenResponse)
async def google_auth(request: GoogleTokenRequest):
    """Authenticate user with Google OAuth token"""
    user_info = await verify_google_token(request.token)
    
    # Create or update user profile
    user_profile = UserProfile(
        id=user_info["id"],
        email=user_info["email"],
        name=user_info["name"],
        picture=user_info["picture"],
        achievements=users_db.get(user_info["id"], {}).get("achievements", [])
    )
    
    # Store user in in-memory database
    users_db[user_info["id"]] = user_profile.dict()
    
    # Initialize user achievements and progress if not exists
    if user_info["id"] not in user_achievements_db:
        user_achievements_db[user_info["id"]] = []
    if user_info["id"] not in user_progress_db:
        user_progress_db[user_info["id"]] = {}
    
    # Create JWT token
    access_token = create_access_token(data={"sub": user_profile.id, "email": user_profile.email})
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_profile
    )

@api_router.get("/auth/me", response_model=UserProfile)
async def get_current_user(user_id: str = Depends(verify_token)):
    """Get current authenticated user"""
    user = users_db.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfile(**user)

@api_router.put("/auth/profile", response_model=UserProfile)
async def update_profile(profile_update: UserProfileUpdate, user_id: str = Depends(verify_token)):
    """Update user profile"""
    user = users_db.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update profile fields
    if profile_update.age is not None:
        user["age"] = profile_update.age
    if profile_update.description is not None:
        user["description"] = profile_update.description
    if profile_update.contact_info is not None:
        user["contact_info"] = profile_update.contact_info
    
    users_db[user_id] = user
    return UserProfile(**user)

@api_router.post("/courses/complete")
async def complete_course(course_data: dict, user_id: str = Depends(verify_token)):
    """Mark course as completed and award achievement"""
    course_id = course_data.get("course_id")
    category = course_data.get("category")
    course_title = course_data.get("title", "")
    
    # Map courses to achievements
    achievement_mapping = {
        "javascript_es6_crash_course": "javascript_master",
        "react_basics_crash_course": "react_expert",
        "python_crash_course": "python_programmer",
        "advanced_database_design": "database_architect",
        "system_design_masterclass": "system_designer",
        "ai_ml_in_production": "ai_ml_specialist",
        "cloud_architecture_mastery": "cloud_expert",
        "devops_career_path": "devops_engineer",
        "full_stack_developer_roadmap": "full_stack_developer",
        "product_manager_journey": "product_manager",
        "data_science_career_guide": "data_scientist",
        "ux_ui_designer_path": "ux_designer",
        "tech_leadership_journey": "tech_leader",
        "git_github_essentials": "git_master",
        "docker_fundamentals": "docker_expert",
        "sql_quick_start": "sql_specialist"
    }
    
    # Determine achievement based on course
    achievement_id = None
    course_key = course_title.lower().replace(" ", "_").replace("/", "_").replace("&", "").replace("+", "")
    
    for key, achievement in achievement_mapping.items():
        if key in course_key or any(word in course_key for word in key.split("_")):
            achievement_id = achievement
            break
    
    # Award achievement if found
    if achievement_id and achievement_id in ACHIEVEMENTS:
        user_achievements = user_achievements_db.get(user_id, [])
        if achievement_id not in user_achievements:
            user_achievements.append(achievement_id)
            user_achievements_db[user_id] = user_achievements
            
            # Update user profile with new achievement
            if user_id in users_db:
                users_db[user_id]["achievements"] = user_achievements
    
    return {"message": "Course completed", "achievement_awarded": achievement_id}

@api_router.get("/achievements")
async def get_all_achievements():
    """Get all available achievements"""
    return {"achievements": ACHIEVEMENTS}

@api_router.get("/users/search")
async def search_users_by_skill(skill: str):
    """Search users by skill/achievement"""
    matching_users = []
    
    for user_id, user_data in users_db.items():
        user_achievements = user_data.get("achievements", [])
        
        # Check if user has the requested skill
        if skill.lower() in [achievement.lower() for achievement in user_achievements]:
            # Get achievement details
            user_skills = []
            for achievement_id in user_achievements:
                if achievement_id in ACHIEVEMENTS:
                    user_skills.append(ACHIEVEMENTS[achievement_id])
            
            matching_users.append({
                "id": user_id,
                "name": user_data.get("name", ""),
                "picture": user_data.get("picture", ""),
                "achievements": user_skills,
                "description": user_data.get("description", "")
            })
    
    return {"users": matching_users}

@api_router.post("/courses/upload")
async def upload_course(course: CourseUpload, user_id: str = Depends(verify_token)):
    """Upload a new course"""
    course_id = str(uuid.uuid4())
    
    # Get user info
    user = users_db.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    course_data = {
        "id": course_id,
        "title": course.title,
        "description": course.description,
        "instructor": user.get("name", course.instructor),
        "level": course.level,
        "tags": course.tags,
        "sessions": [session.dict() for session in course.sessions],
        "quiz": {"questions": [q.dict() for q in course.quiz]},
        "duration": f"{len(course.sessions) * 15}m",  # Estimate duration
        "views": "0",
        "created_by": user_id,
        "category": "user_uploaded",
        "created_at": datetime.utcnow().isoformat()
    }
    
    courses_db[course_id] = course_data
    
    return {"message": "Course uploaded successfully", "course_id": course_id}

@api_router.get("/courses/user-uploaded")
async def get_user_uploaded_courses():
    """Get all user-uploaded courses"""
    user_courses = []
    for course_id, course_data in courses_db.items():
        user_courses.append(course_data)
    
    return {"courses": user_courses}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
