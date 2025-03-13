import { useState } from 'react';
import colorPicker from './assets/colorpicker.png';
import { FaCheck, FaCopy } from 'react-icons/fa';

function App() {
  const [hexColor, setHexColor] = useState<string>("");
  const [hslaColor, setHslaColor] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const pickColor = async () => {
    if (!window.EyeDropper) {
      alert('Eyedropper API is not supported in your browser.');
      return;
    }

    try {
      const eyeDropper = new window.EyeDropper();
      const { sRGBHex } = await eyeDropper.open();

      setHexColor(sRGBHex);
      setHslaColor(convertHexToHSLA(sRGBHex));

    } catch (error) {
      console.error('Error picking color:', error);
    }
  };

  const convertHexToHSLA = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }

    const rPercent = r / 255;
    const gPercent = g / 255;
    const bPercent = b / 255;

    const max = Math.max(rPercent, gPercent, bPercent);
    const min = Math.min(rPercent, gPercent, bPercent);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rPercent: h = (gPercent - bPercent) / d + (gPercent < bPercent ? 6 : 0); break;
        case gPercent: h = (bPercent - rPercent) / d + 2; break;
        case bPercent: h = (rPercent - gPercent) / d + 4; break;
      }
      h *= 60;
    }

    return `hsla(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, 1)`;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-96 text-center">
        <div className="flex justify-center mb-4">
          <img src={colorPicker} className="h-12 mx-2" alt="color picker" />
        </div>
        <h1 className="text-2xl font-bold text-gray-100">
          Steal the Color of the Web!
        </h1>
        <button
          onClick={pickColor}
          className="mt-4 cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition shadow-md hover:shadow-pink-500/50"
        >
          Pick Color
        </button>

        {hexColor && (
          <div className="mt-6 p-4 border border-gray-600 rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-2">
              <div
                className="w-16 h-16 rounded-full border border-gray-500"
                style={{ backgroundColor: hexColor }}
              />
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                <span className="text-gray-300 font-medium">Hex: {hexColor}</span>
                <button
                  onClick={() => copyToClipboard(hexColor, "hex")}
                  className="text-gray-50 hover:text-gray-100 cursor-pointer transition"
                >
                  {copiedField === "hex" ? <FaCheck className="text-green-400" /> : <FaCopy />}
                </button>
              </div>

              <div className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                <span className="text-gray-300 font-medium">HSLA: {hslaColor}</span>
                <button
                  onClick={() => copyToClipboard(hslaColor, "hsla")}
                  className="text-gray-50 hover:text-gray-100 cursor-pointer transition"
                >
                  {copiedField === "hsla" ? <FaCheck className="text-green-400" /> : <FaCopy />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
