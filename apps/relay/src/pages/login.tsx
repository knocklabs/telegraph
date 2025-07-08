import { Button } from "@telegraph/button";
import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('relay_session');
    if (token) {
      router.push('/');
      return;
    }

    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [router]);

  const initializeGoogleSignIn = () => {
    if (!window.google) {
      setError('Failed to load Google Sign-In');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Render the sign-in button
    const buttonElement = document.getElementById('google-signin-button');
    if (buttonElement) {
      window.google.accounts.id.renderButton(buttonElement, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
        shape: 'rectangular',
      });
    }
  };

  const handleGoogleResponse = async (response: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetch('/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      if (result.ok) {
        const data = await result.json();
        
        // Store the session token in localStorage
        localStorage.setItem('relay_session', data.token);
        
        // Redirect to home page
        router.push('/');
      } else {
        const errorData = await result.json();
        setError(errorData.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      align="center"
      justify="center"
      bg="surface-1"
      data-tgph-appearance="light"
    >
      <Stack
        w="full"
        maxW="96"
        gap="8"
        align="center"
        bg="white"
        p="8"
        rounded="4"
        border="px"
        borderColor="gray-6"
      >
        <Stack gap="4" align="center">
          <Heading as="h1" size="6" color="gray-12">
            Welcome to Relay
          </Heading>
          <Text as="p" size="4" color="gray-11" align="center">
            Sign in with your Knock account to continue
          </Text>
        </Stack>

        {error && (
          <Box
            w="full"
            p="3"
            bg="red-2"
            border="px"
            borderColor="red-6"
            rounded="2"
          >
            <Text as="p" size="2" color="red-11">
              {error}
            </Text>
          </Box>
        )}

        <Stack w="full" gap="4">
          <Box w="full" h="12" id="google-signin-button" />
          
          {isLoading && (
            <Text as="p" size="2" color="gray-11" align="center">
              Signing you in...
            </Text>
          )}
        </Stack>

        <Stack gap="2" align="center">
          <Text as="p" size="2" color="gray-10" align="center">
            Only @knock.app email addresses are allowed
          </Text>
          <Text as="p" size="1" color="gray-9" align="center">
            Need help? Contact your system administrator
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default LoginPage;