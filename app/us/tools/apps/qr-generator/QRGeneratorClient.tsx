'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

interface RelatedApp {
  href: string;
  title: string;
  description: string;
  color: string;
}

const defaultRelatedApps: RelatedApp[] = [
  { href: '/us/tools/apps/qr-generator', title: 'QR Generator', description: 'Generate QR codes', color: 'bg-blue-500' },
  { href: '/us/tools/apps/timer', title: 'Timer', description: 'Countdown timer', color: 'bg-green-500' },
  { href: '/us/tools/apps/stopwatch', title: 'Stopwatch', description: 'Track time', color: 'bg-purple-500' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: 'What types of QR codes can I create?',
    answer: 'You can create QR codes for URLs, plain text, emails, phone numbers, WiFi networks, contact cards (vCard), locations, SMS messages, and social media profiles (Instagram, Facebook, Twitter, LinkedIn, YouTube, TikTok, WhatsApp, Telegram).',
    order: 1
  },
  {
    id: '2',
    question: 'Can I customize the colors of my QR code?',
    answer: 'Yes! You can change both the QR code color and background color using the color pickers. Just make sure there is enough contrast between the two colors for reliable scanning.',
    order: 2
  },
  {
    id: '3',
    question: 'Can I add a logo to my QR code?',
    answer: 'Absolutely! Upload any image as a logo and it will be placed in the center of your QR code. The QR code uses error correction to remain scannable even with a logo. Recommended: square images, max 2MB.',
    order: 3
  },
  {
    id: '4',
    question: 'What download formats are available?',
    answer: 'You can download your QR codes as PNG (for web and digital use) or SVG (for print and scalable graphics). Both formats are available in multiple sizes from 200px to 1000px.',
    order: 4
  },
  {
    id: '5',
    question: 'Are the QR codes free to use commercially?',
    answer: 'Yes, all QR codes generated with our tool are free for personal and commercial use. There are no watermarks, limits, or hidden fees.',
    order: 5
  },
  {
    id: '6',
    question: 'Why is my QR code not scanning?',
    answer: 'Ensure there is sufficient contrast between the QR code and background colors. Dark codes on light backgrounds work best. If using a logo, try a smaller logo size. Also check that the data length is not exceeding QR code capacity.',
    order: 6
  }
];

interface QRGeneratorClientProps {
  relatedApps?: Array<{
    href: string;
    title: string;
    description: string;
    color: string;
    icon: string;
  }>;
  breadcrumbs?: Array<{
    name: string;
    url: string;
    current?: boolean;
  }>;
}

type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'contact' | 'location' | 'sms' | 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'whatsapp' | 'telegram';
type FrameStyle = 'none' | 'text-bottom' | 'text-top' | 'banner' | 'circle';

declare global {
  interface Window {
    QRious?: any;
  }
}

