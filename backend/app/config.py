from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ChronoGrid API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    OPENF1_BASE_URL: str = "https://api.openf1.org/v1"
    ERGAST_BASE_URL: str = "https://api.jolpi.ca/ergast/f1"
    CACHE_TTL_SECONDS: int = 300

    class Config:
        case_sensitive = True

settings = Settings()
