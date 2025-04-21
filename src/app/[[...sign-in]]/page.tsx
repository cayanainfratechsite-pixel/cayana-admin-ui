"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Box,
  Paper,
} from "@mui/material";
import { NextPage } from "next";
import Image from "next/image";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie"; 
import Link from "next/link";

const SignInPage: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await axios.post("https://api.cayana.co.in/api/v1/user/login", {
        email,
        password,
      });

      // Extract tokens from response headers
      const authHeader = response.headers["authorization"];
      const refreshHeader = response.headers["refresh-token"];
  
      if (!authHeader) {
        throw new Error("Authorization or refresh token missing in headers.");
      }

      // Remove 'Bearer ' from the auth header to get the token
      const tokenWithoutBearer = authHeader.replace("Bearer ", "");

      // Store the access token in a cookie
      Cookies.set("access-token", tokenWithoutBearer, {
        expires: 1, // Cookie expires in 1 day (adjust as needed)
        sameSite: "strict",
      });

      // Optional: You could also store the refresh token if needed
      // Cookies.set("refresh-token", refreshHeader, {
      //   expires: 7, // Adjust expiration as required
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "strict",
      // });

      console.log("Token without Bearer", tokenWithoutBearer);
      console.log("Refresh token", refreshHeader);
      console.log("Login successful", response.data);
      // Redirect to /projects upon successful login
      router.push("/projects");
    } catch (error) {
      console.error("Login failed", error);
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "Login failed");
      } else {
        setErrorMessage("An error occurred during login.");
      }
    }
  };

  return (
    <Box
      className="h-screen flex justify-center items-center"
      sx={{ backgroundColor: "#f6f6f6" }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: "40px 30px",
          width: "400px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: "white",
        }}
      >
        <Box className="text-center mb-6">
          <Image
            src="/images/cayana_blue.png"
            alt="Admin Logo"
            width={300}
            height={60}
            className="mx-auto mb-4"
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif",
              color: "#333",
              textAlign: "center",
              marginTop: "2rem",
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            sx={{
              fontWeight: 100,
              fontFamily: "Poppins, sans-serif",
              color: "#383838",
              textAlign: "center",
              fontSize: "0.8rem",
            }}
          >
            Please enter your credentials to continue
          </Typography>
          {errorMessage && (
            <Typography
              sx={{
                marginTop: "1rem",
                color: "red",
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.9rem",
              }}
            >
              {errorMessage}
            </Typography>
          )}
        </Box>
        <form onSubmit={handleSubmit}>
          <Box className="mb-4">
            <TextField
              fullWidth
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderRadius: "8px" },
                },
              }}
            />
          </Box>
          <Box className="mb-4">
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderRadius: "8px" },
                },
              }}
            />
          </Box>
          <Link className="text-red-500 font-medium" href={"/forget-password"}>forgot password?</Link>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              padding: "12px 16px",
              borderRadius: "8px",
              backgroundColor: "#007AFF",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              marginTop: "10px",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#0056b3",
              },
            }}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SignInPage;
