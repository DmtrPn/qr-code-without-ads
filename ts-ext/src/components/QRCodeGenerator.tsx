import { useState, useRef } from 'preact/hooks';
import './QRCodeGenerator.css';
// import QRCode, { toCanvas } from 'qrcode';
import { QRCodeCanvas } from './QRCodeCanvas.tsx';

// Define the QRCode type
declare global {
    interface Window {
        jspdf: {
            jsPDF: new () => any;
        };
    }
}

export function QRCodeGenerator() {
    const [text, setText] = useState('');
    const [size, setSize] = useState(256);
    const [colorDark, setColorDark] = useState('#000000');
    const [colorLight, setColorLight] = useState('#ffffff');
    // const [currentQRCode, setCurrentQRCode] = useState<any>(null);

    const qrDivRef = useRef<HTMLDivElement>(null);

    // // Load external scripts
    // useEffect(() => {
    //     // const loadScript = (src: string): Promise<void> => {
    //     //     return new Promise((resolve, reject) => {
    //     //         const script = document.createElement('script');
    //     //         script.src = src;
    //     //         script.onload = () => resolve();
    //     //         script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    //     //         document.head.appendChild(script);
    //     //     });
    //     // };
    //
    //     Promise.all([
    //         loadScript('https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js'),
    //         // loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js'),
    //     ]).catch(error => console.error('Error loading scripts:', error));
    // }, []);

    const generateQRCode = () => {
        if (!qrDivRef.current) return;

        // Clear previous QR code
        qrDivRef.current.innerHTML = '';

        if (!text.trim()) {
            alert('Пожалуйста, введите текст или URL для генерации QR-кода.');
            return;
        }

        // toCanvas(
        //     qrDivRef.current,
        //     text,
        //     { width: size, height: size, colorDark: colorDark, colorLight: colorLight, errorCorrectionLevel: 'H' },
        //     function (err) {
        //         if (err) console.error(err);
        //     },
        // );
        // Generate QR code
        // const qrCode = toCanvas(qrDivRef.current, [{

        //     correctLevel: QRCode.CorrectLevel.H,
        // }]);

        //
        // // Generate QR code
        // const qrCode1 = QRCode.(qrDivRef.current, {
        //     text: text,
        //     width: size,
        //     height: size,
        //     colorDark: colorDark,
        //     colorLight: colorLight,
        //     correctLevel: QRCode.CorrectLevel.H,
        // });

        // setCurrentQRCode(qrCode);
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

        // Convert canvas to image
        const image = qrCanvas.toDataURL('image/png');

        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = image;
        downloadLink.download = 'qrcode.png';
        downloadLink.click();
    };

    const saveQRCodeAsPDF = async () => {
        if (!text || !window.jspdf) {
            alert('Сначала сгенерируйте QR-код.');
            return;
        }

        const qrCanvas = qrDivRef.current?.querySelector('canvas');
        if (!qrCanvas) {
            alert('Ошибка: Не удалось найти QR-код.');
            return;
        }

        // Convert canvas to image
        const image = qrCanvas.toDataURL('image/png');

        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        // Convert size from px to mm (1px = 0.264583 mm)
        const sizeInMm = size * 0.264583;

        // Add image to PDF
        pdf.addImage(image, 'PNG', 10, 10, sizeInMm, sizeInMm);

        // Save PDF
        pdf.save('qrcode.pdf');
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
                <button onClick={saveQRCodeAsPDF}>Сохранить как PDF</button>
            </div>

            <QRCodeCanvas text={text} width={size} color={{ dark: colorDark, light: colorLight }} />
            {/*<div id="qrcode" ref={qrDivRef}></div>*/}
        </div>
    );
}
