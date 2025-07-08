# Environment Setup Guide for Relay

This guide explains how to set up the required environment variables for the Relay app.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values in `.env.local` (see sections below)

## Required Environment Variables

### 1. OpenAI Configuration

**OPENAI_API_KEY**
- **Required**: Yes
- **Description**: Your OpenAI API key for accessing GPT models
- **How to get**: 
  1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
  2. Sign in or create an account
  3. Click "Create new secret key"
  4. Copy the key (starts with `sk-`)
- **Example**: `sk-proj-abc123...`

### 2. Google OAuth Configuration

**GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET**
- **Required**: Yes (for authentication)
- **Description**: Google OAuth credentials for user authentication
- **How to get**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select existing one
  3. Enable the Google Identity API
  4. Go to "APIs & Services" > "Credentials"
  5. Click "Create Credentials" > "OAuth 2.0 Client ID"
  6. Configure authorized origins:
     - `http://localhost:3000` (for development)
     - `https://your-domain.com` (for production)
  7. Configure authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback` (for development)
     - `https://your-domain.com/api/auth/google/callback` (for production)
  8. Copy the Client ID and Client Secret

**NEXT_PUBLIC_GOOGLE_CLIENT_ID**
- **Required**: Yes
- **Description**: Public version of Google Client ID for client-side use
- **Value**: Should be the same as `GOOGLE_CLIENT_ID`

### 3. JWT Configuration

**JWT_SECRET**
- **Required**: Yes
- **Description**: Secret key for signing JWT session tokens
- **How to generate**: Run `openssl rand -base64 32` in your terminal
- **Example**: `abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

### 4. Next.js Configuration

**NEXTAUTH_URL**
- **Required**: Yes
- **Description**: The canonical URL of your site
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

**NEXTAUTH_SECRET**
- **Required**: Yes
- **Description**: Secret for NextAuth.js (can be same as JWT_SECRET)
- **How to generate**: Run `openssl rand -base64 32` in your terminal

**NODE_ENV**
- **Required**: No (automatically set by Next.js)
- **Description**: Environment mode
- **Values**: `development`, `production`, `test`

## Example .env.local file

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz

# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com

# JWT Secret
JWT_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890

# Node Environment
NODE_ENV=development
```

## Security Best Practices

1. **Never commit `.env.local` to version control**
   - The `.env.local` file is already in `.gitignore`
   - Only commit `.env.example` with placeholder values

2. **Use different secrets for different environments**
   - Development, staging, and production should have different JWT secrets
   - Use different Google OAuth clients for different environments

3. **Rotate secrets regularly**
   - Change JWT secrets periodically
   - Rotate OpenAI API keys if compromised

4. **Use environment-specific values**
   - `NEXTAUTH_URL` should match your actual domain in production
   - Google OAuth redirect URIs should match your environment

## Troubleshooting

### "Missing environment variable" errors
- Make sure all required variables are set in `.env.local`
- Restart your development server after adding new variables

### Google OAuth errors
- Check that your redirect URIs match exactly (including http/https)
- Ensure your domain is added to authorized origins
- Verify that the Google Identity API is enabled

### OpenAI API errors
- Check that your API key is valid and not expired
- Ensure you have sufficient credits in your OpenAI account
- Verify the API key format (should start with `sk-`)

## Production Deployment

For production deployment, set these environment variables in your hosting platform:

- **Vercel**: Go to Project Settings > Environment Variables
- **Netlify**: Go to Site Settings > Environment Variables  
- **AWS**: Use AWS Secrets Manager or Parameter Store
- **Docker**: Use environment variables or secrets

Remember to update `NEXTAUTH_URL` to your production domain and use production-specific OAuth credentials.