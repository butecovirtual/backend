# Buteco Virtual - servidor

Antes de iniciar o servidor, crie um arquivo .env na raiz do projeto para definir as variáveis de ambiente necessárias
```
# API Port (default 3000)
PORT=...

# MongoDB (required)
MONGODB_URI=mongodb://...

# Jwt Secret (required)
JWT_SECRET=...

# Twilio (required)
TWILIO_ACSID=...
TWILIO_TOKEN=...
TWILIO_SMSID=...

# NMS (Media Server)
NMS_RTMP_PORT=... #default 1935
NMS_HTTP_PORT=... #default 8000

# ffmpeg path (default '/usr/bin/ffmpeg')
FFMPEG_PATH=C:\dir\to\ffmpeg-4.2.2-win64-static\bin\ffmpeg.exe
```
