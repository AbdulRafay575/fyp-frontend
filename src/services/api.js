const API_BASE = 'http://localhost:8000';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('access_token');
        this.API_BASE = API_BASE;
    }

    async request(endpoint, options = {}) {
        const url = `${this.API_BASE}${endpoint}`;
        
        console.log(`Making API request to: ${url}`);
        console.log(`Token available: ${!!this.token}`);
        
        const config = {
            headers: {
                ...options.headers,
            },
            ...options,
        };

        // Add Authorization header if token exists and not skipping auth
        if (this.token && !options.skipAuth) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Don't set Content-Type for FormData - let the browser set it
        if (options.body instanceof FormData) {
            delete config.headers['Content-Type'];
        } else if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }

        try {
            const response = await fetch(url, config);
            
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                throw new Error(data.detail || data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('access_token', token);
        } else {
            localStorage.removeItem('access_token');
        }
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('access_token');
    }

    // Auth endpoints
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async signup(email, password, full_name) {
        return this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, full_name }),
        });
    }

    async logout() {
        try {
            const result = await this.request('/auth/logout', {
                method: 'POST',
            });
            this.clearToken();
            return result;
        } catch (error) {
            this.clearToken();
            throw error;
        }
    }

    // Document endpoints - FIXED
    async uploadDocument(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        return this.request('/documents/upload', {
            method: 'POST',
            body: formData,
            // Headers will be set automatically, including Authorization
        });
    }

    async generateQuestionsFromDocument(file, numQuestions = 10) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('num_questions', numQuestions.toString());
        
        return this.request('/documents/generate-questions', {
            method: 'POST',
            body: formData,
        });
    }

    // Profile endpoints
    async updateProfilePicture(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        return this.request('/users/profile-picture', {
            method: 'PUT',
            body: formData,
        });
    }

    async getProfile() {
        return this.request('/users/profile');
    }

    async updateProfile(fullName) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify({ full_name: fullName }),
        });
    }

    async changePassword(currentPassword, newPassword) {
        return this.request('/users/change-password', {
            method: 'PUT',
            body: JSON.stringify({ 
                current_password: currentPassword, 
                new_password: newPassword 
            }),
        });
    }

    // YouTube endpoints
    async summarizeYouTube(videoUrl, chunkMinutes = 10, targetLanguage = "Urdu") {
        return this.request('/youtube/summarize', {
            method: 'POST',
            body: JSON.stringify({ 
                video_url: videoUrl, 
                chunk_minutes: chunkMinutes,
                target_language: targetLanguage
            }),
        });
    }

    async getYouTubeTranscript(videoUrl) {
        return this.request('/youtube/transcript', {
            method: 'POST',
            body: JSON.stringify({ video_url: videoUrl }),
        });
    }
    // Add this method to your ApiService class
    async analyzePastPapers(studyMaterialFile, pastPaperFile, numQuestions = 10) {
        const formData = new FormData();
        formData.append('study_material_file', studyMaterialFile);
        formData.append('past_paper_file', pastPaperFile);
        formData.append('num_questions', numQuestions.toString());
        
        return this.request('/past-papers/analyze', {
            method: 'POST',
            body: formData,
        });
    }

    // Summaries endpoints
    async getUserSummaries() {
        return this.request('/summaries');
    }

    async getSummary(summaryId) {
        return this.request(`/summaries/${summaryId}`);
    }

    async createSummary(summaryData) {
        return this.request('/summaries', {
            method: 'POST',
            body: JSON.stringify(summaryData),
        });
    }

    async updateSummary(summaryId, updateData) {
        return this.request(`/summaries/${summaryId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    }

    async deleteSummary(summaryId) {
        return this.request(`/summaries/${summaryId}`, {
            method: 'DELETE',
        });
    }

    async searchSummaries(query) {
        return this.request(`/summaries/search/?query=${encodeURIComponent(query)}`);
    }

    isAuthenticated() {
        return !!this.token;
    }

    // Extract token from URL (for email links)
    extractTokenFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('token') || urlParams.get('access_token') || 
               window.location.hash.includes('access_token') ? 
               new URLSearchParams(window.location.hash.substring(1)).get('access_token') : null;
    }
}

export const apiService = new ApiService();