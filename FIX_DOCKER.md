# Fix Docker Desktop - WSL Update Required

## Issue
Docker Desktop shows: "WSL needs updating"
Your version of Windows Subsystem for Linux (WSL) is too old.

## Solution

### Option 1: Update WSL (Recommended)

Open **PowerShell as Administrator** and run:

```powershell
wsl --update
```

Wait for the update to complete, then restart Docker Desktop.

### Option 2: Install/Update WSL Manually

1. Open **PowerShell as Administrator**
2. Run these commands:

```powershell
# Enable WSL
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Enable Virtual Machine Platform
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Restart your computer
Restart-Computer
```

3. After restart, open PowerShell as Administrator again:

```powershell
# Set WSL 2 as default
wsl --set-default-version 2

# Update WSL
wsl --update
```

### Option 3: Download WSL Update Package

If the above doesn't work:

1. Download the WSL2 Linux kernel update package:
   https://aka.ms/wsl2kernel

2. Run the downloaded file to install

3. Restart Docker Desktop

## After Fixing WSL

1. **Restart Docker Desktop**
   - Close Docker Desktop completely
   - Open it again
   - Wait for it to fully start (green icon)

2. **Verify Docker is Working**
   ```powershell
   docker --version
   docker ps
   ```

3. **Start the Smart Bus Pass System**
   ```powershell
   .\start-system.ps1
   ```

## Alternative: Use Hyper-V Instead of WSL

If WSL continues to have issues, you can switch Docker to use Hyper-V:

1. Open Docker Desktop
2. Go to Settings → General
3. Uncheck "Use the WSL 2 based engine"
4. Click "Apply & Restart"

**Note**: Hyper-V requires Windows 10/11 Pro, Enterprise, or Education.

## Quick Fix Commands

Run these in **PowerShell as Administrator**:

```powershell
# Update WSL
wsl --update

# Check WSL version
wsl --version

# List installed distributions
wsl --list --verbose

# Set WSL 2 as default
wsl --set-default-version 2
```

## Verification

After updating, verify everything works:

```powershell
# Check WSL version
wsl --version

# Check Docker
docker --version
docker ps

# If Docker works, start the system
.\start-system.ps1
```

## Still Having Issues?

### Check Windows Version
WSL 2 requires:
- Windows 10 version 1903 or higher (Build 18362 or higher)
- Windows 11 (any version)

Check your version:
```powershell
winver
```

### Enable Virtualization in BIOS
1. Restart computer
2. Enter BIOS (usually F2, F10, or Del key)
3. Enable "Intel VT-x" or "AMD-V" (virtualization)
4. Save and exit

### Reinstall Docker Desktop
If nothing works:
1. Uninstall Docker Desktop
2. Restart computer
3. Download latest Docker Desktop from: https://www.docker.com/products/docker-desktop
4. Install with WSL 2 backend option
5. Restart computer

## Need More Help?

- WSL Documentation: https://docs.microsoft.com/en-us/windows/wsl/
- Docker Desktop Documentation: https://docs.docker.com/desktop/windows/wsl/
- Docker Desktop Troubleshooting: https://docs.docker.com/desktop/troubleshoot/overview/

---

**Quick Fix**: Run `wsl --update` in PowerShell as Administrator, then restart Docker Desktop.
