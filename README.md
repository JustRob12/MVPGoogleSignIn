# MVP Google Sign-In with React Native

This project demonstrates a Model-View-Presenter (MVP) architecture implementation with secure Google Sign-In in React Native.

## Features

- Google Sign-In authentication
- Secure token storage using react-native-keychain
- MVP architecture implementation
- TypeScript support
- Secure networking with Axios
- Web platform support

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Google Cloud Project with OAuth 2.0 credentials

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd mvp-google-signin
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure Google Sign-In:
   - Go to the [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Enable the Google Sign-In API
   - Create OAuth 2.0 credentials
   - Add your web application's domain to the authorized JavaScript origins
   - Copy the Web Client ID and replace `YOUR_WEB_CLIENT_ID` in `src/model/AuthModel.ts`

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Run on web:
```bash
npm run web
# or
yarn web
```

## Project Structure

```
src/
├── model/
│   └── AuthModel.ts       # Business logic and data handling
├── view/
│   └── LoginScreen.tsx    # UI components
├── presenter/
│   └── AuthPresenter.ts   # Mediator between Model and View
└── services/
    └── api.ts            # Secure networking service
```

## Security Features

- Secure token storage using react-native-keychain
- HTTPS networking with Axios
- Token-based authentication
- Automatic token refresh
- Secure error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.