"""
Application Configuration and Environment Validation.
Uses pydantic-settings to validate environment variables with safe development defaults.
"""
from typing import List, Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    # Application & Server
    ENVIRONMENT: str = Field(default="development", description="Runtime environment: development, testing, production")
    LOG_LEVEL: str = Field(default="INFO", description="Log level: DEBUG, INFO, WARNING, ERROR")
    HOST: str = Field(default="0.0.0.0", description="Server host binding")
    PORT: int = Field(default=8000, description="Server port")
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
        description="Allowed CORS origins",
    )

    # Database
    DATABASE_URL: str = Field(
        default="sqlite:///./sangyan_shield.db",
        description="SQLAlchemy-compatible database URL",
    )

    # Vector Store
    VECTOR_STORE_PROVIDER: str = Field(
        default="chroma",
        description="Vector store provider: chroma or pgvector",
    )
    CHROMA_PERSIST_DIR: str = Field(
        default="./data/processed/chroma_db",
        description="Chroma DB persistence directory",
    )
    EMBEDDING_MODEL_NAME: str = Field(
        default="all-MiniLM-L6-v2",
        description="Model name for generating local embeddings",
    )

    # LLM / Reasoning Provider
    LLM_PROVIDER: str = Field(
        default="offline_rule_fallback",
        description="Provider: offline_rule_fallback, openai, or gemini",
    )
    LLM_API_KEY: Optional[str] = Field(
        default=None,
        description="Optional API key for external LLM provider",
    )
    LLM_MODEL: str = Field(
        default="gemini-1.5-flash",
        description="Model identifier for LLM provider",
    )

    # OCR Settings
    OCR_ENGINE: str = Field(
        default="tesseract",
        description="OCR Engine: tesseract",
    )
    TESSERACT_CMD: Optional[str] = Field(
        default=None,
        description="Path to tesseract binary if not in PATH",
    )
    OCR_MIN_CONFIDENCE: float = Field(
        default=60.0,
        ge=0.0,
        le=100.0,
        description="Minimum confidence threshold for accepting OCR extraction",
    )

    # Deployment
    PUBLIC_API_URL: str = Field(
        default="http://localhost:8000",
        description="Public URL for API endpoints",
    )
    FRONTEND_URL: str = Field(
        default="http://localhost:5173",
        description="Public URL for frontend interface",
    )

    @field_validator("ENVIRONMENT")
    @classmethod
    def validate_environment(cls, v: str) -> str:
        valid_envs = {"development", "testing", "staging", "production"}
        if v.lower() not in valid_envs:
            raise ValueError(f"ENVIRONMENT must be one of {valid_envs}")
        return v.lower()

    @field_validator("VECTOR_STORE_PROVIDER")
    @classmethod
    def validate_vector_store(cls, v: str) -> str:
        valid_stores = {"chroma", "pgvector"}
        if v.lower() not in valid_stores:
            raise ValueError(f"VECTOR_STORE_PROVIDER must be one of {valid_stores}")
        return v.lower()

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


# Singleton settings instance
settings = AppSettings()
