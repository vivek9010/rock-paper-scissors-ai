from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = "django-development-key"

DEBUG = True

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
]


INSTALLED_APPS = [

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "website",
]


MIDDLEWARE = [

    "django.middleware.security.SecurityMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "rps.urls"


TEMPLATES = [

    {
        "BACKEND":
            "django.template.backends.django.DjangoTemplates",

        "DIRS": [
            BASE_DIR / "website" / "templates"
        ],

        "APP_DIRS": True,

        "OPTIONS": {

            "context_processors": [

                "django.template.context_processors.request",

                "django.contrib.auth.context_processors.auth",

                "django.contrib.messages.context_processors.messages",

            ],

        },

    },

]


WSGI_APPLICATION = "rps.wsgi.application"


DATABASES = {

    "default": {

        "ENGINE":
            "django.db.backends.sqlite3",

        "NAME":
            BASE_DIR / "db.sqlite3",

    }

}


AUTH_PASSWORD_VALIDATORS = []


LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Kolkata"

USE_I18N = True

USE_TZ = True


STATIC_URL = "static/"


STATICFILES_DIRS = [

    BASE_DIR / "website" / "static"

]


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ==================================================
# ML MODEL
# ==================================================
MODEL_PATHS = [

    BASE_DIR
    / "website"
    / "ml_models"
    / "best_resnet50_rps.keras",

    BASE_DIR
    / "website"
    / "ml_models"
    / "rps.keras",

    BASE_DIR
    / "website"
    / "ml_models"
    / "rps2.keras",

    BASE_DIR
    / "website"
    / "ml_models"
    / "rps3.keras",

]


CLASS_NAMES = [
    "paper",
    "rock",
    "scissors",
]


MODEL_INCLUDES_PREPROCESSING = True

MIN_PREDICTION_CONFIDENCE = 0.50