export default function QRGeneratorClient({ relatedApps = [], breadcrumbs = [] }: QRGeneratorClientProps) {
  const [currentType, setCurrentType] = useState<QRType>('url');
  const [currentQRData, setCurrentQRData] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('none');
  const [frameText, setFrameText] = useState('');
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [qrLibraryLoaded, setQrLibraryLoaded] = useState(false);
  const [showDownloadButtons, setShowDownloadButtons] = useState(false);
  const [showQRInfo, setShowQRInfo] = useState(false);
  const [qrDisplayContent, setQrDisplayContent] = useState<'initial' | 'loading' | 'error' | 'success'>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const [qrInfoData, setQrInfoData] = useState({ type: '', size: '', length: '' });

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const logoUploadRef = useRef<HTMLInputElement>(null);

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('qr-generator');

  const webAppSchema = generateWebAppSchema(
    'QR Code Generator - Free Online QR Maker with Logo & Colors',
    'Free online QR code generator. Create custom QR codes for URLs, WiFi, contacts, social media, and more. Add logos, customize colors, download as PNG or SVG.',
    'https://economictimes.indiatimes.com/us/tools/apps/qr-generator',
    'Utility'
  );

  // Input states
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');
  const [contactFirstName, setContactFirstName] = useState('');
  const [contactLastName, setContactLastName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOrg, setContactOrg] = useState('');
  const [locationLat, setLocationLat] = useState('');
  const [locationLng, setLocationLng] = useState('');
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [facebookUsername, setFacebookUsername] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('');
  const [linkedinUsername, setLinkedinUsername] = useState('');
  const [youtubeUsername, setYoutubeUsername] = useState('');
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');

  // Load QR library
  const loadQRLibrary = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window.QRious !== 'undefined') {
        setQrLibraryLoaded(true);
        console.log('QRious library loaded from CDN');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js';
      script.onload = () => {
        setQrLibraryLoaded(true);
        console.log('QRious library loaded dynamically');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load QRious library');
        reject(new Error('Failed to load QR library'));
      };
      document.head.appendChild(script);
    });
  }, []);

  useEffect(() => {
    loadQRLibrary().catch((error) => {
      console.warn('QR library not loaded yet, will load on demand:', error);
    });
  }, [loadQRLibrary]);

  // Auto-regenerate when colors change
  useEffect(() => {
    if (currentQRData) {
      generateQR();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrColor, qrBgColor]);

  const handleQRTypeChange = (type: QRType) => {
    setCurrentType(type);
    clearQRDisplay();
  };

  const getQRData = useCallback((): string => {
    try {
      switch (currentType) {
        case 'text':
          const text = textInput.trim();
          return text.length > 0 ? text : '';

        case 'url':
          const url = urlInput.trim();
          if (!url) return '';
          if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
          } else if (url.includes('.')) {
            return `https://${url}`;
          }
          return '';

        case 'email':
          const email = emailInput.trim();
          if (!email || !email.includes('@')) return '';
          const subject = emailSubject.trim();
          const message = emailMessage.trim();
          let emailData = `mailto:${email}`;
          const params = [];
          if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
          if (message) params.push(`body=${encodeURIComponent(message)}`);
          if (params.length > 0) emailData += `?${params.join('&')}`;
          return emailData;

        case 'phone':
          const phone = phoneInput.trim();
          if (!phone) return '';
          const cleanPhone = phone.replace(/[^\d+\-\s()]/g, '');
          return cleanPhone ? `tel:${cleanPhone}` : '';

        case 'wifi':
          const ssid = wifiSSID.trim();
          if (!ssid) return '';
          const password = wifiPassword.trim();
          const security = wifiSecurity;
          return `WIFI:T:${security};S:${ssid};P:${password};;`;

        case 'contact':
          const firstName = contactFirstName.trim();
          const lastName = contactLastName.trim();
          if (!firstName && !lastName) return '';
          const cPhone = contactPhone.trim();
          const cEmail = contactEmail.trim();
          const org = contactOrg.trim();
          return `BEGIN:VCARD
VERSION:3.0
FN:${firstName} ${lastName}
ORG:${org}
TEL:${cPhone}
EMAIL:${cEmail}
END:VCARD`;

        case 'location':
          const lat = parseFloat(locationLat.trim());
          const lng = parseFloat(locationLng.trim());
          if (isNaN(lat) || isNaN(lng)) return '';
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return '';
          return `geo:${lat},${lng}`;

        case 'sms':
          const sPhone = smsPhone.trim();
          if (!sPhone) return '';
          const sMessage = smsMessage.trim();
          const cleanSMSPhone = sPhone.replace(/[^\d+\-\s()]/g, '');
          return cleanSMSPhone ? `sms:${cleanSMSPhone}${sMessage ? `?body=${encodeURIComponent(sMessage)}` : ''}` : '';

        case 'instagram':
          const igUsername = instagramUsername.trim();
          if (!igUsername) return '';
          return igUsername.startsWith('http') ? igUsername : `https://instagram.com/${igUsername.replace('@', '')}`;

        case 'facebook':
          const fbUsername = facebookUsername.trim();
          if (!fbUsername) return '';
          return fbUsername.startsWith('http') ? fbUsername : `https://facebook.com/${fbUsername}`;

        case 'twitter':
          const twUsername = twitterUsername.trim();
          if (!twUsername) return '';
          return twUsername.startsWith('http') ? twUsername : `https://twitter.com/${twUsername.replace('@', '')}`;

        case 'linkedin':
          const liUsername = linkedinUsername.trim();
          if (!liUsername) return '';
          return liUsername.startsWith('http') ? liUsername : `https://linkedin.com/in/${liUsername}`;

        case 'youtube':
          const ytUsername = youtubeUsername.trim();
          if (!ytUsername) return '';
          if (ytUsername.startsWith('http')) return ytUsername;
          return ytUsername.startsWith('@') ? `https://youtube.com/${ytUsername}` : `https://youtube.com/@${ytUsername}`;

        case 'tiktok':
          const ttUsername = tiktokUsername.trim();
          if (!ttUsername) return '';
          return ttUsername.startsWith('http') ? ttUsername : `https://tiktok.com/@${ttUsername.replace('@', '')}`;

        case 'whatsapp':
          const waPhone = whatsappPhone.trim();
          if (!waPhone) return '';
          const cleanWhatsappPhone = waPhone.replace(/[^\d+]/g, '');
          return `https://wa.me/${cleanWhatsappPhone}`;

        case 'telegram':
          const tgUsername = telegramUsername.trim();
          if (!tgUsername) return '';
          return tgUsername.startsWith('http') ? tgUsername : `https://t.me/${tgUsername.replace('@', '')}`;

        default:
          return '';
      }
    } catch (error) {
      console.error('Error getting QR data:', error);
      return '';
    }
  }, [currentType, urlInput, textInput, emailInput, emailSubject, emailMessage, phoneInput, wifiSSID, wifiPassword, wifiSecurity, contactFirstName, contactLastName, contactPhone, contactEmail, contactOrg, locationLat, locationLng, smsPhone, smsMessage, instagramUsername, facebookUsername, twitterUsername, linkedinUsername, youtubeUsername, tiktokUsername, whatsappPhone, telegramUsername]);

  const generateQR = async () => {
    console.log('Generating QR for type:', currentType);
    const data = getQRData();
    console.log('QR Data:', data);

    if (!data) {
      showErrorMessage('Please fill in the required fields.');
      return;
    }

    showLoadingMessage();

    if (!qrLibraryLoaded) {
      try {
        await loadQRLibrary();
      } catch (error) {
        console.error('Failed to load QR library:', error);
        showErrorMessage('Failed to load QR code library. Please check your internet connection and try again.');
        return;
      }
    }

    setCurrentQRData(data);
    const displaySize = 300;

    try {
      generateRealQRCode(data, displaySize, qrColor, qrBgColor);
    } catch (error) {
      console.error('Error generating QR code:', error);
      showErrorMessage('Failed to generate QR code. Please try again.');
    }
  };

  const generateRealQRCode = (data: string, size: number, color: string, bgColor: string) => {
    try {
      console.log('Generating QR with QRious library:', { data, size, color, bgColor });

      if (!data) {
        throw new Error('No data provided for QR code');
      }
      if (typeof window.QRious === 'undefined') {
        throw new Error('QRious library is not available');
      }

      const qr = new window.QRious({
        value: data,
        size: size,
        foreground: color,
        background: bgColor,
        level: 'M',
        padding: 4
      });

      const baseCanvas = qr.canvas;
      if (!baseCanvas) {
        throw new Error('Failed to generate QR code canvas');
      }

      const styledCanvas = applyCustomStyle(baseCanvas, size, color, bgColor);

      if (logoImage) {
        addLogoToQRCode(styledCanvas, size);
      } else {
        if (frameStyle !== 'none') {
          const fText = frameText || 'Scan Me';
          const framedCanvas = applyFrame(styledCanvas, size, frameStyle, fText, color, bgColor);
          displayQRCode(framedCanvas, size);
        } else {
          displayQRCode(styledCanvas, size);
        }
      }
    } catch (error: any) {
      console.error('QR generation failed:', error);
      showErrorMessage(`Failed to generate QR code: ${error.message}`);
    }
  };

  const applyCustomStyle = (sourceCanvas: HTMLCanvasElement, size: number, color: string, bgColor: string) => {
    return sourceCanvas;
  };

  const applyFrame = (qrCanvas: HTMLCanvasElement, size: number, fStyle: FrameStyle, fText: string, color: string, bgColor: string) => {
    const padding = 40;
    const textHeight = 50;
    let frameWidth, frameHeight;

    switch (fStyle) {
      case 'text-bottom':
        frameWidth = size + (padding * 2);
        frameHeight = size + (padding * 2) + textHeight;
        break;
      case 'text-top':
        frameWidth = size + (padding * 2);
        frameHeight = size + (padding * 2) + textHeight;
        break;
      case 'banner':
        frameWidth = size + (padding * 2);
        frameHeight = size + (padding * 3) + textHeight;
        break;
      case 'circle':
        frameWidth = size + (padding * 4);
        frameHeight = size + (padding * 4);
        break;
      default:
        return qrCanvas;
    }

    const canvas = document.createElement('canvas');
    canvas.width = frameWidth;
    canvas.height = frameHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return qrCanvas;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, frameWidth, frameHeight);

    let qrX, qrY;

    if (fStyle === 'circle') {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(frameWidth / 2, frameHeight / 2, (size / 2) + padding, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.arc(frameWidth / 2, frameHeight / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();

      qrX = (frameWidth - size) / 2;
      qrY = (frameHeight - size) / 2;
    } else {
      qrX = padding;
      qrY = fStyle === 'text-top' ? padding + textHeight : padding;
    }

    ctx.drawImage(qrCanvas, qrX, qrY);

    if (fText && fStyle !== 'circle') {
      ctx.fillStyle = color;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (fStyle === 'text-bottom') {
        ctx.fillText(fText, frameWidth / 2, frameHeight - textHeight / 2);
      } else if (fStyle === 'text-top') {
        ctx.fillText(fText, frameWidth / 2, textHeight / 2);
      } else if (fStyle === 'banner') {
        ctx.fillStyle = color;
        ctx.fillRect(0, frameHeight - textHeight - padding, frameWidth, textHeight);
        ctx.fillStyle = bgColor;
        ctx.fillText(fText, frameWidth / 2, frameHeight - textHeight / 2 - padding / 2);
      }
    }

    return canvas;
  };

  const addLogoToQRCode = (qrCanvas: HTMLCanvasElement, size: number) => {
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return;

    finalCanvas.width = size;
    finalCanvas.height = size;

    ctx.drawImage(qrCanvas, 0, 0);

    const logoSize = Math.min(size * 0.2, 80);
    const logoX = (size - logoSize) / 2;
    const logoY = (size - logoSize) / 2;

    const padding = 8;
    const bgSize = logoSize + (padding * 2);
    const bgX = logoX - padding;
    const bgY = logoY - padding;

    ctx.fillStyle = 'white';
    ctx.fillRect(bgX, bgY, bgSize, bgSize);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(bgX, bgY, bgSize, bgSize);

    try {
      if (logoImage) {
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
      }
    } catch (error) {
      console.error('Error drawing logo:', error);
    }

    if (frameStyle !== 'none') {
      const fText = frameText || 'Scan Me';
      const framedCanvas = applyFrame(finalCanvas, size, frameStyle, fText, qrColor, qrBgColor);
      displayQRCode(framedCanvas, size);
    } else {
      displayQRCode(finalCanvas, size);
    }
  };

  const displayQRCode = (canvas: HTMLCanvasElement, size: number) => {
    qrCanvasRef.current = canvas;
    setQrDisplayContent('success');
    setShowDownloadButtons(true);
    setShowQRInfo(true);
    setQrInfoData({
      type: currentType.toUpperCase(),
      size: '300x300 (display)',
      length: currentQRData.length.toString()
    });
    console.log('QR code generated successfully!');
  };

  const clearQRDisplay = () => {
    qrCanvasRef.current = null;
    setQrDisplayContent('initial');
    setShowDownloadButtons(false);
    setShowQRInfo(false);
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setQrDisplayContent('error');
    setShowDownloadButtons(false);
    setShowQRInfo(false);
  };

  const showLoadingMessage = () => {
    setQrDisplayContent('loading');
  };

  const downloadQR = (format: 'png' | 'svg', size: number = 300) => {
    if (!currentQRData) {
      showErrorMessage('Please generate a QR code first.');
      return;
    }

    try {
      const qr = new window.QRious({
        value: currentQRData,
        size: size,
        foreground: qrColor,
        background: qrBgColor,
        level: 'M',
        padding: 4
      });

      const baseCanvas = qr.canvas;
      if (!baseCanvas) {
        throw new Error('Failed to generate download QR code');
      }

      let finalCanvas = applyCustomStyle(baseCanvas, size, qrColor, qrBgColor);

      if (logoImage) {
        finalCanvas = addLogoToCanvas(finalCanvas, size);
      }

      if (frameStyle !== 'none') {
        const fText = frameText || 'Scan Me';
        finalCanvas = applyFrame(finalCanvas, size, frameStyle, fText, qrColor, qrBgColor);
      }

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `qr-code-${currentType}-${size}px.png`;
        link.href = finalCanvas.toDataURL('image/png');
        link.click();
      } else if (format === 'svg') {
        try {
          const svg = canvasToSVG(finalCanvas, finalCanvas.width);
          const blob = new Blob([svg], { type: 'image/svg+xml' });
          const link = document.createElement('a');
          link.download = `qr-code-${currentType}-${size}px.svg`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        } catch (error) {
          console.error('SVG generation error:', error);
          showErrorMessage('Error generating SVG. Please try PNG format.');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      showErrorMessage('Error generating download file. Please try again.');
    }
  };

  const addLogoToCanvas = (qrCanvas: HTMLCanvasElement, size: number) => {
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return qrCanvas;

    finalCanvas.width = size;
    finalCanvas.height = size;

    ctx.drawImage(qrCanvas, 0, 0);

    const logoSize = Math.min(size * 0.2, 80);
    const logoX = (size - logoSize) / 2;
    const logoY = (size - logoSize) / 2;

    const padding = 8;
    const bgSize = logoSize + (padding * 2);
    const bgX = logoX - padding;
    const bgY = logoY - padding;

    ctx.fillStyle = 'white';
    ctx.fillRect(bgX, bgY, bgSize, bgSize);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(bgX, bgY, bgSize, bgSize);

    try {
      if (logoImage) {
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
      }
    } catch (error) {
      console.error('Error drawing logo:', error);
    }

    return finalCanvas;
  };

  const canvasToSVG = (canvas: HTMLCanvasElement, size: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;

    svg += `<rect width="100%" height="100%" fill="${qrBgColor}"/>`;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        const alpha = pixels[index + 3];

        if (alpha > 128 && (r < 200 || g < 200 || b < 200)) {
          svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${qrColor}"/>`;
        }
      }
    }

    svg += '</svg>';
    return svg;
  };

  const copyQRData = () => {
    navigator.clipboard.writeText(currentQRData).then(() => {
      alert('QR code data copied to clipboard!');
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setLogoImage(img);
        if (currentQRData) {
          generateQR();
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoImage(null);
    if (logoUploadRef.current) {
      logoUploadRef.current.value = '';
    }
    if (currentQRData) {
      generateQR();
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationLat(position.coords.latitude.toFixed(6));
          setLocationLng(position.coords.longitude.toFixed(6));
        },
        (error) => {
          alert('Error getting location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleFrameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFrameStyle = e.target.value as FrameStyle;
    setFrameStyle(newFrameStyle);
    if (currentQRData) {
      generateQR();
    }
  };

  const qrTypes: Array<{ id: QRType; label: string; emoji: string }> = [
    { id: 'url', label: 'URL', emoji: '🔗' },
    { id: 'text', label: 'Text', emoji: '📝' },
    { id: 'email', label: 'Email', emoji: '✉️' },
    { id: 'phone', label: 'Phone', emoji: '📞' },
    { id: 'wifi', label: 'WiFi', emoji: '📶' },
    { id: 'contact', label: 'Contact', emoji: '👤' },
    { id: 'location', label: 'Location', emoji: '📍' },
    { id: 'sms', label: 'SMS', emoji: '💬' },
    { id: 'instagram', label: 'Instagram', emoji: '📷' },
    { id: 'facebook', label: 'Facebook', emoji: '📘' },
    { id: 'twitter', label: 'Twitter', emoji: '🐦' },
    { id: 'linkedin', label: 'LinkedIn', emoji: '💼' },
    { id: 'youtube', label: 'YouTube', emoji: '▶️' },
    { id: 'tiktok', label: 'TikTok', emoji: '🎵' },
    { id: 'whatsapp', label: 'WhatsApp', emoji: '💬' },
    { id: 'telegram', label: 'Telegram', emoji: '✈️' }
  ];

  // Group QR types by category for better organization
  const qrTypeCategories = [
    {
      name: 'Basic',
      types: qrTypes.filter(t => ['url', 'text', 'email', 'phone', 'sms'].includes(t.id))
    },
    {
      name: 'Utilities',
      types: qrTypes.filter(t => ['wifi', 'contact', 'location'].includes(t.id))
    },
    {
      name: 'Social Media',
      types: qrTypes.filter(t => ['instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok', 'whatsapp', 'telegram'].includes(t.id))
    }
  ];

  return (
    <>
      <style jsx>{`
        #qrDisplay canvas {
          max-width: 100%;
          max-height: 400px;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }

        .qr-type-scroll::-webkit-scrollbar {
          height: 6px;
        }

        .qr-type-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .qr-type-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .qr-type-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-3 sm:mb-4 border border-blue-200/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg sm:text-xl">📱</span>
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-sm sm:text-base">QR Code Generator</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
            {getH1('QR Code Generator')}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            {getSubHeading('Create custom QR codes for URLs, text, contact information, WiFi passwords, and more. Download as PNG or SVG.')}
          </p>
        </div>

        {/* Mobile Below Subheading Banner */}
        <MobileBelowSubheadingBanner />

        {/* QR Generator Tool - Full Width Hero Section */}
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8 mb-6">

          {/* QR Type Selector - Categorized */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h2 className="text-base sm:text-lg font-bold text-gray-800">Select QR Code Type</h2>
            </div>

            <div className="space-y-4">
              {qrTypeCategories.map((category) => (
                <div key={category.name}>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
                    {category.name}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.types.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleQRTypeChange(type.id)}
                        className={`
                          group relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-sm
                          transition-all duration-200 ease-out
                          ${currentType === type.id
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'
                          }
                        `}
                      >
                        <span className={`text-base sm:text-lg transition-transform duration-200 ${currentType === type.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                          {type.emoji}
                        </span>
                        <span className="whitespace-nowrap">{type.label}</span>
                        {currentType === type.id && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6 md:mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-r from-blue-50 via-white to-purple-50 px-4 text-sm text-gray-500">Configure & Generate</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

            {/* Input Section */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">✏️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Content Input</h3>
                  <p className="text-xs text-gray-500">Enter your {currentType} details</p>
                </div>
              </div>

              {/* URL Input */}
              {currentType === 'url' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL</label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Text Input */}
              {currentType === 'text' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Text</label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter your text here..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                  ></textarea>
                </div>
              )}

              {/* Email Input */}
              {currentType === 'email' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="contact@example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                  />
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject (Optional)</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Email subject"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                  />
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Email message..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                  ></textarea>
                </div>
              )}

              {/* Phone Input */}
              {currentType === 'phone' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* WiFi Input */}
              {currentType === 'wifi' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSSID}
                    onChange={(e) => setWifiSSID(e.target.value)}
                    placeholder="MyWiFiNetwork"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                  />
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="WiFi password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                  />
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Security Type</label>
                  <select
                    value={wifiSecurity}
                    onChange={(e) => setWifiSecurity(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="">None (Open)</option>
                  </select>
                </div>
              )}

              {/* Contact Input */}
              {currentType === 'contact' && (
                <div className="input-section space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={contactFirstName}
                        onChange={(e) => setContactFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={contactLastName}
                        onChange={(e) => setContactLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+1234567890"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
                    <input
                      type="text"
                      value={contactOrg}
                      onChange={(e) => setContactOrg(e.target.value)}
                      placeholder="Company Name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Location Input */}
              {currentType === 'location' && (
                <div className="input-section">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={locationLat}
                        onChange={(e) => setLocationLat(e.target.value)}
                        placeholder="40.7128"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        value={locationLng}
                        onChange={(e) => setLocationLng(e.target.value)}
                        placeholder="-74.0060"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={getLocation}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    📍 Use My Location
                  </button>
                </div>
              )}

              {/* SMS Input */}
              {currentType === 'sms' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                  />
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="SMS message..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                  ></textarea>
                </div>
              )}

              {/* Instagram Input */}
              {currentType === 'instagram' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram Username</label>
                  <input
                    type="text"
                    value={instagramUsername}
                    onChange={(e) => setInstagramUsername(e.target.value)}
                    placeholder="username"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Enter your Instagram username (without @)</p>
                </div>
              )}

              {/* Facebook Input */}
              {currentType === 'facebook' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook Username or Profile URL</label>
                  <input
                    type="text"
                    value={facebookUsername}
                    onChange={(e) => setFacebookUsername(e.target.value)}
                    placeholder="username or full URL"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Enter your Facebook username or full profile URL</p>
                </div>
              )}

              {/* Twitter Input */}
              {currentType === 'twitter' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter/X Username</label>
                  <input
                    type="text"
                    value={twitterUsername}
                    onChange={(e) => setTwitterUsername(e.target.value)}
                    placeholder="username"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Enter your Twitter/X username (without @)</p>
                </div>
              )}

              {/* LinkedIn Input */}
              {currentType === 'linkedin' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn Username or URL</label>
                  <input
                    type="text"
                    value={linkedinUsername}
                    onChange={(e) => setLinkedinUsername(e.target.value)}
                    placeholder="username or full URL"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Enter your LinkedIn username or full profile URL</p>
                </div>
              )}

              {/* YouTube Input */}
              {currentType === 'youtube' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube Channel</label>
                  <input
                    type="text"
                    value={youtubeUsername}
                    onChange={(e) => setYoutubeUsername(e.target.value)}
                    placeholder="@username or channel URL"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Enter your YouTube channel handle or full URL</p>
                </div>
              )}

              {/* TikTok Input */}
              {currentType === 'tiktok' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">TikTok Username</label>
                  <input
                    type="text"
                    value={tiktokUsername}
                    onChange={(e) => setTiktokUsername(e.target.value)}
                    placeholder="@username"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Enter your TikTok username (with or without @)</p>
                </div>
              )}

              {/* WhatsApp Input */}
              {currentType === 'whatsapp' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Phone Number</label>
                  <input
                    type="tel"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Include country code (e.g., +1 for US)</p>
                </div>
              )}

              {/* Telegram Input */}
              {currentType === 'telegram' && (
                <div className="input-section">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telegram Username</label>
                  <input
                    type="text"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="username"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Enter your Telegram username (without @)</p>
                </div>
              )}

              {/* Customization Options */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
                <h4 className="font-semibold text-gray-800 mb-3">🎨 Customization</h4>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Colors</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <div className="flex-1 text-xs text-gray-600 flex items-center">
                      QR Code & Background Colors
                    </div>
                  </div>
                </div>

                {/* Frame Style */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Frame</label>
                  <select
                    value={frameStyle}
                    onChange={handleFrameChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-2"
                  >
                    <option value="none">No Frame</option>
                    <option value="text-bottom">Text Bottom</option>
                    <option value="text-top">Text Top</option>
                    <option value="banner">Banner</option>
                    <option value="circle">Circle Frame</option>
                  </select>
                  {frameStyle !== 'none' && (
                    <div>
                      <input
                        type="text"
                        value={frameText}
                        onChange={(e) => setFrameText(e.target.value)}
                        placeholder="Enter frame text..."
                        maxLength={50}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Logo Upload */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Add Logo (Optional)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      ref={logoUploadRef}
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoUploadRef.current?.click()}
                      className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      📁 Upload Logo
                    </button>
                    {logoImage && (
                      <div className="flex items-center gap-2">
                        <img src={logoImage.src} alt="Logo preview" className="w-8 h-8 rounded" />
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Logo will be placed in the center of the QR code. Recommended: square image, max 2MB</div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={generateQR}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-semibold text-base sm:text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 mt-6 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span className="text-xl">✨</span>
                Generate QR Code
              </button>
            </div>

            {/* Output Section */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">📱</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Generated QR Code</h3>
                  <p className="text-xs text-gray-500">Preview & download your QR code</p>
                </div>
              </div>

              {/* QR Display */}
              <div
                id="qrDisplay"
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center flex items-center justify-center border-2 border-dashed border-gray-200 mb-6 transition-all duration-300"
                style={{ minHeight: '320px' }}
              >
                {qrDisplayContent === 'initial' && (
                  <div className="text-gray-400">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
                      <span className="text-4xl opacity-50">📱</span>
                    </div>
                    <p className="text-base font-medium text-gray-500">Your QR code will appear here</p>
                    <p className="text-sm text-gray-400 mt-1">Fill in the details and click Generate</p>
                  </div>
                )}
                {qrDisplayContent === 'loading' && (
                  <div className="text-blue-500">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                    <p className="text-base font-medium">Generating QR Code...</p>
                  </div>
                )}
                {qrDisplayContent === 'error' && (
                  <div className="text-red-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl">❌</span>
                    </div>
                    <p className="text-base font-semibold">Error</p>
                    <p className="text-sm mt-2 text-red-400">{errorMessage}</p>
                    <button
                      onClick={clearQRDisplay}
                      className="mt-4 px-5 py-2 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
                {qrDisplayContent === 'success' && qrCanvasRef.current && (
                  <div className="p-2 bg-white rounded-xl shadow-lg">
                    <canvas
                      ref={(el) => {
                        if (el && qrCanvasRef.current) {
                          const ctx = el.getContext('2d');
                          el.width = qrCanvasRef.current.width;
                          el.height = qrCanvasRef.current.height;
                          ctx?.drawImage(qrCanvasRef.current, 0, 0);
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Download Buttons */}
              {showDownloadButtons && (
                <div id="downloadButtons" className="space-y-3">
                  {/* Download Options */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* PNG Downloads */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">📥</span>
                        <span className="font-semibold text-emerald-800 text-sm">PNG Format</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[200, 300, 500, 1000].map((size) => (
                          <button
                            key={`png-${size}`}
                            onClick={() => downloadQR('png', size)}
                            className="bg-emerald-600 text-white px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
                          >
                            {size}px
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SVG Downloads */}
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-3 border border-violet-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🎨</span>
                        <span className="font-semibold text-violet-800 text-sm">SVG Format</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[200, 300, 500, 1000].map((size) => (
                          <button
                            key={`svg-${size}`}
                            onClick={() => downloadQR('svg', size)}
                            className="bg-violet-600 text-white px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-violet-700 transition-colors"
                          >
                            {size}px
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Copy Data */}
                  <button
                    onClick={copyQRData}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 border border-gray-200"
                  >
                    <span>📋</span> Copy QR Data
                  </button>
                </div>
              )}

              {/* QR Info */}
              {showQRInfo && (
                <div id="qrInfo" className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">ℹ️</span>
                    <h4 className="font-semibold text-blue-800 text-sm">QR Code Info</h4>
                  </div>
                  <div className="text-xs text-blue-700 grid grid-cols-3 gap-2">
                    <p><span className="font-medium">Type:</span> <span>{qrInfoData.type}</span></p>
                    <p><span className="font-medium">Size:</span> <span>{qrInfoData.size}</span></p>
                    <p><span className="font-medium">Data Length:</span> <span>{qrInfoData.length}</span> characters</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* End QR Generator Tool */}

        {/* Two Column Layout for Supporting Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Column */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* How to Use */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">How to Use the QR Generator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-gray-700">
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">📝 1. Choose Type</h4>
                  <p className="text-sm md:text-base mb-4">Select the type of QR code you want to create: URL, text, email, WiFi, contact info, etc.</p>

                  <h4 className="font-semibold mb-2 text-purple-600">✏️ 2. Enter Content</h4>
                  <p className="text-sm md:text-base">Fill in the required information based on the type you selected. All fields are validated automatically.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">🎨 3. Customize</h4>
                  <p className="text-sm md:text-base mb-4">Choose your preferred size and colors to match your brand or design requirements.</p>

                  <h4 className="font-semibold mb-2 text-orange-600">💾 4. Download</h4>
                  <p className="text-sm md:text-base">Generate and download your QR code as PNG for web use or SVG for print and scalable applications.</p>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Popular QR Code Uses</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl md:text-2xl mb-2">🏪</div>
                  <h4 className="font-semibold text-blue-800 text-sm md:text-base mb-1">Business Cards</h4>
                  <p className="text-xs md:text-sm text-blue-600">Contact information</p>
                </div>
                <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg">
                  <div className="text-xl md:text-2xl mb-2">🍽️</div>
                  <h4 className="font-semibold text-green-800 text-sm md:text-base mb-1">Restaurant Menus</h4>
                  <p className="text-xs md:text-sm text-green-600">Digital menus</p>
                </div>
                <div className="text-center p-3 md:p-4 bg-purple-50 rounded-lg">
                  <div className="text-xl md:text-2xl mb-2">📱</div>
                  <h4 className="font-semibold text-purple-800 text-sm md:text-base mb-1">App Downloads</h4>
                  <p className="text-xs md:text-sm text-purple-600">Direct app links</p>
                </div>
                <div className="text-center p-3 md:p-4 bg-orange-50 rounded-lg">
                  <div className="text-xl md:text-2xl mb-2">🏠</div>
                  <h4 className="font-semibold text-orange-800 text-sm md:text-base mb-1">WiFi Access</h4>
                  <p className="text-xs md:text-sm text-orange-600">Easy network sharing</p>
                </div>
              </div>
            </div>

            {/* Mobile MREC2 */}
            <GameAppMobileMrec2 />

            {/* FAQs Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Frequently Asked Questions</h2>
              <FirebaseFAQs pageId="qr-generator" fallbackFaqs={fallbackFaqs} />
            </div>
          </div>
          {/* End Main Content Column */}

          {/* Right Sidebar */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />

            {/* Desktop Stats */}
            <div className="hidden lg:block bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-blue-500">📊</span> QR Code Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">Type</span>
                  <span className="font-bold text-blue-600">{currentType.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                  <span className="text-gray-600">Status</span>
                  <span className="font-bold text-purple-600">{qrDisplayContent === 'success' ? 'Generated' : 'Pending'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-gray-600">Logo</span>
                  <span className="font-bold text-green-600">{logoImage ? 'Added' : 'None'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                  <span className="text-gray-600">Frame</span>
                  <span className="font-bold text-orange-600">{frameStyle !== 'none' ? frameStyle : 'None'}</span>
                </div>
                {currentQRData && (
                  <div className="flex justify-between items-center p-2 bg-cyan-50 rounded-lg">
                    <span className="text-gray-600">Data Length</span>
                    <span className="font-bold text-cyan-600">{currentQRData.length} chars</span>
                  </div>
                )}
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

            {/* Related Tools */}
            <div className="hidden lg:block bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-purple-500">🔧</span> Related Tools
              </h3>
              <div className="space-y-2">
                <Link href="/us/tools/apps/strong-password-generator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors group">
                  <span className="text-xl">🔐</span>
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-purple-600">Password Generator</div>
                    <div className="text-xs text-gray-500">Create secure passwords</div>
                  </div>
                </Link>
                <Link href="/us/tools/apps/base64-encoder" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors group">
                  <span className="text-xl">🔄</span>
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-purple-600">Base64 Encoder</div>
                    <div className="text-xs text-gray-500">Encode/decode Base64</div>
                  </div>
                </Link>
                <Link href="/us/tools/apps/hash-generator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors group">
                  <span className="text-xl">#️⃣</span>
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-purple-600">Hash Generator</div>
                    <div className="text-xs text-gray-500">Generate MD5, SHA hashes</div>
                  </div>
                </Link>
                <Link href="/us/tools/apps/random-number-generator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors group">
                  <span className="text-xl">🎲</span>
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-purple-600">Random Generator</div>
                    <div className="text-xs text-gray-500">Generate random numbers</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="hidden lg:block bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>💡</span> Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Use high contrast colors for better scanning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Keep logos small (20% of QR code)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>SVG format is best for printing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Test QR codes before distribution</span>
                </li>
              </ul>
            </div>
          </div>
          {/* End Sidebar */}
        </div>
        {/* End Two Column Layout */}
      </div>
    </>
  );
}
