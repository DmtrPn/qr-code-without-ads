import { useEffect, useRef } from 'preact/hooks';
import QRCode, { type QRCodeRenderersOptions } from 'qrcode';

export function QRCodeCanvas({ text = 'https://example.com', ...options }: { text: string } & QRCodeRenderersOptions) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current && text?.length > 0) {
            QRCode.toCanvas(canvasRef.current, text, { ...options, errorCorrectionLevel: 'H' }, function (err) {
                if (err) console.error(err);
            });
        }
    }, [text, options]);

    return <canvas ref={canvasRef} />;
}
