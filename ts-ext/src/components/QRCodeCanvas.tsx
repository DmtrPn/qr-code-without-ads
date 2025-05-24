import { useEffect, useRef } from 'preact/hooks';
import QRCode, { type QRCodeRenderersOptions } from 'qrcode';

export function QRCodeCanvas({ text = 'https://example.com', ...options }: { text?: string } & QRCodeRenderersOptions) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, text, { ...options, errorCorrectionLevel: 'H' }, function (err) {
                if (err) console.error(err);
            });
        }
    }, [text]);

    return <canvas id="qrcode" ref={canvasRef} />;
}
