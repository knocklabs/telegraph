import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("relay_session");
    if (token) {
      router.push("/");
      return;
    }

    // Load Google Identity Services
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const initializeGoogleSignIn = () => {
    if (!window.google) {
      setError("Failed to load Google Sign-In");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Render the sign-in button
    const buttonElement = document.getElementById("google-signin-button");
    if (buttonElement) {
      window.google.accounts.id.renderButton(buttonElement, {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "continue_with",
        shape: "rectangular",
      });
    }
  };

  const handleGoogleResponse = async (response: { credential: unknown }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetch("/api/auth/google/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      if (result.ok) {
        const data = await result.json();

        // Store the session token in localStorage
        localStorage.setItem("relay_session", data.token);

        // Redirect to home page
        router.push("/");
      } else {
        const errorData = await result.json();
        setError(errorData.error || "Authentication failed");
      }
    } catch (_error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack align="center" justify="center" direction="column" mt="40">
      <Stack
        w="full"
        maxW="96"
        gap="8"
        align="center"
        p="8"
        rounded="4"
        border="px"
        direction="column"
      >
        <Stack gap="4" direction="column">
          <Heading as="h1" size="6" align="center">
            Welcome to Relay
          </Heading>
          <Text as="p" size="4" align="center">
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
            <Text as="p" size="2" color="red">
              {error}
            </Text>
          </Box>
        )}

        <Stack w="full" gap="4" direction="column">
          <Box w="full" h="12" id="google-signin-button" />

          {isLoading && (
            <Text as="p" size="2" color="gray" align="center">
              Signing you in...
            </Text>
          )}
        </Stack>

        <Stack gap="2" align="center" direction="column">
          <Text as="p" size="2" color="gray" align="center">
            Only @knock.app email addresses are allowed
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LoginPage;
