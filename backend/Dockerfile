# ===== STAGE 1: Builder ===== #
FROM python:3.13-alpine AS builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ARG ENVIRONMENT=local

WORKDIR /app

# Copy requirements first (for better caching).
COPY ./requirements ./requirements/

# Install build dependencies for python packages.
RUN apk add --no-cache build-base postgresql-dev yaml-dev

# Create virtual environment and upgrade pip.
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir --upgrade pip wheel setuptools

# Install base requirements with hash checking (security!).
RUN /opt/venv/bin/pip install --no-cache-dir --require-hashes -r /app/requirements/base.txt

# Install environment-specific requirements with hashes.
RUN if [ "$ENVIRONMENT" = "local" ] ; then \
    /opt/venv/bin/pip install --no-cache-dir --require-hashes -r /app/requirements/local.txt; \
    elif [ "$ENVIRONMENT" = "production" ] ; then \
    /opt/venv/bin/pip install --no-cache-dir --require-hashes -r /app/requirements/production.txt; \
    fi

# ===== STAGE 2: Runtime Image(Final) ===== #
FROM python:3.13-alpine

# Install security updates and clean up in single layer.
RUN apk update && \
    apk upgrade --no-cache

# Create non-root user and group with explicit UID/GID.
# No home directory needed and prevent any shell access for this user.
RUN addgroup -S -g 1000 appgroup && \
    adduser -S -u 1000 -G appgroup -H -D appuser

WORKDIR /app

# Set correct ownership for the app directory.
RUN chown -R appuser:appgroup /app

# Copy virtual environment from builder.
COPY --from=builder --chown=appuser:appgroup /opt/venv /opt/venv

# Copy application source code.
COPY --chown=appuser:appgroup ./src ./src

# Copy healthcheck script (only)
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