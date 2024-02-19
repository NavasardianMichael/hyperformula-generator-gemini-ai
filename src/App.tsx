import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Typography
} from "@mui/material";
import { useState } from "react";
import "./App.css";

function App() {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const [data, setData] = useState("---");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchDataFromGeminiProAPI() {
    try {
      if (!inputText) {
        return;
      }
      setLoading(true);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(
        `
        Generate hyperformula based on the prompt:
        ${inputText}
        `
      );
      const text = result.response.text();
      setLoading(false);
      setData(text);
    } catch (error) {
      setLoading(false);
      console.error("fetchDataFromGeminiAPI error: ", error);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",

          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          GEMINI AI
        </Typography>
        <Box
          style={{ width: 400 }}
          sx={{ mt: 3 }}
        >
          <textarea
            required
            disabled={loading}
            placeholder="Enter formula description here"
            style={{ width: 400 }}
            autoFocus
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value)
            }}
          />
          <Button
            type="submit"
            fullWidth
            disabled={loading || !inputText}
            onClick={() => fetchDataFromGeminiProAPI()}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Prompt the Formula
          </Button>
          <Typography component="h1" variant="h6">
            Result: {data}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}


export default App;
