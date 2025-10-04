# ===== STAGE 1: Builder ===== #
FROM python:3.13-slim-bullseye AS builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ARG ENVIRONMENT=local

WORKDIR /app

# Copy requirements first (for better caching).
COPY ./requirements ./requirements/

# Create virtual environment and upgrade pip with security flags.
# Ensure packages are installed with hashes for security.
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir --upgrade pip wheel setuptools && \
    /opt/venv/bin/pip install --no-cache-dir --require-hashes -r /app/requirements/base.txt

# Install environment-specific requirements.
RUN if [ "$ENVIRONMENT" = "local" ] && [ -f "/app/requirements/local.txt" ]; then \
    /opt/venv/bin/pip install --no-cache-dir --require-hashes -r /app/requirements/local.txt; \
    elif [ "$ENVIRONMENT" = "production" ] && [ -f "/app/requirements/production.txt" ]; then \
    /opt/venv/bin/pip install --no-cache-dir --require-hashes -r /app/requirements/production.txt; \
    fi

# ===== STAGE 2: Runtime Image(Final) ===== #
FROM python:3.13-slim-bullseye

# Install security updates and clean up in single layer
RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user and group with explicit UID/GID.
# No home directory needed and prevent any shell access for this user.
RUN groupadd --system --gid 1000 appgroup && \
    useradd --system --uid 1000 --gid appgroup --no-create-home --shell /bin/false appuser

WORKDIR /app

# Set correct ownership for the app directory
RUN chown -R appuser:appgroup /app

# Copy virtual environment from builder (corrected path)
COPY --from=builder --chown=appuser:appgroup /opt/venv /opt/venv

# Copy application source code.
COPY --chown=appuser:appgroup ./src ./src

# Copy healthcheck script only
COPY --chown=appuser:appgroup ./scripts/healthcheck.py ./scripts/healthcheck.py

# Make health script executable inside scripts folder.
RUN chmod +x ./scripts/healthcheck.py

# Switch to non-root user early.
USER appuser

# Use virtual environment Python interpreter.
ENV PATH="/opt/venv/bin:$PATH"
ENV VIRTUAL_ENV="/opt/venv"

# Security-related environment variables.
ENV PYTHONPATH="/app/src"
ENV UVI_CORES="1"

EXPOSE 8000

# Run application with security flags.
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--loop", "asyncio"]