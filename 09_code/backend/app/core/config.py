from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/neuraltruth"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "neuraltruth_super_secret_key_development"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    WEB_SEARCH_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
