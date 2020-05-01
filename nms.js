const NodeMediaServer = require('node-media-server');

module.exports.start = () => {
    var nms = new NodeMediaServer({
        rtmp: {
            port: process.env.NMS_RTMP || 1935,
            chunk_size: 60000,
            gop_cache: true,
            ping: 60,
            ping_timeout: 30
        },
        http: {
            port: process.env.NMS_HTTP || 8000,
            mediaroot: './media',
            allow_origin: '*'
        },
        trans: {
            ffmpeg: process.env.FFMPEG_PATH,
            tasks: [
                {
                    app: 'live',
                    ac: 'aac',
                    mp4: true,
                    mp4Flags: '[movflags=faststart]'
                }
            ]
        }
    });
    nms.run();
}