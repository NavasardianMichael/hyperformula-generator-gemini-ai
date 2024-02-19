import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import "./App.css";

function App() {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const [data, setData] = useState("---");
  const [prePromptText, setPrePromptText] = useState('Generate excel formula as hyperformula based on the following prompt');
  const [postPromptText, setPostPromptText] = useState(' Please make sure it starts with "=".');
  const [inputText, setInputText] = useState("");
  const [temperature, setTemperature] = useState(0.5);
  const [loading, setLoading] = useState(false);

  async function fetchDataFromGeminiProAPI() {
    try {
      if (!inputText) {
        return;
      }
      setLoading(true);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        generationConfig: { temperature },
      });

      const result = await model.generateContent(
        `
        ${prePromptText}: ${inputText}. ${postPromptText}`
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
        <Box style={{ width: 600, display: 'flex', flexDirection: 'column', gap: 16 }} sx={{ mt: 3 }}>
          <TextField 
            value={prePromptText}
            disabled={loading}
            label="Prompt pre text"
            fullWidth
            onChange={(e) => setPrePromptText(e.target.value)}
          />
          <textarea
            required
            disabled={loading}
            placeholder="Enter formula description here"
            rows={8}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          />
          <TextField 
            value={postPromptText}
            disabled={loading}
            label="Prompt pre text"
            fullWidth
            onChange={(e) => setPostPromptText(e.target.value)}
          />
          <Box>
            <Typography gutterBottom>Temperature controls the randomness of the output. A higher temperature results in more creative and less predictable outputs, while a lower temperature produces more conservative and expected results.</Typography>          
            <Slider
              max={1}
              min={0}
              valueLabelDisplay='auto'
              step={.1}
              marks
              value={temperature}
              disabled={loading}
              onChange={(e) => setTemperature(+e.target.value)}
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            disabled={loading || !inputText}
            onClick={() => fetchDataFromGeminiProAPI()}
            variant="contained"
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
