# 🌍 City Information Finder

An intelligent web application that automatically detects your location and provides comprehensive information about cities in any state or country using AI technology.

![City Information Finder](https://github.com/1900690105/findaboutstate/blob/main/public/Screenshot%20(1).png)
![City Information Finder](https://github.com/1900690105/findaboutstate/blob/main/public/Screenshot%20(2).png)


## ✨ Features

### 🎯 Core Functionality
- **Auto Location Detection**: One-click geolocation using browser's GPS
- **AI-Powered City Data**: Get detailed information about cities including:
  - Comprehensive descriptions
  - Historical background
  - Famous attractions and landmarks
  - Cultural highlights
- **Manual Location Input**: Fallback option for manual state/country entry
- **Real-time Data Processing**: Instant AI-generated responses

### 🚀 Technical Features
- **Reverse Geocoding**: Convert GPS coordinates to readable addresses
- **Privacy-First**: Location access only when explicitly requested
- **Error Handling**: Comprehensive error management for all scenarios
- **Loading States**: Clear user feedback during data processing
- **Responsive Design**: Mobile-first, works on all devices

### ♿ Accessibility & UX
- **WCAG 2.1 AA Compliant**: Full accessibility support
- **Keyboard Navigation**: Complete keyboard-only operation
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Logical tab order and focus indicators
- **High Contrast**: Readable color schemes
- **Keyboard Shortcuts**: 
  - `Enter` - Submit form
  - `Escape` - Clear form
  - `↑/↓` - Navigate between fields

## 🛠️ Tech Stack

- **Frontend**: React 18+ with Hooks
- **Framework**: Next.js 13+
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **APIs**: 
  - Browser Geolocation API
  - OpenStreetMap Nominatim (reverse geocoding)
  - Custom AI integration
- **Accessibility**: ARIA, semantic HTML, keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern web browser with geolocation support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/city-information-finder.git
   cd city-information-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your AI service configuration:
   ```env
   NEXT_PUBLIC_AI_API_KEY=your_ai_api_key_here
   NEXT_PUBLIC_AI_API_URL=your_ai_service_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
city-information-finder/
├── components/
│   ├── LocationForm.js          # Main form component
│   ├── ShowData.js              # Results display component
│   └── ui/                      # Reusable UI components
├── config/
│   └── AIConfig.js              # AI service configuration
├── pages/
│   ├── index.js                 # Home page
│   └── _app.js                  # Next.js app wrapper
├── styles/
│   └── globals.css              # Global styles
├── public/
│   └── favicon.ico              # App icon
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

## 🔧 Configuration

### AI Service Setup

Update `config/AIConfig.js` with your AI service:

```javascript
export const AIState = {
  sendMessage: async (prompt) => {
    const response = await fetch('/api/ai-service', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_API_KEY}`
      },
      body: JSON.stringify({ prompt })
    });
    
    return await response.json();
  }
};
```

### Customizing Location Services

The app uses OpenStreetMap Nominatim by default (free, no API key required). To use alternative services:

```javascript
// In LocationForm.js, update the reverseGeocode function
const reverseGeocode = async (latitude, longitude) => {
  // Option 1: Google Maps Geocoding API
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
  );
  
  // Option 2: MapBox Geocoding API
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${ACCESS_TOKEN}`
  );
};
```

## 📱 Usage Examples

### Basic Usage
1. Click "Use My Current Location" button
2. Allow location access when prompted
3. View auto-filled state and country
4. Click "Find Cities" to get AI-generated city information

### Manual Entry
1. Type state/province name (e.g., "California", "Ontario")
2. Type country name (e.g., "United States", "Canada")
3. Click "Find Cities"

### Keyboard Navigation
1. Use `Tab` for standard navigation
2. Use `↑/↓` arrows to move between form fields
3. Press `Enter` to submit form
4. Press `Escape` to clear form

## 🌐 Browser Support

| Browser | Version | Geolocation | Status |
|---------|---------|-------------|--------|
| Chrome | 50+ | ✅ | Fully Supported |
| Firefox | 55+ | ✅ | Fully Supported |
| Safari | 10+ | ✅ | Fully Supported |
| Edge | 79+ | ✅ | Fully Supported |
| Opera | 37+ | ✅ | Fully Supported |

**Note**: HTTPS required for geolocation in production environments.

## 🔒 Privacy & Security

- **Location Data**: Never stored, only used for geocoding
- **User Input**: Validated and sanitized
- **API Keys**: Stored in environment variables
- **HTTPS**: Required for geolocation in production
- **No Tracking**: No analytics or user tracking

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Manual Deployment
```bash
npm run build
npm run export
# Upload out/ folder to your hosting provider
```

### Environment Variables for Production
```env
NEXT_PUBLIC_AI_API_KEY=your_production_ai_key
NEXT_PUBLIC_AI_API_URL=your_production_ai_url
```

## 🧪 Testing

### Run Tests
```bash
npm test
# or
yarn test
```

### Accessibility Testing
```bash
npm run test:a11y
```

### Performance Testing
```bash
npm run lighthouse
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes and test**
4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open Pull Request**

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure accessibility compliance
- Test on multiple browsers

## 🐛 Troubleshooting

### Common Issues

**Location not detected:**
- Ensure HTTPS in production
- Check browser permissions
- Verify geolocation API support

**AI responses not working:**
- Check API key configuration
- Verify environment variables
- Check network connectivity

**Styling issues:**
- Clear browser cache
- Check Tailwind CSS build
- Verify CSS imports

**Accessibility issues:**
- Test with screen readers
- Check keyboard navigation
- Validate ARIA labels

### Getting Help
- 📧 Email: nikhilkandhare22@gmail.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenStreetMap](https://www.openstreetmap.org/) for free geocoding service
- [Tailwind CSS](https://tailwindcss.com/) for styling framework
- [Lucide](https://lucide.dev/) for beautiful icons
- [React](https://reactjs.org/) and [Next.js](https://nextjs.org/) communities

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/city-information-finder)
![GitHub forks](https://img.shields.io/github/forks/yourusername/city-information-finder)
![GitHub issues](https://img.shields.io/github/issues/yourusername/city-information-finder)
![GitHub license](https://img.shields.io/github/license/yourusername/city-information-finder)

---

**Made with ❤️ by [Nikhil & Saraswati ](https://github.com/1900690105)**

⭐ Star this repo if you found it helpful!
