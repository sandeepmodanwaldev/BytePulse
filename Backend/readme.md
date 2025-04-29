# 🚀 Judge0 Setup Guide on Ubuntu (WSL 2)

## Prerequisites

- Windows 10/11 with **WSL 2** installed
- **Ubuntu** installed as WSL Distro
- **Docker Desktop** installed with WSL integration enabled
- Basic Terminal Commands Knowledge

---

## ✨ Docker Desktop: Enable WSL 2 Integration
- Open Docker Desktop

- Click Settings ⚙️ → Resources → WSL Integration

- Find your Ubuntu distro (example: Ubuntu-22.04, etc.)

- Toggle ON (Enable) WSL Integration for Ubuntu

- Save and Restart Docker Desktop if needed.

- Important Note:
Docker must use WSL 2 backend for containers.
Otherwise, the containers will not run on WSL 2.

---

## 1. WSL Setup

```bash
# Open PowerShell or Terminal as Admin:
wsl --install

# Restart your PC if asked, then select Ubuntu.
```

---

## 2. Update Ubuntu

```bash
# Open Ubuntu (WSL) terminal:
wsl -d ubuntu

# Update and Upgrade system packages:
sudo apt update
sudo apt upgrade -y
```

---

## 3. Enable Systemd (Optional but Recommended)

```bash
sudo nano /etc/default/grub
```

Find the line:

```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
```

Replace it with:

```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash systemd.unified_cgroup_hierarchy=1"
```

Save and Exit:
- Press `Ctrl + O`, `Enter`, then `Ctrl + X`

(Optional) Update GRUB (usually not needed for WSL2):

```bash
sudo update-grub
```

---

## 4. Install Docker Compose

```bash
sudo apt install -y docker-compose
```

---

## 5. Download Judge0 Source Code

```bash
wget https://github.com/judge0/judge0/releases/download/v1.13.1/judge0-v1.13.1.zip
```

---

## 6. Install Unzip and Extract the Project

```bash
sudo apt install unzip
unzip judge0-v1.13.1.zip
cd judge0-v1.13.1
```

---

## 7. Configure Judge0

```bash
nano judge0.conf
```

Inside `judge0.conf`, set your passwords for **Redis** and **Postgres**:

Example:

```bash
REDIS_PASSWORD=yourredispassword
POSTGRES_PASSWORD=yourpostgrespassword
```

Save and Exit:
- `Ctrl + O`, `Enter`, then `Ctrl + X`

---

## 8. Start Database and Cache Containers

```bash
docker-compose up -d db redis
```

---

## 9. Start All Judge0 Services

```bash
docker-compose up -d
```

---

## ⚡ Troubleshooting / Rebuild Containers

If containers are not running properly, do a clean rebuild:

```bash
docker-compose down
docker-compose up --build -d
```

**Explanation**:
- `docker-compose down` ➔ Stops and removes old containers.
- `docker-compose up --build -d` ➔ Rebuilds or pulls images and runs them fresh in background.

---

## 🧐 Quick Commands Summary

```bash
# Start Services
docker-compose up -d

# Stop Services
docker-compose down

# List Running Containers
docker ps

# View Docker Images
docker images

# See Container Logs
docker-compose logs -f
```

---

## 🌟 Final Note

- You can monitor Containers/Images from **Docker Desktop GUI**.
- Use Ubuntu Terminal for all docker commands.
- First image pull can take time (~14GB+).

---

# ✅ Congratulations! Judge0 Setup Done Successfully!

---



