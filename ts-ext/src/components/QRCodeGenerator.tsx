import { useState, useRef } from 'preact/hooks';

import './QRCodeGenerator.css';

import { QRCodeCanvas } from './QRCodeCanvas.tsx';

export function QRCodeGenerator() {
    const [text, setText] = useState('');
    const [size, setSize] = useState(256);
    const [colorDark, setColorDark] = useState('#000000');
    const [colorLight, setColorLight] = useState('#ffffff');

    const qrDivRef = useRef<HTMLDivElement>(null);

    const saveQRCodeAsPNG = () => {
        const qrCanvas = qrDivRef.current?.querySelector('canvas');
        if (!qrCanvas) {
            alert('Errir: QR Code not found.');
            return;
        }

        const image = qrCanvas.toDataURL('image/png');

        const downloadLink = document.createElement('a');
        downloadLink.href = image;
        downloadLink.download = 'qrcode.png';
        downloadLink.click();
    };

    const updateSize = (e: Event) => {
        const newSize = parseInt((e.target as HTMLInputElement).value, 10);
        setSize(newSize < 400 ? (newSize > 50 ? newSize : 50) : 400);
    };

    const updateColorValue = (e: Event, setter: (value: string) => void) => {
        const input = e.target as HTMLInputElement;
        setter(input.value);
    };

    return (
        <div className="qr-generator">
            <h1>QR Code Generator</h1>

            <p>Enter text or URL:</p>
            <input
                value={text}
                onInput={e => setText((e.target as HTMLInputElement).value)}
                placeholder="For example: https://example.com"
            />

            <p>Entry size (px):</p>
            <input type="number" value={size} onInput={updateSize} placeholder="For example: 256" />

            <p>Цвет QR-кода:</p>
            <div className="color-picker">
                <input type="color" value={colorDark} onInput={e => updateColorValue(e, setColorDark)} />
                <input value={colorDark} onInput={e => updateColorValue(e, setColorDark)} maxLength={7} />
            </div>

            <p>Цвет фона:</p>
            <div className="color-picker">
                <input type="color" value={colorLight} onInput={e => updateColorValue(e, setColorLight)} />
                <input value={colorLight} onInput={e => updateColorValue(e, setColorLight)} maxLength={7} />
            </div>

            <div>
                <button disabled={text.length === 0} onClick={saveQRCodeAsPNG}>
                    Save as PNG
                </button>
            </div>

            <div id="qrcode" ref={qrDivRef}>
                {text.length > 0 && (
                    <QRCodeCanvas text={text} margin={1} width={size} color={{ dark: colorDark, light: colorLight }} />
                )}
            </div>
        </div>
    );
}
