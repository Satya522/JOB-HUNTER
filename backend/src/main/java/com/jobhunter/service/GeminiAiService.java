package com.jobhunter.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * ✅ FILE #5: GeminiAiService
 * 
 * Purpose: Call Google Gemini AI API to generate content
 * API Link: https://ai.google.dev
 * 
 * Setup:
 *   1. Go to https://ai.google.dev
 *   2. Click "Get API Key"
 *   3. Create new project
 *   4. Get free API key
 *   5. Add to .env: GEMINI_API_KEY=your_key
 * 
 * Used by: AiSuggestionService
 * Endpoints using this:
 *   - POST /api/ai/cover-letter
 *   - POST /api/ai/interview-prep
 *   - POST /api/ai/salary-insights
 *   - POST /api/ai/insights
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiAiService {
    
    // ===== CONFIGURATION =====
    @Value("${gemini.api-key}")
    private String geminiApiKey;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    // Gemini API endpoint
    private static final String GEMINI_API_URL = 
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
    
    /**
     * Generate content using Gemini AI
     * @param prompt The prompt to send to Gemini AI
     * @return AI generated response text
     */
    public String generateContent(String prompt) {
        try {
            log.info("🤖 Calling Gemini AI with prompt length: {}", prompt.length());
            
            // Step 1: Create request body in Gemini API format
            String requestBody = createRequestBody(prompt);
            
            // Step 2: Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            // Step 3: Create HTTP request
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
            
            // Step 4: Call Gemini API
            ResponseEntity<String> response = restTemplate.postForEntity(
                GEMINI_API_URL + "?key=" + geminiApiKey,
                request,
                String.class
            );
            
            log.info("✅ Gemini API response status: {}", response.getStatusCode());
            
            // Step 5: Parse and return response
            return parseResponse(response.getBody());
            
        } catch (Exception e) {
            log.error("❌ Error calling Gemini AI: {}", e.getMessage());
            throw new RuntimeException("Error calling Gemini AI: " + e.getMessage(), e);
        }
    }
    
    /**
     * Create request body in Gemini API format
     */
    private String createRequestBody(String prompt) throws Exception {
        // Gemini API expects this format:
        // {
        //   "contents": [{
        //     "parts": [{"text": "prompt here"}]
        //   }]
        // }
        
        StringBuilder json = new StringBuilder();
        json.append("{\"contents\": [{\"parts\": [{\"text\": \"");
        json.append(objectMapper.writeValueAsString(prompt).substring(1));
        json.append("}]}]}");
        
        return json.toString();
    }
    
    /**
     * Parse Gemini API response
     * Extract the generated text from response JSON
     */
    private String parseResponse(String responseBody) throws Exception {
        // Gemini API returns:
        // {
        //   "candidates": [{
        //     "content": {
        //       "parts": [{"text": "generated response here"}]
        //     }
        //   }]
        // }
        
        JsonNode root = objectMapper.readTree(responseBody);
        String result = root.at("/candidates/0/content/parts/0/text").asText();
        
        if (result.isEmpty()) {
            log.warn("⚠️ Empty response from Gemini AI");
        }
        
        return result;
    }
}
