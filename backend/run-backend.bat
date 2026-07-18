@echo off
setlocal
set "GRADLE_VERSION=8.14.3"
set "TOOLS_DIR=%~dp0.gradle-tools"
set "GRADLE_HOME=%TOOLS_DIR%\gradle-%GRADLE_VERSION%"

if not exist "%GRADLE_HOME%\bin\gradle.bat" (
  echo Preparing Gradle for the first run...
  if not exist "%TOOLS_DIR%" mkdir "%TOOLS_DIR%"
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://services.gradle.org/distributions/gradle-%GRADLE_VERSION%-bin.zip' -OutFile '%TOOLS_DIR%\gradle.zip'; Expand-Archive -Path '%TOOLS_DIR%\gradle.zip' -DestinationPath '%TOOLS_DIR%' -Force"
  del "%TOOLS_DIR%\gradle.zip"
)

call "%GRADLE_HOME%\bin\gradle.bat" --no-daemon -Dorg.gradle.jvmargs= bootRun
