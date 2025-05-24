import { useState, useRef } from 'preact/hooks';

import './QRCodeGenerator.css';

import { QRCodeCanvas } from './QRCodeCanvas.tsx';

export function QRCodeGenerator() {
    const [text, setText] = useState('');
    const [size, setSize] = useState(256);
    const [colorDark, setColorDark] = useState('#000000');
    const [colorLight, setColorLight] = useState('#ffffff');

    const qrDivRef = useRef<HTMLDivElement>(null);

    const generateQRCode = () => {
        if (!qrDivRef.current) return;

        qrDivRef.current.innerHTML = '';

        if (!text.trim()) {
            alert('Пожалуйста, введите текст или URL для генерации QR-кода.');
            return;
        }
    };

    const saveQRCodeAsPNG = () => {
        if (!text) {
            alert('Сначала сгенерируйте QR-код.');
            return;
        }

        const qrCanvas = qrDivRef.current?.querySelector('canvas');
        if (!qrCanvas) {
            alert('Ошибка: Не удалось найти QR-код.');
            return;
        }

        const image = qrCanvas.toDataURL('image/png');

        const downloadLink = document.createElement('a');
        downloadLink.href = image;
        downloadLink.download = 'qrcode.png';
        downloadLink.click();
    };

    const updateColorValue = (e: Event, setter: (value: string) => void) => {
        const input = e.target as HTMLInputElement;
        setter(input.value);
    };

    return (
        <div className="qr-generator">
            <h1>QR Code Generator</h1>

            <p>Введите текст или URL:</p>
            <input
                type="text"
                value={text}
                onInput={e => setText((e.target as HTMLInputElement).value)}
                placeholder="Пример: https://example.com"
            />

            <p>Выберите размер (px):</p>
            <input
                type="number"
                value={size}
                onInput={e => setSize(parseInt((e.target as HTMLInputElement).value, 10))}
                placeholder="Например: 256"
                min="100"
                max="1000"
            />

            <p>Цвет QR-кода:</p>
            <div className="color-picker">
                <input type="color" value={colorDark} onInput={e => updateColorValue(e, setColorDark)} />
                <input type="text" value={colorDark} onInput={e => updateColorValue(e, setColorDark)} maxLength={7} />
            </div>

            <p>Цвет фона:</p>
            <div className="color-picker">
                <input type="color" value={colorLight} onInput={e => updateColorValue(e, setColorLight)} />
                <input type="text" value={colorLight} onInput={e => updateColorValue(e, setColorLight)} maxLength={7} />
            </div>

            <div>
                <button onClick={generateQRCode}>Сгенерировать QR-код</button>
                <button onClick={saveQRCodeAsPNG}>Сохранить как PNG</button>
            </div>

            <div id="qrcode" ref={qrDivRef}>
                <QRCodeCanvas text={text} margin={1} width={size} color={{ dark: colorDark, light: colorLight }} />
            </div>
        </div>
    );
}
